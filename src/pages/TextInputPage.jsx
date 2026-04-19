import React, { useState } from 'react';
import TextInput from '../components/TextInput';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const PropsTable = () => (
  <div className="overflow-x-auto">
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
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">label</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">string</td>
          <td className="py-3 px-4 font-mono text-xs">—</td>
          <td className="py-3 px-4">Label text displayed above the input</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">placeholder</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">string</td>
          <td className="py-3 px-4 font-mono text-xs">'Placeholder'</td>
          <td className="py-3 px-4">Placeholder text shown when the input is empty</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">value</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">string</td>
          <td className="py-3 px-4 font-mono text-xs">''</td>
          <td className="py-3 px-4">Controlled value of the input</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">onChange</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">function</td>
          <td className="py-3 px-4 font-mono text-xs">—</td>
          <td className="py-3 px-4">Callback fired when the input value changes</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">disabled</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">boolean</td>
          <td className="py-3 px-4 font-mono text-xs">false</td>
          <td className="py-3 px-4">Disables the input and renders the inactive visual state</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">error</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">string | boolean</td>
          <td className="py-3 px-4 font-mono text-xs">''</td>
          <td className="py-3 px-4">Shows error state with red border and warning icon. Pass a string to also display an error message below the input.</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">showIcon</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">boolean</td>
          <td className="py-3 px-4 font-mono text-xs">true</td>
          <td className="py-3 px-4">Shows the search icon inside the input. Hidden when error is present.</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">id</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">string</td>
          <td className="py-3 px-4 font-mono text-xs">auto-generated</td>
          <td className="py-3 px-4">HTML id for the input element, used to associate the label</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">className</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">string</td>
          <td className="py-3 px-4 font-mono text-xs">''</td>
          <td className="py-3 px-4">Additional CSS classes applied to the outer wrapper</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function TextInputPage() {
  const [basicValue, setBasicValue] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const emailError =
    formSubmitted && !formEmail.includes('@')
      ? 'Please enter a valid email address'
      : '';

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Text Input</h1>
          <p className="text-xl text-gray-600">
            A text input component for collecting user-entered data, with support for labels, icons, disabled, and error states.
          </p>
        </div>

        {/* Import */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import TextInput from './components/TextInput';`} />
        </section>

        {/* Basic Usage */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
          <p className="text-gray-600 mb-6">
            A labeled input with a search icon. Click into the field to see the active (focused) state.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <div className="max-w-xs">
              <TextInput
                label="Label"
                placeholder="Placeholder"
                value={basicValue}
                onChange={(e) => setBasicValue(e.target.value)}
              />
            </div>
          </div>
          <CodeBlock code={`const [value, setValue] = useState('');

<TextInput
  label="Label"
  placeholder="Placeholder"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`} />
        </section>

        {/* States */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">States</h2>
          <p className="text-gray-600 mb-6">
            The input has five visual states: default, active (focused), filled, disabled, and error.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Default</p>
                <TextInput label="Label" placeholder="Placeholder" value="" onChange={() => {}} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Active (focus)</p>
                <TextInput label="Label" placeholder="Placeholder" value="" onChange={() => {}} id="active-demo" />
                <p className="text-xs text-gray-400 mt-2">Click the field above</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Filled</p>
                <TextInput label="Label" placeholder="Placeholder" value="User input text" onChange={() => {}} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Disabled</p>
                <TextInput label="Label" placeholder="Placeholder Text" value="" onChange={() => {}} disabled />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Error</p>
                <TextInput
                  label="Label"
                  placeholder="Placeholder"
                  value="Invalid value"
                  onChange={() => {}}
                  error="This field has an error"
                />
              </div>
            </div>
          </div>
          <CodeBlock code={`{/* Default */}
<TextInput label="Label" placeholder="Placeholder" value={value} onChange={...} />

{/* Filled (value present) */}
<TextInput label="Label" value="User input text" onChange={...} />

{/* Disabled */}
<TextInput label="Label" placeholder="Placeholder Text" disabled />

{/* Error — string shows a message below the input */}
<TextInput
  label="Label"
  value="Invalid value"
  onChange={...}
  error="This field has an error"
/>

{/* Error — boolean shows red border + icon only */}
<TextInput label="Label" value="Invalid" onChange={...} error />`} />
        </section>

        {/* Without Icon */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Without Icon</h2>
          <p className="text-gray-600 mb-6">
            The search icon can be hidden with <code className="text-sm bg-gray-100 px-1 rounded">showIcon=&#123;false&#125;</code>.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <div className="max-w-xs">
              <TextInput
                label="First Name"
                placeholder="Enter your name"
                value=""
                onChange={() => {}}
                showIcon={false}
              />
            </div>
          </div>
          <CodeBlock code={`<TextInput
  label="First Name"
  placeholder="Enter your name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  showIcon={false}
/>`} />
        </section>

        {/* Without Label */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Without Label</h2>
          <p className="text-gray-600 mb-6">
            Omit the <code className="text-sm bg-gray-100 px-1 rounded">label</code> prop to render the input alone — useful for search bars or inline fields.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <div className="max-w-xs">
              <TextInput placeholder="Search..." value="" onChange={() => {}} />
            </div>
          </div>
          <CodeBlock code={`<TextInput placeholder="Search..." value={value} onChange={(e) => setValue(e.target.value)} />`} />
        </section>

        {/* Form Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Form Example</h2>
          <p className="text-gray-600 mb-6">
            A complete example showing validation with error states on submit.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <form
              className="flex flex-col gap-6 max-w-sm"
              onSubmit={(e) => {
                e.preventDefault();
                setFormSubmitted(true);
              }}
            >
              <TextInput
                label="Name"
                placeholder="Your name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                showIcon={false}
              />
              <TextInput
                label="Email"
                placeholder="you@example.com"
                value={formEmail}
                onChange={(e) => {
                  setFormEmail(e.target.value);
                  if (formSubmitted) setFormSubmitted(false);
                }}
                showIcon={false}
                error={emailError}
              />
              <button
                type="submit"
                className="h-10 px-4 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
              {formSubmitted && !emailError && (
                <p className="text-sm text-green-600">Form submitted successfully!</p>
              )}
            </form>
          </div>
          <CodeBlock code={`const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [submitted, setSubmitted] = useState(false);

const emailError =
  submitted && !email.includes('@')
    ? 'Please enter a valid email address'
    : '';

<form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
  <TextInput
    label="Name"
    placeholder="Your name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    showIcon={false}
  />
  <TextInput
    label="Email"
    placeholder="you@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    showIcon={false}
    error={emailError}
  />
  <button type="submit">Submit</button>
</form>`} />
        </section>

        {/* Props Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Props</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <PropsTable />
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Always use a label:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Every input should have a visible label or an accessible aria-label</li>
                  <li>Placeholder text is not a substitute for a label</li>
                  <li>Labels help users understand what information to enter</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Error messages:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Show errors after the user has attempted to submit or leave the field</li>
                  <li>Be specific — explain what went wrong and how to fix it</li>
                  <li>Use the string form of the error prop to display a message below the input</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Disabled state:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Use disabled inputs sparingly — consider removing them entirely if they'll never be enabled</li>
                  <li>If a field is disabled, make sure it's clear to the user why</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Controlled inputs:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Always manage value and onChange together to keep the input controlled</li>
                  <li>Avoid mixing controlled and uncontrolled patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
