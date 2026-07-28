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

const RadiusCard = ({ token, className, value, usage }) => (
  <div className="flex items-center gap-4 p-4 bg-surface-raised rounded-lg border border-line">
    <div className={`w-20 h-20 bg-primary/15 border-2 border-primary flex-shrink-0 ${className}`} />
    <div className="flex-1">
      <p className="font-mono font-semibold text-ink">{className}</p>
      <p className="text-sm text-ink-muted font-mono">{value}</p>
      <p className="text-sm text-ink-muted mt-1">{usage}</p>
    </div>
  </div>
);

export default function RadiusPage() {
  const semantic = [
    { className: 'rounded-control', value: '0.5rem / 8px', usage: 'Buttons, inputs, small controls' },
    { className: 'rounded-card', value: '0.75rem / 12px', usage: 'Cards and panels' },
    { className: 'rounded-modal', value: '1rem / 16px', usage: 'Dialogs and large surfaces' },
    { className: 'rounded-pill', value: '9999px', usage: 'Tags, avatars, fully-rounded chips' },
  ];

  const base = [
    { className: 'rounded-none', value: '0px', usage: 'Flush edges' },
    { className: 'rounded-sm', value: '0.125rem / 2px', usage: 'Subtle softening' },
    { className: 'rounded', value: '0.25rem / 4px', usage: 'Default small radius' },
    { className: 'rounded-lg', value: '0.5rem / 8px', usage: 'General-purpose' },
    { className: 'rounded-full', value: '9999px', usage: 'Circles and pills' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Radius</h1>
          <p className="text-xl text-ink-muted">
            Corner-radius tokens that keep component shapes consistent and on-brand.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-ink-muted mb-4">
            Groove defines semantic radius tokens named for their use case, so a control always
            looks like a control and a card always looks like a card — regardless of where it appears.
          </p>
          <p className="text-ink-muted mb-4">
            Corner radius sets the tone of the interface: consistent rounding reads as polished and
            considered, while mixed radii feel accidental. The goal is a coherent shape language — every
            member of a control family shares the same corners, and larger containers round a little more
            than the elements nested inside them. Choose a token by what an element <span className="italic">is</span>,
            not by eyeballing a value, and shapes stay consistent as the system evolves.
          </p>
          <CodeBlock code={`<button className="rounded-control">Save</button>
<div className="rounded-card">Card</div>
<div className="rounded-modal">Dialog</div>`} />
        </section>

        {/* Semantic tokens */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Semantic Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {semantic.map((r) => (
              <RadiusCard key={r.className} {...r} />
            ))}
          </div>
        </section>

        {/* Base scale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Base Scale</h2>
          <p className="text-ink-muted mb-6">
            The underlying Tailwind radii remain available for one-off needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {base.map((r) => (
              <RadiusCard key={r.className} {...r} />
            ))}
          </div>
        </section>

        {/* Guidelines */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Usage Guidelines</h2>
          <div className="space-y-4">
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-2">Prefer semantic tokens</h3>
              <p className="text-ink-muted">Reach for <span className="font-mono text-sm">rounded-control</span>, <span className="font-mono text-sm">rounded-card</span>, and <span className="font-mono text-sm">rounded-modal</span> first so shapes stay consistent if the scale is ever retuned.</p>
            </div>
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-2">Nest smaller inside larger</h3>
              <p className="text-ink-muted">An element inside a rounded container should use an equal or smaller radius to avoid corners poking out.</p>
            </div>
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Do's &amp; Don'ts</h2>
          <p className="text-ink-muted mb-6">
            Keep corners consistent so the interface feels like one coherent system.
          </p>
          <DosDonts
            dos={[
              'Reach for the semantic tokens first — rounded-control, rounded-card, and rounded-modal — so shapes stay in sync.',
              'Give every member of a control family (buttons, inputs, selects) the same radius.',
              'Round nested elements equal to or less than their container to avoid corners poking past the edge.',
              'Use rounded-pill intentionally for fully-rounded shapes like tags, avatars, and chips.',
            ]}
            donts={[
              'Scatter arbitrary values like rounded-[7px] that drift off the defined scale.',
              'Mix several unrelated radii on a single component or within one control family.',
              'Nest a larger radius inside a smaller one, which leaves the inner corners clipped.',
              'Over-round dense data surfaces like tables, where large radii waste space and look inconsistent.',
            ]}
          />
        </section>

        {/* Accessibility */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2 text-ink">Consistency &amp; clarity</h3>
            <ul className="space-y-2 text-ink-muted">
              <li>• Keep radius consistent across a control family so components are easy to recognize and predict.</li>
              <li>• Ensure focus outlines follow the corner shape and stay fully visible — rounded corners shouldn't clip the focus ring.</li>
              <li>• Don't let rounding eat into a control's hit area; preserve the minimum 44×44px touch target.</li>
              <li>• Never rely on shape alone to signal state or meaning; pair it with color, text, or an icon.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
