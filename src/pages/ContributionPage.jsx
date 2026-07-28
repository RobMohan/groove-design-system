import React from 'react';
import { Link } from 'react-router-dom';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const Step = ({ n, title, children }) => (
  <div className="flex gap-4">
    <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-pill bg-primary text-white font-bold">{n}</span>
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-ink mb-1">{title}</h3>
      <div className="text-ink-muted">{children}</div>
    </div>
  </div>
);

export default function ContributionPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Contributing</h1>
          <p className="text-xl text-ink-muted">
            How to add or change a component in Groove — the file pattern, token conventions, and how to run the tests.
          </p>
        </div>

        {/* The pattern */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">The five-part component pattern</h2>
          <p className="text-ink-muted mb-6">
            Every component in Groove is added the same way. Each new component touches five things — miss one and it
            won't be reachable, documented, or covered.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-6">
            <ul className="space-y-3 text-ink-muted">
              <li className="flex gap-3"><span className="font-mono text-sm text-primary font-semibold w-56 shrink-0">src/components/Xyz.jsx</span><span>The component itself, styled with semantic tokens.</span></li>
              <li className="flex gap-3"><span className="font-mono text-sm text-primary font-semibold w-56 shrink-0">src/components/Xyz.test.jsx</span><span>Unit tests covering rendering, variants, and behavior.</span></li>
              <li className="flex gap-3"><span className="font-mono text-sm text-primary font-semibold w-56 shrink-0">src/pages/XyzPage.jsx</span><span>The documentation page (follow the ButtonPage structure).</span></li>
              <li className="flex gap-3"><span className="font-mono text-sm text-primary font-semibold w-56 shrink-0">src/main.jsx</span><span>Import the page and register its <span className="font-mono">&lt;Route&gt;</span>.</span></li>
              <li className="flex gap-3"><span className="font-mono text-sm text-primary font-semibold w-56 shrink-0">src/layout/DocsLayout.jsx</span><span>Add a nav entry under the right section.</span></li>
            </ul>
          </div>
        </section>

        {/* Walkthrough */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Walkthrough</h2>
          <div className="space-y-8">
            <Step n={1} title="Build the component">
              <p className="mb-3">
                Create <span className="font-mono text-sm">src/components/Xyz.jsx</span>. Use semantic tokens for every
                color, radius, and shadow so it themes automatically, and wire up accessible focus with{' '}
                <span className="font-mono text-sm">ring-focus</span>.
              </p>
              <CodeBlock code={`// src/components/Badge.jsx
export default function Badge({ variant = 'neutral', children }) {
  const variants = {
    neutral:  'bg-surface-muted text-ink border-line',
    positive: 'bg-positive/10 text-positive border-positive/40',
    warning:  'bg-warning/10 text-warning border-warning/40',
  };
  return (
    <span className={\`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-pill border \${variants[variant]}\`}>
      {children}
    </span>
  );
}`} />
            </Step>

            <Step n={2} title="Write the test">
              <p className="mb-3">
                Add <span className="font-mono text-sm">src/components/Xyz.test.jsx</span> using Vitest and Testing
                Library. Cover the default render, each variant, and any interaction or a11y attributes.
              </p>
              <CodeBlock code={`// src/components/Badge.test.jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from './Badge';

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });
});`} />
            </Step>

            <Step n={3} title="Document it">
              <p className="mb-3">
                Create <span className="font-mono text-sm">src/pages/XyzPage.jsx</span> following the established page
                structure: a local <span className="font-mono text-sm">CodeBlock</span> helper, a{' '}
                <span className="font-mono text-sm">p-8 &rarr; max-w-5xl mx-auto</span> container, an{' '}
                <span className="font-mono text-sm">h1 text-5xl font-bold</span> header with a{' '}
                <span className="font-mono text-sm">text-xl text-ink-muted</span> subtitle, then{' '}
                <span className="font-mono text-sm">section mb-12</span> blocks. Include live demos, a props table, and
                usage guidance.
              </p>
            </Step>

            <Step n={4} title="Register the route">
              <p className="mb-3">In <span className="font-mono text-sm">src/main.jsx</span>, import the page and add its route.</p>
              <CodeBlock code={`import XyzPage from './pages/XyzPage';

// inside <Routes>
<Route path="/xyz" element={<XyzPage />} />`} />
            </Step>

            <Step n={5} title="Add the nav entry">
              <p className="mb-3">
                In <span className="font-mono text-sm">src/layout/DocsLayout.jsx</span>, add the item to the correct
                list — <span className="font-mono text-sm">componentItems</span> for components (kept alphabetical), or
                the foundations/guides group for docs pages.
              </p>
              <CodeBlock code={`// componentItems array (keep alphabetical)
{ path: '/xyz', label: 'Xyz' },`} />
            </Step>
          </div>
        </section>

        {/* Token conventions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Token conventions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-positive/5 border border-positive rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-ink">
                <span className="text-positive text-xl leading-none">✓</span> Do
              </h3>
              <ul className="space-y-3 text-ink-muted">
                <li className="flex gap-2"><span className="text-positive" aria-hidden="true">✓</span><span>Use semantic tokens: bg-surface, text-ink, border-line.</span></li>
                <li className="flex gap-2"><span className="text-positive" aria-hidden="true">✓</span><span>Use brand scales for intent: primary, positive, warning, destructive.</span></li>
                <li className="flex gap-2"><span className="text-positive" aria-hidden="true">✓</span><span>Use named radius/elevation tokens: rounded-control, shadow-elevation-2.</span></li>
                <li className="flex gap-2"><span className="text-positive" aria-hidden="true">✓</span><span>Provide a visible focus state with ring-focus.</span></li>
              </ul>
            </div>
            <div className="bg-destructive/5 border border-destructive rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-ink">
                <span className="text-destructive text-xl leading-none">✗</span> Don't
              </h3>
              <ul className="space-y-3 text-ink-muted">
                <li className="flex gap-2"><span className="text-destructive" aria-hidden="true">✗</span><span>Use raw palette classes like bg-gray-100, text-white, or border-gray-200.</span></li>
                <li className="flex gap-2"><span className="text-destructive" aria-hidden="true">✗</span><span>Hard-code hex colors or arbitrary values like rounded-[7px].</span></li>
                <li className="flex gap-2"><span className="text-destructive" aria-hidden="true">✗</span><span>Add scattered dark: overrides — the tokens handle theming.</span></li>
                <li className="flex gap-2"><span className="text-destructive" aria-hidden="true">✗</span><span>Ship a component without a test or a docs page.</span></li>
              </ul>
            </div>
          </div>
          <p className="text-ink-muted mt-4">
            See <Link to="/theming" className="text-primary hover:underline">Theming</Link> for the full token list and{' '}
            <Link to="/accessibility" className="text-primary hover:underline">Accessibility</Link> for the a11y baseline.
          </p>
        </section>

        {/* Running tests */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Running tests</h2>
          <p className="text-ink-muted mb-4">
            Tests run on Vitest with Testing Library and jsdom. Run the whole suite in watch mode, or target a single
            file.
          </p>
          <CodeBlock code={`# run the full suite (watch mode)
npm test

# run once (CI-style) and exit
npx vitest run

# run a single file
npx vitest run src/components/Badge.test.jsx

# coverage report
npm run test:coverage`} />
          <p className="text-ink-muted mt-4">
            Before opening a PR, make sure <span className="font-mono text-sm">npx vitest run</span> and{' '}
            <span className="font-mono text-sm">npm run build</span> both pass.
          </p>
        </section>
      </div>
    </div>
  );
}
