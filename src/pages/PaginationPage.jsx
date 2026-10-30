import React, { useState } from 'react';
import Pagination from '../components/Pagination';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['currentPage', 'number', '1', 'The active page (1-based).'],
  ['totalPages', 'number', '1', 'Total number of pages. Renders nothing when ≤ 1.'],
  ['onPageChange', 'function', '—', 'Called with the next page number.'],
  ['maxButtons', 'number', '7', 'Max page buttons before collapsing with ellipses.'],
  ['className', 'string', "''", 'Additional CSS classes on the nav element'],
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

export default function PaginationPage() {
  const [page, setPage] = useState(1);
  const [bigPage, setBigPage] = useState(6);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Pagination</h1>
          <p className="text-xl text-ink-muted">
            Navigate through pages of content. Collapses to ellipses when there are more pages than fit,
            always keeping the first, last, and nearby pages reachable.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Pagination from './components/Pagination';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
            <p className="mt-4 text-center text-sm text-ink-muted">Page {page} of 5</p>
          </div>
          <CodeBlock code={`const [page, setPage] = useState(1);

<Pagination currentPage={page} totalPages={5} onPageChange={setPage} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Many pages (collapsed)</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <Pagination currentPage={bigPage} totalPages={20} onPageChange={setBigPage} />
            <p className="mt-4 text-center text-sm text-ink-muted">Page {bigPage} of 20</p>
          </div>
          <CodeBlock code={`<Pagination currentPage={page} totalPages={20} onPageChange={setPage} />`} />
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
              <li>Use for long, ordered result sets split into pages.</li>
              <li>Keep the current page and total clearly visible.</li>
              <li>Pair with a Data Table or List of results.</li>
            </DoCard>
            <DontCard>
              <li>Don't use for infinite feeds — prefer load-more / infinite scroll.</li>
              <li>Don't render it for a single page (it hides itself).</li>
              <li>Don't reset the user's place unexpectedly on data changes.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
