import React, { useState } from 'react';
import SegmentedControl from '../components/SegmentedControl';
import { List, Grid, Columns } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['options', 'Array<string | Option>', '[]', 'Option is { value, label, icon?, disabled? }.'],
  ['value', 'any', 'undefined', 'Controlled selected value.'],
  ['defaultValue', 'any', 'first option', 'Initial value when uncontrolled.'],
  ['onChange', 'function', '—', 'Called with the selected value.'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Control height.'],
  ['fullWidth', 'boolean', 'false', 'Stretch segments to fill the width.'],
  ['disabled', 'boolean', 'false', 'Disable the whole control.'],
  ['aria-label', 'string', 'undefined', 'Accessible name for the radiogroup.'],
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

export default function SegmentedControlPage() {
  const [view, setView] = useState('list');
  const [range, setRange] = useState('week');

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Segmented Control</h1>
          <p className="text-xl text-ink-muted">
            A single choice among a few mutually-exclusive options, joined into one control with a sliding
            indicator. Exposes a radiogroup with full arrow-key navigation.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import SegmentedControl from './components/SegmentedControl';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <SegmentedControl
              aria-label="Date range"
              options={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
              ]}
              value={range}
              onChange={setRange}
            />
          </div>
          <CodeBlock code={`<SegmentedControl
  aria-label="Date range"
  options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]}
  value={range}
  onChange={setRange}
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With icons</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <SegmentedControl
              aria-label="View mode"
              options={[
                { value: 'list', label: 'List', icon: List },
                { value: 'grid', label: 'Grid', icon: Grid },
                { value: 'columns', label: 'Columns', icon: Columns },
              ]}
              value={view}
              onChange={setView}
            />
          </div>
          <CodeBlock code={`<SegmentedControl options={[{ value: 'list', label: 'List', icon: List }, ...]} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sizes &amp; full width</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 space-y-4">
            <SegmentedControl size="sm" aria-label="Small" options={['On', 'Off']} defaultValue="On" />
            <SegmentedControl
              fullWidth
              aria-label="Full width"
              options={['Overview', 'Analytics', 'Reports']}
              defaultValue="Overview"
            />
          </div>
          <CodeBlock code={`<SegmentedControl size="sm" options={['On', 'Off']} />
<SegmentedControl fullWidth options={['Overview', 'Analytics', 'Reports']} />`} />
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
              <li>Use for 2–5 short, mutually-exclusive options.</li>
              <li>Keep labels to one or two words so segments stay even.</li>
              <li>Use for view/mode switches where all options are visible.</li>
            </DoCard>
            <DontCard>
              <li>Don't use for more than ~5 options — use a Select.</li>
              <li>Don't use for multiple selections — that's a different control.</li>
              <li>Don't mix very long and very short labels.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
