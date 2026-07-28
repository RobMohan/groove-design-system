import React, { useState } from 'react';
import NumberInput from '../components/NumberInput';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['value', "number | ''", "''", 'Controlled value.'],
  ['onChange', 'function', '—', 'Called with the next numeric value (or "").'],
  ['min', 'number', 'undefined', 'Lower bound (clamped, disables decrement).'],
  ['max', 'number', 'undefined', 'Upper bound (clamped, disables increment).'],
  ['step', 'number', '1', 'Increment/decrement amount.'],
  ['precision', 'number', 'undefined', 'Fixed decimal places.'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Control height.'],
  ['error', 'string', "''", 'Error message; sets aria-invalid.'],
  ['helperText', 'string', "''", 'Help text below the field.'],
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

export default function NumberInputPage() {
  const [qty, setQty] = useState(3);
  const [price, setPrice] = useState(9.99);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Number Input</h1>
          <p className="text-xl text-ink-muted">
            A numeric field with increment/decrement steppers, min/max clamping, and full keyboard
            control. Implements the ARIA spinbutton pattern.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import NumberInput from './components/NumberInput';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic</h2>
          <p className="text-ink-muted mb-6">
            Use the steppers, or focus the field and press <kbd className="text-xs font-mono border border-line rounded px-1.5 py-0.5">↑</kbd>{' '}
            / <kbd className="text-xs font-mono border border-line rounded px-1.5 py-0.5">↓</kbd>.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-xs">
            <NumberInput label="Quantity" value={qty} onChange={setQty} min={0} max={99} />
          </div>
          <CodeBlock code={`const [qty, setQty] = useState(3);

<NumberInput label="Quantity" value={qty} onChange={setQty} min={0} max={99} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Step &amp; precision</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-xs">
            <NumberInput label="Price" value={price} onChange={setPrice} min={0} step={0.5} precision={2} />
          </div>
          <CodeBlock code={`<NumberInput value={price} onChange={setPrice} step={0.5} precision={2} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sizes &amp; states</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap items-end gap-6">
              <div className="w-32"><NumberInput label="Small" size="sm" value={1} onChange={() => {}} /></div>
              <div className="w-32"><NumberInput label="Large" size="lg" value={1} onChange={() => {}} /></div>
              <div className="w-40"><NumberInput label="Error" value={-1} onChange={() => {}} error="Must be positive." /></div>
              <div className="w-40"><NumberInput label="Disabled" value={5} onChange={() => {}} disabled /></div>
            </div>
          </div>
          <CodeBlock code={`<NumberInput size="sm" ... />
<NumberInput error="Must be positive." ... />
<NumberInput disabled ... />`} />
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
              <li>Use for bounded quantities, prices, and precise numeric entry.</li>
              <li>Set sensible min/max so values stay valid.</li>
              <li>Use precision for currency and measurements.</li>
            </DoCard>
            <DontCard>
              <li>Don't use for unbounded free text — that's a text input.</li>
              <li>Don't use for a value picked from a small set — use a Select.</li>
              <li>Don't hide the steppers' purpose behind tiny hit areas.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
