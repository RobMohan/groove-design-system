import React, { useState } from 'react';
import Select from '../components/Select';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const PropRow = ({ name, type, def, desc }) => (
  <tr className="border-b border-gray-100">
    <td className="py-3 px-4 font-mono text-sm">{name}</td>
    <td className="py-3 px-4 font-mono text-xs text-gray-600">{type}</td>
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

export default function SelectPage() {
  const [value, setValue] = useState('');
  const [city, setCity] = useState('nyc');

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Select</h1>
          <p className="text-xl text-gray-600">
            A custom dropdown for choosing a single option, with full keyboard support.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Select from './components/Select';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic usage</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 max-w-xs">
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
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 max-w-xs">
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
          <h2 className="text-2xl font-bold mb-4">States</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 grid gap-6 md:grid-cols-2 max-w-2xl">
            <Select label="Error" options={fruits} error="Please make a selection" placeholder="Required" />
            <Select label="Disabled" options={fruits} value="apple" disabled />
          </div>
          <CodeBlock code={`<Select label="Error" options={options} error="Please make a selection" />
<Select label="Disabled" options={options} value="apple" disabled />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Props</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold">Prop</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Default</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <PropRow name="options" type="array" def="[]" desc="Strings or { value, label, disabled } objects" />
                <PropRow name="value" type="any" def="—" desc="Currently selected value" />
                <PropRow name="onChange" type="function" def="—" desc="Called with the selected value" />
                <PropRow name="placeholder" type="string" def="'Select an option'" desc="Shown when nothing is selected" />
                <PropRow name="label" type="string" def="—" desc="Field label" />
                <PropRow name="error" type="string" def="''" desc="Error message; switches to the error style" />
                <PropRow name="disabled" type="boolean" def="false" desc="Disable the select" />
                <PropRow name="className" type="string" def="''" desc="Additional CSS classes" />
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Keyboard</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-gray-700 space-y-2">
            <p><span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Enter</span> / <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Space</span> / <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">↓</span> opens the menu.</p>
            <p><span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">↑</span> / <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">↓</span> move the highlight, <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Enter</span> selects.</p>
            <p><span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Esc</span> closes the menu.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
