import React from 'react';
import Skeleton, { SkeletonText } from '../components/Skeleton';

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

export default function SkeletonPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Skeleton</h1>
          <p className="text-xl text-gray-600">
            Placeholder shapes that mimic content while it loads.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Skeleton, { SkeletonText } from './components/Skeleton';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Variants</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 space-y-4">
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="circle" width="48px" height="48px" />
            <Skeleton variant="rect" width="100%" height="120px" />
          </div>
          <CodeBlock code={`<Skeleton variant="text" width="100%" />
<Skeleton variant="circle" width="48px" height="48px" />
<Skeleton variant="rect" width="100%" height="120px" />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Text lines</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <SkeletonText lines={3} />
          </div>
          <CodeBlock code={`<SkeletonText lines={3} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Card loading</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <div className="flex items-center gap-4">
              <Skeleton variant="circle" width="48px" height="48px" />
              <div className="flex-1">
                <SkeletonText lines={2} />
              </div>
            </div>
          </div>
          <CodeBlock code={`<div className="flex items-center gap-4">
  <Skeleton variant="circle" width="48px" height="48px" />
  <div className="flex-1">
    <SkeletonText lines={2} />
  </div>
</div>`} />
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
                <PropRow name="variant" type="'text'|'circle'|'rect'" def="'text'" desc="Shape of the placeholder" />
                <PropRow name="width" type="string" def="—" desc="CSS width, e.g. '100%' or '48px'" />
                <PropRow name="height" type="string" def="'1em' (text)" desc="CSS height; defaults to '1em' for text variant" />
                <PropRow name="className" type="string" def="''" desc="Additional CSS classes" />
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-gray-700">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">SkeletonText</code> accepts{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">lines</code> (number, default{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">3</code>) to set how many stacked
            text lines render, and{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">className</code> for additional
            CSS classes.
          </p>
        </section>
      </div>
    </div>
  );
}
