import React from 'react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const DosDonts = ({ dos, donts }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-positive/5 border border-positive rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-ink">
        <span className="text-positive text-xl leading-none">✓</span> Do
      </h3>
      <ul className="space-y-3 text-ink-muted">
        {dos.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className="text-positive flex-shrink-0" aria-hidden="true">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-destructive/5 border border-destructive rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-ink">
        <span className="text-destructive text-xl leading-none">✗</span> Don't
      </h3>
      <ul className="space-y-3 text-ink-muted">
        {donts.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className="text-destructive flex-shrink-0" aria-hidden="true">✗</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const breakpoints = [
  { name: 'base', prefix: '(none)', min: '0px', usage: 'Mobile-first default — styles apply until the next breakpoint.' },
  { name: 'sm', prefix: 'sm:', min: '640px', usage: 'Large phones, small tablets in portrait.' },
  { name: 'md', prefix: 'md:', min: '768px', usage: 'Tablets — two-column layouts become viable.' },
  { name: 'lg', prefix: 'lg:', min: '1024px', usage: 'Laptops — sidebars and multi-column grids.' },
  { name: 'xl', prefix: 'xl:', min: '1280px', usage: 'Desktops — wide dashboards.' },
  { name: '2xl', prefix: '2xl:', min: '1536px', usage: 'Large desktops and ultra-wide displays.' },
];

const containers = [
  { className: 'max-w-2xl', value: '672px', usage: 'Reading width — long-form text, settings forms.' },
  { className: 'max-w-4xl', value: '896px', usage: 'Focused content pages.' },
  { className: 'max-w-5xl', value: '1024px', usage: 'Default docs / component page width in Groove.' },
  { className: 'max-w-7xl', value: '1280px', usage: 'Full application shells and dashboards.' },
];

export default function LayoutPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Layout</h1>
          <p className="text-xl text-ink-muted">
            Breakpoints, containers, and grids for building responsive, mobile-first interfaces
            with Tailwind's utility classes.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-ink-muted mb-4">
            Groove is <span className="italic">mobile-first</span>: unprefixed utilities apply at every
            width, and each breakpoint prefix (<span className="font-mono text-sm">sm:</span>,{' '}
            <span className="font-mono text-sm">md:</span>, …) layers on styles from that width{' '}
            <span className="italic">up</span>. Design the smallest layout first, then progressively
            enhance for larger screens.
          </p>
          <CodeBlock code={`{/* one column on phones, two on tablets, four on laptops */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">…</div>`} />
        </section>

        {/* Breakpoints (with live indicator) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Breakpoints</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-6">
            <p className="text-sm text-ink-muted mb-3">Resize your window — the active breakpoint updates live:</p>
            <div className="text-2xl font-bold text-primary font-mono">
              <span className="sm:hidden">base &nbsp;·&nbsp; &lt; 640px</span>
              <span className="hidden sm:inline md:hidden">sm &nbsp;·&nbsp; ≥ 640px</span>
              <span className="hidden md:inline lg:hidden">md &nbsp;·&nbsp; ≥ 768px</span>
              <span className="hidden lg:inline xl:hidden">lg &nbsp;·&nbsp; ≥ 1024px</span>
              <span className="hidden xl:inline 2xl:hidden">xl &nbsp;·&nbsp; ≥ 1280px</span>
              <span className="hidden 2xl:inline">2xl &nbsp;·&nbsp; ≥ 1536px</span>
            </div>
          </div>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Prefix</th>
                  <th className="py-3 px-4 font-semibold">Min width</th>
                  <th className="py-3 px-4 font-semibold">Typical use</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {breakpoints.map((b) => (
                  <tr key={b.name} className="border-b border-line last:border-0">
                    <td className="py-3 px-4 font-mono text-ink">{b.name}</td>
                    <td className="py-3 px-4 font-mono text-xs text-ink-muted">{b.prefix}</td>
                    <td className="py-3 px-4 font-mono text-xs">{b.min}</td>
                    <td className="py-3 px-4 text-ink-muted">{b.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Containers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Container widths</h2>
          <p className="text-ink-muted mb-6">
            Cap content width with a <span className="font-mono text-sm">max-w-*</span> utility and
            center it with <span className="font-mono text-sm">mx-auto</span>. Every Groove doc page
            uses <span className="font-mono text-sm">max-w-5xl mx-auto</span> inside a{' '}
            <span className="font-mono text-sm">p-8</span> gutter.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 space-y-3">
            {containers.map((c) => (
              <div key={c.className}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm text-ink">{c.className}</span>
                  <span className="font-mono text-xs text-ink-muted">{c.value}</span>
                </div>
                <div className={`${c.className} h-6 bg-primary/20 border border-primary rounded`} />
                <p className="text-xs text-ink-muted mt-1">{c.usage}</p>
              </div>
            ))}
          </div>
          <CodeBlock code={`<div className="max-w-5xl mx-auto px-8">
  {/* page content */}
</div>`} />
        </section>

        {/* Responsive grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Responsive grid</h2>
          <p className="text-ink-muted mb-6">
            Compose grids with <span className="font-mono text-sm">grid</span>,{' '}
            <span className="font-mono text-sm">grid-cols-*</span>, and a{' '}
            <span className="font-mono text-sm">gap-*</span> gutter. Change the column count per
            breakpoint. The demo below is 1 column on phones, 2 on{' '}
            <span className="font-mono text-sm">sm</span>, and 4 on{' '}
            <span className="font-mono text-sm">lg</span> — resize to see it reflow.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="h-20 flex items-center justify-center rounded-card bg-primary/10 border border-primary/30 text-primary font-medium"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <CodeBlock code={`<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>1</div>
  <div>2</div>
  {/* … */}
</div>`} />
        </section>

        {/* Gutters */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Gutters &amp; spacing</h2>
          <p className="text-ink-muted mb-4">
            Space between grid and flex children comes from the <span className="font-mono text-sm">gap-*</span>{' '}
            scale, which shares the same 4px-based rhythm as the{' '}
            <span className="font-medium text-ink">Spacing</span> foundation. Common gutters:
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8">
            <div className="space-y-4">
              {[
                { g: 'gap-2', px: '8px' },
                { g: 'gap-4', px: '16px' },
                { g: 'gap-6', px: '24px' },
                { g: 'gap-8', px: '32px' },
              ].map(({ g, px }) => (
                <div key={g} className="flex items-center gap-4">
                  <span className="w-20 font-mono text-sm text-ink">{g}</span>
                  <span className="w-14 font-mono text-xs text-ink-muted">{px}</span>
                  <div className={`flex ${g}`}>
                    <div className="w-8 h-8 rounded bg-primary/40" />
                    <div className="w-8 h-8 rounded bg-primary/40" />
                    <div className="w-8 h-8 rounded bg-primary/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Page scaffolds */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Common page scaffolds</h2>
          <div className="space-y-8">
            <div>
              <p className="font-semibold text-ink mb-2">Sidebar + content</p>
              <p className="text-sm text-ink-muted mb-3">A fixed-width nav beside a fluid content column — the layout of these docs.</p>
              <div className="bg-surface-raised rounded-lg border border-line p-4">
                <div className="flex gap-4 h-32">
                  <div className="w-40 rounded-card bg-primary/10 border border-primary/30 flex items-center justify-center text-xs text-primary font-medium">w-64 sidebar</div>
                  <div className="flex-1 rounded-card bg-surface-muted border border-line flex items-center justify-center text-xs text-ink-muted">flex-1 content</div>
                </div>
              </div>
            </div>
            <div>
              <p className="font-semibold text-ink mb-2">Centered content</p>
              <p className="text-sm text-ink-muted mb-3">A capped, centered column for reading and forms.</p>
              <div className="bg-surface-raised rounded-lg border border-line p-4">
                <div className="h-32 flex justify-center">
                  <div className="w-2/3 rounded-card bg-primary/10 border border-primary/30 flex items-center justify-center text-xs text-primary font-medium">max-w-* mx-auto</div>
                </div>
              </div>
            </div>
            <div>
              <p className="font-semibold text-ink mb-2">Two-column split</p>
              <p className="text-sm text-ink-muted mb-3">Stacks on mobile, splits at md — great for a form beside a preview.</p>
              <div className="bg-surface-raised rounded-lg border border-line p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-32">
                  <div className="rounded-card bg-primary/10 border border-primary/30 flex items-center justify-center text-xs text-primary font-medium">column</div>
                  <div className="rounded-card bg-surface-muted border border-line flex items-center justify-center text-xs text-ink-muted">column</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Do's &amp; Don'ts</h2>
          <DosDonts
            dos={[
              'Design mobile-first: set base styles, then layer breakpoint prefixes upward.',
              'Cap line length with a max-w-* container so text stays readable.',
              'Use gap-* for gutters instead of margins on individual grid children.',
              'Reflow columns at breakpoints (grid-cols-1 → md:grid-cols-2) rather than shrinking them.',
            ]}
            donts={[
              'Hard-code pixel widths that break on small screens — prefer fluid and max-width utilities.',
              'Introduce custom breakpoints that drift from sm/md/lg/xl/2xl.',
              'Nest deep, competing containers that fight over width.',
              'Rely on horizontal scrolling for primary content on mobile.',
            ]}
          />
        </section>
      </div>
    </div>
  );
}
