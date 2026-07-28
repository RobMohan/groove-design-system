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

const SpacingRow = ({ token, rem, px }) => (
  <div className="flex items-center gap-4 p-4 bg-surface-raised rounded-lg border border-line">
    <div className="w-24 flex-shrink-0">
      <p className="font-mono font-semibold text-ink">{token}</p>
    </div>
    <div className="w-32 flex-shrink-0 text-sm text-ink-muted font-mono">
      {rem} / {px}px
    </div>
    <div className="flex-1">
      <div className="h-6 bg-primary rounded" style={{ width: `${px}px`, maxWidth: '100%' }} />
    </div>
  </div>
);

export default function SpacingPage() {
  const scale = [
    { token: '0', rem: '0rem', px: 0 },
    { token: '0.5', rem: '0.125rem', px: 2 },
    { token: '1', rem: '0.25rem', px: 4 },
    { token: '2', rem: '0.5rem', px: 8 },
    { token: '3', rem: '0.75rem', px: 12 },
    { token: '4', rem: '1rem', px: 16 },
    { token: '5', rem: '1.25rem', px: 20 },
    { token: '6', rem: '1.5rem', px: 24 },
    { token: '8', rem: '2rem', px: 32 },
    { token: '10', rem: '2.5rem', px: 40 },
    { token: '12', rem: '3rem', px: 48 },
    { token: '16', rem: '4rem', px: 64 },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Spacing</h1>
          <p className="text-xl text-ink-muted">
            A consistent 4px-based spacing scale for margins, padding, and gaps across the system.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-ink-muted mb-4">
            Spacing is built on a 4px base unit. Each step in the scale is a multiple of 4,
            which keeps layouts rhythmic and predictable. Use these tokens for padding (<span className="font-mono text-sm">p-*</span>),
            margin (<span className="font-mono text-sm">m-*</span>), and fl/grid gaps (<span className="font-mono text-sm">gap-*</span>).
          </p>
          <p className="text-ink-muted mb-4">
            Consistent spacing is what makes an interface feel calm and intentional. Because every value is a
            multiple of the same base unit, elements line up on an invisible grid and relationships read clearly:
            tightly grouped items belong together, generously separated blocks are distinct. Use space deliberately
            to group and separate content — proximity is one of the strongest signals of what relates to what.
          </p>
          <CodeBlock code={`<div className="p-4 gap-2">   {/* 16px padding, 8px gap */}
<div className="mt-6 mb-8">    {/* 24px top, 32px bottom */}`} />
        </section>

        {/* Scale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Scale</h2>
          <div className="space-y-3">
            {scale.map((s) => (
              <SpacingRow key={s.token} {...s} />
            ))}
          </div>
        </section>

        {/* Guidelines */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Usage Guidelines</h2>
          <div className="space-y-4">
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-2">Component padding</h3>
              <p className="text-ink-muted">Use <span className="font-mono text-sm">2</span>–<span className="font-mono text-sm">4</span> (8–16px) for the internal padding of controls and cards.</p>
            </div>
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-2">Stacking content</h3>
              <p className="text-ink-muted">Use <span className="font-mono text-sm">4</span>–<span className="font-mono text-sm">8</span> (16–32px) between related blocks, and <span className="font-mono text-sm">12</span>+ (48px+) between major sections.</p>
            </div>
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-2">Stay on the scale</h3>
              <p className="text-ink-muted">Avoid arbitrary values like <span className="font-mono text-sm">p-[13px]</span>. Round to the nearest scale step to preserve vertical rhythm.</p>
            </div>
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Do's &amp; Don'ts</h2>
          <p className="text-ink-muted mb-6">
            Apply spacing consistently to keep layouts rhythmic and scannable.
          </p>
          <DosDonts
            dos={[
              'Pull every margin, padding, and gap from the scale so spacing stays on the 4px grid.',
              'Use tighter spacing within a group and looser spacing between groups to show what belongs together.',
              'Increase space as you move up the hierarchy — more room around sections than around individual items.',
              'Give interactive targets at least 44×44px of tappable area, padding the hit region if the visual is smaller.',
            ]}
            donts={[
              'Reach for arbitrary values like m-[7px] or p-[13px] that fall between scale steps.',
              'Apply equal spacing everywhere — uniform gaps flatten hierarchy and hide relationships.',
              'Crowd tappable controls together, which causes mis-taps on touch devices.',
              'Fix a cramped layout by shrinking text or targets instead of adjusting the surrounding space.',
            ]}
          />
        </section>

        {/* Accessibility */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2 text-ink">Touch targets &amp; rhythm</h3>
            <ul className="space-y-2 text-ink-muted">
              <li>• Make interactive elements at least 44×44px (WCAG 2.5.5) — extend padding rather than the visible icon or label to get there.</li>
              <li>• Keep adequate space between adjacent controls so people with motor impairments don't trigger the wrong one.</li>
              <li>• Maintain consistent spacing rhythm so screen magnifier users can scan predictably.</li>
              <li>• Preserve the vertical rhythm as text scales up to 200%; content should reflow without overlap or clipping.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
