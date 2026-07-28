import React, { useState } from 'react';
import Stepper from '../components/Stepper';
import Button from '../components/Button';
import { User, CreditCard, Check } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['steps', 'Array<{ label, description?, icon?, status? }>', '[]', 'The steps to render.'],
  ['activeStep', 'number', '0', 'Index of the current step.'],
  ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Layout direction.'],
  ['clickable', 'boolean', 'false', 'Make step indicators interactive.'],
  ['onStepClick', 'function', '—', 'Called with the clicked step index.'],
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

const steps = [
  { label: 'Account', description: 'Your details', icon: User },
  { label: 'Payment', description: 'Billing info', icon: CreditCard },
  { label: 'Confirm', description: 'Review & submit', icon: Check },
];

export default function StepperPage() {
  const [active, setActive] = useState(1);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Stepper</h1>
          <p className="text-xl text-ink-muted">
            A multi-step progress indicator for wizards and checkouts. Shows completed, current, upcoming,
            and error states; supports horizontal and vertical layouts.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Stepper from './components/Stepper';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Horizontal</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <Stepper steps={steps} activeStep={active} className="mb-6" />
            <div className="flex justify-center gap-3">
              <Button variant="outline" disabled={active === 0} onClick={() => setActive((a) => a - 1)}>Back</Button>
              <Button disabled={active === steps.length - 1} onClick={() => setActive((a) => a + 1)}>Next</Button>
            </div>
          </div>
          <CodeBlock code={`<Stepper steps={steps} activeStep={active} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Vertical &amp; error state</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <Stepper
              orientation="vertical"
              activeStep={2}
              steps={[
                { label: 'Order placed', description: 'We received your order' },
                { label: 'Processing', description: 'Preparing your items' },
                { label: 'Payment failed', description: 'Please update your card', status: 'error' },
                { label: 'Shipped', description: 'On the way' },
              ]}
            />
          </div>
          <CodeBlock code={`<Stepper
  orientation="vertical"
  activeStep={2}
  steps={[..., { label: 'Payment failed', status: 'error' }]}
/>`} />
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
              <li>Use for linear, multi-step flows with a clear order.</li>
              <li>Keep step labels short; use descriptions for detail.</li>
              <li>Surface errors on the step where they occurred.</li>
            </DoCard>
            <DontCard>
              <li>Don't use for non-sequential navigation — use Tabs.</li>
              <li>Don't cram more than ~5 steps horizontally.</li>
              <li>Don't let users skip required steps silently.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
