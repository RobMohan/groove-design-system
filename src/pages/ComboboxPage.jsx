import React, { useState } from 'react';
import Combobox from '../components/Combobox';
import { Globe, Code, Terminal } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const frameworks = ['React', 'Vue', 'Svelte', 'Angular', 'Solid', 'Qwik'];
const grouped = [
  { value: 'js', label: 'JavaScript', group: 'Languages', icon: Code },
  { value: 'ts', label: 'TypeScript', group: 'Languages', icon: Code },
  { value: 'bash', label: 'Bash', group: 'Shells', icon: Terminal },
  { value: 'zsh', label: 'Zsh', group: 'Shells', icon: Terminal },
];

const rows = [
  ['options', 'Array<string | Option>', '[]', 'Option is { value, label, icon?, group?, disabled? }.'],
  ['value', 'any', 'undefined', 'Controlled selected value. Omit it to let the component manage its own selection.'],
  ['defaultValue', 'any', 'undefined', 'Initial selection when uncontrolled.'],
  ['onChange', 'function', '—', 'Called with the selected value.'],
  ['label', 'string', '—', 'Field label, associated with the input.'],
  ['placeholder', 'string', "'Search…'", 'Shown in the empty input.'],
  ['clearable', 'boolean', 'false', 'Show a clear button when a value is set. Hidden while loading.'],
  ['loading', 'boolean', 'false', 'Show a spinner in the control and a "Loading…" row in the menu.'],
  ['emptyMessage', 'string', "'No results found'", 'Shown when the filter matches nothing.'],
  ['filterFn', '(option, query) => boolean', 'substring', 'Custom typeahead matcher.'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Minimum control height: 32px / 40px / 48px.'],
  ['disabled', 'boolean', 'false', 'Disable the control. It renders at 60% opacity.'],
  ['id', 'string', 'auto-generated', 'HTML id for the input, used to associate the label.'],
  ['className', 'string', "''", 'Additional CSS classes for the outer wrapper.'],
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

export default function ComboboxPage() {
  const [framework, setFramework] = useState('');
  const [lang, setLang] = useState('ts');

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Combobox</h1>
          <p className="text-xl text-ink-muted">
            A text-filterable single-select with typeahead. Type to narrow, navigate with the arrow keys,
            Enter to select. The listbox portals above modals and supports groups, icons, and clearing.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Combobox from './components/Combobox';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-sm">
            <Combobox
              label="Framework"
              options={frameworks}
              value={framework}
              onChange={setFramework}
              clearable
              placeholder="Search frameworks…"
            />
          </div>
          <CodeBlock code={`<Combobox
  label="Framework"
  options={['React', 'Vue', 'Svelte', 'Angular']}
  value={framework}
  onChange={setFramework}
  clearable
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Groups &amp; icons</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-sm">
            <Combobox label="Language" options={grouped} value={lang} onChange={setLang} />
          </div>
          <CodeBlock code={`<Combobox
  label="Language"
  options={[
    { value: 'js', label: 'JavaScript', group: 'Languages', icon: Code },
    { value: 'bash', label: 'Bash', group: 'Shells', icon: Terminal },
  ]}
  value={lang}
  onChange={setLang}
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sizes &amp; loading</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap items-end gap-6">
              <div className="w-40"><Combobox size="sm" options={frameworks} placeholder="Small" /></div>
              <div className="w-48"><Combobox size="lg" options={frameworks} placeholder="Large" /></div>
              <div className="w-48"><Combobox options={[]} loading placeholder="Loading…" label="Async" icon={Globe} /></div>
            </div>
          </div>
          <CodeBlock code={`<Combobox size="sm" ... />
<Combobox loading options={[]} />`} />
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
              <li>Use when there are enough options that scanning a Select is slow.</li>
              <li>Group related options and add clear, scannable labels.</li>
              <li>Offer clearable when "no selection" is a valid state.</li>
            </DoCard>
            <DontCard>
              <li>Don't use for a handful of options — a Select or Segmented Control is simpler.</li>
              <li>Don't use for multiple values — reach for Multi-Select.</li>
              <li>Don't hide required typing behind an unclear placeholder.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
