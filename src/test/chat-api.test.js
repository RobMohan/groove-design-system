// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { retrieve, CORE_PATHS } from '../../api/_retrieve.mjs';
import { stableSystem, retrievedSystem } from '../../api/_prompt.mjs';
import { parseBody, originAllowed, rateLimited, handleChat, _resetRateLimit } from '../../api/chat.mjs';

// ---- Retrieval ---------------------------------------------------------------

describe('retrieve', () => {
  const top = (q, prev = '', page = '') => retrieve(q, prev, page).map((p) => p.path);

  it.each([
    ['How do I open a modal and close it on escape?', '/modal'],
    ['What props does the button take?', '/button'],
    ['How do I show a toast after saving?', '/toast'],
    ['How do I show a date picker with a min date?', '/date-picker'],
    ['Which spacing scale should I use for padding?', '/spacing'],
    ['z-index for dropdowns over modals', '/layering'],
    ['what font sizes does Groove use?', '/typography'],
  ])('puts the right page first for "%s"', (q, path) => {
    expect(top(q)[0]).toBe(path);
  });

  it('uses the previous question for follow-ups', () => {
    expect(top('and what about the sizes?', 'tell me about the Avatar component')[0]).toBe('/avatar');
  });

  it('always includes the page the visitor is on, first', () => {
    expect(top('how do I use this', '', '/tabs')[0]).toBe('/tabs');
  });

  it('does not repeat core pages that are already in the cached prefix', () => {
    const got = top('how does dark mode and theming work with color tokens', '', '/theming');
    for (const core of CORE_PATHS) expect(got).not.toContain(core);
  });

  it('keeps the changelog out of generic questions but returns it when asked', () => {
    expect(top('how do I use the modal')).not.toContain('/changelog');
    expect(top('what is in the latest release changelog')).toContain('/changelog');
  });

  it('respects the page and size limits', () => {
    const got = retrieve('button modal tabs toast select card table', '', '', { maxPages: 3 });
    expect(got.length).toBeLessThanOrEqual(3);
  });
});

// ---- Prompt ------------------------------------------------------------------

describe('system prompt', () => {
  it('keeps the cached block identical across calls (no per-request data in it)', () => {
    expect(stableSystem()).toBe(stableSystem());
    expect(stableSystem()).toContain('/button');
    expect(stableSystem()).toContain('Core reference');
  });

  it('puts retrieved pages and the current path in the volatile block only', () => {
    const volatile = retrievedSystem(retrieve('modal'), '/modal');
    expect(volatile).toContain('currently viewing: /modal');
    expect(stableSystem()).not.toContain('currently viewing');
  });
});

// ---- Validation --------------------------------------------------------------

describe('parseBody', () => {
  const user = (content) => ({ role: 'user', content });

  it('accepts a normal conversation and a valid page path', () => {
    const out = parseBody({ messages: [user('hi'), { role: 'assistant', content: 'hello' }, user('props?')], page: '/button' });
    expect(out.messages).toHaveLength(3);
    expect(out.page).toBe('/button');
  });

  it('accepts a JSON string body (dev server)', () => {
    expect(parseBody(JSON.stringify({ messages: [user('hi')] })).messages).toHaveLength(1);
  });

  it.each([
    [null],
    [{}],
    [{ messages: [] }],
    [{ messages: [{ role: 'system', content: 'x' }] }],
    [{ messages: [{ role: 'user', content: 42 }] }],
    [{ messages: [{ role: 'user', content: '   ' }] }],
    [{ messages: [{ role: 'assistant', content: 'last turn is not the user' }] }],
  ])('rejects malformed input %#', (body) => {
    expect(() => parseBody(body)).toThrow(/messages|role|user/i);
  });

  it('rejects over-long user messages with a 413', () => {
    try {
      parseBody({ messages: [user('x'.repeat(2001))] });
      throw new Error('should have thrown');
    } catch (e) {
      expect(e.status).toBe(413);
    }
  });

  it('keeps only the most recent 12 messages and starts on a user turn', () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: `m${i}` }));
    many.push(user('last'));
    const { messages } = parseBody({ messages: many });
    expect(messages.length).toBeLessThanOrEqual(12);
    expect(messages[0].role).toBe('user');
    expect(messages.at(-1).content).toBe('last');
  });

  it('drops a page path that is not a plain site path', () => {
    expect(parseBody({ messages: [user('hi')], page: 'https://evil.example/x' }).page).toBe('');
    expect(parseBody({ messages: [user('hi')], page: '/a/../b' }).page).toBe('');
  });
});

// ---- Guards ------------------------------------------------------------------

describe('originAllowed', () => {
  const req = (origin, host = 'docs.example.com') => ({ headers: { origin, host } });

  it('allows same-origin and localhost, rejects the rest', () => {
    expect(originAllowed(req('https://docs.example.com'))).toBe(true);
    expect(originAllowed(req('http://localhost:5173', 'localhost:5173'))).toBe(true);
    expect(originAllowed(req('https://evil.example'))).toBe(false);
    expect(originAllowed({ headers: { host: 'docs.example.com' } })).toBe(false);
    expect(originAllowed(req('not a url'))).toBe(false);
  });
});

describe('rateLimited', () => {
  beforeEach(() => _resetRateLimit());

  it('allows the limit, then returns seconds to wait, then recovers', () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 20; i++) expect(rateLimited('1.1.1.1', t0 + i)).toBe(0);
    expect(rateLimited('1.1.1.1', t0 + 100)).toBeGreaterThan(0);
    expect(rateLimited('2.2.2.2', t0 + 100)).toBe(0); // other IPs unaffected
    expect(rateLimited('1.1.1.1', t0 + 11 * 60 * 1000)).toBe(0);
  });
});

