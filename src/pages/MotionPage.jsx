import React, { useState } from 'react';

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

const durations = [
  { token: '150ms', usage: 'Micro-feedback — fades, hovers, small state changes', animation: 'fade-in, scale-in' },
  { token: '200ms', usage: 'Standard enter — toasts, inline reveals', animation: 'slide-in-right' },
  { token: '250ms', usage: 'Larger surfaces — drawers, sheets, edge slides', animation: 'slide-in-from-*' },
  { token: '1200ms', usage: 'Looping / ambient — indeterminate progress', animation: 'progress-indeterminate' },
];

const easings = [
  { token: 'ease-out', usage: 'Enter transitions — fast start, gentle settle. The default for elements appearing.' },
  { token: 'ease-in-out', usage: 'Continuous / looping motion, like the indeterminate progress track.' },
  { token: 'ease-in', usage: 'Exit transitions — element accelerates away as it leaves.' },
];

const utilities = [
  { name: 'animate-fade-in', label: 'Fade in', desc: 'Opacity 0 → 1 over 150ms. Overlays, tooltips, scrims.' },
  { name: 'animate-scale-in', label: 'Scale in', desc: 'Fades and scales from 0.96 → 1. Modals, popovers.' },
  { name: 'animate-slide-in-from-left', label: 'Slide from left', desc: 'Full off-canvas slide. Left drawers / nav.' },
  { name: 'animate-slide-in-from-right', label: 'Slide from right', desc: 'Full off-canvas slide. Right drawers / sheets.' },
  { name: 'animate-slide-in-from-top', label: 'Slide from top', desc: 'Full off-canvas slide. Top banners / command bar.' },
  { name: 'animate-slide-in-from-bottom', label: 'Slide from bottom', desc: 'Full off-canvas slide. Bottom sheets / mobile.' },
];

