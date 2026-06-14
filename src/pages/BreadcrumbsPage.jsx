import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

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

export default function BreadcrumbsPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Breadcrumbs</h1>
          <p className="text-xl text-gray-600">
            A navigation trail showing the user's location within a hierarchy.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Breadcrumbs from './components/Breadcrumbs';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic usage</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '#' },
                { label: 'Components', href: '#' },
                { label: 'Navigation', href: '#' },
                { label: 'Breadcrumbs' },
              ]}
            />
          </div>
          <CodeBlock code={`<Breadcrumbs
  items={[
    { label: 'Home', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Navigation', href: '#' },
    { label: 'Breadcrumbs' },
  ]}
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Custom separator</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <Breadcrumbs
              separator="/"
              items={[
                { label: 'Home', href: '#' },
                { label: 'Docs', href: '#' },
                { label: 'Getting Started' },
              ]}
            />
          </div>
          <CodeBlock code={`<Breadcrumbs
  separator="/"
  items={[
    { label: 'Home', href: '#' },
    { label: 'Docs', href: '#' },
    { label: 'Getting Started' },
  ]}
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Collapsed</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <Breadcrumbs
              maxItems={3}
              items={[
                { label: 'Home', href: '#' },
                { label: 'Library', href: '#' },
                { label: 'Components', href: '#' },
                { label: 'Navigation', href: '#' },
                { label: 'Breadcrumbs' },
              ]}
            />
          </div>
          <CodeBlock code={`<Breadcrumbs
  maxItems={3}
  items={[
    { label: 'Home', href: '#' },
    { label: 'Library', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Navigation', href: '#' },
    { label: 'Breadcrumbs' },
  ]}
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Props</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold">Prop</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Default</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <PropRow name="items" type="Array<{ label, href, onClick }>" def="[]" desc="The trail of crumbs; the last item renders as the current page" />
                <PropRow name="separator" type="node" def="<ChevronRight />" desc="Custom separator rendered between crumbs" />
                <PropRow name="maxItems" type="number" def="—" desc="Collapses the middle behind an ellipsis when exceeded" />
                <PropRow name="className" type="string" def="''" desc="Additional CSS classes on the nav element" />
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-gray-700">
            Each entry in <code className="bg-gray-100 px-2 py-1 rounded text-sm">items</code> is an object of the
            shape <code className="bg-gray-100 px-2 py-1 rounded text-sm">{`{ label, href, onClick }`}</code>. The
            last item is treated as the current page, rendered with{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">aria-current="page"</code> and not as a link.
          </p>
        </section>
      </div>
    </div>
  );
}
