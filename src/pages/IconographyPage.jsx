import React from 'react';
import {
  Home, Search, Settings, Bell, User, Heart, Star, Trash2,
  Download, Upload, Check, X, ChevronRight, Plus, Edit, Calendar,
  Mail, Lock, Eye, AlertCircle,
} from 'lucide-react';

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

const sizes = [
  { px: 16, usage: 'Dense / inline — table cells, badges, small buttons, breadcrumb separators.' },
  { px: 18, usage: 'Default button and menu-item icons.' },
  { px: 20, usage: 'Inputs, alerts, list rows — the most common standalone size.' },
  { px: 24, usage: 'Section headers, empty states, feature tiles.' },
];

const colors = [
  { className: 'text-ink', label: 'text-ink', note: 'Default / primary icon color' },
  { className: 'text-ink-muted', label: 'text-ink-muted', note: 'Secondary, supporting icons' },
  { className: 'text-ink-subtle', label: 'text-ink-subtle', note: 'Disabled or decorative' },
  { className: 'text-primary', label: 'text-primary', note: 'Interactive / brand accent' },
  { className: 'text-positive', label: 'text-positive', note: 'Success states' },
  { className: 'text-destructive', label: 'text-destructive', note: 'Errors, destructive actions' },
];

const gallery = [
  Home, Search, Settings, Bell, User, Heart, Star, Trash2,
  Download, Upload, Check, X, ChevronRight, Plus, Edit, Calendar,
  Mail, Lock, Eye, AlertCircle,
];

export default function IconographyPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Iconography</h1>
          <p className="text-xl text-ink-muted">
            Groove uses lucide-react — a consistent, open-source icon set. Clean line icons that
            inherit text color and scale crisply at any size.
          </p>
        </div>

        {/* Import & usage */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Usage</h2>
          <p className="text-ink-muted mb-6">
            Import each icon as a component and control it with the{' '}
            <span className="font-mono text-sm">size</span>,{' '}
            <span className="font-mono text-sm">strokeWidth</span>, and{' '}
            <span className="font-mono text-sm">className</span> props. Icons render as inline SVG, so
            they inherit the current text color automatically.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex items-center gap-4 text-ink">
              <Settings size={20} />
              <span>Settings</span>
            </div>
          </div>
          <CodeBlock code={`import { Settings } from 'lucide-react';

<Settings size={20} className="text-ink" />`} />
        </section>

        {/* Sizing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Sizing scale</h2>
          <p className="text-ink-muted mb-6">
            Stick to four sizes so icons align with the type and controls around them.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex items-end gap-10">
              {sizes.map((s) => (
                <div key={s.px} className="flex flex-col items-center gap-2 text-ink">
                  <Bell size={s.px} />
                  <span className="font-mono text-xs text-ink-muted">{s.px}px</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 px-4 font-semibold">Size</th>
                  <th className="py-3 px-4 font-semibold">Where to use it</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {sizes.map((s) => (
                  <tr key={s.px} className="border-b border-line last:border-0">
                    <td className="py-3 px-4 font-mono text-ink">{s.px}px</td>
                    <td className="py-3 px-4 text-ink-muted">{s.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Stroke width */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Stroke width</h2>
          <p className="text-ink-muted mb-6">
            lucide defaults to a <span className="font-mono text-sm">2</span> stroke, which matches
            Groove's weight. Drop to <span className="font-mono text-sm">1.5</span> for a lighter,
            more elegant feel at large sizes; reserve <span className="font-mono text-sm">2.5</span> for
            emphasis. Keep one weight consistent within a view.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex items-center gap-10 text-ink">
              {[1.5, 2, 2.5].map((w) => (
                <div key={w} className="flex flex-col items-center gap-2">
                  <Star size={32} strokeWidth={w} />
                  <span className="font-mono text-xs text-ink-muted">strokeWidth={w}</span>
                </div>
              ))}
            </div>
          </div>
          <CodeBlock code={`<Star size={24} strokeWidth={2} />   {/* default */}
<Star size={24} strokeWidth={1.5} /> {/* lighter */}`} />
        </section>

        {/* Color */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Color</h2>
          <p className="text-ink-muted mb-6">
            Icons are drawn with <span className="font-mono text-sm">currentColor</span>, so they pick
            up whatever text token you apply — and adapt to light and dark themes for free. Set color
            with a <span className="font-mono text-sm">text-*</span> class, never a hard-coded hex.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {colors.map((c) => (
                <div key={c.className} className="flex items-center gap-3">
                  <Heart size={24} className={c.className} />
                  <div>
                    <p className="font-mono text-xs text-ink">{c.label}</p>
                    <p className="text-xs text-ink-muted">{c.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <CodeBlock code={`<Heart size={24} className="text-primary" />
<AlertCircle size={20} className="text-destructive" />`} />
        </section>

        {/* Accessibility */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
          <p className="text-ink-muted mb-6">
            Whether an icon needs a label depends on whether it carries meaning on its own.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <p className="font-semibold text-ink mb-2">Decorative</p>
              <p className="text-sm text-ink-muted mb-3">
                The icon sits next to a visible text label. Hide it from screen readers so it isn't
                announced twice.
              </p>
              <div className="flex items-center gap-2 text-ink mb-3">
                <Download size={18} aria-hidden="true" />
                <span>Download</span>
              </div>
              <CodeBlock code={`<Download size={18} aria-hidden="true" />
<span>Download</span>`} />
            </div>
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <p className="font-semibold text-ink mb-2">Meaningful</p>
              <p className="text-sm text-ink-muted mb-3">
                The icon is the only content (an icon-only button). Give it an accessible name with{' '}
                <span className="font-mono text-xs">aria-label</span>.
              </p>
              <div className="mb-3">
                <button
                  aria-label="Delete item"
                  className="p-2 rounded-control text-ink hover:bg-surface-muted transition-colors"
                >
                  <Trash2 size={20} aria-hidden="true" />
                </button>
              </div>
              <CodeBlock code={`<button aria-label="Delete item">
  <Trash2 size={20} aria-hidden="true" />
</button>`} />
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/30 rounded-lg p-6">
            <ul className="space-y-2 text-ink-muted text-sm">
              <li>• Never convey status with an icon alone — pair it with text or color so it's perceivable by everyone.</li>
              <li>• Ensure icon color meets contrast against its background, the same as text.</li>
              <li>• Keep interactive icon targets at least 44×44px (see the Sizing foundation).</li>
            </ul>
          </div>
        </section>

        {/* Gallery */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Common icons</h2>
          <p className="text-ink-muted mb-6">
            A sample of the set. Browse the full library at{' '}
            <span className="font-mono text-sm">lucide.dev</span>.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
              {gallery.map((Icon, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-ink">
                  <Icon size={24} aria-hidden="true" />
                  <span className="text-[10px] text-ink-subtle font-mono">{Icon.displayName || Icon.name}</span>
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
              'Use lucide-react so icons share one visual language.',
              'Size icons from the 16 / 18 / 20 / 24 scale to align with type and controls.',
              'Color icons with text-* tokens so they adapt to light and dark themes.',
              'Add aria-label to icon-only controls and aria-hidden to decorative icons.',
            ]}
            donts={[
              'Mix icon sets or paste one-off SVGs with a different style.',
              'Hard-code icon colors with hex values that ignore the theme.',
              'Use arbitrary sizes that leave icons misaligned with adjacent text.',
              'Rely on an icon alone to communicate meaning or status.',
            ]}
          />
        </section>
      </div>
    </div>
  );
}
