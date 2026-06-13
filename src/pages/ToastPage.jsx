import React from 'react';
import { useToast } from '../components/Toast';
import Button from '../components/Button';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const PropRow = ({ name, type, def, desc }) => (
  <tr className="border-b border-gray-100">
    <td className="py-3 px-4 font-mono text-sm">{name}</td>
    <td className="py-3 px-4 font-mono text-xs text-gray-600">{type}</td>
    <td className="py-3 px-4 font-mono text-xs">{def}</td>
    <td className="py-3 px-4">{desc}</td>
  </tr>
);

export default function ToastPage() {
  const { toast } = useToast();

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Toast</h1>
          <p className="text-xl text-gray-600">
            Transient notifications triggered imperatively from anywhere in the app.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Setup</h2>
          <p className="text-gray-600 mb-4">
            Wrap your app once in <code className="bg-gray-100 px-2 py-1 rounded text-sm">ToastProvider</code>,
            then call <code className="bg-gray-100 px-2 py-1 rounded text-sm">useToast()</code> from any component.
          </p>
          <CodeBlock code={`// main.jsx
import { ToastProvider } from './components/Toast';

<ToastProvider>
  <App />
</ToastProvider>

// any component
import { useToast } from './components/Toast';

const { toast } = useToast();
toast({ title: 'Saved', description: 'Your changes are live.', variant: 'success' });`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Variants</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => toast({ title: 'Heads up', description: 'Just so you know.', variant: 'info' })}>Info</Button>
            <Button variant="positive" onClick={() => toast({ title: 'Saved', description: 'Your changes are live.', variant: 'success' })}>Success</Button>
            <Button variant="secondary" onClick={() => toast({ title: 'Careful', description: 'Storage almost full.', variant: 'warning' })}>Warning</Button>
            <Button variant="destructive" onClick={() => toast({ title: 'Failed', description: 'Something went wrong.', variant: 'error' })}>Error</Button>
          </div>
          <CodeBlock code={`toast({ title: 'Saved', description: 'Your changes are live.', variant: 'success' });`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Options</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => toast('Quick message')}>String shorthand</Button>
            <Button variant="outline" onClick={() => toast({ title: 'Sticky', description: 'Stays until dismissed.', duration: Infinity })}>Persistent</Button>
          </div>
          <CodeBlock code={`// String shorthand
toast('Quick message');

// Persistent (no auto-dismiss)
toast({ title: 'Sticky', description: 'Stays until dismissed.', duration: Infinity });`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">toast(options)</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold">Option</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Default</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <PropRow name="title" type="string" def="''" desc="Bold heading line" />
                <PropRow name="description" type="string" def="''" desc="Body text (also the value of the string shorthand)" />
                <PropRow name="variant" type="string" def="'info'" desc="info, success, warning, error" />
                <PropRow name="duration" type="number" def="4000" desc="Auto-dismiss delay in ms; use Infinity to persist" />
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 mt-4">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">ToastProvider</code> also accepts a
            <code className="bg-gray-100 px-2 py-1 rounded text-sm ml-1">position</code> prop
            (<code className="bg-gray-100 px-2 py-1 rounded text-sm">'bottom-right'</code> by default).
          </p>
        </section>
      </div>
    </div>
  );
}
