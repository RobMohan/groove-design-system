import React from 'react';
import IconButton from '../components/IconButton';
import Tooltip from '../components/Tooltip';
import { Heart, Trash2, Settings, Plus, Search, Bell } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['icon', 'LucideIcon', '—', 'Icon component to render.'],
  ['aria-label', 'string', '—', 'Accessible name (required). Also accepts `label`.'],
  ['variant', "'primary' | 'secondary' | 'destructive' | 'positive' | 'outline' | 'ghost' | 'link'", "'primary'", 'Visual style (mirrors Button).'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Button size.'],
  ['loading', 'boolean', 'false', 'Show a spinner and mark aria-busy.'],
  ['disabled', 'boolean', 'false', 'Disable the button.'],
];

const PropsTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-line">
          <th className="py-3 px-4 font-semibold">Prop</th>
          <th className="py-3 px-4 font-semibold">Type</th>
          <th className="py-3 px-4 font-semibold">Default</th>
          <th className="py-3 px-4 font-semibold">Description</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {rows.map(([prop, type, def, desc]) => (
          <tr key={prop} className="border-b border-line">
            <td className="py-3 px-4 font-mono text-sm">{prop}</td>
            <td className="py-3 px-4 font-mono text-xs text-ink-muted">{type}</td>
            <td className="py-3 px-4 font-mono text-xs">{def}</td>
            <td className="py-3 px-4">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DoCard = ({ children }) => (
  <div className="flex-1 rounded-lg border border-positive bg-positive/5 p-5">
    <div className="font-semibold text-ink mb-2">✓ Do</div>
    <ul className="text-sm text-ink-muted space-y-1 list-disc pl-4">{children}</ul>
  </div>
);
const DontCard = ({ children }) => (
  <div className="flex-1 rounded-lg border border-destructive bg-destructive/5 p-5">
    <div className="font-semibold text-ink mb-2">✗ Don't</div>
    <ul className="text-sm text-ink-muted space-y-1 list-disc pl-4">{children}</ul>
  </div>
);

export default function IconButtonPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Icon Button</h1>
          <p className="text-xl text-ink-muted">
            A square, icon-only button. It requires an accessible name (<code className="text-base">aria-label</code>)
            and shares Button's variants and sizes. Pair it with a Tooltip for a visible hint.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import IconButton from './components/IconButton';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Variants</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap gap-3">
              <IconButton icon={Plus} aria-label="Add" variant="primary" />
              <IconButton icon={Settings} aria-label="Settings" variant="secondary" />
              <IconButton icon={Trash2} aria-label="Delete" variant="destructive" />
              <IconButton icon={Search} aria-label="Search" variant="outline" />
              <IconButton icon={Heart} aria-label="Like" variant="ghost" />
            </div>
          </div>
          <CodeBlock code={`<IconButton icon={Plus} aria-label="Add" variant="primary" />
<IconButton icon={Trash2} aria-label="Delete" variant="destructive" />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sizes, loading &amp; tooltip</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <IconButton icon={Bell} aria-label="Notifications" size="sm" variant="outline" />
              <IconButton icon={Bell} aria-label="Notifications" size="md" variant="outline" />
              <IconButton icon={Bell} aria-label="Notifications" size="lg" variant="outline" />
              <IconButton icon={Settings} aria-label="Saving" loading variant="primary" />
              <Tooltip content="Delete item">
                <IconButton icon={Trash2} aria-label="Delete item" variant="ghost" />
              </Tooltip>
            </div>
          </div>
          <CodeBlock code={`<IconButton icon={Bell} aria-label="Notifications" size="lg" />
<IconButton icon={Settings} aria-label="Saving" loading />

<Tooltip content="Delete item">
  <IconButton icon={Trash2} aria-label="Delete item" />
</Tooltip>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Props</h2>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <PropsTable />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Usage</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <DoCard>
              <li>Always pass an <code>aria-label</code> describing the action.</li>
              <li>Use for compact, space-constrained toolbars and rows.</li>
              <li>Pair with a Tooltip when the icon's meaning isn't obvious.</li>
            </DoCard>
            <DontCard>
              <li>Don't use an ambiguous icon for a critical action.</li>
              <li>Don't omit the label — the control is invisible to screen readers.</li>
              <li>Don't use where a labelled Button would be clearer.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
