import React, { useState } from 'react';
import { User, Users } from 'lucide-react';
import Select from '../components/Select';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const PropRow = ({ name, type, def, desc }) => (
  <tr className="border-b border-line">
    <td className="py-3 px-4 font-mono text-sm">{name}</td>
    <td className="py-3 px-4 font-mono text-xs text-ink-muted">{type}</td>
    <td className="py-3 px-4 font-mono text-xs">{def}</td>
    <td className="py-3 px-4">{desc}</td>
  </tr>
);

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
];

const people = [
  { value: 'rob', label: 'Rob M.', icon: User, group: 'People' },
  { value: 'ana', label: 'Ana K.', icon: User, group: 'People' },
  { value: 'design', label: 'Design team', icon: Users, group: 'Teams' },
  { value: 'eng', label: 'Engineering', icon: Users, group: 'Teams' },
];

export default function SelectPage() {
  const [value, setValue] = useState('');
  const [city, setCity] = useState('nyc');
  const [fruit, setFruit] = useState('');
  const [owner, setOwner] = useState('');

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Select</h1>
          <p className="text-xl text-ink-muted">
            A custom dropdown for choosing a single option, with full keyboard support.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Select from './components/Select';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic usage</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-xs">
            <Select
              label="Favorite fruit"
              options={fruits}
              value={value}
              onChange={setValue}
              placeholder="Choose one…"
            />
          </div>
          <CodeBlock code={`const [value, setValue] = useState('');

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'date', label: 'Date', disabled: true },
];

<Select
  label="Favorite fruit"
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Choose one…"
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Preselected &amp; string options</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-xs">
            <Select
              label="City"
              options={['nyc', 'sf', 'london', 'tokyo']}
              value={city}
              onChange={setCity}
            />
          </div>
          <CodeBlock code={`<Select options={['nyc', 'sf', 'london', 'tokyo']} value={city} onChange={setCity} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sizes</h2>
          <p className="text-ink-muted mb-6">
            Three sizes. Medium is the default; match the size of neighbouring inputs.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 flex flex-col gap-6 max-w-xs">
            <Select size="sm" label="Small" options={fruits} placeholder="Choose one…" />
            <Select size="md" label="Medium" options={fruits} placeholder="Choose one…" />
            <Select size="lg" label="Large" options={fruits} placeholder="Choose one…" />
          </div>
          <CodeBlock code={`<Select size="sm" label="Small" options={options} />
<Select size="md" label="Medium" options={options} />
<Select size="lg" label="Large" options={options} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Searchable &amp; clearable</h2>
          <p className="text-ink-muted mb-6">
            <code className="text-sm bg-surface-muted px-1 rounded">searchable</code> adds a typeahead field to the menu. <code className="text-sm bg-surface-muted px-1 rounded">clearable</code> adds a button that resets the value.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-xs">
            <Select
              label="Fruit"
              options={fruits}
              value={fruit}
              onChange={setFruit}
              searchable
              clearable
              placeholder="Search or choose…"
              emptyMessage="No matching fruit"
            />
          </div>
          <CodeBlock code={`<Select
  label="Fruit"
  options={options}
  value={value}
  onChange={setValue}
  searchable
  clearable
  emptyMessage="No matching fruit"
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Groups &amp; icons</h2>
          <p className="text-ink-muted mb-6">
            Give options a <code className="text-sm bg-surface-muted px-1 rounded">group</code> to render them under a heading, and an <code className="text-sm bg-surface-muted px-1 rounded">icon</code> (a component, not an element) to show a glyph beside the label. The chosen option's icon also appears in the trigger.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-xs">
            <Select
              label="Assign to"
              options={people}
              value={owner}
              onChange={setOwner}
              placeholder="Choose a person…"
            />
          </div>
          <CodeBlock code={`import { User, Users } from 'lucide-react';

const options = [
  { value: 'rob', label: 'Rob M.', icon: User, group: 'People' },
  { value: 'ana', label: 'Ana K.', icon: User, group: 'People' },
  { value: 'design', label: 'Design team', icon: Users, group: 'Teams' },
];

<Select label="Assign to" options={options} value={value} onChange={setValue} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">States</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 grid gap-6 md:grid-cols-2 max-w-2xl">
            <Select label="Error" options={fruits} error="Please make a selection" placeholder="Required" />
            <Select label="Disabled" options={fruits} value="apple" disabled />
          </div>
          <CodeBlock code={`<Select label="Error" options={options} error="Please make a selection" />
<Select label="Disabled" options={options} value="apple" disabled />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Props</h2>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
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
                <PropRow name="options" type="array" def="[]" desc="Strings or { value, label, icon, group, disabled } objects. Options that share a group render under one heading." />
                <PropRow name="value" type="any" def="—" desc="Currently selected value" />
                <PropRow name="onChange" type="function" def="—" desc="Called with the selected value (or '' when cleared)" />
                <PropRow name="placeholder" type="string" def="'Select an option'" desc="Shown when nothing is selected" />
                <PropRow name="label" type="string" def="—" desc="Field label" />
                <PropRow name="size" type="'sm' | 'md' | 'lg'" def="'md'" desc="Trigger height and text size: 32px / 40px / 48px with 14 / 16 / 18px text" />
                <PropRow name="searchable" type="boolean" def="false" desc="Adds a search field at the top of the menu that filters options as you type" />
                <PropRow name="clearable" type="boolean" def="false" desc="Shows a clear button once a value is selected" />
                <PropRow name="emptyMessage" type="string" def="'No options'" desc="Shown when there are no options, or none match the search" />
                <PropRow name="error" type="string" def="''" desc="Error message; switches to the error style" />
                <PropRow name="disabled" type="boolean" def="false" desc="Disable the select" />
                <PropRow name="id" type="string" def="auto-generated" desc="HTML id for the trigger button, used to associate the label" />
                <PropRow name="className" type="string" def="''" desc="Additional CSS classes" />
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Keyboard</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-6 text-ink-muted space-y-2">
            <p><span className="font-mono text-sm bg-surface-muted px-2 py-1 rounded">Enter</span> / <span className="font-mono text-sm bg-surface-muted px-2 py-1 rounded">Space</span> / <span className="font-mono text-sm bg-surface-muted px-2 py-1 rounded">↓</span> opens the menu.</p>
            <p><span className="font-mono text-sm bg-surface-muted px-2 py-1 rounded">↑</span> / <span className="font-mono text-sm bg-surface-muted px-2 py-1 rounded">↓</span> move the highlight, <span className="font-mono text-sm bg-surface-muted px-2 py-1 rounded">Enter</span> selects.</p>
            <p><span className="font-mono text-sm bg-surface-muted px-2 py-1 rounded">Esc</span> closes the menu.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
