import React from 'react';
import Link from '../components/Link';
import { Link as RouterLink } from 'react-router-dom';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['href', 'string', 'undefined', 'Destination for the default <a>.'],
  ['as', 'ElementType', "'a'", 'Swap in a router Link or custom component.'],
  ['variant', "'default' | 'subtle' | 'quiet'", "'default'", 'Emphasis level.'],
  ['underline', "'hover' | 'always' | 'none'", "'hover'", 'Underline behavior.'],
  ['external', 'boolean', 'false', 'Adds target/rel and an external icon.'],
  ['disabled', 'boolean', 'false', 'Prevent navigation and interaction.'],
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

export default function LinkPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Link</h1>
          <p className="text-xl text-ink-muted">
            A semantic anchor with consistent states. Renders a real <code className="text-base">&lt;a&gt;</code> by
            default, or swaps in your router's Link via the <code className="text-base">as</code> prop.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Link from './components/Link';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Variants</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-col gap-3 text-base">
              <span>A <Link href="#link">default link</Link> inside a sentence.</span>
              <span>A <Link href="#link" variant="subtle">subtle link</Link> that leans on hover.</span>
              <span>A <Link href="#link" variant="quiet" underline="always">quiet, always-underlined link</Link>.</span>
              <span>An <Link href="https://groove.design" external>external link</Link> with icon.</span>
            </div>
          </div>
          <CodeBlock code={`<Link href="/pricing">default link</Link>
<Link href="/docs" variant="subtle">subtle link</Link>
<Link href="https://groove.design" external>external link</Link>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Router integration</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <Link as={RouterLink} to="/button">Go to the Button page →</Link>
          </div>
          <CodeBlock code={`import { Link as RouterLink } from 'react-router-dom';

<Link as={RouterLink} to="/button">Go to the Button page →</Link>`} />
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
              <li>Use for navigation; use Button for actions.</li>
              <li>Write descriptive link text ("View pricing"), not "click here".</li>
              <li>Mark external links so users know they'll leave.</li>
            </DoCard>
            <DontCard>
              <li>Don't style a Button as a link for a real navigation target.</li>
              <li>Don't use vague link text that fails out of context.</li>
              <li>Don't remove underlines where color alone must carry meaning.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
