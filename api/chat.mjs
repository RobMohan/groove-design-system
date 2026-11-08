// POST /api/chat - the docs chatbot backend.
//
// Request:  { messages: [{ role: 'user' | 'assistant', content: string }], page?: '/button' }
// Response: application/x-ndjson, one JSON event per line:
//   { t: 'text', v: '...' }                 streamed answer text
//   { t: 'done', stop: 'end_turn' | ... }   final event
//   { t: 'error', v: '...' }                failure after streaming started
// Failures before streaming starts are plain JSON with an HTTP status.
//
// The API key never reaches the browser: it is read from ANTHROPIC_API_KEY here.

import Anthropic from '@anthropic-ai/sdk';
import { retrieve } from './_retrieve.mjs';
import { stableSystem, retrievedSystem } from './_prompt.mjs';

const MODEL = () => process.env.CHAT_MODEL || 'claude-opus-5-5';
const MAX_TOKENS = 2048;
const MAX_MESSAGES = 12;
const MAX_CHARS = 2000;

// ---- Input validation -------------------------------------------------------

class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function parseBody(body) {
  const data = typeof body === 'string' ? safeJson(body) : body;
  if (!data || !Array.isArray(data.messages) || data.messages.length === 0) {
    throw new HttpError(400, 'bad_request', 'Expected a non-empty messages array.');
  }
  const messages = data.messages.slice(-MAX_MESSAGES).map((m) => {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string' || !m.content.trim()) {
      throw new HttpError(400, 'bad_request', 'Each message needs a role (user or assistant) and text content.');
    }
    if (m.content.length > MAX_CHARS * (m.role === 'assistant' ? 4 : 1)) {
      throw new HttpError(413, 'too_long', `Messages are limited to ${MAX_CHARS} characters.`);
    }
    return { role: m.role, content: m.content };
  });
  // The API needs the conversation to start with, and end on, a user turn.
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    throw new HttpError(400, 'bad_request', 'The last message must come from the user.');
  }
  const page = typeof data.page === 'string' && /^\/[a-z0-9-]*$/.test(data.page) ? data.page : '';
  return { messages, page };
}

const safeJson = (s) => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

// ---- Abuse guards (best effort; see README "Chatbot" for the real limits) ---

export function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  let host;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  if (host === req.headers.host) return true;
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) return true;
  return (process.env.CHAT_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .some((o) => o === origin);
}

const hits = new Map(); // ip -> timestamps; per warm instance only
export function rateLimited(ip, now = Date.now()) {
  const limit = Number(process.env.CHAT_RATE_LIMIT) || 20;
  const windowMs = 10 * 60 * 1000;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(ip, recent);
    return Math.ceil((windowMs - (now - recent[0])) / 1000);
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return 0;
}
export const _resetRateLimit = () => hits.clear();

const clientIp = (req) =>
  String(req.headers['x-forwarded-for'] ?? req.headers['x-real-ip'] ?? req.socket?.remoteAddress ?? 'unknown')
    .split(',')[0]
    .trim();

// ---- Handler ----------------------------------------------------------------

const sendJson = (res, status, payload, headers = {}) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(payload));
};

let sharedClient;
const defaultClient = () => (sharedClient ??= new Anthropic());

/** Exported with an injectable client so tests never touch the network. */
export async function handleChat(req, res, { client } = {}) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'method_not_allowed' }, { Allow: 'POST' });
  if (!originAllowed(req)) return sendJson(res, 403, { error: 'forbidden', message: 'Cross-origin requests are not allowed.' });
  if (!client && !process.env.ANTHROPIC_API_KEY) {
    return sendJson(res, 503, { error: 'not_configured', message: 'The assistant is not configured on this deployment.' });
  }

  let parsed;
  try {
    parsed = parseBody(req.body);
  } catch (e) {
    if (e instanceof HttpError) return sendJson(res, e.status, { error: e.code, message: e.message });
    throw e;
  }

  const wait = rateLimited(clientIp(req));
  if (wait) {
    return sendJson(res, 429, { error: 'rate_limited', message: 'Too many questions. Please try again in a few minutes.' }, { 'Retry-After': String(wait) });
  }

  const { messages, page } = parsed;
  const users = messages.filter((m) => m.role === 'user');
  const docs = retrieve(users.at(-1).content, users.at(-2)?.content ?? '', page);

  const anthropic = client ?? defaultClient();
  const stream = anthropic.messages.stream({
    model: MODEL(),
    max_tokens: MAX_TOKENS,
    // Docs Q&A is retrieval plus a short answer, so keep thinking light for a snappy first token.
    output_config: { effort: 'low' },
    system: [
      { type: 'text', text: stableSystem(), cache_control: { type: 'ephemeral' } },
      { type: 'text', text: retrievedSystem(docs, page) },
    ],
    messages,
  });

  let started = false;
  const emit = (event) => {
    if (!started) {
      started = true;
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('X-Accel-Buffering', 'no');
    }
    res.write(JSON.stringify(event) + '\n');
  };

  // Stop paying for tokens nobody will read when the visitor closes the panel.
  res.on('close', () => {
    if (!res.writableEnded) stream.abort();
  });

  stream.on('text', (text) => emit({ t: 'text', v: text }));

  try {
    const final = await stream.finalMessage();
    const u = final.usage ?? {};
    console.log(
      JSON.stringify({
        chat: 'ok',
        model: final.model,
        in: u.input_tokens,
        out: u.output_tokens,
        cacheRead: u.cache_read_input_tokens,
        cacheWrite: u.cache_creation_input_tokens,
        pages: docs.map((d) => d.path),
      }),
    );
    emit({ t: 'done', stop: final.stop_reason });
    res.end();
  } catch (error) {
    if (res.writableEnded || res.destroyed) return;
    const status = error instanceof Anthropic.APIError ? error.status : undefined;
    console.error(JSON.stringify({ chat: 'error', status, name: error?.name }));
    const message =
      status === 429 || status === 529
        ? 'The assistant is busy right now. Please try again in a moment.'
        : 'Something went wrong while answering. Please try again.';
    if (started) {
      emit({ t: 'error', v: message });
      res.end();
    } else {
      sendJson(res, status === 429 || status === 529 ? 503 : 502, { error: 'upstream_error', message });
    }
  }
}

export default function handler(req, res) {
  return handleChat(req, res);
}
