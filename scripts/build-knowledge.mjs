// Builds the chatbot's knowledge base from the doc site's own source, so the bot
// answers from what the pages actually say. Output: api/_knowledge.mjs
//
//   node scripts/build-knowledge.mjs
//
// Runs automatically before `npm run dev` and `npm run build`. The output is
// committed so the serverless function can import it without a build step.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// ---- Route table: path -> page file, plus sidebar category + label ---------

const main = read('src/main.jsx');
const layout = read('src/layout/DocsLayout.jsx');

const importFile = {};
for (const m of main.matchAll(/import\s+(\w+)\s+from\s+'\.\/pages\/(\w+)'/g)) importFile[m[1]] = m[2];

const routes = [];
for (const m of main.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<(\w+)\s*\/>\}/g)) {
  routes.push({ path: m[1], file: importFile[m[2]] });
}

const categories = {
  gettingStartedItems: 'Getting started',
  foundationItems: 'Foundations',
  componentItems: 'Components',
  resourceItems: 'Resources',
};
const nav = {};
for (const [arr, category] of Object.entries(categories)) {
  const block = layout.match(new RegExp(`const ${arr} = \\[([\\s\\S]*?)\\];`))?.[1] ?? '';
  for (const m of block.matchAll(/path:\s*'([^']+)',\s*label:\s*'([^']+)'/g)) {
    nav[m[1]] = { label: m[2], category };
  }
}

// ---- JSX -> readable text ---------------------------------------------------

const SKIP_ATTRS = new Set(['className', 'key', 'to', 'href', 'id', 'ref', 'style', 'aria-label', 'role']);
const BLOCK_TAGS = new Set(['p', 'li', 'tr', 'div', 'section', 'pre', 'ul', 'ol', 'table', 'thead', 'tbody', 'dl', 'dt', 'dd']);
const HEADINGS = { h1: '# ', h2: '## ', h3: '### ', h4: '#### ' };

const squash = (s) => s.replace(/\s+/g, ' ').trim();

const templateText = (node) =>
  node.quasis
    .map((q, i) => q.value.cooked + (i < node.expressions.length ? '${…}' : ''))
    .join('');

