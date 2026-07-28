import React, { useState } from 'react';
import Slider from '../components/Slider';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['value / defaultValue', 'number | [number, number]', '—', 'A number, or a tuple for a range slider.'],
  ['onChange', 'function', '—', 'Called with the next value (or tuple).'],
  ['min', 'number', '0', 'Minimum value.'],
  ['max', 'number', '100', 'Maximum value.'],
  ['step', 'number', '1', 'Increment.'],
  ['marks', 'Array<number | {value,label}>', 'undefined', 'Tick marks under the track.'],
  ['showValue', 'boolean', 'false', 'Show the current value.'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Track/thumb size.'],
  ['disabled', 'boolean', 'false', 'Disable the slider.'],
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

export default function SliderPage() {
  const [volume, setVolume] = useState(40);
  const [price, setPrice] = useState([20, 80]);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Slider</h1>
          <p className="text-xl text-ink-muted">
            Drag — or use the keyboard — to pick a numeric value or a range. Each thumb is a full ARIA
            slider with arrow, Page, and Home/End key support.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Slider from './components/Slider';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Single value</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-md">
            <Slider label="Volume" showValue value={volume} onChange={setVolume} />
          </div>
          <CodeBlock code={`const [volume, setVolume] = useState(40);

<Slider label="Volume" showValue value={volume} onChange={setVolume} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Range</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-md">
            <Slider label="Price range" showValue value={price} onChange={setPrice} />
          </div>
          <CodeBlock code={`const [price, setPrice] = useState([20, 80]);

<Slider label="Price range" showValue value={price} onChange={setPrice} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Steps, marks &amp; sizes</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-md space-y-8">
            <Slider
              label="Rating"
              defaultValue={3}
              min={0}
              max={5}
              step={1}
              marks={[0, 1, 2, 3, 4, 5]}
            />
            <Slider size="sm" defaultValue={30} aria-label="Small slider" />
            <Slider size="lg" defaultValue={60} aria-label="Large slider" disabled />
          </div>
          <CodeBlock code={`<Slider min={0} max={5} step={1} marks={[0,1,2,3,4,5]} defaultValue={3} />
<Slider size="sm" defaultValue={30} />
<Slider size="lg" defaultValue={60} disabled />`} />
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
              <li>Use for approximate values where fine precision isn't required.</li>
              <li>Show the current value when the exact number matters.</li>
              <li>Use a range slider for min/max filters like price.</li>
            </DoCard>
            <DontCard>
              <li>Don't use when users need to enter an exact number — use Number Input.</li>
              <li>Don't use tiny steps across a huge range — it's hard to hit values.</li>
              <li>Don't hide the value when precision is important.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
