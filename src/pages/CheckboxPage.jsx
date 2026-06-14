import React, { useState } from 'react';
import Checkbox from '../components/Checkbox';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

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
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">checked</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">boolean</td>
          <td className="py-3 px-4 font-mono text-xs">false</td>
          <td className="py-3 px-4">Whether the checkbox is checked</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">disabled</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">boolean</td>
          <td className="py-3 px-4 font-mono text-xs">false</td>
          <td className="py-3 px-4">Whether the checkbox is disabled</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">label</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">''</td>
          <td className="py-3 px-4">Label text to display next to the checkbox</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">onChange</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">function</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Callback when checkbox state changes</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">id</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">auto-generated</td>
          <td className="py-3 px-4">Custom ID for the checkbox input</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">className</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">''</td>
          <td className="py-3 px-4">Additional CSS classes</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function CheckboxPage() {
  const [terms, setTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
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
            The Checkbox component has three states: default, checked, and inactive (disabled).
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
