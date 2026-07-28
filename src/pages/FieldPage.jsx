import React, { useState } from 'react';
import Field from '../components/Field';
import NumberInput from '../components/NumberInput';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

// A minimal token-styled input for the render-prop demo.
const BareInput = (props) => (
  <input
    {...props}
    className="h-10 px-3 rounded-control border border-line-strong bg-surface-raised text-ink outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 aria-[invalid=true]:border-destructive"
  />
);

const rows = [
  ['label', 'string', 'undefined', 'Field label, tied to the input via htmlFor/id.'],
  ['required', 'boolean', 'false', 'Marks the field required (adds * and required attr).'],
  ['optional', 'boolean', 'false', 'Adds an "(optional)" hint when not required.'],
  ['description', 'ReactNode', 'undefined', 'Help text, linked via aria-describedby.'],
  ['error', 'string', 'undefined', 'Error message; sets aria-invalid + role="alert".'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Passed through to the child input.'],
  ['children', 'ReactNode | (field) => ReactNode', '—', 'Input, or a render-prop receiving the aria bundle.'],
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

export default function FieldPage() {
  const [qty, setQty] = useState(2);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Field</h1>
          <p className="text-xl text-ink-muted">
            A form-control wrapper that standardizes the label, required marker, help text, and error —
            and wires <code className="text-base">aria-describedby</code> / <code className="text-base">aria-invalid</code> to
            the input for you. Every Groove input plugs straight in.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Field, { useField } from './components/Field';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Render-prop</h2>
          <p className="text-ink-muted mb-6">
            The render-prop hands your input the generated <code>id</code> and aria attributes.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-sm">
            <Field label="Email address" description="We'll never share it.">
              {(field) => <BareInput type="email" placeholder="you@example.com" {...field} />}
            </Field>
          </div>
          <CodeBlock code={`<Field label="Email address" description="We'll never share it.">
  {(field) => <input type="email" {...field} />}
</Field>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Error &amp; required</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-sm">
            <Field label="Username" required error="That username is taken.">
              {(field) => <BareInput defaultValue="rob" {...field} />}
            </Field>
          </div>
          <CodeBlock code={`<Field label="Username" required error="That username is taken.">
  {(field) => <input {...field} />}
</Field>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With a Groove input</h2>
          <p className="text-ink-muted mb-6">
            Inputs like NumberInput accept the field bundle by spread — no double labels, correct aria.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-sm">
            <Field label="Quantity" description="Between 1 and 10." optional>
              {(field) => (
                <NumberInput value={qty} onChange={setQty} min={1} max={10} {...field} />
              )}
            </Field>
          </div>
          <CodeBlock code={`<Field label="Quantity" description="Between 1 and 10.">
  {(field) => <NumberInput value={qty} onChange={setQty} min={1} max={10} {...field} />}
</Field>`} />
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
              <li>Wrap every input so label, help, and error stay consistent.</li>
              <li>Let Field own the label — don't also set the input's own label.</li>
              <li>Write specific, actionable error messages.</li>
            </DoCard>
            <DontCard>
              <li>Don't hand-wire aria-describedby yourself — Field does it.</li>
              <li>Don't use color alone to signal errors; the message carries meaning.</li>
              <li>Don't mark everything required — flag what's genuinely optional.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
