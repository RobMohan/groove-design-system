import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['accept', 'string', 'undefined', 'Input accept string (e.g. "image/*,.pdf").'],
  ['multiple', 'boolean', 'false', 'Allow more than one file.'],
  ['maxSize', 'number', 'undefined', 'Max bytes per file; larger files are rejected.'],
  ['onFiles', 'function', '—', 'Called with the accepted File[] on change.'],
  ['uploadProgress', '{ [name]: 0..100 }', 'undefined', 'Per-file progress bars.'],
  ['hint', 'string', 'undefined', 'Helper text under the prompt.'],
  ['disabled', 'boolean', 'false', 'Disable the dropzone.'],
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

export default function FileUploadPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">File Upload</h1>
          <p className="text-xl text-ink-muted">
            A drag-and-drop dropzone with click-to-browse. Keyboard accessible, validates file size, and
            lists selected files with per-file progress.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import FileUpload from './components/FileUpload';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-lg">
            <FileUpload
              label="Attachments"
              multiple
              accept="image/*,.pdf"
              hint="PNG, JPG or PDF up to 5 MB"
              maxSize={5 * 1024 * 1024}
              onFiles={(f) => setCount(f.length)}
            />
            <p className="mt-3 text-sm text-ink-muted">{count} file(s) selected</p>
          </div>
          <CodeBlock code={`<FileUpload
  label="Attachments"
  multiple
  accept="image/*,.pdf"
  hint="PNG, JPG or PDF up to 5 MB"
  maxSize={5 * 1024 * 1024}
  onFiles={setFiles}
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Disabled</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-lg">
            <FileUpload disabled hint="Uploads are currently paused" />
          </div>
          <CodeBlock code={`<FileUpload disabled />`} />
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
              <li>State accepted types and size limits up front.</li>
              <li>Show selected files with a way to remove each.</li>
              <li>Surface progress and errors clearly.</li>
            </DoCard>
            <DontCard>
              <li>Don't rely on drag-and-drop alone — keep click-to-browse.</li>
              <li>Don't accept files you can't handle; validate early.</li>
              <li>Don't hide why a file was rejected.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
