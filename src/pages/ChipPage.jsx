import React, { useState } from 'react';
import Chip from '../components/Chip';
import { Check, Tag, Star } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['children / label', 'ReactNode', '—', 'Chip content.'],
  ['color', "'neutral' | 'primary' | 'positive' | 'warning' | 'destructive'", "'neutral'", 'Color role.'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Chip size.'],
  ['icon', 'LucideIcon', 'undefined', 'Leading icon.'],
  ['onRemove', 'function', 'undefined', 'Show a dismiss ✕ and handle removal.'],
  ['onClick / clickable', 'function / boolean', '—', 'Make the chip a toggle button.'],
  ['selected', 'boolean', 'false', 'Solid, active/applied state.'],
  ['disabled', 'boolean', 'false', 'Disable interaction.'],
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

export default function ChipPage() {
  const [tags, setTags] = useState(['Design', 'Research', 'Engineering']);
  const [filters, setFilters] = useState({ open: true, mine: false });

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Chip</h1>
          <p className="text-xl text-ink-muted">
            A compact token for tags, filters, and multi-select values. Chips can be static, removable,
            or toggleable — unlike Badge, which is display-only.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Chip from './components/Chip';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Colors</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <Chip>Neutral</Chip>
              <Chip color="primary" icon={Tag}>Primary</Chip>
              <Chip color="positive" icon={Check}>Positive</Chip>
              <Chip color="warning">Warning</Chip>
              <Chip color="destructive">Destructive</Chip>
            </div>
          </div>
          <CodeBlock code={`<Chip color="primary" icon={Tag}>Primary</Chip>
<Chip color="positive">Positive</Chip>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Removable</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap items-center gap-3 min-h-[2rem]">
              {tags.map((t) => (
                <Chip key={t} color="primary" onRemove={() => setTags(tags.filter((x) => x !== t))}>
                  {t}
                </Chip>
              ))}
              {tags.length === 0 && <span className="text-sm text-ink-muted">All removed.</span>}
            </div>
          </div>
          <CodeBlock code={`<Chip onRemove={() => removeTag(tag)}>{tag}</Chip>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Toggleable filters</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <Chip clickable selected={filters.open} icon={Star} onClick={() => setFilters((f) => ({ ...f, open: !f.open }))}>
                Open
              </Chip>
              <Chip clickable selected={filters.mine} onClick={() => setFilters((f) => ({ ...f, mine: !f.mine }))}>
                Assigned to me
              </Chip>
            </div>
          </div>
          <CodeBlock code={`<Chip clickable selected={active} onClick={toggle}>Open</Chip>`} />
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
              <li>Use for tags, filters, and removable selections.</li>
              <li>Keep labels short — one or two words.</li>
              <li>Use color roles meaningfully (destructive = removal risk).</li>
            </DoCard>
            <DontCard>
              <li>Don't use a clickable Chip where a Button is expected.</li>
              <li>Don't use for read-only status — that's Badge.</li>
              <li>Don't pack long sentences into a chip.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
