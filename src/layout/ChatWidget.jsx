import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp, MessageCircle, RotateCcw, Square, Trash2, X } from 'lucide-react';
import IconButton from '../components/IconButton';
import Markdown from './chat/Markdown';
import { MAX_INPUT, useChat } from './chat/useChat';

const SUGGESTIONS = [
  'How do I install Groove?',
  'Which color token should I use for text?',
  'How does dark mode work?',
  'Show me how to use the Modal',
];

function Thinking() {
  return (
    <span className="inline-flex items-center gap-1 text-ink-muted text-sm" role="status">
      <span className="sr-only">The assistant is writing an answer</span>
      <span aria-hidden="true" className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-ink-subtle motion-safe:animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
    </span>
  );
}

export default function ChatWidget() {
  const { pathname } = useLocation();
  const { messages, streaming, error, send, retry, stop, clear } = useChat(pathname);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const panelId = useId();
  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const stickToBottom = useRef(true);
  const wasOpen = useRef(false);

  // Move focus into the panel on open and back to the launcher on close.
  useEffect(() => {
    if (open) inputRef.current?.focus();
    else if (wasOpen.current) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  // Follow the stream, unless the reader has scrolled up to read.
  useLayoutEffect(() => {
    const el = logRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, error, open]);

  const onScroll = () => {
    const el = logRef.current;
    if (el) stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
  };

  // Grow the textarea with its content, up to ~5 lines.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft, open]);

  const submit = useCallback(
    (text) => {
      if (!text.trim() || streaming) return;
      stickToBottom.current = true;
      send(text);
      setDraft('');
    },
    [send, streaming],
  );

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit(draft);
    }
  };

  const closeOnNarrow = () => {
    if (window.innerWidth < 640) setOpen(false);
  };

  const lastIsAnswering = streaming && messages.at(-1)?.role === 'assistant' && !messages.at(-1).content;

  return (
    <>
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded="false"
          aria-controls={panelId}
          className="fixed bottom-6 right-6 z-sticky inline-flex items-center gap-2 rounded-pill bg-primary hover:bg-primary-hover active:bg-primary-pressed text-white pl-4 pr-5 py-3 font-medium shadow-elevation-4 transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
        >
          <MessageCircle size={20} aria-hidden="true" />
          Ask Groove
        </button>
      )}

      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-label="Groove documentation assistant"
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
          className="fixed z-sticky bottom-3 right-3 left-3 sm:left-auto sm:bottom-6 sm:right-6 sm:w-[400px] h-[min(640px,calc(100vh-1.5rem))] flex flex-col bg-surface-raised border border-line rounded-card shadow-elevation-5 overflow-hidden motion-safe:animate-scale-in"
        >
          <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-line">
            <div className="min-w-0">
              <h2 className="font-semibold text-ink leading-tight">Ask Groove</h2>
              <p className="text-xs text-ink-muted">Answers from these docs</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {messages.length > 0 && (
                <IconButton icon={Trash2} label="Clear conversation" variant="ghost" size="sm" onClick={clear} />
              )}
              <IconButton icon={X} label="Close assistant" variant="ghost" size="sm" onClick={() => setOpen(false)} />
            </div>
          </header>

          <div
            ref={logRef}
            onScroll={onScroll}
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
          >
            {messages.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-ink-muted">
                  Ask about components, design tokens, style rules, or how to set Groove up in your project.
                </p>
                <ul className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => submit(s)}
                        className="w-full text-left text-sm px-3 py-2 rounded-control border border-line text-ink hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-focus"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              messages.map((m, i) =>
                m.role === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <p className="max-w-[85%] rounded-card bg-primary/10 text-ink text-sm px-3 py-2 whitespace-pre-wrap break-words">
                      {m.content}
                    </p>
                  </div>
                ) : (
                  <div key={i}>
                    {m.content ? <Markdown text={m.content} onNavigate={closeOnNarrow} /> : lastIsAnswering && i === messages.length - 1 ? <Thinking /> : null}
                  </div>
                ),
              )
            )}

            {error && (
              <div role="alert" className="flex items-start justify-between gap-3 rounded-control border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-ink">
                <span>{error}</span>
                {messages.some((m) => m.role === 'user') && (
                  <button
                    type="button"
                    onClick={retry}
                    className="shrink-0 inline-flex items-center gap-1 font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-focus rounded"
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    Try again
                  </button>
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(draft);
            }}
            className="border-t border-line p-3"
          >
            <div className="flex items-end gap-2">
              <label htmlFor={`${panelId}-input`} className="sr-only">
                Ask a question about Groove
              </label>
              <textarea
                id={`${panelId}-input`}
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                maxLength={MAX_INPUT}
                placeholder="Ask about Groove…"
                className="flex-1 resize-none rounded-control border-2 border-line-strong bg-surface-raised text-ink placeholder:text-ink-subtle px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent"
              />
              {streaming ? (
                <IconButton icon={Square} label="Stop generating" variant="outline" onClick={stop} />
              ) : (
                <IconButton type="submit" icon={ArrowUp} label="Send question" variant="primary" disabled={!draft.trim()} />
              )}
            </div>
            <p className="mt-2 text-xs text-ink-muted">AI-generated from the docs. Follow the linked pages to confirm details.</p>
          </form>
        </section>
      )}
    </>
  );
}
