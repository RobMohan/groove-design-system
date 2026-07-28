import React, { useState } from 'react';
import List, { ListItem } from '../components/List';
import Badge from '../components/Badge';
import { Folder, FileText, Image, ChevronRight } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['List: dividers', 'boolean', 'false', 'Draw a rule between rows.'],
  ['ListItem: leading', 'ReactNode', 'undefined', 'Leading slot (icon/avatar).'],
  ['ListItem: primary', 'ReactNode', 'undefined', 'Primary line.'],
  ['ListItem: secondary', 'ReactNode', 'undefined', 'Secondary line.'],
  ['ListItem: trailing', 'ReactNode', 'undefined', 'Trailing slot (meta/action).'],
  ['ListItem: onClick / interactive', 'function / boolean', '—', 'Make the row a button.'],
  ['ListItem: selected / disabled', 'boolean', 'false', 'Row state.'],
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

export default function ListPage() {
  const [selected, setSelected] = useState('docs');

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">List</h1>
          <p className="text-xl text-ink-muted">
            A structured set of rows with leading and trailing slots and two lines of text. Rows can be
            static or interactive.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import List, { ListItem } from './components/List';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With metadata</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-4 mb-4">
            <List dividers className="rounded-card overflow-hidden">
              <ListItem leading={<Folder className="text-ink-muted" />} primary="Projects" secondary="12 items" trailing={<Badge>Team</Badge>} />
              <ListItem leading={<FileText className="text-ink-muted" />} primary="Design spec.pdf" secondary="2.4 MB · Updated today" trailing={<span className="text-sm text-ink-muted">PDF</span>} />
              <ListItem leading={<Image className="text-ink-muted" />} primary="cover.png" secondary="1.1 MB · Updated yesterday" trailing={<span className="text-sm text-ink-muted">PNG</span>} />
            </List>
          </div>
          <CodeBlock code={`<List dividers>
  <ListItem leading={<Folder />} primary="Projects" secondary="12 items" trailing={<Badge>Team</Badge>} />
</List>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Interactive &amp; selectable</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-4 mb-4">
            <List dividers className="rounded-card overflow-hidden">
              {[
                { id: 'docs', primary: 'Documents', secondary: 'Shared with you' },
                { id: 'photos', primary: 'Photos', secondary: 'Private' },
                { id: 'archive', primary: 'Archive', secondary: 'Read-only' },
              ].map((item) => (
                <ListItem
                  key={item.id}
                  primary={item.primary}
                  secondary={item.secondary}
                  trailing={<ChevronRight size={18} />}
                  selected={selected === item.id}
                  onClick={() => setSelected(item.id)}
                />
              ))}
            </List>
          </div>
          <CodeBlock code={`<ListItem primary="Documents" secondary="Shared" selected={active} onClick={select} />`} />
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
              <li>Use for scannable rows of similar items.</li>
              <li>Keep primary text short; use secondary for detail.</li>
              <li>Make whole rows clickable when they navigate.</li>
            </DoCard>
            <DontCard>
              <li>Don't use for tabular, multi-column data — use Data Table.</li>
              <li>Don't mix interactive and static rows without cause.</li>
              <li>Don't overload rows with too many trailing actions.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
