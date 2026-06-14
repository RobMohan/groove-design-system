import React, { useState } from 'react';
import Alert from '../components/Alert';
import Button from '../components/Button';

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

export default function AlertPage() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Alert</h1>
          <p className="text-xl text-ink-muted">
            Inline banners that communicate contextual status and messages.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Alert from './components/Alert';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Variants</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 space-y-4">
            <Alert variant="info" title="Heads up">A new version of the app is available.</Alert>
            <Alert variant="success" title="Saved">Your changes have been saved.</Alert>
            <Alert variant="warning" title="Almost out of space">You're using 90% of your storage.</Alert>
            <Alert variant="error" title="Something went wrong">We couldn't process your payment.</Alert>
          </div>
          <CodeBlock code={`<Alert variant="info" title="Heads up">A new version is available.</Alert>
<Alert variant="success" title="Saved">Your changes have been saved.</Alert>
<Alert variant="warning" title="Almost out of space">You're at 90%.</Alert>
<Alert variant="error" title="Something went wrong">Payment failed.</Alert>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Title-only &amp; description-only</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 space-y-4">
            <Alert variant="success" title="Profile updated" />
            <Alert variant="info">Just a plain informational message with no title.</Alert>
          </div>
          <CodeBlock code={`<Alert variant="success" title="Profile updated" />
<Alert variant="info">A plain message with no title.</Alert>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Dismissible</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            {dismissed ? (
              <Button variant="outline" size="small" onClick={() => setDismissed(false)}>
                Restore alert
              </Button>
            ) : (
              <Alert variant="warning" title="Dismiss me" onClose={() => setDismissed(true)}>
                Click the × to close this alert.
              </Alert>
            )}
          </div>
          <CodeBlock code={`<Alert variant="warning" title="Dismiss me" onClose={() => setDismissed(true)}>
  Click the × to close this alert.
</Alert>`} />
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
                <PropRow name="variant" type="string" def="'info'" desc="info, success, warning, error" />
                <PropRow name="title" type="string" def="—" desc="Bold heading line" />
                <PropRow name="children" type="node" def="—" desc="Body content" />
                <PropRow name="icon" type="Component" def="—" desc="Override the default variant icon" />
                <PropRow name="onClose" type="function" def="—" desc="When provided, renders a dismiss button" />
                <PropRow name="className" type="string" def="''" desc="Additional CSS classes" />
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
