import React, { useState } from 'react';
import Textarea from '../components/Textarea';

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

export default function TextareaPage() {
  const [value, setValue] = useState('');
  const [counted, setCounted] = useState('');

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Textarea</h1>
          <p className="text-xl text-gray-600">
            A multi-line text field for longer free-form input.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Textarea from './components/Textarea';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic usage</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 max-w-md">
            <Textarea
              label="Description"
              placeholder="Tell us what happened…"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <CodeBlock code={`const [value, setValue] = useState('');

<Textarea
  label="Description"
  placeholder="Tell us what happened…"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Character count</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 max-w-md">
            <Textarea
              label="Bio"
              maxLength={120}
              showCount
              value={counted}
              onChange={(e) => setCounted(e.target.value)}
            />
          </div>
          <CodeBlock code={`<Textarea label="Bio" maxLength={120} showCount value={value} onChange={onChange} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">States</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 grid gap-6 md:grid-cols-2">
            <Textarea label="Error" error="This field is required" placeholder="Required" />
            <Textarea label="Disabled" disabled value="Can't edit this" />
          </div>
          <CodeBlock code={`<Textarea label="Error" error="This field is required" />
<Textarea label="Disabled" disabled value="Can't edit this" />`} />
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
                <PropRow name="label" type="string" def="—" desc="Field label" />
                <PropRow name="value" type="string" def="''" desc="Controlled value" />
                <PropRow name="onChange" type="function" def="—" desc="Change handler (receives the event)" />
                <PropRow name="placeholder" type="string" def="'Placeholder'" desc="Placeholder text" />
                <PropRow name="rows" type="number" def="4" desc="Visible rows" />
                <PropRow name="maxLength" type="number" def="—" desc="Maximum characters" />
                <PropRow name="showCount" type="boolean" def="false" desc="Show character count (requires maxLength)" />
                <PropRow name="error" type="string" def="''" desc="Error message; switches to the error style" />
                <PropRow name="disabled" type="boolean" def="false" desc="Disable the field" />
                <PropRow name="className" type="string" def="''" desc="Additional CSS classes" />
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
