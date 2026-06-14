import React, { useState, useEffect } from 'react';
import Progress from '../components/Progress';

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

export default function ProgressPage() {
  const [value, setValue] = useState(40);

  // Animate the live demo value.
  useEffect(() => {
    const timer = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Progress</h1>
          <p className="text-xl text-ink-muted">
            A linear bar for determinate and indeterminate progress.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Progress from './components/Progress';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Determinate</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 space-y-6">
            <Progress value={25} />
            <Progress value={60} showLabel label="Uploading" />
            <Progress value={value} showLabel label="Live" />
          </div>
          <CodeBlock code={`<Progress value={60} showLabel label="Uploading" />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Indeterminate</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <Progress indeterminate label="Working…" />
          </div>
          <CodeBlock code={`<Progress indeterminate label="Working…" />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sizes &amp; colors</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 space-y-6">
            <Progress value={50} size="sm" />
            <Progress value={50} size="md" color="positive" />
            <Progress value={50} size="lg" color="destructive" />
          </div>
          <CodeBlock code={`<Progress value={50} size="lg" color="positive" />`} />
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
                <PropRow name="value" type="number" def="0" desc="Current progress (0–max)" />
                <PropRow name="max" type="number" def="100" desc="Maximum value" />
                <PropRow name="indeterminate" type="boolean" def="false" desc="Show an animated indeterminate bar" />
                <PropRow name="color" type="string" def="'primary'" desc="primary, secondary, positive, destructive" />
                <PropRow name="size" type="'sm'|'md'|'lg'" def="'md'" desc="Bar thickness" />
                <PropRow name="showLabel" type="boolean" def="false" desc="Show the percentage value" />
                <PropRow name="label" type="string" def="—" desc="Descriptive label above the bar" />
                <PropRow name="className" type="string" def="''" desc="Additional CSS classes" />
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
