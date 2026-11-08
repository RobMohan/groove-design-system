import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Markdown, { safeHref, parseBlocks } from './Markdown';
import { readEvents } from './useChat';
import ChatWidget from '../ChatWidget';

// ---- Markdown ----------------------------------------------------------------

const md = (text) =>
  render(
    <MemoryRouter>
      <Markdown text={text} />
    </MemoryRouter>,
  );

describe('Markdown', () => {
  it('renders paragraphs, bold, italic and inline code', () => {
    const { container } = md('Use **semantic** tokens like `bg-surface` and *never* hex.');
    expect(container.querySelector('strong')).toHaveTextContent('semantic');
    expect(container.querySelector('em')).toHaveTextContent('never');
    expect(container.querySelector('code')).toHaveTextContent('bg-surface');
  });

  it('renders fenced code with its language and a copy button', () => {
    md('```jsx\n<Button variant="outline">Go</Button>\n```');
    expect(screen.getByText('jsx')).toBeInTheDocument();
    expect(screen.getByText('<Button variant="outline">Go</Button>')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });

  it('keeps a still-streaming (unclosed) code fence as code', () => {
    const { container } = md('Try:\n```jsx\n<Modal isOpen');
    expect(container.querySelector('pre code')).toHaveTextContent('<Modal isOpen');
  });

  it('renders lists and tables', () => {
    const { container } = md('- one\n- two\n\n1. first\n2. second\n\n| Prop | Type |\n| --- | --- |\n| size | string |');
    expect(container.querySelectorAll('ul li')).toHaveLength(2);
    expect(container.querySelectorAll('ol li')).toHaveLength(2);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(screen.getByRole('columnheader', { name: 'Prop' })).toBeInTheDocument();
  });

  it('turns site paths into router links and external links into new-tab anchors', () => {
    md('See [Button](/button) and [React](https://react.dev).');
    expect(screen.getByRole('link', { name: 'Button' })).toHaveAttribute('href', '/button');
    const ext = screen.getByRole('link', { name: 'React' });
    expect(ext).toHaveAttribute('target', '_blank');
    expect(ext).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('never creates a link for javascript:, data: or protocol-relative URLs', () => {
    expect(safeHref('javascript:alert(1)')).toBeNull();
    expect(safeHref('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(safeHref('//evil.example/x')).toBeNull();
    md('[click](javascript:alert(1)) and [x](//evil.example)');
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText(/click/)).toBeInTheDocument();
  });

  it('does not inject raw HTML from the model', () => {
    const { container } = md('<img src=x onerror="alert(1)"> <script>alert(1)</script> **ok**');
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('script')).toBeNull();
    expect(container).toHaveTextContent('<script>alert(1)</script>');
  });

  it('parses headings without treating them as lists', () => {
    expect(parseBlocks('## Title\n\ntext')[0]).toEqual({ type: 'heading', text: 'Title' });
  });
});

// ---- Stream reader -----------------------------------------------------------

const streamOf = (chunks) =>
  new ReadableStream({
    start(c) {
      const enc = new TextEncoder();
      chunks.forEach((x) => c.enqueue(enc.encode(x)));
      c.close();
    },
  });

describe('readEvents', () => {
  it('reassembles events split across chunk boundaries and ignores junk lines', async () => {
    const got = [];
    const line = JSON.stringify({ t: 'text', v: 'héllo' });
    await readEvents(
      { body: streamOf([line.slice(0, 7), line.slice(7) + '\nnot json\n{"t":"done"', '}\n']) },
      (e) => got.push(e),
    );
    expect(got).toEqual([{ t: 'text', v: 'héllo' }, { t: 'done' }]);
  });
});

// ---- Widget ------------------------------------------------------------------

const ndjson = (events) =>
  new Response(streamOf(events.map((e) => JSON.stringify(e) + '\n')), { status: 200, headers: { 'Content-Type': 'application/x-ndjson' } });

const mount = (path = '/button') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ChatWidget />
    </MemoryRouter>,
  );

const openPanel = async (user) => {
  await user.click(screen.getByRole('button', { name: /ask groove/i }));
  return screen.getByRole('dialog', { name: /documentation assistant/i });
};

describe('ChatWidget', () => {
  let fetchMock;

  beforeEach(() => {
    sessionStorage.clear();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    Element.prototype.scrollTo = Element.prototype.scrollTo || (() => {});
  });
  afterEach(() => vi.unstubAllGlobals());

  it('opens from the launcher, focuses the input, and closes on Escape returning focus', async () => {
    const user = userEvent.setup();
    mount();
    const panel = await openPanel(user);
    expect(within(panel).getByLabelText(/ask a question/i)).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: /ask groove/i })).toHaveFocus();
  });

  it('streams an answer, sends the current page, and renders Markdown', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(ndjson([{ t: 'text', v: 'Use the ' }, { t: 'text', v: '[Modal](/modal) component.' }, { t: 'done', stop: 'end_turn' }]));
    mount('/button');
    const panel = await openPanel(user);

    await user.type(within(panel).getByLabelText(/ask a question/i), 'How do I open a dialog?{Enter}');

    expect(await within(panel).findByRole('link', { name: 'Modal' })).toHaveAttribute('href', '/modal');
    expect(within(panel).getByText('How do I open a dialog?')).toBeInTheDocument();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/chat');
    expect(JSON.parse(init.body)).toEqual({ messages: [{ role: 'user', content: 'How do I open a dialog?' }], page: '/button' });
  });

  it('inserts a newline on Shift+Enter instead of sending', async () => {
    const user = userEvent.setup();
    mount();
    const panel = await openPanel(user);
    const input = within(panel).getByLabelText(/ask a question/i);
    await user.type(input, 'line one{Shift>}{Enter}{/Shift}line two');
    expect(input).toHaveValue('line one\nline two');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends a suggested question when clicked', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(ndjson([{ t: 'text', v: 'Clone the repo.' }, { t: 'done', stop: 'end_turn' }]));
    mount();
    const panel = await openPanel(user);
    await user.click(within(panel).getByRole('button', { name: 'How do I install Groove?' }));
    expect(await within(panel).findByText('Clone the repo.')).toBeInTheDocument();
  });

  it('shows a friendly message when the assistant is not configured, and lets the user retry', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ error: 'not_configured' }), { status: 503 }));
    mount();
    const panel = await openPanel(user);
    await user.type(within(panel).getByLabelText(/ask a question/i), 'hello{Enter}');
    expect(await within(panel).findByRole('alert')).toHaveTextContent(/not set up/i);

    fetchMock.mockResolvedValueOnce(ndjson([{ t: 'text', v: 'Hi there.' }, { t: 'done', stop: 'end_turn' }]));
    await user.click(within(panel).getByRole('button', { name: /try again/i }));
    expect(await within(panel).findByText('Hi there.')).toBeInTheDocument();
    expect(within(panel).queryByRole('alert')).toBeNull();
    // the retried request carries the same single question, not a duplicate
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).messages).toHaveLength(1);
  });

  it('reports a network failure without losing the question', async () => {
    const user = userEvent.setup();
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    mount();
    const panel = await openPanel(user);
    await user.type(within(panel).getByLabelText(/ask a question/i), 'hello{Enter}');
    expect(await within(panel).findByRole('alert')).toHaveTextContent(/couldn't reach/i);
    expect(within(panel).getByText('hello')).toBeInTheDocument();
  });

  it('shows a mid-stream error but keeps the partial answer', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(ndjson([{ t: 'text', v: 'Partial answer' }, { t: 'error', v: 'The assistant is busy right now.' }]));
    mount();
    const panel = await openPanel(user);
    await user.type(within(panel).getByLabelText(/ask a question/i), 'hello{Enter}');
    expect(await within(panel).findByText('Partial answer')).toBeInTheDocument();
    expect(within(panel).getByRole('alert')).toHaveTextContent(/busy/i);
  });

  it('can stop a streaming answer and keeps what arrived', async () => {
    const user = userEvent.setup();
    let controller;
    fetchMock.mockImplementation((_url, init) => {
      init.signal.addEventListener('abort', () => controller.error(Object.assign(new Error('aborted'), { name: 'AbortError' })));
      return Promise.resolve(
        new Response(
          new ReadableStream({
            start(c) {
              controller = c;
              c.enqueue(new TextEncoder().encode(JSON.stringify({ t: 'text', v: 'Working on it' }) + '\n'));
            },
          }),
        ),
      );
    });
    mount();
    const panel = await openPanel(user);
    await user.type(within(panel).getByLabelText(/ask a question/i), 'hello{Enter}');
    expect(await within(panel).findByText('Working on it')).toBeInTheDocument();
    await user.click(within(panel).getByRole('button', { name: /stop generating/i }));
    await waitFor(() => expect(within(panel).getByRole('button', { name: /send question/i })).toBeInTheDocument());
    expect(within(panel).getByText('Working on it')).toBeInTheDocument();
    expect(within(panel).queryByRole('alert')).toBeNull();
  });

  it('persists the conversation for the session and clears it on request', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(ndjson([{ t: 'text', v: 'Saved answer' }, { t: 'done', stop: 'end_turn' }]));
    const first = mount();
    let panel = await openPanel(user);
    await user.type(within(panel).getByLabelText(/ask a question/i), 'remember me{Enter}');
    await within(panel).findByText('Saved answer');
    first.unmount();

    mount();
    panel = await openPanel(user);
    expect(within(panel).getByText('Saved answer')).toBeInTheDocument();

    await user.click(within(panel).getByRole('button', { name: /clear conversation/i }));
    expect(within(panel).queryByText('Saved answer')).toBeNull();
    expect(JSON.parse(sessionStorage.getItem('groove-chat-v1'))).toEqual([]);
  });

  it('disables Send until there is text', async () => {
    const user = userEvent.setup();
    mount();
    const panel = await openPanel(user);
    expect(within(panel).getByRole('button', { name: /send question/i })).toBeDisabled();
    await user.type(within(panel).getByLabelText(/ask a question/i), 'x');
    expect(within(panel).getByRole('button', { name: /send question/i })).toBeEnabled();
  });
});
