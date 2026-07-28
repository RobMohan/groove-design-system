import React from 'react';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { Inbox, Search, Plus } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['icon', 'LucideIcon | ReactNode', 'undefined', 'Illustration in a muted badge.'],
  ['title', 'string', 'undefined', 'Headline message.'],
  ['description', 'string', 'undefined', 'Supporting text.'],
  ['primaryAction', 'ReactNode', 'undefined', 'Primary action (usually a Button).'],
  ['secondaryAction', 'ReactNode', 'undefined', 'Secondary action.'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Overall scale.'],
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

export default function EmptyStatePage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Empty State</h1>
          <p className="text-xl text-ink-muted">
            A friendly placeholder for zero-data views — first-run experiences, empty searches, and
            cleared lists — with a clear next action.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import EmptyState from './components/EmptyState';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">First run</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <EmptyState
              icon={Inbox}
              title="No projects yet"
              description="Create your first project to get started. It only takes a minute."
              primaryAction={<Button icon={Plus}>New project</Button>}
              secondaryAction={<Button variant="ghost">Import</Button>}
            />
          </div>
          <CodeBlock code={`<EmptyState
  icon={Inbox}
  title="No projects yet"
  description="Create your first project to get started."
  primaryAction={<Button icon={Plus}>New project</Button>}
  secondaryAction={<Button variant="ghost">Import</Button>}
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">No search results</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <EmptyState
              size="sm"
              icon={Search}
              title="No results for “widgets”"
              description="Try a different search term or clear your filters."
            />
          </div>
          <CodeBlock code={`<EmptyState size="sm" icon={Search} title="No results" description="Try a different search." />`} />
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
              <li>Explain why it's empty and what to do next.</li>
              <li>Offer a clear primary action when one exists.</li>
              <li>Keep the tone helpful and encouraging.</li>
            </DoCard>
            <DontCard>
              <li>Don't leave a blank area with no guidance.</li>
              <li>Don't use error styling for a normal empty state.</li>
              <li>Don't bury the action the user most likely wants.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
