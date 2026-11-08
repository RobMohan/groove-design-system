import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'groove-chat-v1';
export const MAX_INPUT = 2000;

const REFUSAL = "I can't help with that one. Try rephrasing, or ask about a Groove component, token or guideline.";
const CUT_OFF = '\n\n_The answer was cut off. Ask me to continue, or narrow the question._';

const load = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(saved)) return [];
    // A reload mid-answer leaves an empty assistant turn behind; drop it.
    return saved.filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string').filter((m, i, all) => !(m.role === 'assistant' && !m.content && i === all.length - 1));
  } catch {
    return [];
  }
};

/** Reads an NDJSON response body, calling onEvent for each parsed line. */
export async function readEvents(response, onEvent) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        onEvent(JSON.parse(line));
      } catch {
        /* ignore a malformed line rather than failing the whole answer */
      }
    }
    if (done) break;
  }
  if (buffer.trim()) {
    try {
      onEvent(JSON.parse(buffer));
    } catch {
      /* trailing partial line */
    }
  }
}

export function useChat(page) {
  const [messages, setMessages] = useState(load);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* storage full or disabled: the chat still works, it just won't survive a reload */
    }
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const appendToLast = (fn) =>
    setMessages((all) => {
      const next = all.slice();
      const last = next[next.length - 1];
      if (last?.role === 'assistant') next[next.length - 1] = { ...last, content: fn(last.content) };
      return next;
    });

  // history must end with the user's question.
  const run = useCallback(
    async (history) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setError('');
      setStreaming(true);
      setMessages([...history, { role: 'assistant', content: '' }]);

      const dropEmptyAnswer = () =>
        setMessages((all) => (all.at(-1)?.role === 'assistant' && !all.at(-1).content ? all.slice(0, -1) : all));

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history, page }),
          signal: controller.signal,
        });

        if (!res.ok) {
          let message = 'Something went wrong. Please try again.';
          try {
            const data = await res.json();
            if (data.error === 'not_configured') message = 'The assistant is not set up on this deployment yet.';
            else if (data.message) message = data.message;
          } catch {
            /* non-JSON error body (for example a 404 from a static host) */
            if (res.status === 404) message = 'The assistant is not available here. It runs on the deployed site or the local dev server.';
          }
          dropEmptyAnswer();
          setError(message);
          return;
        }

        let gotText = false;
        await readEvents(res, (event) => {
          if (event.t === 'text') {
            if (event.v) gotText = true;
            appendToLast((c) => c + event.v);
          } else if (event.t === 'error') {
            setError(event.v);
          } else if (event.t === 'done') {
            if (event.stop === 'max_tokens') appendToLast((c) => c + CUT_OFF);
            if (event.stop === 'refusal') {
              gotText = true;
              appendToLast((c) => c || REFUSAL);
            }
          }
        });
        // A stream that ended without any text (and no error event) is a failure too.
        if (!gotText) {
          dropEmptyAnswer();
          setError((e) => e || 'The assistant did not return an answer. Please try again.');
        }
      } catch (e) {
        if (e?.name === 'AbortError') {
          dropEmptyAnswer(); // keep whatever streamed so far
        } else {
          dropEmptyAnswer();
          setError("Couldn't reach the assistant. Check your connection and try again.");
        }
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setStreaming(false);
      }
    },
    [page],
  );

  const send = useCallback(
    (text) => {
      const content = text.trim().slice(0, MAX_INPUT);
      if (!content || abortRef.current) return;
      run([...messagesRef.current, { role: 'user', content }]);
    },
    [run],
  );

  const retry = useCallback(() => {
    if (abortRef.current) return;
    const all = messagesRef.current;
    const lastUser = all.map((m) => m.role).lastIndexOf('user');
    if (lastUser >= 0) run(all.slice(0, lastUser + 1));
  }, [run]);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError('');
  }, []);

  return { messages, streaming, error, send, retry, stop, clear };
}
