import React, { useState } from 'react';
import MultiSelect from '../components/MultiSelect';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const skills = [
  { value: 'react', label: 'React', group: 'Frontend' },
  { value: 'vue', label: 'Vue', group: 'Frontend' },
  { value: 'svelte', label: 'Svelte', group: 'Frontend' },
  { value: 'node', label: 'Node.js', group: 'Backend' },
  { value: 'go', label: 'Go', group: 'Backend' },
  { value: 'rust', label: 'Rust', group: 'Backend' },
];

const rows = [
  ['options', 'Array<string | Option>', '[]', 'Option is { value, label, icon?, group?, disabled? }.'],
  ['value', 'any[]', 'undefined', 'Controlled array of selected values.'],
  ['onChange', 'function', '—', 'Called with the next array of values.'],
  ['clearable', 'boolean', 'true', 'Show a clear-all button.'],
  ['loading', 'boolean', 'false', 'Show a spinner and "Loading…" state.'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Control height.'],
  ['disabled', 'boolean', 'false', 'Disable the control.'],
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

export default function MultiSelectPage() {
  const [values, setValues] = useState(['react', 'node']);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Multi-Select</h1>
          <p className="text-xl text-ink-muted">
            Select several options at once. Choices render as removable pills inside the control.
            Type to filter, Backspace to remove the last pill, and clear all in one click.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import MultiSelect from './components/MultiSelect';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-md">
            <MultiSelect label="Skills" options={skills} value={values} onChange={setValues} />
            <p className="mt-3 text-sm text-ink-muted">Selected: {values.join(', ') || 'none'}</p>
          </div>
          <CodeBlock code={`const [values, setValues] = useState(['react', 'node']);

<MultiSelect label="Skills" options={skills} value={values} onChange={setValues} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sizes &amp; disabled</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 space-y-4 max-w-md">
            <MultiSelect size="sm" options={skills} defaultValue={['vue']} placeholder="Small" />
            <MultiSelect options={skills} defaultValue={['go', 'rust']} disabled />
          </div>
          <CodeBlock code={`<MultiSelect size="sm" options={skills} />
<MultiSelect options={skills} defaultValue={['go', 'rust']} disabled />`} />
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
              <li>Use for tags, filters, and any "choose several" input.</li>
              <li>Keep pill labels short so the control stays readable.</li>
              <li>Group options when the list gets long.</li>
            </DoCard>
            <DontCard>
              <li>Don't use when only one value is allowed — use Combobox/Select.</li>
              <li>Don't allow unbounded selections without a clear-all.</li>
              <li>Don't rely on pills alone for very large selections — show a count.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
