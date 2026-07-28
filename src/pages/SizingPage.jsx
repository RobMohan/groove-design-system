import React from 'react';
import { Search } from 'lucide-react';

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

const heights = [
  { name: 'sm', h: 'h-8', px: '32px', pad: 'px-3 text-sm', usage: 'Compact toolbars, dense tables, secondary controls.' },
  { name: 'md', h: 'h-10', px: '40px', pad: 'px-3 text-base', usage: 'The Groove default — inputs, selects, standard buttons.' },
  { name: 'lg', h: 'h-12', px: '48px', pad: 'px-4 text-lg', usage: 'Prominent actions, marketing pages, touch-first layouts.' },
];

const boxes = [
  { size: 'w-6 h-6', px: '24px', usage: 'xs avatar, small icon button target inner' },
  { size: 'w-8 h-8', px: '32px', usage: 'sm avatar, icon chip' },
  { size: 'w-10 h-10', px: '40px', usage: 'md avatar — matches the default control height' },
  { size: 'w-14 h-14', px: '56px', usage: 'lg avatar' },
  { size: 'w-20 h-20', px: '80px', usage: 'xl avatar, feature glyph' },
];

export default function SizingPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Sizing</h1>
          <p className="text-xl text-ink-muted">
            Control heights, density, and touch targets — a consistent size language so buttons,
            inputs, and selects line up wherever they're used together.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-ink-muted mb-4">
            Interactive controls share three heights — <span className="font-mono text-sm">sm</span>,{' '}
            <span className="font-mono text-sm">md</span>, and{' '}
            <span className="font-mono text-sm">lg</span> — built on the same 4px spacing rhythm as the
            rest of Groove. Any controls placed side by side should use the same height so their edges
            and baselines align.
          </p>
          <p className="text-ink-muted">
            <span className="font-mono text-sm">md</span> (40px) is the default; reach for it unless a
            layout is unusually dense or deliberately prominent.
          </p>
        </section>

        {/* Control heights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Control heights</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 space-y-6">
            {heights.map((s) => (
              <div key={s.name}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm text-ink w-10">{s.name}</span>
                  <span className="font-mono text-xs text-ink-muted">{s.h} · {s.px}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className={`inline-flex items-center justify-center rounded-control bg-primary text-white font-medium ${s.h} ${s.pad}`}
                  >
                    Button
                  </button>
                  <div
                    className={`inline-flex items-center gap-2 rounded-control border border-line-strong bg-surface-raised text-ink-muted ${s.h} ${s.pad}`}
                  >
                    <Search size={16} className="shrink-0" />
                    <span>Input</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden mb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 px-4 font-semibold">Size</th>
                  <th className="py-3 px-4 font-semibold">Class</th>
                  <th className="py-3 px-4 font-semibold">Height</th>
                  <th className="py-3 px-4 font-semibold">When to use</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {heights.map((s) => (
                  <tr key={s.name} className="border-b border-line last:border-0">
                    <td className="py-3 px-4 font-mono text-ink">{s.name}</td>
                    <td className="py-3 px-4 font-mono text-xs text-ink-muted">{s.h}</td>
                    <td className="py-3 px-4 font-mono text-xs">{s.px}</td>
                    <td className="py-3 px-4 text-ink-muted">{s.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CodeBlock code={`<button className="h-10 px-3 rounded-control">Button</button>  {/* md, default */}
<input className="h-8 px-3 rounded-control" />                 {/* sm, dense */}
<button className="h-12 px-4 rounded-control">Button</button>  {/* lg, prominent */}`} />
        </section>

        {/* Density */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Density</h2>
          <p className="text-ink-muted mb-4">
            Density is a deliberate choice, not an accident of mismatched sizes. Use one height across a
            related group of controls; only step down to <span className="font-mono text-sm">sm</span> for
            genuinely dense surfaces like data-table toolbars or filter bars, where fitting more on
            screen outweighs generous spacing.
          </p>
          <div className="bg-primary/5 border border-primary/30 rounded-lg p-6 text-sm text-ink-muted">
            Pick a density per surface and hold it. Mixing <span className="font-mono">sm</span> and{' '}
            <span className="font-mono">lg</span> controls in one row makes an interface feel unplanned.
          </div>
        </section>

        {/* Touch targets */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Touch targets</h2>
          <p className="text-ink-muted mb-6">
            Any control a person taps needs a hit area of at least{' '}
            <span className="font-medium text-ink">44 × 44px</span> (WCAG 2.5.5, Target Size). The{' '}
            <span className="italic">visible</span> icon can be smaller — pad the control out to 44px so
            it's still comfortable to hit. A bare 24px icon is far too small on touch.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex items-end gap-10">
              <div className="flex flex-col items-center gap-2">
                <button
                  aria-label="Too small example"
                  className="w-6 h-6 flex items-center justify-center rounded bg-destructive/10 text-destructive"
                >
                  <Search size={16} />
                </button>
                <span className="text-xs text-destructive font-medium">24px ✗</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button
                  aria-label="Correct size example"
                  className="w-11 h-11 flex items-center justify-center rounded-control bg-positive/10 text-positive"
                >
                  <Search size={20} />
                </button>
                <span className="text-xs text-positive font-medium">44px ✓</span>
              </div>
            </div>
          </div>
          <CodeBlock code={`{/* 20px icon centered in a 44px (w-11 h-11) target */}
<button aria-label="Search" className="w-11 h-11 flex items-center justify-center">
  <Search size={20} />
</button>`} />
        </section>

        {/* Box / icon sizes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Box &amp; icon sizes</h2>
          <p className="text-ink-muted mb-6">
            Square elements — avatars, icon tiles, swatches — use a shared box scale. Note that{' '}
            <span className="font-mono text-sm">w-10 h-10</span> (40px) matches the default control
            height, so an avatar sits flush beside a button or input.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8">
            <div className="flex flex-wrap items-end gap-8">
              {boxes.map((b) => (
                <div key={b.size} className="flex flex-col items-center gap-2">
                  <div className={`${b.size} rounded-card bg-primary/15 border border-primary/40`} />
                  <span className="font-mono text-xs text-ink">{b.px}</span>
                  <span className="text-[10px] text-ink-muted max-w-[7rem] text-center">{b.usage}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Do's &amp; Don'ts</h2>
          <DosDonts
            dos={[
              'Default to the md (40px) control height; use sm and lg intentionally.',
              'Give controls that sit together the same height so their edges align.',
              'Guarantee at least a 44×44px hit area for anything tappable.',
              'Match box sizes to control heights (w-10 h-10 = 40px) for flush alignment.',
            ]}
            donts={[
              'Mix sm, md, and lg controls within the same row or form.',
              'Ship interactive icons with a hit area smaller than 44px.',
              'Invent one-off heights that drift off the sm / md / lg scale.',
              'Shrink controls below sm to cram in more content at the cost of usability.',
            ]}
          />
        </section>
      </div>
    </div>
  );
}
