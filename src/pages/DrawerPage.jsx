import React, { useState } from 'react';
import Drawer from '../components/Drawer';
import Button from '../components/Button';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['open', 'boolean', 'false', 'Whether the drawer is visible.'],
  ['onClose', 'function', '—', 'Called when the drawer requests to close.'],
  ['side', "'left' | 'right' | 'top' | 'bottom'", "'right'", 'Edge the panel slides in from.'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Panel width (horizontal) or height (vertical).'],
  ['title', 'string', 'undefined', 'Header title (labels the dialog).'],
  ['footer', 'ReactNode', 'undefined', 'Sticky footer content.'],
  ['closeOnOverlayClick', 'boolean', 'true', 'Close when the scrim is clicked.'],
  ['closeOnEsc', 'boolean', 'true', 'Close on Escape.'],
  ['showClose', 'boolean', 'true', 'Render the header close button.'],
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

export default function DrawerPage() {
  const [side, setSide] = useState(null);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Drawer</h1>
          <p className="text-xl text-ink-muted">
            An off-canvas panel that slides in from any edge. Traps focus, restores it on close, locks
            body scroll, and dims the page behind a scrim — ideal for filters, navigation, and side forms.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Drawer from './components/Drawer';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sides</h2>
          <p className="text-ink-muted mb-6">Open a drawer from any edge of the screen.</p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap gap-4">
              {['left', 'right', 'top', 'bottom'].map((s) => (
                <Button key={s} variant="outline" onClick={() => setSide(s)}>
                  Open {s}
                </Button>
              ))}
            </div>
          </div>
          <Drawer
            open={side !== null}
            onClose={() => setSide(null)}
            side={side || 'right'}
            title={`${side || ''} drawer`}
            footer={
              <>
                <Button variant="ghost" onClick={() => setSide(null)}>Cancel</Button>
                <Button onClick={() => setSide(null)}>Apply</Button>
              </>
            }
          >
            <p className="text-ink-muted">
              This drawer slid in from the <strong>{side}</strong> edge. Press Escape, click the scrim,
              or use the buttons to close it.
            </p>
          </Drawer>
          <CodeBlock code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>
<Drawer open={open} onClose={() => setOpen(false)} side="right" title="Filters"
  footer={<Button onClick={() => setOpen(false)}>Apply</Button>}>
  <FilterForm />
</Drawer>`} />
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
              <li>Use for secondary tasks that keep page context — filters, details, quick edits.</li>
              <li>Always provide a title so the dialog is labelled for screen readers.</li>
              <li>Anchor navigation drawers to the left, actions to the right.</li>
            </DoCard>
            <DontCard>
              <li>Don't use for a blocking confirmation — that's a Modal.</li>
              <li>Don't overload one drawer with multiple unrelated tasks.</li>
              <li>Don't disable Escape/scrim close without a strong reason.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
