import React, { useState } from 'react';
import CommandPalette, { useCommandK } from '../components/CommandPalette';
import Button from '../components/Button';
import { Home, Settings, User, FileText, Search, Moon } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['open', 'boolean', 'false', 'Whether the palette is visible.'],
  ['onClose', 'function', '—', 'Called when the palette requests to close.'],
  ['items', 'CommandItem[]', '[]', '{ id, label, icon?, shortcut?, group?, keywords?, disabled?, onSelect }'],
  ['placeholder', 'string', "'Type a command…'", 'Search input placeholder.'],
  ['emptyMessage', 'string', "'No results found.'", 'Shown when nothing matches.'],
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

export default function CommandPalettePage() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState(null);

  useCommandK(() => setOpen((o) => !o));

  const items = [
    { id: 'home', label: 'Go to Home', icon: Home, group: 'Navigation', shortcut: 'G H', onSelect: () => setLast('Home') },
    { id: 'profile', label: 'Open Profile', icon: User, group: 'Navigation', onSelect: () => setLast('Profile') },
    { id: 'docs', label: 'Search Docs', icon: FileText, group: 'Navigation', keywords: 'help', onSelect: () => setLast('Docs') },
    { id: 'settings', label: 'Open Settings', icon: Settings, group: 'Actions', shortcut: '⌘,', onSelect: () => setLast('Settings') },
    { id: 'theme', label: 'Toggle Dark Mode', icon: Moon, group: 'Actions', onSelect: () => setLast('Theme') },
  ];

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Command Palette</h1>
          <p className="text-xl text-ink-muted">
            A ⌘K / Ctrl+K search-and-run overlay. Filter as you type, navigate with the arrow keys,
            Enter to run, Escape to dismiss. Results group by category and focus stays trapped.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import CommandPalette, { useCommandK } from './components/CommandPalette';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Example</h2>
          <p className="text-ink-muted mb-6">
            Press <kbd className="text-xs font-mono border border-line rounded px-1.5 py-0.5">⌘K</kbd> /{' '}
            <kbd className="text-xs font-mono border border-line rounded px-1.5 py-0.5">Ctrl K</kbd> or use the button.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex items-center gap-4">
              <Button icon={Search} onClick={() => setOpen(true)}>Open palette</Button>
              {last && <span className="text-sm text-ink-muted">Last run: <strong>{last}</strong></span>}
            </div>
          </div>
          <CommandPalette open={open} onClose={() => setOpen(false)} items={items} />
          <CodeBlock code={`const [open, setOpen] = useState(false);
useCommandK(() => setOpen((o) => !o));

<CommandPalette
  open={open}
  onClose={() => setOpen(false)}
  items={[
    { id: 'home', label: 'Go to Home', icon: Home, group: 'Navigation', onSelect: goHome },
    { id: 'settings', label: 'Open Settings', icon: Settings, group: 'Actions', onSelect: openSettings },
  ]}
/>`} />
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
              <li>Expose your most common actions and navigation targets.</li>
              <li>Group related items and add keywords for fuzzy discovery.</li>
              <li>Advertise the ⌘K shortcut somewhere visible.</li>
            </DoCard>
            <DontCard>
              <li>Don't hide primary navigation solely behind the palette.</li>
              <li>Don't list hundreds of ungrouped items — curate.</li>
              <li>Don't put destructive actions without a follow-up confirm.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
