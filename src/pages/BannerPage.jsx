import React from 'react';
import Banner from '../components/Banner';
import Button from '../components/Button';
import Link from '../components/Link';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['tone', "'info' | 'positive' | 'warning' | 'destructive'", "'info'", 'Color and semantics (destructive is announced assertively).'],
  ['title', 'string', 'undefined', 'Bold heading line.'],
  ['children', 'ReactNode', 'undefined', 'Body content.'],
  ['icon', 'LucideIcon', 'tone default', 'Override the leading icon.'],
  ['actions', 'ReactNode', 'undefined', 'Trailing action buttons/links.'],
  ['dismissible', 'boolean', 'false', 'Show a dismiss button.'],
  ['onDismiss', 'function', 'undefined', 'Called when dismissed.'],
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

export default function BannerPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Banner</h1>
          <p className="text-xl text-ink-muted">
            A page-level, full-width status band for messages that apply to the whole page or section —
            distinct from the inline Alert.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Banner from './components/Banner';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Tones</h2>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden mb-4 divide-y divide-line">
            <Banner tone="info" title="Scheduled maintenance">
              We'll be offline Sunday 02:00–03:00 UTC.
            </Banner>
            <Banner tone="positive" title="Payment received">Your plan is now active.</Banner>
            <Banner tone="warning" title="Usage approaching limit">You've used 90% of your quota.</Banner>
            <Banner tone="destructive" title="Payment failed">Update your card to avoid interruption.</Banner>
          </div>
          <CodeBlock code={`<Banner tone="warning" title="Usage approaching limit">
  You've used 90% of your quota.
</Banner>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With actions &amp; dismiss</h2>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden mb-4">
            <Banner
              tone="info"
              title="New workspace features"
              dismissible
              actions={
                <>
                  <Link href="#learn" variant="subtle">Learn more</Link>
                  <Button size="small" variant="primary">Try it</Button>
                </>
              }
            >
              We've shipped a redesigned dashboard.
            </Banner>
          </div>
          <CodeBlock code={`<Banner
  tone="info"
  title="New workspace features"
  dismissible
  onDismiss={handleDismiss}
  actions={<Button size="small">Try it</Button>}
>
  We've shipped a redesigned dashboard.
</Banner>`} />
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
              <li>Use at the top of a page/section for broad, contextual messages.</li>
              <li>Keep it to one message; lead with the most important info.</li>
              <li>Use destructive tone only for genuine, urgent problems.</li>
            </DoCard>
            <DontCard>
              <li>Don't use for field-level or inline feedback — that's Alert.</li>
              <li>Don't stack multiple banners competing for attention.</li>
              <li>Don't make critical banners dismissible without resolution.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
