import React from 'react';
import { Link } from 'react-router-dom';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const TokenRow = ({ token, usage, light, dark }) => (
  <tr className="border-b border-line">
    <td className="py-3 px-4 font-mono text-sm text-ink">{token}</td>
    <td className="py-3 px-4 text-sm text-ink-muted">{usage}</td>
    <td className="py-3 px-4 font-mono text-xs text-ink-muted whitespace-nowrap">{light}</td>
    <td className="py-3 px-4 font-mono text-xs text-ink-muted whitespace-nowrap">{dark}</td>
  </tr>
);

export default function ThemingPage() {
  const surfaceTokens = [
    { token: '--color-surface', usage: 'Page background (bg-surface)', light: '249 250 251', dark: '17 24 39' },
    { token: '--color-surface-raised', usage: 'Cards, panels, menus (bg-surface-raised)', light: '255 255 255', dark: '31 41 55' },
    { token: '--color-surface-muted', usage: 'Subtle fills, hovers, insets (bg-surface-muted)', light: '243 244 246', dark: '55 65 81' },
    { token: '--color-ink', usage: 'Primary text (text-ink)', light: '17 24 39', dark: '243 244 246' },
    { token: '--color-ink-muted', usage: 'Secondary text (text-ink-muted)', light: '75 85 99', dark: '156 163 175' },
    { token: '--color-ink-subtle', usage: 'Tertiary text, placeholders (text-ink-subtle)', light: '156 163 175', dark: '107 114 128' },
    { token: '--color-line', usage: 'Borders, dividers (border-line)', light: '229 231 235', dark: '55 65 81' },
    { token: '--color-line-strong', usage: 'Emphasized borders (border-line-strong)', light: '209 213 219', dark: '75 85 99' },
    { token: '--color-focus', usage: 'Focus ring (ring-focus)', light: '88 138 224', dark: '163 185 237' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Theming</h1>
          <p className="text-xl text-ink-muted">
            How Groove's semantic tokens work, how dark mode is wired, and how to override tokens or build a custom theme.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">The two-layer color model</h2>
          <p className="text-ink-muted mb-4">
            Groove separates color into two layers. <span className="font-semibold text-ink">Brand scales</span> —{' '}
            <span className="font-mono text-sm">primary</span>, <span className="font-mono text-sm">secondary</span>,{' '}
            <span className="font-mono text-sm">destructive</span>, <span className="font-mono text-sm">positive</span>, and{' '}
            <span className="font-mono text-sm">warning</span> — are static hex values that mean the same thing in every
            theme (each has <span className="font-mono text-sm">DEFAULT / hover / pressed / disabled</span>).{' '}
            <span className="font-semibold text-ink">Semantic tokens</span> — <span className="font-mono text-sm">surface</span>,{' '}
            <span className="font-mono text-sm">ink</span>, <span className="font-mono text-sm">line</span>, and{' '}
            <span className="font-mono text-sm">focus</span> — are theme-aware: they resolve through CSS variables that
            change between light and dark.
          </p>
          <p className="text-ink-muted">
            The rule of thumb: build layouts and text with the semantic tokens so they adapt automatically, and use the
            brand scales for intent — actions, status, and emphasis.
          </p>
        </section>

        {/* How dark mode works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">How dark mode works</h2>
          <p className="text-ink-muted mb-4">
            Tailwind is configured with <span className="font-mono text-sm">darkMode: 'class'</span>. Dark mode turns on
            when the <span className="font-mono text-sm">dark</span> class is present on the{' '}
            <span className="font-mono text-sm">&lt;html&gt;</span> element. Groove doesn't rely on{' '}
            <span className="font-mono text-sm">dark:</span> variants scattered across components — instead, the{' '}
            <span className="font-mono text-sm">.dark</span> selector redefines the <span className="font-mono text-sm">--color-*</span> CSS
            variables in <span className="font-mono text-sm">global.css</span>, and every semantic utility picks up the new
            values automatically.
          </p>
          <CodeBlock code={`/* global.css */
@layer base {
  :root {
    --color-surface: 249 250 251;   /* gray-50  */
    --color-surface-raised: 255 255 255;
    --color-ink: 17 24 39;          /* gray-900 */
    --color-line: 229 231 235;      /* gray-200 */
    --color-focus: 88 138 224;      /* primary 500 */
  }

  .dark {
    --color-surface: 17 24 39;      /* gray-900 */
    --color-surface-raised: 31 41 55;
    --color-ink: 243 244 246;       /* gray-100 */
    --color-line: 55 65 81;         /* gray-700 */
    --color-focus: 163 185 237;     /* primary 300 (brighter on dark) */
  }
}`} />
          <p className="text-ink-muted mt-4 mb-4">
            Toggling the theme is just toggling that class. Groove persists the choice to{' '}
            <span className="font-mono text-sm">localStorage</span> under the key <span className="font-mono text-sm">groove-theme</span>:
          </p>
          <CodeBlock code={`const [theme, setTheme] = useState(
  () => localStorage.getItem('groove-theme') || 'light'
);

useEffect(() => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('groove-theme', theme);
}, [theme]);

// somewhere in your UI:
<button onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}>
  Toggle theme
</button>`} />
        </section>

        {/* Token reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Semantic token reference</h2>
          <p className="text-ink-muted mb-4">
            Values are stored as space-separated RGB channels so Tailwind's{' '}
            <span className="font-mono text-sm">&lt;alpha-value&gt;</span> opacity modifiers work (e.g.{' '}
            <span className="font-mono text-sm">bg-surface/80</span>).
          </p>
          <div className="bg-surface-raised rounded-lg border border-line overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 px-4 font-semibold">Token</th>
                  <th className="py-3 px-4 font-semibold">Usage</th>
                  <th className="py-3 px-4 font-semibold">Light (RGB)</th>
                  <th className="py-3 px-4 font-semibold">Dark (RGB)</th>
                </tr>
              </thead>
              <tbody>
                {surfaceTokens.map((t) => (
                  <TokenRow key={t.token} {...t} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Customizing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overriding tokens &amp; building a custom theme</h2>

          <h3 className="text-lg font-semibold mb-2">Retint the whole system</h3>
          <p className="text-ink-muted mb-3">
            To reskin surfaces and text globally, change the CSS variables — you don't need to touch a single component.
            Redefine both the <span className="font-mono text-sm">:root</span> (light) and{' '}
            <span className="font-mono text-sm">.dark</span> blocks so both themes stay balanced.
          </p>
          <CodeBlock code={`/* A warmer light theme */
:root {
  --color-surface: 250 249 246;       /* warm off-white */
  --color-surface-raised: 255 255 255;
  --color-ink: 28 25 23;
  --color-line: 231 229 224;
}`} />

          <h3 className="text-lg font-semibold mt-6 mb-2">Add or change a brand color</h3>
          <p className="text-ink-muted mb-3">
            Brand scales live in <span className="font-mono text-sm">tailwind.config.js</span>. Add a new intent color
            with the same <span className="font-mono text-sm">DEFAULT / hover / pressed / disabled</span> shape so it drops
            into existing component APIs.
          </p>
          <CodeBlock code={`// tailwind.config.js -> theme.extend.colors
info: {
  DEFAULT: '#0ea5e9',  // sky 500
  hover:   '#38bdf8',
  pressed: '#0369a1',
  disabled:'#bae6fd',
},

// then use it anywhere:
// <span className="bg-info text-white rounded-pill px-2">New</span>`} />

          <h3 className="text-lg font-semibold mt-6 mb-2">Add a new theme-aware token</h3>
          <p className="text-ink-muted mb-3">
            For a token that should shift with the theme, declare a CSS variable in both blocks and map it in the Tailwind
            config using the <span className="font-mono text-sm">&lt;alpha-value&gt;</span> pattern.
          </p>
          <CodeBlock code={`/* global.css */
:root { --color-accent: 124 58 237; }   /* purple 600 */
.dark { --color-accent: 167 139 250; }  /* purple 400 */

// tailwind.config.js -> theme.extend.colors
accent: 'rgb(var(--color-accent) / <alpha-value>)',`} />
        </section>

        {/* Focus ring */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">The focus token</h2>
          <p className="text-ink-muted mb-4">
            Focus visibility is itself a theme-aware token. Use <span className="font-mono text-sm">ring-focus</span> (paired
            with <span className="font-mono text-sm">focus-visible:</span>) instead of a hard-coded color so focus rings stay
            legible in both themes — the token brightens on dark backgrounds automatically.
          </p>
          <CodeBlock code={`<button className="rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2">
  Accessible button
</button>`} />
          <p className="text-ink-muted mt-4">
            For the full contrast and keyboard story, see the{' '}
            <Link to="/accessibility" className="text-primary hover:underline">Accessibility</Link> foundation.
          </p>
        </section>

        {/* Do's and Don'ts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Do's &amp; Don'ts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-positive/5 border border-positive rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-ink">
                <span className="text-positive text-xl leading-none">✓</span> Do
              </h3>
              <ul className="space-y-3 text-ink-muted">
                <li className="flex gap-2"><span className="text-positive" aria-hidden="true">✓</span><span>Use semantic tokens (bg-surface, text-ink, border-line) for layout and text.</span></li>
                <li className="flex gap-2"><span className="text-positive" aria-hidden="true">✓</span><span>Change themes by editing CSS variables, not by rewriting components.</span></li>
                <li className="flex gap-2"><span className="text-positive" aria-hidden="true">✓</span><span>Keep new tokens defined in both :root and .dark so themes stay in sync.</span></li>
                <li className="flex gap-2"><span className="text-positive" aria-hidden="true">✓</span><span>Use ring-focus for focus states so they adapt across themes.</span></li>
              </ul>
            </div>
            <div className="bg-destructive/5 border border-destructive rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-ink">
                <span className="text-destructive text-xl leading-none">✗</span> Don't
              </h3>
              <ul className="space-y-3 text-ink-muted">
                <li className="flex gap-2"><span className="text-destructive" aria-hidden="true">✗</span><span>Hard-code raw palette classes like bg-gray-100 or text-white in product UI.</span></li>
                <li className="flex gap-2"><span className="text-destructive" aria-hidden="true">✗</span><span>Scatter dark: overrides across components — let the tokens do the switching.</span></li>
                <li className="flex gap-2"><span className="text-destructive" aria-hidden="true">✗</span><span>Define a variable for only one theme, leaving the other unstyled.</span></li>
                <li className="flex gap-2"><span className="text-destructive" aria-hidden="true">✗</span><span>Skip re-checking contrast after retinting — verify both light and dark.</span></li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
