// Picks which doc pages to show the model for a question. Plain BM25 over the
// generated knowledge base: no embeddings, no extra service, deterministic.

import { pages } from './_knowledge.mjs';

const STOP = new Set(
  ('a an and are as at be by can do does for from has have how i if in is it its me my of on or our so ' +
    'that the their them then there these this to use used using want was we what when where which who why ' +
    'will with would you your about into should could please tell show explain need get make')
    .split(' '),
);

const stem = (t) => t.replace(/ies$/, 'y').replace(/(?<!s)s$/, '');

export const tokenize = (text) =>
  (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((t) => t.length > 1 && !STOP.has(t)).map(stem);

// Pages the model always gets in its cached prefix: how to install, how tokens
// and dark mode work, and how color roles are applied. Never retrieved twice.
export const CORE_PATHS = ['/installation', '/theming', '/color-usage'];

const index = pages.map((page) => {
  const tf = new Map();
  const terms = tokenize(page.text);
  for (const t of terms) tf.set(t, (tf.get(t) ?? 0) + 1);
  return {
    page,
    tf,
    len: terms.length,
    title: new Set(tokenize(`${page.title} ${page.path.replace(/[/#-]/g, ' ')}`)),
  };
});

const N = index.length;
const avgLen = index.reduce((n, d) => n + d.len, 0) / N;
const df = new Map();
for (const d of index) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
const idf = (t) => Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));

const NOISY_PATHS = new Set(['/', '/changelog', '/status']);
const META_TERMS = new Set(['changelog', 'release', 'version', 'history', 'status', 'deprecated', 'deprecate', 'stable', 'beta', 'roadmap', 'new', 'contact', 'author']);

const K1 = 1.2;
const B = 0.75;
const TITLE_BOOST = 4;

function score(doc, weighted) {
  let s = 0;
  for (const [t, w] of weighted) {
    const f = doc.tf.get(t) ?? 0;
    if (f) s += w * idf(t) * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * doc.len) / avgLen)));
    if (doc.title.has(t)) s += w * TITLE_BOOST * idf(t);
  }
  return s;
}

/**
 * @param {string} question  latest user message
 * @param {string} [previous]  the user message before it (follow-ups like "and its props?")
 * @param {string} [currentPath]  page the visitor is looking at
 * @param {{maxPages?: number, maxChars?: number}} [opts]
 */
export function retrieve(question, previous = '', currentPath = '', { maxPages = 5, maxChars = 36000 } = {}) {
  const weighted = new Map();
  for (const t of tokenize(previous)) weighted.set(t, Math.max(weighted.get(t) ?? 0, 0.4));
  for (const t of tokenize(question)) weighted.set(t, 1);

  // The changelog, status table and home page mention nearly every component, so
  // they outrank the real page for generic words. Only favor them when asked about.
  const wantsMeta = [...weighted.keys()].some((t) => META_TERMS.has(t));

  const ranked = index
    .filter((d) => !CORE_PATHS.includes(d.page.path))
    .map((d) => ({ d, s: score(d, weighted) * (NOISY_PATHS.has(d.page.path) && !wantsMeta ? 0.25 : 1) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);

  const picked = [];
  const here = index.find((d) => d.page.path === currentPath && !CORE_PATHS.includes(currentPath));
  if (here) picked.push(here.page);
  for (const { d } of ranked) {
    if (picked.length >= maxPages) break;
    if (!picked.includes(d.page)) picked.push(d.page);
  }

  // Fit the character budget; the page the visitor is on stays first.
  const out = [];
  let used = 0;
  for (const p of picked) {
    if (used + p.text.length > maxChars && out.length) continue;
    out.push(p);
    used += p.text.length;
  }
  return out;
}

export const corePages = () => CORE_PATHS.map((p) => pages.find((x) => x.path === p)).filter(Boolean);
export const allPages = pages;