function extractPage(source) {
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  const imported = new Set();
  for (const node of ast.program.body) {
    if (node.type === 'ImportDeclaration') node.specifiers.forEach((s) => imported.add(s.local.name));
  }

  // Data tables declared as plain JS (const roles = [...]) are rendered where the
  // JSX maps over them, so rows stay under the right heading.
  const dataNodes = new Map();
  const usedData = new Set();
  (function collect(node) {
    if (!node || typeof node.type !== 'string') return;
    if (
      node.type === 'VariableDeclarator' &&
      node.id.type === 'Identifier' &&
      /^[a-z]/.test(node.id.name) &&
      ['ArrayExpression', 'ObjectExpression'].includes(node.init?.type)
    ) {
      dataNodes.set(node.id.name, node.init);
    }
    for (const key of Object.keys(node)) {
      if (['loc', 'start', 'end', 'extra'].includes(key)) continue;
      const v = node[key];
      if (Array.isArray(v)) v.forEach(collect);
      else if (v && typeof v === 'object') collect(v);
    }
  })(ast.program);

  const out = [];
  const push = (s) => out.push(s);
  const nl = () => out.push('\n');

  const stringOf = (node) => {
    if (!node) return null;
    if (node.type === 'StringLiteral') return node.value;
    if (node.type === 'TemplateLiteral') return templateText(node);
    if (node.type === 'JSXExpressionContainer') return stringOf(node.expression);
    return null;
  };

  function walk(node) {
    if (!node || typeof node.type !== 'string') return;

    switch (node.type) {
      case 'ImportDeclaration':
        return;

      // Helper components defined at the top of a page (CodeBlock, PropRow, ...)
      // are templates, not content: their usages carry the data.
      case 'VariableDeclaration':
        if (
          node.declarations.every(
            (d) => d.id.type === 'Identifier' && /^[A-Z]/.test(d.id.name) && /Function/.test(d.init?.type ?? ''),
          )
        ) {
          return;
        }
        if (node.declarations.every((d) => d.id.type === 'Identifier' && dataNodes.get(d.id.name) === d.init)) return;
        node.declarations.forEach(walk);
        return;

      // rows.map(...) / [...].map(...): emit the data here, skip the row template
      case 'CallExpression': {
        const callee = node.callee;
        if (callee.type === 'MemberExpression' && callee.property.name === 'map') {
          const obj = callee.object;
          if (obj.type === 'Identifier' && dataNodes.has(obj.name)) {
            usedData.add(obj.name);
            walk(dataNodes.get(obj.name));
            return;
          }
          if (obj.type === 'ArrayExpression') {
            walk(obj);
            return;
          }
        }
        walk(callee);
        node.arguments.forEach(walk);
        return;
      }

      case 'JSXText': {
        const t = squash(node.value);
        if (t) push(t + ' ');
        return;
      }

      case 'JSXElement': {
        const name = node.openingElement.name.name; // identifier or member expr -> undefined
        const attrs = node.openingElement.attributes.filter((a) => a.type === 'JSXAttribute');

        if (name && HEADINGS[name]) {
          nl();
          push(HEADINGS[name]);
          node.children.forEach(walk);
          nl();
          return;
        }

        // Fenced code samples: <CodeBlock code={`...`} />
        const codeAttr = attrs.find((a) => a.name.name === 'code');
        if (codeAttr) {
          const code = stringOf(codeAttr.value);
          if (code != null) {
            nl();
            push('```jsx\n' + code.replace(/\s+$/, '') + '\n```');
            nl();
            return;
          }
        }

        if (name === 'code' || name === 'kbd') {
          const inner = [];
          const saved = out.length;
          node.children.forEach(walk);
          const text = squash(out.splice(saved).join(''));
          if (text) push('`' + text + '` ');
          return;
        }

        // Doc-helper components defined in the page itself (PropRow, TokenRow, ...)
        // carry their data in string attributes: emit them as a table-ish row.
        if (name && /^[A-Z]/.test(name) && !imported.has(name)) {
          const cells = attrs
            .filter((a) => !SKIP_ATTRS.has(a.name.name))
            .map((a) => stringOf(a.value))
            .filter((v) => v != null && v !== '');
          if (cells.length) {
            nl();
            push('- ' + cells.map(squash).join(' | '));
            nl();
          }
        }

        const block = name && BLOCK_TAGS.has(name);
        if (name === 'tr') {
          nl();
          push('- ');
          const row = [];
          for (const cell of node.children) {
            if (cell.type !== 'JSXElement') continue;
            const saved = out.length;
            cell.children.forEach(walk);
            row.push(squash(out.splice(saved).join('')));
          }
          if (row.some((c) => /[\p{L}\p{N}]/u.test(c))) push(row.join(' | '));
          nl();
          return;
        }
        if (block) nl();
        node.children.forEach(walk);
        if (block) nl();
        return;
      }

      case 'JSXExpressionContainer': {
        const s = stringOf(node.expression);
        if (s != null) {
          const t = squash(s);
          if (t) push(t + ' ');
        } else walk(node.expression);
        return;
      }

      case 'JSXAttribute':
        return; // handled by the element

      // Data tables defined as plain JS (arrays/objects of strings).
      case 'ArrayExpression': {
        const strs = node.elements.map(stringOf);
        if (strs.length && strs.every((s) => s != null)) {
          nl();
          push('- ' + strs.map(squash).join(' | '));
          nl();
          return;
        }
        node.elements.forEach(walk);
        return;
      }
      case 'ObjectExpression': {
        const cells = [];
        const rest = [];
        for (const p of node.properties) {
          if (p.type !== 'ObjectProperty') continue;
          const key = p.key.name ?? p.key.value;
          const s = stringOf(p.value);
          if (s != null && !SKIP_ATTRS.has(key) && key !== 'className') cells.push(squash(s));
          else rest.push(p.value);
        }
        if (cells.length) {
          nl();
          push('- ' + cells.join(' | '));
          nl();
        }
        rest.forEach(walk);
        return;
      }

      case 'TemplateLiteral':
        return; // only meaningful when attached to code/props above

      default:
        for (const key of Object.keys(node)) {
          if (key === 'loc' || key === 'start' || key === 'end' || key === 'extra') continue;
          const v = node[key];
          if (Array.isArray(v)) v.forEach(walk);
          else if (v && typeof v === 'object') walk(v);
        }
    }
  }

  walk(ast.program);
  for (const [name, init] of dataNodes) {
    if (!usedData.has(name) && source.includes(name)) {
      const saved = out.length;
      walk(init);
      if (out.length > saved) out.splice(saved, 0, '\n');
    }
  }
  const raw = out.join('').replace(/^- [|\s]*$/gm, '');
  // Tidy whitespace outside fenced code blocks; leave code exactly as written.
  return raw
    .split(/(```[\s\S]*?```)/g)
    .map((part, i) =>
      i % 2
        ? part
        : part
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n[ \t]+/g, '\n')
            .replace(/ {2,}/g, ' '),
    )
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^(- .*)\n\n(?=- )/gm, '$1\n')
    .replace(/^(- .*)\n\n(?=- )/gm, '$1\n')
    .trim();
}

// ---- Build chunks -----------------------------------------------------------

const pages = [];
for (const r of routes) {
  if (!r.file) continue;
  const text = extractPage(read(`src/pages/${r.file}.jsx`));
  const title = text.match(/^# (.+)$/m)?.[1] ?? nav[r.path]?.label ?? r.file;
  const lead = text.split('\n').slice(1).find((l) => l.trim() && !l.startsWith('#') && !l.startsWith('-') && !l.startsWith('`')) ?? '';
  pages.push({
    path: r.path,
    title: nav[r.path]?.label ?? title,
    category: r.path === '/' ? 'Home' : (nav[r.path]?.category ?? 'Other'),
    summary: squash(lead).slice(0, 220),
    text,
  });
}

// Tokens that live outside the pages: Tailwind theme + CSS variables.
const tailwind = read('tailwind.config.js').trim();
const css = read('src/styles/global.css').trim();
pages.push({
  path: '/theming#source',
  title: 'Tailwind config and CSS variables (source)',
  category: 'Source',
  summary: 'The exact tailwind.config.js theme extension and the light/dark CSS variables the semantic tokens read from.',
  text:
    '# Tailwind config and CSS variables (source)\n\n## tailwind.config.js\n\n```js\n' +
    tailwind +
    '\n```\n\n## src/styles/global.css\n\n```css\n' +
    css +
    '\n```',
});

const out =
  '// GENERATED by scripts/build-knowledge.mjs - do not edit by hand.\n' +
  'export const pages = ' +
  JSON.stringify(pages, null, 1) +
  ';\n';
fs.mkdirSync(path.join(root, 'api'), { recursive: true });
fs.writeFileSync(path.join(root, 'api/_knowledge.mjs'), out);

const chars = pages.reduce((n, p) => n + p.text.length, 0);
console.log(`knowledge: ${pages.length} pages, ${(chars / 1000).toFixed(0)}k chars (~${Math.round(chars / 4000)}k tokens)`);
