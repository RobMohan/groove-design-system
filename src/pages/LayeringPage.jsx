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

const layers = [
  { token: 'z-hide', value: '-1', usage: 'Push an element behind its parent (decorative backdrops).' },
  { token: 'z-base', value: '0', usage: 'Default in-flow content.' },
  { token: 'z-dropdown', value: '1000', usage: 'Select / Menu panels anchored inline (no scrim).' },
  { token: 'z-sticky', value: '1100', usage: 'Sticky headers, toolbars, pinned table columns.' },
  { token: 'z-overlay', value: '1300', usage: 'The dimming scrim behind modals and drawers.' },
  { token: 'z-drawer', value: '1350', usage: 'Off-canvas Drawer / Sheet panels.' },
  { token: 'z-modal', value: '1400', usage: 'Centered dialogs.' },
  { token: 'z-popover', value: '1500', usage: 'Floating poppers — must clear an open modal.' },
  { token: 'z-toast', value: '1600', usage: 'Toast / snackbar stack.' },
  { token: 'z-tooltip', value: '1700', usage: 'Tooltips — always on top, never blocking.' },
];

const stack = [
  { token: 'z-dropdown', label: 'Dropdown · 1000', z: 'z-dropdown' },
  { token: 'z-overlay', label: 'Overlay scrim · 1300', z: 'z-overlay' },
  { token: 'z-modal', label: 'Modal · 1400', z: 'z-modal' },
  { token: 'z-popover', label: 'Popover · 1500', z: 'z-popover' },
  { token: 'z-toast', label: 'Toast · 1600', z: 'z-toast' },
  { token: 'z-tooltip', label: 'Tooltip · 1700', z: 'z-tooltip' },
];

export default function LayeringPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Layering</h1>
          <p className="text-xl text-ink-muted">
            A named z-index scale that gives every overlay a predictable stacking order — so poppers,
            modals, toasts, and tooltips never fight over who sits on top.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-ink-muted mb-4">
            Ad-hoc z-index values (<span className="font-mono text-sm">z-10</span>,{' '}
            <span className="font-mono text-sm">z-50</span>, …) are the classic source of stacking bugs:
            two overlays pick the same number and the wrong one wins. Groove replaces them with a
            single, ordered scale of <span className="italic">named</span> layers. Reach for the token
            that matches an element's role and the ordering takes care of itself.
          </p>
          <CodeBlock code={`<div className="z-modal">…</div>      {/* dialog */}
<div className="z-popover">…</div>    {/* floating popper above the dialog */}
<div className="z-toast">…</div>      {/* notifications above everything but tooltips */}`} />
        </section>

        {/* The scale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">The layering scale</h2>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 px-4 font-semibold">Token</th>
                  <th className="py-3 px-4 font-semibold">Value</th>
                  <th className="py-3 px-4 font-semibold">Used for</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {layers.map((l) => (
                  <tr key={l.token} className="border-b border-line last:border-0">
                    <td className="py-3 px-4 font-mono text-ink">{l.token}</td>
                    <td className="py-3 px-4 font-mono text-xs text-ink-muted">{l.value}</td>
                    <td className="py-3 px-4 text-ink-muted">{l.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-ink-muted mt-3">
            Rising order: <span className="font-mono">base &lt; dropdown &lt; sticky &lt; overlay &lt; drawer &lt; modal &lt; popover &lt; toast &lt; tooltip</span>.
            The large gaps between values leave room to slot in a one-off layer without renumbering the scale.
          </p>
        </section>

        {/* Visual stack diagram */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Visual stack</h2>
          <p className="text-ink-muted mb-6">
            Each card carries its real layering token. Higher tokens render nearer the viewer.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8">
            <div className="relative h-72">
              {stack.map((s, i) => (
                <div
                  key={s.token}
                  className={`absolute w-64 h-16 rounded-card border border-primary/40 bg-surface-raised shadow-elevation-3 flex items-center px-4 ${s.z}`}
                  style={{ top: `${i * 34}px`, left: `${i * 34}px` }}
                >
                  <span className="font-mono text-sm text-ink">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The rule */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">The rule: poppers portal above modals</h2>
          <p className="text-ink-muted mb-4">
            Floating poppers — a Select, Combobox, Menu, Popover, or Tooltip — frequently open{' '}
            <span className="italic">from inside</span> a Modal or Drawer. To stay visible, they render
            through a portal to <span className="font-mono text-sm">document.body</span> and sit at{' '}
            <span className="font-mono text-sm">z-popover</span> or higher — above{' '}
            <span className="font-mono text-sm">z-modal</span>. Tooltips sit highest of all so a help
            hint is never obscured.
          </p>
          <div className="bg-primary/5 border border-primary/30 rounded-lg p-6">
            <p className="font-semibold text-ink mb-2">Order of precedence</p>
            <p className="text-ink-muted text-sm">
              Scrim (<span className="font-mono">z-overlay</span>) → Drawer (<span className="font-mono">z-drawer</span>)
              → Modal (<span className="font-mono">z-modal</span>) → any popper opened within it
              (<span className="font-mono">z-popover</span>) → Toasts (<span className="font-mono">z-toast</span>)
              → Tooltips (<span className="font-mono">z-tooltip</span>).
            </p>
          </div>
        </section>

        {/* The collision it fixes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">The collision this fixes</h2>
          <p className="text-ink-muted mb-4">
            Before the scale, Groove's overlays used unrelated values — Select at{' '}
            <span className="font-mono text-sm">z-20</span>, Menu at{' '}
            <span className="font-mono text-sm">z-30</span>, Modal at{' '}
            <span className="font-mono text-sm">z-50</span>. A Menu or Select opened inside a Modal
            rendered <span className="italic">behind</span> the dialog and was unusable — the classic
            &ldquo;menu-behind-modal&rdquo; bug.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-destructive/5 border border-destructive rounded-lg p-6">
              <p className="font-semibold text-ink mb-2 flex items-center gap-2">
                <span className="text-destructive">✗</span> Before
              </p>
              <p className="text-sm text-ink-muted font-mono mb-2">Menu z-30 &lt; Modal z-50</p>
              <p className="text-sm text-ink-muted">The menu opens underneath the dialog and can't be clicked.</p>
            </div>
            <div className="bg-positive/5 border border-positive rounded-lg p-6">
              <p className="font-semibold text-ink mb-2 flex items-center gap-2">
                <span className="text-positive">✓</span> After
              </p>
              <p className="text-sm text-ink-muted font-mono mb-2">Modal z-modal(1400) &lt; Menu z-popover(1500)</p>
              <p className="text-sm text-ink-muted">The menu portals above the dialog and works as expected.</p>
            </div>
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Do's &amp; Don'ts</h2>
          <DosDonts
            dos={[
              'Use the named tokens (z-modal, z-popover, z-toast) for every stacked element.',
              'Portal floating poppers to the body so they clear modals and overflow containers.',
              'Keep tooltips at the very top so help never gets covered.',
              'Match the scrim to z-overlay and the panel it dims to the next layer up.',
            ]}
            donts={[
              'Sprinkle arbitrary z-10 / z-50 values that collide unpredictably.',
              'Invent numbers between tokens; if you need a new layer, add it to the scale.',
              'Render a popper inline inside an overflow-hidden ancestor and expect it to escape.',
              'Stack unrelated components at the same z and rely on DOM order to break the tie.',
            ]}
          />
        </section>
      </div>
    </div>
  );
}
