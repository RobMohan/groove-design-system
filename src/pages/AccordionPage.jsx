import React from 'react';
import Accordion from '../components/Accordion';

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

const items = [
  {
    title: 'What is the Groove design system?',
    content: (
      <p>
        Groove is a collection of accessible React components and design tokens
        that help teams build consistent product experiences quickly.
      </p>
    ),
  },
  {
    title: 'Can I theme the components?',
    content: (
      <p>
        Yes. Every component reads from Tailwind theme tokens, so you can adjust
        colors, spacing, and radii in one place and see the changes everywhere.
      </p>
    ),
  },
  {
    title: 'Are the components accessible?',
    content: (
      <p>
        Components ship with sensible ARIA attributes and keyboard support out of
        the box, including this accordion's <code>aria-expanded</code> and
        <code> aria-controls</code> wiring.
      </p>
    ),
  },
  {
    title: 'Is enterprise support available?',
    content: <p>Enterprise support is coming soon.</p>,
    disabled: true,
  },
];

export default function AccordionPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Accordion</h1>
          <p className="text-xl text-ink-muted">
            Stacked, collapsible panels that let people reveal one section of
            content at a time.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Accordion from './components/Accordion';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic usage</h2>
          <p className="text-ink-muted mb-4">
            By default the accordion is single-open: opening one panel collapses
            whichever panel was previously open.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <Accordion items={items} />
          </div>
          <CodeBlock code={`const items = [
  { title: 'What is the Groove design system?', content: <p>Groove is a collection of accessible React components…</p> },
  { title: 'Can I theme the components?', content: <p>Yes. Every component reads from Tailwind theme tokens…</p> },
  { title: 'Are the components accessible?', content: <p>Components ship with sensible ARIA attributes…</p> },
];

<Accordion items={items} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Allow multiple</h2>
          <p className="text-ink-muted mb-4">
            Set <code className="font-mono">allowMultiple</code> to let people
            keep several panels open at the same time.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <Accordion items={items} allowMultiple />
          </div>
          <CodeBlock code={`<Accordion items={items} allowMultiple />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Default open</h2>
          <p className="text-ink-muted mb-4">
            Pass an array of indexes to{' '}
            <code className="font-mono">defaultOpen</code> to expand panels on
            first render.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <Accordion items={items} defaultOpen={[0]} />
          </div>
          <CodeBlock code={`<Accordion items={items} defaultOpen={[0]} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Disabled item</h2>
          <p className="text-ink-muted mb-4">
            Mark an item with{' '}
            <code className="font-mono">disabled: true</code> to prevent it from
            being opened.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <Accordion items={items} />
          </div>
          <CodeBlock code={`const items = [
  // …
  { title: 'Is enterprise support available?', content: <p>Enterprise support is coming soon.</p>, disabled: true },
];

<Accordion items={items} />`} />
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
                <PropRow name="items" type="object[]" def="[]" desc="Panels to render (see item shape below)" />
                <PropRow name="allowMultiple" type="boolean" def="false" desc="Allow more than one panel open at once" />
                <PropRow name="defaultOpen" type="number[]" def="[]" desc="Indexes of panels open on first render" />
                <PropRow name="className" type="string" def="''" desc="Additional CSS classes" />
              </tbody>
            </table>
          </div>
          <p className="text-ink-muted mt-4">
            Each entry in <code className="font-mono">items</code> is an object of
            the shape{' '}
            <code className="font-mono">
              {`{ title, content, disabled }`}
            </code>{' '}
            — where <code className="font-mono">title</code> is the header label,{' '}
            <code className="font-mono">content</code> is the panel body (any
            node), and the optional{' '}
            <code className="font-mono">disabled</code> flag prevents the panel
            from opening.
          </p>
        </section>
      </div>
    </div>
  );
}