// ---- Handler (fake Claude client; no network) --------------------------------

function fakeRes() {
  const res = {
    statusCode: 0,
    headers: {},
    chunks: [],
    writableEnded: false,
    destroyed: false,
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
    },
    write(c) {
      this.chunks.push(c);
    },
    end(c) {
      if (c) this.chunks.push(c);
      this.writableEnded = true;
    },
    on() {},
  };
  return res;
}

const request = (body, overrides = {}) => ({
  method: 'POST',
  headers: { origin: 'https://docs.example.com', host: 'docs.example.com', 'x-forwarded-for': '9.9.9.9' },
  body,
  ...overrides,
});

function fakeClient({ texts = ['Use the ', 'Modal.'], stop = 'end_turn', fail } = {}) {
  const calls = [];
  const client = {
    calls,
    messages: {
      stream(params) {
        calls.push(params);
        let onText;
        return {
          on(evt, cb) {
            if (evt === 'text') onText = cb;
          },
          abort() {},
          async finalMessage() {
            if (fail) throw fail;
            for (const t of texts) onText(t);
            return { model: params.model, stop_reason: stop, usage: { input_tokens: 10, output_tokens: 5 } };
          },
        };
      },
    },
  };
  return client;
}

const events = (res) =>
  res.chunks
    .join('')
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l));

describe('handleChat', () => {
  beforeEach(() => {
    _resetRateLimit();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('streams text events then a done event', async () => {
    const res = fakeRes();
    const client = fakeClient();
    await handleChat(request({ messages: [{ role: 'user', content: 'How do I use the modal?' }], page: '/modal' }), res, { client });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/ndjson/);
    expect(events(res)).toEqual([
      { t: 'text', v: 'Use the ' },
      { t: 'text', v: 'Modal.' },
      { t: 'done', stop: 'end_turn' },
    ]);
  });

  it('sends a cached stable block, the retrieved pages, and low effort', async () => {
    const res = fakeRes();
    const client = fakeClient();
    await handleChat(request({ messages: [{ role: 'user', content: 'How do I use the modal?' }], page: '/modal' }), res, { client });
    const params = client.calls[0];
    expect(params.model).toBe('claude-opus-5-5');
    expect(params.output_config).toEqual({ effort: 'low' });
    expect(params.max_tokens).toBeGreaterThan(0);
    expect(params.system[0].cache_control).toEqual({ type: 'ephemeral' });
    expect(params.system[1].cache_control).toBeUndefined();
    expect(params.system[1].text).toContain('(/modal)');
    expect(params.messages.at(-1)).toEqual({ role: 'user', content: 'How do I use the modal?' });
  });

  it('honors CHAT_MODEL', async () => {
    process.env.CHAT_MODEL = 'claude-haiku-5-5';
    try {
      const client = fakeClient();
      await handleChat(request({ messages: [{ role: 'user', content: 'hi' }] }), fakeRes(), { client });
      expect(client.calls[0].model).toBe('claude-haiku-5-5');
    } finally {
      delete process.env.CHAT_MODEL;
    }
  });

  it('rejects non-POST, foreign origins and bad input before calling the model', async () => {
    const client = fakeClient();
    const get = fakeRes();
    await handleChat(request(null, { method: 'GET' }), get, { client });
    expect(get.statusCode).toBe(405);

    const foreign = fakeRes();
    await handleChat(request({ messages: [{ role: 'user', content: 'hi' }] }, { headers: { origin: 'https://evil.example', host: 'docs.example.com' } }), foreign, { client });
    expect(foreign.statusCode).toBe(403);

    const bad = fakeRes();
    await handleChat(request({ messages: [] }), bad, { client });
    expect(bad.statusCode).toBe(400);
    expect(client.calls).toHaveLength(0);
  });

  it('returns 503 when no API key is configured', async () => {
    const saved = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    try {
      const res = fakeRes();
      await handleChat(request({ messages: [{ role: 'user', content: 'hi' }] }), res);
      expect(res.statusCode).toBe(503);
      expect(JSON.parse(res.chunks.join('')).error).toBe('not_configured');
    } finally {
      if (saved) process.env.ANTHROPIC_API_KEY = saved;
    }
  });

  it('returns 429 with Retry-After once the limit is hit', async () => {
    const client = fakeClient();
    let last;
    for (let i = 0; i < 21; i++) {
      last = fakeRes();
      await handleChat(request({ messages: [{ role: 'user', content: 'hi' }] }), last, { client });
    }
    expect(last.statusCode).toBe(429);
    expect(Number(last.headers['retry-after'])).toBeGreaterThan(0);
    expect(client.calls).toHaveLength(20);
  });

  it('turns an upstream failure into a safe message without leaking details', async () => {
    const res = fakeRes();
    const client = fakeClient({ fail: new Error('secret internal detail sk-ant-xyz') });
    await handleChat(request({ messages: [{ role: 'user', content: 'hi' }] }), res, { client });
    expect(res.statusCode).toBe(502);
    expect(res.chunks.join('')).not.toMatch(/secret|sk-ant/);
  });

  it('passes a refusal stop reason through to the client', async () => {
    const res = fakeRes();
    await handleChat(request({ messages: [{ role: 'user', content: 'hi' }] }), res, { client: fakeClient({ texts: [], stop: 'refusal' }) });
    expect(events(res).at(-1)).toEqual({ t: 'done', stop: 'refusal' });
  });
});
