import React from 'react';
import Spinner from '../components/Spinner';

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

export default function SpinnerPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Spinner</h1>
          <p className="text-xl text-gray-600">
            An animated indicator for indeterminate loading states.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Spinner from './components/Spinner';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sizes</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 flex items-center gap-8">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
            <Spinner size="xl" />
          </div>
          <CodeBlock code={`<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Colors</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 flex items-center gap-8">
            <Spinner color="primary" />
            <Spinner color="secondary" />
            <Spinner color="positive" />
            <Spinner color="destructive" />
            <Spinner color="neutral" />
          </div>
          <CodeBlock code={`<Spinner color="primary" />
<Spinner color="neutral" />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With label</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <Spinner label="Loading your data…" />
          </div>
          <CodeBlock code={`<Spinner label="Loading your data…" />`} />
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
                <PropRow name="size" type="'sm'|'md'|'lg'|'xl'|number" def="'md'" desc="Diameter of the spinner" />
                <PropRow name="color" type="string" def="'primary'" desc="primary, secondary, positive, destructive, neutral" />
                <PropRow name="label" type="string" def="—" desc="Visible text; also used as the screen-reader label" />
                <PropRow name="className" type="string" def="''" desc="Additional CSS classes" />
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-gray-700 space-y-2">
            <p>The spinner exposes <code className="bg-gray-100 px-2 py-1 rounded text-sm">role="status"</code> and a visually-hidden label so screen readers announce the loading state.</p>
            <p>Provide a <code className="bg-gray-100 px-2 py-1 rounded text-sm">label</code> describing what is loading whenever the context isn't obvious.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
