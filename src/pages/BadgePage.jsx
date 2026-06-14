import React from 'react';
import Badge from '../components/Badge';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

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
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">type</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">
            'default' | 'warning' | 'positive' | 'negative'
          </td>
          <td className="py-3 px-4 font-mono text-xs">'default'</td>
          <td className="py-3 px-4">Visual style variant</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">children</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">ReactNode</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Badge content</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">className</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">''</td>
          <td className="py-3 px-4">Additional CSS classes</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function BadgePage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Badge</h1>
          <p className="text-xl text-ink-muted">
            A compact status indicator component for displaying labels, categories, or status information.
          </p>
        </div>

        {/* Import */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Badge from './components/Badge';`} />
        </section>

        {/* Types */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Types</h2>
          <p className="text-ink-muted mb-6">
            The Badge component comes in 4 different types to represent various states and contexts.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap gap-4">
              <Badge type="default">Default</Badge>
              <Badge type="warning">Warning</Badge>
              <Badge type="positive">Positive</Badge>
              <Badge type="negative">Negative</Badge>
            </div>
          </div>
          <CodeBlock code={`<Badge type="default">Default</Badge>
<Badge type="warning">Warning</Badge>
<Badge type="positive">Positive</Badge>
<Badge type="negative">Negative</Badge>`} />
        </section>

        {/* Use Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Common Use Cases</h2>
          <p className="text-ink-muted mb-6">
            Badges are great for displaying status, categories, or counts.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-ink-muted mb-2">Status indicators:</p>
                <div className="flex flex-wrap gap-3">
                  <Badge type="positive">Active</Badge>
                  <Badge type="warning">Pending</Badge>
                  <Badge type="negative">Inactive</Badge>
                  <Badge type="default">Draft</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-ink-muted mb-2">Categories:</p>
                <div className="flex flex-wrap gap-3">
                  <Badge type="default">Technology</Badge>
                  <Badge type="default">Design</Badge>
                  <Badge type="default">Business</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-ink-muted mb-2">Notifications:</p>
                <div className="flex flex-wrap gap-3">
                  <Badge type="negative">3 errors</Badge>
                  <Badge type="warning">5 warnings</Badge>
                  <Badge type="positive">12 new</Badge>
                </div>
              </div>
            </div>
          </div>
          <CodeBlock code={`// Status indicators
<Badge type="positive">Active</Badge>
<Badge type="warning">Pending</Badge>
<Badge type="negative">Inactive</Badge>

// Categories
<Badge type="default">Technology</Badge>

// Notifications
<Badge type="negative">3 errors</Badge>`} />
        </section>

        {/* In Context */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">In Context</h2>
          <p className="text-ink-muted mb-6">
            Examples of badges used alongside other content.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium">User Account</span>
                <Badge type="positive">Verified</Badge>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-medium">Payment Method</span>
                <Badge type="warning">Expiring Soon</Badge>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base font-medium">Subscription</span>
                <Badge type="negative">Expired</Badge>
              </div>
            </div>
          </div>
          <CodeBlock code={`<div className="flex items-center gap-3">
  <span className="text-base font-medium">User Account</span>
  <Badge type="positive">Verified</Badge>
</div>`} />
        </section>

        {/* Props Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Props</h2>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <PropsTable />
          </div>
        </section>

        {/* Usage Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
          <p className="text-ink-muted mb-6">
            Here's a complete example showing how to use the Badge component in a list.
          </p>
          <CodeBlock code={`import Badge from './components/Badge';

function TaskList() {
  const tasks = [
    { id: 1, name: 'Deploy to production', status: 'positive', label: 'Complete' },
    { id: 2, name: 'Review pull request', status: 'warning', label: 'In Progress' },
    { id: 3, name: 'Update documentation', status: 'default', label: 'Todo' },
    { id: 4, name: 'Fix critical bug', status: 'negative', label: 'Blocked' }
  ];

  return (
    <ul className="space-y-3">
      {tasks.map(task => (
        <li key={task.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
          <span>{task.name}</span>
          <Badge type={task.status}>{task.label}</Badge>
        </li>
      ))}
    </ul>
  );
}`} />
        </section>
      </div>
    </div>
  );
}
