import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy } from 'lucide-react';

// A small, safe Markdown renderer for chat answers. It builds React elements
// (never HTML strings), so model output cannot inject markup or script, and it
// only supports what answers actually use: paragraphs, headings, lists, tables,
// fenced code, inline code, bold, italic and links.

// ---- Inline ------------------------------------------------------------------

const INLINE = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\[[^\]\n]+\]\([^)\s]+\))|(\*[^*\s][^*\n]*\*)/g;

// Only site paths and http(s) URLs become links. Anything else (javascript:, data:, ...) stays text.
export const safeHref = (href) => {
  if (/^\/(?!\/)[A-Za-z0-9\-_/#?=&.%]*$/.test(href)) return { href, internal: true };
  if (/^https?:\/\/[^\s<>"]+$/i.test(href)) return { href, internal: false };
  return null;
};

function renderInline(text, keyPrefix, onNavigate) {
  const out = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyPrefix}-${i++}`;
    const [token] = m;
    if (m[1]) {
      out.push(
        <code key={key} className="px-1.5 py-0.5 rounded bg-surface-muted text-ink font-mono text-[0.85em]">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (m[2]) {
      out.push(
        <strong key={key} className="font-semibold">
          {renderInline(token.slice(2, -2), key, onNavigate)}
        </strong>,
      );
    } else if (m[3]) {
      const [, label, href] = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const safe = safeHref(href);
      if (!safe) out.push(label);
      else if (safe.internal)
        out.push(
          <Link key={key} to={safe.href} onClick={onNavigate} className="text-primary underline underline-offset-2 hover:text-primary-pressed">
            {label}
          </Link>,
        );
      else
        out.push(
          <a key={key} href={safe.href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary-pressed">
            {label}
          </a>,
        );
    } else {
      out.push(<em key={key}>{token.slice(1, -1)}</em>);
    }
    last = m.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// ---- Blocks ------------------------------------------------------------------

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable (insecure context); the text stays selectable */
    }
  };
  return (
    <div className="my-2 rounded-control overflow-hidden border border-line bg-gray-900 text-gray-100">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 text-xs">
        <span className="font-mono opacity-70">{lang || 'code'}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-focus"
        >
          {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-[0.8rem] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const cells = (line) =>
  line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim());

const isTableSep = (line) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line);

export function parseBlocks(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    const fence = line.match(/^\s*```\s*([\w+-]*)\s*$/);
    if (fence) {
      const code = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) code.push(lines[i++]);
      i++; // closing fence (absent while still streaming)
      blocks.push({ type: 'code', lang: fence[1], code: code.join('\n') });
      continue;
    }

    if (!line.trim()) {
      i++;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: 'heading', text: heading[2] });
      i++;
      continue;
    }

    if (line.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const head = cells(line);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) rows.push(cells(lines[i++]));
      blocks.push({ type: 'table', head, rows });
      continue;
    }

    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const ordered = !bullet;
      const re = ordered ? /^\s*\d+[.)]\s+(.*)$/ : /^\s*[-*]\s+(.*)$/;
      const items = [];
      while (i < lines.length && re.test(lines[i])) items.push(lines[i++].match(re)[1]);
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^\s*```/.test(lines[i]) &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^\s*([-*]|\d+[.)])\s+/.test(lines[i])
    ) {
      para.push(lines[i++]);
    }
    blocks.push({ type: 'paragraph', text: para.join(' ') });
  }
  return blocks;
}

export default function Markdown({ text, onNavigate }) {
  const blocks = parseBlocks(text);
  return (
    <div className="space-y-2 text-sm leading-relaxed text-ink break-words">
      {blocks.map((b, n) => {
        const key = `b${n}`;
        switch (b.type) {
          case 'code':
            return <CodeBlock key={key} code={b.code} lang={b.lang} />;
          case 'heading':
            return (
              <p key={key} className="font-semibold pt-1">
                {renderInline(b.text, key, onNavigate)}
              </p>
            );
          case 'list': {
            const Tag = b.ordered ? 'ol' : 'ul';
            return (
              <Tag key={key} className={`${b.ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1`}>
                {b.items.map((item, j) => (
                  <li key={j}>{renderInline(item, `${key}-${j}`, onNavigate)}</li>
                ))}
              </Tag>
            );
          }
          case 'table':
            return (
              <div key={key} className="overflow-x-auto rounded-control border border-line">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-surface-muted">
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j} className="px-2 py-1.5 font-semibold border-b border-line">
                          {renderInline(h, `${key}h${j}`, onNavigate)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r} className="border-b border-line last:border-0">
                        {row.map((c, j) => (
                          <td key={j} className="px-2 py-1.5 align-top">
                            {renderInline(c, `${key}r${r}c${j}`, onNavigate)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return <p key={key}>{renderInline(b.text, key, onNavigate)}</p>;
        }
      })}
    </div>
  );
}
