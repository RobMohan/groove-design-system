import React, { useState } from 'react';
import Popover from '../components/Popover';
import Button from '../components/Button';
import { Settings, Info } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['trigger', 'ReactElement', '—', 'Element that toggles the popover (cloned with aria + onClick).'],
  ['content', 'ReactNode', 'undefined', 'Panel content (alternatively pass children).'],
  ['placement', "'top' | 'bottom' | 'left' | 'right' (+ '-start' / '-end')", "'bottom'", 'Preferred side; flips on collision.'],
  ['open', 'boolean', 'undefined', 'Controlled open state.'],
  ['defaultOpen', 'boolean', 'false', 'Initial open state when uncontrolled.'],
  ['onOpenChange', 'function', 'undefined', 'Called with the next open state.'],
  ['offset', 'number', '8', 'Gap in px between trigger and panel.'],
  ['closeOnBlur', 'boolean', 'true', 'Close when focus leaves the panel.'],
  ['closeOnEsc', 'boolean', 'true', 'Close on Escape.'],
  ['showArrow', 'boolean', 'false', 'Render a pointing arrow.'],
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

export default function PopoverPage() {
  const [controlled, setControlled] = useState(false);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Popover</h1>
          <p className="text-xl text-ink-muted">
            An anchored floating panel for arbitrary content. Portals above modals, flips on collision,
            traps focus, and closes on Escape or outside-click.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Popover from './components/Popover';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <Popover
              trigger={<Button variant="outline" icon={Settings}>Settings</Button>}
              content={
                <div className="space-y-2">
                  <p className="font-medium text-ink">Preferences</p>
                  <p className="text-sm text-ink-muted">Adjust your workspace settings here.</p>
                  <Button size="small" className="w-full">Save</Button>
                </div>
              }
            />
          </div>
          <CodeBlock code={`<Popover
  trigger={<Button variant="outline" icon={Settings}>Settings</Button>}
  content={<PreferencesPanel />}
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Placement</h2>
          <p className="text-ink-muted mb-6">
            Choose a preferred side; the panel automatically flips when it would overflow the viewport.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap gap-4">
              {['top', 'right', 'bottom', 'left'].map((side) => (
                <Popover
                  key={side}
                  placement={side}
                  showArrow
                  trigger={<Button variant="ghost">{side}</Button>}
                  content={<span className="text-sm text-ink">Opens to the {side}.</span>}
                />
              ))}
            </div>
          </div>
          <CodeBlock code={`<Popover placement="top" showArrow trigger={...} content={...} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Controlled</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex items-center gap-4">
              <Popover
                open={controlled}
                onOpenChange={setControlled}
                trigger={<Button icon={Info}>Details</Button>}
                content={<span className="text-sm text-ink">Controlled by parent state.</span>}
              />
              <span className="text-sm text-ink-muted">open: {String(controlled)}</span>
            </div>
          </div>
          <CodeBlock code={`const [open, setOpen] = useState(false);

<Popover open={open} onOpenChange={setOpen} trigger={...} content={...} />`} />
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
              <li>Use for rich, interactive content anchored to a trigger.</li>
              <li>Pass an accessible, focusable element as the trigger.</li>
              <li>Keep panels compact and focused on one task.</li>
            </DoCard>
            <DontCard>
              <li>Don't use for plain text hints — reach for Tooltip.</li>
              <li>Don't nest critical flows that need a full dialog — use Modal.</li>
              <li>Don't stuff long forms inside; consider a Drawer.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
