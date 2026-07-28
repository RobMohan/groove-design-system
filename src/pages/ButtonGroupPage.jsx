import React, { useState } from 'react';
import ButtonGroup from '../components/ButtonGroup';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['children', 'ReactNode', '—', 'Buttons or IconButtons to join.'],
  ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Layout direction.'],
  ['attached', 'boolean', 'true', 'Collapse borders so it reads as one control.'],
  ['size', "'small' | 'default' | 'large'", 'undefined', 'Shared size applied to children without their own.'],
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

export default function ButtonGroupPage() {
  const [align, setAlign] = useState('left');

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Button Group</h1>
          <p className="text-xl text-ink-muted">
            Visually joins related buttons into a single segmented control — toolbars, split actions,
            and grouped choices.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import ButtonGroup from './components/ButtonGroup';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <ButtonGroup>
              <Button variant="outline">Day</Button>
              <Button variant="outline">Week</Button>
              <Button variant="outline">Month</Button>
            </ButtonGroup>
          </div>
          <CodeBlock code={`<ButtonGroup>
  <Button variant="outline">Day</Button>
  <Button variant="outline">Week</Button>
  <Button variant="outline">Month</Button>
</ButtonGroup>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Icon toolbar</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap gap-4">
              <ButtonGroup>
                <IconButton icon={Bold} aria-label="Bold" variant="outline" />
                <IconButton icon={Italic} aria-label="Italic" variant="outline" />
                <IconButton icon={Underline} aria-label="Underline" variant="outline" />
              </ButtonGroup>
              <ButtonGroup>
                {[
                  ['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight],
                ].map(([val, Icon]) => (
                  <IconButton
                    key={val}
                    icon={Icon}
                    aria-label={`Align ${val}`}
                    variant={align === val ? 'primary' : 'outline'}
                    onClick={() => setAlign(val)}
                  />
                ))}
              </ButtonGroup>
            </div>
          </div>
          <CodeBlock code={`<ButtonGroup>
  <IconButton icon={Bold} aria-label="Bold" variant="outline" />
  <IconButton icon={Italic} aria-label="Italic" variant="outline" />
</ButtonGroup>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Vertical &amp; detached</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap gap-8">
              <ButtonGroup orientation="vertical">
                <Button variant="outline">Top</Button>
                <Button variant="outline">Middle</Button>
                <Button variant="outline">Bottom</Button>
              </ButtonGroup>
              <ButtonGroup attached={false}>
                <Button variant="primary">Save</Button>
                <Button variant="ghost">Cancel</Button>
              </ButtonGroup>
            </div>
          </div>
          <CodeBlock code={`<ButtonGroup orientation="vertical"> ... </ButtonGroup>
<ButtonGroup attached={false}> ... </ButtonGroup>`} />
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
              <li>Group buttons that share a purpose or context.</li>
              <li>Use one variant across the group for a unified look.</li>
              <li>Prefer for formatting toolbars and view switches.</li>
            </DoCard>
            <DontCard>
              <li>Don't mix unrelated actions into one group.</li>
              <li>Don't attach primary + destructive actions together.</li>
              <li>Don't use for a single-choice form input — use Segmented Control.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