export default function MotionPage() {
  const [playKey, setPlayKey] = useState(0);
  const replay = () => setPlayKey((k) => k + 1);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Motion</h1>
          <p className="text-xl text-ink-muted">
            Duration, easing, and the animation utilities that make Groove feel responsive —
            used with restraint so motion always means something.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-ink-muted mb-4">
            Motion in Groove is quick and purposeful. Animations confirm that something happened,
            show where an element came from, or draw the eye to a change in state — they are never
            decorative for their own sake. Enter transitions are short (150–250ms) with an{' '}
            <span className="font-mono text-sm">ease-out</span> curve so the interface feels immediate
            rather than sluggish.
          </p>
          <p className="text-ink-muted">
            The named utilities below are defined once in{' '}
            <span className="font-mono text-sm">tailwind.config.js</span> and reused across components
            (Modal, Toast, Drawer, Menu, Progress) so timing stays consistent everywhere.
          </p>
        </section>

        {/* When to animate */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">When to animate</h2>
          <div className="space-y-4">
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-2">Appearance &amp; dismissal</h3>
              <p className="text-ink-muted">Overlays, toasts, menus, and drawers should ease in on open so they don't pop abruptly into view.</p>
            </div>
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-2">State &amp; progress</h3>
              <p className="text-ink-muted">Loading and indeterminate states use continuous motion to signal that work is happening.</p>
            </div>
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-2">Spatial context</h3>
              <p className="text-ink-muted">Edge slides tell the user where a panel lives — a right sheet slides in from the right, so dismissing it back to the right feels natural.</p>
            </div>
          </div>
        </section>

        {/* Duration */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Duration</h2>
          <p className="text-ink-muted mb-6">
            Keep transitions short. Anything longer than ~300ms starts to feel like a delay.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 px-4 font-semibold">Duration</th>
                  <th className="py-3 px-4 font-semibold">Used by</th>
                  <th className="py-3 px-4 font-semibold">When</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {durations.map((d) => (
                  <tr key={d.token} className="border-b border-line last:border-0">
                    <td className="py-3 px-4 font-mono text-ink">{d.token}</td>
                    <td className="py-3 px-4 font-mono text-xs text-ink-muted">{d.animation}</td>
                    <td className="py-3 px-4 text-ink-muted">{d.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Easing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Easing</h2>
          <div className="grid grid-cols-1 gap-4">
            {easings.map((e) => (
              <div key={e.token} className="bg-surface-raised rounded-lg border border-line p-6">
                <p className="font-mono font-semibold text-ink mb-1">{e.token}</p>
                <p className="text-ink-muted text-sm">{e.usage}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Live utilities */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Animation utilities</h2>
            <button
              onClick={replay}
              className="px-4 py-2 rounded-control bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
            >
              ▶ Replay animations
            </button>
          </div>
          <p className="text-ink-muted mb-6">
            Each swatch below plays its enter animation on mount. Press{' '}
            <span className="font-medium text-ink">Replay</span> to run them all again.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {utilities.map((u) => (
                <div key={u.name} className="overflow-hidden rounded-card border border-line">
                  <div className="h-24 flex items-center justify-center bg-surface-muted overflow-hidden">
                    <div
                      key={`${u.name}-${playKey}`}
                      className={`w-16 h-16 rounded-card bg-primary ${u.name}`}
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-mono text-xs text-ink">{u.name}</p>
                    <p className="text-xs text-ink-muted mt-1">{u.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <CodeBlock code={`<div className="animate-fade-in">…</div>
<div className="animate-scale-in">…</div>
<div className="animate-slide-in-from-left">…</div>
<div className="animate-slide-in-from-right">…</div>
<div className="animate-slide-in-from-top">…</div>
<div className="animate-slide-in-from-bottom">…</div>`} />
        </section>

        {/* Indeterminate progress */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Indeterminate progress</h2>
          <p className="text-ink-muted mb-6">
            <span className="font-mono text-sm">animate-progress-indeterminate</span> loops continuously
            (1.2s, <span className="font-mono text-sm">ease-in-out</span>) to show that work is happening
            without a known completion percentage. Place it on a partial-width bar inside an
            overflow-hidden track.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="w-full h-2 bg-surface-muted rounded-pill overflow-hidden">
              <div className="h-full w-1/3 bg-primary rounded-pill animate-progress-indeterminate" />
            </div>
          </div>
          <CodeBlock code={`<div className="w-full h-2 bg-surface-muted rounded-pill overflow-hidden">
  <div className="h-full w-1/3 bg-primary rounded-pill animate-progress-indeterminate" />
</div>`} />
        </section>

        {/* Enter / exit */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Enter &amp; exit patterns</h2>
          <p className="text-ink-muted mb-4">
            Groove ships enter animations as utilities. Because they run on mount, pair them with
            conditional rendering: mount the element to play the enter animation. Exit animations —
            when needed — are best handled by keeping the node mounted briefly while a reverse
            transition runs, then unmounting.
          </p>
          <div className="bg-primary/5 border border-primary/30 rounded-lg p-6">
            <ul className="space-y-2 text-ink-muted">
              <li>• Match the exit to the entrance: a sheet that slides in from the right should slide back out to the right.</li>
              <li>• Overlays fade their scrim (<span className="font-mono text-sm">animate-fade-in</span>) while the panel scales or slides — two layers, one coordinated motion.</li>
              <li>• Keep exits equal to or slightly faster than entrances so dismissal feels snappy.</li>
            </ul>
          </div>
        </section>

        {/* Reduced motion */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Respecting reduced motion</h2>
          <p className="text-ink-muted mb-6">
            Some users set <span className="font-mono text-sm">prefers-reduced-motion</span> at the OS
            level. Honor it: use Tailwind's <span className="font-mono text-sm">motion-reduce:</span>{' '}
            variant to drop or shorten animations so essential content still appears — just without the
            movement.
          </p>
          <CodeBlock code={`{/* Keep the element, remove the motion */}
<div className="animate-slide-in-from-right motion-reduce:animate-none">
  …
</div>

{/* Fades are usually fine to keep; large slides are the ones to disable */}`} />
        </section>

        {/* Do's and Don'ts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Do's &amp; Don'ts</h2>
          <DosDonts
            dos={[
              'Use the named utilities so timing and easing stay consistent across components.',
              'Keep enter transitions short (150–250ms) with an ease-out curve.',
              'Animate to communicate — appearance, progress, or spatial origin.',
              'Provide a motion-reduce fallback for anything beyond a subtle fade.',
            ]}
            donts={[
              'Animate everything — constant movement is noise and slows perceived performance.',
              'Use long durations (>300ms) for routine UI transitions.',
              'Block interaction while a decorative animation finishes.',
              'Rely on motion alone to convey meaning; pair it with text, color, or an icon.',
            ]}
          />
        </section>
      </div>
    </div>
  );
}
