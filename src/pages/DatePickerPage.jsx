import React, { useState } from 'react';
import DatePicker from '../components/DatePicker';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['value', 'Date | null', 'null', 'The selected date.'],
  ['onChange', 'function', '—', 'Called with the chosen Date.'],
  ['min / max', 'Date', 'undefined', 'Selectable range bounds.'],
  ['disabledDates', 'Date[] | (date) => boolean', 'undefined', 'Dates to disable.'],
  ['format', '(date) => string', 'MM/DD/YYYY', 'Custom display formatter.'],
  ['placeholder', 'string', "'Select a date'", 'Empty-state text.'],
  ['disabled', 'boolean', 'false', 'Disable the picker.'],
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

export default function DatePickerPage() {
  const [date, setDate] = useState(null);
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Date Picker</h1>
          <p className="text-xl text-ink-muted">
            A calendar-driven date field built on native <code className="text-base">Date</code> — no date
            library. Fully keyboard navigable (arrows, Page, Home/End) and portaled above modals.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import DatePicker from './components/DatePicker';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <DatePicker value={date} onChange={setDate} />
            <p className="mt-4 text-sm text-ink-muted">
              Selected: {date ? date.toDateString() : 'none'}
            </p>
          </div>
          <CodeBlock code={`const [date, setDate] = useState(null);

<DatePicker value={date} onChange={setDate} />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Bounded range</h2>
          <p className="text-ink-muted mb-6">Restrict selection to today through the end of next month.</p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <DatePicker min={today} max={nextMonth} placeholder="Pick a delivery date" />
          </div>
          <CodeBlock code={`<DatePicker min={today} max={endOfNextMonth} />`} />
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
              <li>Use for a single date where a calendar helps orientation.</li>
              <li>Constrain with min/max when only some dates are valid.</li>
              <li>Format the display to match your locale.</li>
            </DoCard>
            <DontCard>
              <li>Don't use for a well-known date users can just type.</li>
              <li>Don't disable dates without making the reason clear.</li>
              <li>Don't use for wide historical ranges (birthdays) without year jump.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
