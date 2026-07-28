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

const ElevationCard = ({ token, className, usage }) => (
  <div className="flex flex-col items-center gap-4 p-8 bg-surface-muted rounded-lg border border-line">
    <div className={`w-full h-24 bg-surface-raised rounded-card flex items-center justify-center ${className}`}>
      <span className="font-mono text-sm text-ink-muted">{className}</span>
    </div>
    <div className="text-center">
      <p className="font-semibold text-ink">{token}</p>
      <p className="text-sm text-ink-muted mt-1">{usage}</p>
    </div>
  </div>
);

export default function ElevationPage() {
  const levels = [
    { token: 'Level 1', className: 'shadow-elevation-1', usage: 'Subtle separation — inputs, list rows' },
    { token: 'Level 2', className: 'shadow-elevation-2', usage: 'Resting cards and panels' },
    { token: 'Level 3', className: 'shadow-elevation-3', usage: 'Hovered cards, dropdowns' },
    { token: 'Level 4', className: 'shadow-elevation-4', usage: 'Popovers, menus' },
    { token: 'Level 5', className: 'shadow-elevation-5', usage: 'Modals and dialogs' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Elevation</h1>
          <p className="text-xl text-ink-muted">
            A five-step shadow scale that conveys depth and layering across surfaces.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-ink-muted mb-4">
            Elevation communicates how close an element is to the user. The higher the level,
            the more an element appears to float above the page. Use the lowest elevation that
            still creates the needed separation.
          </p>
          <p className="text-ink-muted mb-4">
            Shadow is a tool for hierarchy, not decoration. Each level maps to a rung on a consistent depth
            ladder, so elements that share a purpose should share an elevation, and anything that sits on top —
            a menu, popover, or dialog — should read as clearly higher than the content beneath it. Treat the
            five levels as the full vocabulary; that restraint is what keeps depth meaningful.
          </p>
          <CodeBlock code={`<div className="shadow-elevation-2 rounded-card">Resting card</div>
<div className="shadow-elevation-5 rounded-modal">Dialog</div>`} />
        </section>

        {/* Scale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Scale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((l) => (
              <ElevationCard key={l.token} {...l} />
            ))}
          </div>
        </section>

        {/* Guidelines */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Usage Guidelines</h2>
          <div className="space-y-4">
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-2">Match elevation to interaction</h3>
              <p className="text-ink-muted">Transient surfaces (menus, popovers, modals) sit higher than persistent ones (cards, inputs).</p>
            </div>
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-2">Elevate on hover</h3>
              <p className="text-ink-muted">Lifting an interactive card from Level 2 to Level 3 on hover signals it can be acted on.</p>
            </div>
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-2">Don't over-stack</h3>
              <p className="text-ink-muted">Too many competing shadows flatten the hierarchy. Reserve the highest levels for true overlays.</p>
            </div>
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Do's &amp; Don'ts</h2>
          <p className="text-ink-muted mb-6">
            Use elevation to reinforce depth and layering, not to add visual noise.
          </p>
          <DosDonts
            dos={[
              'Match elevation to layer order — overlays (menus, popovers, dialogs) always sit above the content they cover.',
              'Give surfaces of the same type the same level so depth stays consistent across the product.',
              'Use the lowest level that still creates the separation you need.',
              'Pair a subtle border with low elevations so edges stay defined in high-contrast and dark themes.',
            ]}
            donts={[
              'Stack many competing shadows on one screen, which flattens the hierarchy instead of clarifying it.',
              'Reach past the five defined levels or invent custom shadows for one-off components.',
              'Use shadow purely as decoration on elements that never leave the page plane.',
              'Rely on shadow alone to separate regions — some displays and users render it faintly or not at all.',
            ]}
          />
        </section>

        {/* Accessibility */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2 text-blue-900">Depth beyond shadow</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• Don't rely on shadow alone to separate content — reinforce boundaries with a border or a change in surface color.</li>
              <li>• Shadows can be nearly invisible in dark themes and Windows High Contrast Mode; ensure layout still reads without them.</li>
              <li>• Keep z-layering purposeful so keyboard focus and reading order follow the visible stacking order.</li>
              <li>• Elevation should signal hierarchy, not replace focus indicators — keep focus outlines visible on raised surfaces.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
