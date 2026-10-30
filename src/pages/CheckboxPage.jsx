import React, { useState } from 'react';
import Checkbox, { CheckboxGroup } from '../components/Checkbox';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['checked', 'boolean', 'false', 'Whether the checkbox is checked. Ignored inside a CheckboxGroup, which owns the value.'],
  ['indeterminate', 'boolean', 'false', 'Shows a minus instead of a check and sets the native indeterminate property. Use for a "select all" parent.'],
  ['disabled', 'boolean', 'false', 'Whether the checkbox is disabled'],
  ['label', 'string', "''", 'Label text to display next to the checkbox'],
  ['description', 'string', "''", 'Help text under the label; linked with aria-describedby'],
  ['error', 'string', "''", 'Error message; turns the box border red, sets aria-invalid and shows the message below'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Box size: 20px / 24px / 28px'],
  ['onChange', 'function', 'undefined', 'Called with the next checked boolean'],
  ['value', 'string', 'undefined', 'Option value; required when used inside a CheckboxGroup'],
  ['name', 'string', 'undefined', 'Native input name (inherited from the group when grouped)'],
  ['id', 'string', 'auto-generated', 'Custom ID for the checkbox input'],
  ['className', 'string', "''", 'Additional CSS classes'],
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

const groupRows = [
  ['value', 'string[]', '[]', 'Array of the checked option values'],
  ['onChange', 'function', 'undefined', 'Called with the next array of values'],
  ['options', '{ value, label, description?, disabled? }[]', 'undefined', 'Render options from data, or nest <Checkbox value="..."> children instead'],
  ['label', 'string', "''", 'Group label; the group is announced with it'],
  ['description', 'string', "''", 'Help text under the group label'],
  ['error', 'string', "''", 'Group error message; marks every checkbox invalid'],
  ['required', 'boolean', 'false', 'Adds a red asterisk to the label (hidden from screen readers)'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Size applied to every checkbox in the group'],
  ['disabled', 'boolean', 'false', 'Disables every checkbox in the group'],
  ['name', 'string', 'auto-generated', 'Shared native input name'],
];

export default function CheckboxPage() {
  const [terms, setTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [plan, setPlan] = useState(['email']);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Checkbox</h1>
          <p className="text-xl text-ink-muted">
            A customizable checkbox component for binary choices and multi-select options.
          </p>
        </div>

        {/* Import */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Checkbox from './components/Checkbox';`} />
        </section>

        {/* States */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">States</h2>
          <p className="text-ink-muted mb-6">
            Unchecked, checked, indeterminate and disabled, plus an error state.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-col gap-4">
              <Checkbox label="Default (unchecked)" checked={false} onChange={() => {}} />
              <Checkbox label="Checked" checked={true} onChange={() => {}} />
              <Checkbox label="Disabled (unchecked)" checked={false} disabled onChange={() => {}} />
              <Checkbox label="Disabled (checked)" checked={true} disabled onChange={() => {}} />
            </div>
          </div>
          <CodeBlock code={`<Checkbox label="Default" checked={false} onChange={handleChange} />
<Checkbox label="Checked" checked={true} onChange={handleChange} />
<Checkbox label="Disabled" disabled checked={false} onChange={handleChange} />
<Checkbox label="Disabled" disabled checked={true} onChange={handleChange} />`} />
        </section>

        {/* With Label */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With Label</h2>
          <p className="text-ink-muted mb-6">
            Checkboxes can display optional labels that are clickable to toggle the state.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-col gap-4">
              <Checkbox
                label="I agree to the terms and conditions"
                checked={terms}
                onChange={setTerms}
              />
              <Checkbox
                label="Subscribe to newsletter"
                checked={newsletter}
                onChange={setNewsletter}
              />
            </div>
          </div>
          <CodeBlock code={`const [terms, setTerms] = useState(false);

<Checkbox
  label="I agree to the terms and conditions"
  checked={terms}
  onChange={setTerms}
/>`} />
        </section>

        {/* Checkbox Group */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Checkbox Group</h2>
          <p className="text-ink-muted mb-6">
            Multiple checkboxes can be grouped together for multi-select functionality.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-ink-muted">Notification Preferences</p>
              <div className="flex flex-col gap-3 pl-4">
                <Checkbox
                  label="Email notifications"
                  checked={notifications.email}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
                <Checkbox
                  label="SMS notifications"
                  checked={notifications.sms}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, sms: checked })
                  }
                />
                <Checkbox
                  label="Push notifications"
                  checked={notifications.push}
                  onChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>
            </div>
          </div>
          <CodeBlock code={`const [notifications, setNotifications] = useState({
  email: true,
  sms: false,
  push: true,
});

<Checkbox
  label="Email notifications"
  checked={notifications.email}
  onChange={(checked) =>
    setNotifications({ ...notifications, email: checked })
  }
/>
<Checkbox
  label="SMS notifications"
  checked={notifications.sms}
  onChange={(checked) =>
    setNotifications({ ...notifications, sms: checked })
  }
/>`} />
        </section>

        {/* Without Label */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Without Label</h2>
          <p className="text-ink-muted mb-6">
            Checkboxes can be used without labels for compact layouts or table views.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex gap-6">
              <Checkbox checked={false} onChange={() => {}} />
              <Checkbox checked={true} onChange={() => {}} />
              <Checkbox checked={false} disabled onChange={() => {}} />
            </div>
          </div>
          <CodeBlock code={`<Checkbox checked={false} onChange={handleChange} />
<Checkbox checked={true} onChange={handleChange} />`} />
        </section>

        {/* Sizes, indeterminate, description, error */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sizes, indeterminate, description &amp; error</h2>
          <p className="text-ink-muted mb-6">
            Three sizes, an indeterminate state for "select all" parents, help text, and an error message.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-6">
                <Checkbox size="sm" label="Small" checked onChange={() => {}} />
                <Checkbox size="md" label="Medium" checked onChange={() => {}} />
                <Checkbox size="lg" label="Large" checked onChange={() => {}} />
              </div>
              <Checkbox label="Select all" indeterminate onChange={() => {}} />
              <Checkbox
                label="Email me product updates"
                description="At most one email a month."
                checked={newsletter}
                onChange={setNewsletter}
              />
              <Checkbox
                label="I agree to the terms"
                error="You must accept the terms to continue."
                checked={false}
                onChange={() => {}}
              />
            </div>
          </div>
          <CodeBlock code={`<Checkbox size="lg" label="Large" checked onChange={handleChange} />
<Checkbox label="Select all" indeterminate onChange={handleChange} />
<Checkbox label="Email me" description="At most one email a month." ... />
<Checkbox label="I agree" error="You must accept the terms." ... />`} />
        </section>

        {/* CheckboxGroup component */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">CheckboxGroup</h2>
          <p className="text-ink-muted mb-6">
            <code className="text-sm bg-surface-muted px-1 rounded">CheckboxGroup</code> owns an array value, a shared label, description and error, and passes size and disabled to every checkbox.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4 max-w-sm">
            <CheckboxGroup
              label="Notify me by"
              description="Choose any that apply."
              required
              value={plan}
              onChange={setPlan}
              options={[
                { value: 'email', label: 'Email' },
                { value: 'sms', label: 'SMS', description: 'Carrier rates may apply.' },
                { value: 'push', label: 'Push', disabled: true },
              ]}
            />
          </div>
          <CodeBlock code={`import Checkbox, { CheckboxGroup } from './components/Checkbox';

<CheckboxGroup label="Notify me by" required value={plan} onChange={setPlan}
  options={[
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS', description: 'Carrier rates may apply.' },
    { value: 'push', label: 'Push', disabled: true },
  ]} />`} />
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden mt-6">
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
                  {groupRows.map(([prop, type, def, desc]) => (
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
          </div>
        </section>

        {/* Props Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Props</h2>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <PropsTable />
          </div>
        </section>

        {/* Usage Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
          <p className="text-ink-muted mb-6">
            Here's a complete example showing how to use the Checkbox component in a form.
          </p>
          <CodeBlock code={`import { useState } from 'react';
import Checkbox from './components/Checkbox';

function SignupForm() {
  const [formData, setFormData] = useState({
    acceptTerms: false,
    subscribeNewsletter: false,
    enableNotifications: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Checkbox
        label="I accept the terms and conditions"
        checked={formData.acceptTerms}
        onChange={(checked) =>
          setFormData({ ...formData, acceptTerms: checked })
        }
      />
      <Checkbox
        label="Subscribe to our newsletter"
        checked={formData.subscribeNewsletter}
        onChange={(checked) =>
          setFormData({ ...formData, subscribeNewsletter: checked })
        }
      />
      <Checkbox
        label="Enable email notifications"
        checked={formData.enableNotifications}
        onChange={(checked) =>
          setFormData({ ...formData, enableNotifications: checked })
        }
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}`} />
        </section>
      </div>
    </div>
  );
}
