import React from 'react';
import Divider from '../components/Divider';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Direction of the rule.'],
  ['label', 'ReactNode', 'undefined', 'Inline label (horizontal only).'],
  ['labelPosition', "'left' | 'center' | 'right'", "'center'", 'Where the label sits.'],
  ['variant', "'solid' | 'dashed'", "'solid'", 'Line style.'],
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

export default function DividerPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Divider</h1>
          <p className="text-xl text-ink-muted">
            A thin rule that separates content — horizontally or vertically, with an optional inline label.
            Exposes <code className="text-base">role="separator"</code> for assistive tech.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Divider from './components/Divider';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Horizontal</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <p className="text-ink">Section one</p>
            <Divider className="my-4" />
            <p className="text-ink">Section two</p>
            <Divider className="my-4" label="OR" />
            <p className="text-ink">Section three</p>
            <Divider className="my-4" variant="dashed" label="Dashed" labelPosition="left" />
          </div>
          <CodeBlock code={`<Divider />
<Divider label="OR" />
<Divider variant="dashed" label="Dashed" labelPosition="left" />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Vertical</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex items-center gap-4 text-ink">
              <span>Edit</span>
              <Divider orientation="vertical" />
              <span>Duplicate</span>
              <Divider orientation="vertical" />
              <span>Delete</span>
            </div>
          </div>
          <CodeBlock code={`<div className="flex items-center gap-4">
  <span>Edit</span>
  <Divider orientation="vertical" />
  <span>Delete</span>
</div>`} />
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
              <li>Use to group and separate related content.</li>
              <li>Use a labelled divider for "OR" style splits.</li>
              <li>Use vertical dividers between inline actions.</li>
            </DoCard>
            <DontCard>
              <li>Don't overuse dividers where whitespace would do.</li>
              <li>Don't rely on a divider to convey meaning alone.</li>
              <li>Don't stack multiple dividers together.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
