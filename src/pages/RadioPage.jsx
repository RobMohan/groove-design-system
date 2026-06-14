import React, { useState } from 'react';
import Radio from '../components/Radio';

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
          <td className="py-3 px-4">Whether the radio button is selected</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">disabled</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">boolean</td>
          <td className="py-3 px-4 font-mono text-xs">false</td>
          <td className="py-3 px-4">Whether the radio button is disabled</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">label</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">''</td>
          <td className="py-3 px-4">Label text to display next to the radio button</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">name</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Name attribute for grouping radio buttons</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">value</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Value of the radio button</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">onChange</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">function</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Callback when radio button is selected</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">id</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">auto-generated</td>
          <td className="py-3 px-4">Custom ID for the radio input</td>
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

export default function RadioPage() {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [deliverySpeed, setDeliverySpeed] = useState('standard');
  const [theme, setTheme] = useState('light');

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Radio Button</h1>
          <p className="text-xl text-ink-muted">
            A radio button component for selecting a single option from a group of choices.
          </p>
        </div>

        {/* Import */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Radio from './components/Radio';`} />
        </section>

        {/* States */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">States</h2>
          <p className="text-ink-muted mb-6">
            The Radio component has three states: default, selected, and inactive (disabled).
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-col gap-4">
              <Radio label="Default (unselected)" name="demo1" checked={false} onChange={() => {}} />
              <Radio label="Selected" name="demo2" checked={true} onChange={() => {}} />
              <Radio label="Disabled (unselected)" name="demo3" checked={false} disabled onChange={() => {}} />
              <Radio label="Disabled (selected)" name="demo4" checked={true} disabled onChange={() => {}} />
            </div>
          </div>
          <CodeBlock code={`<Radio label="Default" name="demo" checked={false} onChange={handleChange} />
<Radio label="Selected" name="demo" checked={true} onChange={handleChange} />
<Radio label="Disabled" name="demo" disabled checked={false} onChange={handleChange} />
<Radio label="Disabled" name="demo" disabled checked={true} onChange={handleChange} />`} />
        </section>

        {/* Radio Group */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Radio Group</h2>
          <p className="text-ink-muted mb-6">
            Radio buttons should be grouped together using the same name attribute to ensure only one can be selected.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-ink-muted">Payment Method</p>
              <div className="flex flex-col gap-3 pl-4">
                <Radio
                  label="Credit Card"
                  name="payment"
                  value="credit-card"
                  checked={paymentMethod === 'credit-card'}
                  onChange={setPaymentMethod}
                />
                <Radio
                  label="PayPal"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={setPaymentMethod}
                />
                <Radio
                  label="Bank Transfer"
                  name="payment"
                  value="bank-transfer"
                  checked={paymentMethod === 'bank-transfer'}
                  onChange={setPaymentMethod}
                />
              </div>
            </div>
          </div>
          <CodeBlock code={`const [paymentMethod, setPaymentMethod] = useState('credit-card');

<Radio
  label="Credit Card"
  name="payment"
  value="credit-card"
  checked={paymentMethod === 'credit-card'}
  onChange={setPaymentMethod}
/>
<Radio
  label="PayPal"
  name="payment"
  value="paypal"
  checked={paymentMethod === 'paypal'}
  onChange={setPaymentMethod}
/>
<Radio
  label="Bank Transfer"
  name="payment"
  value="bank-transfer"
  checked={paymentMethod === 'bank-transfer'}
  onChange={setPaymentMethod}
/>`} />
        </section>

        {/* Multiple Groups */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Multiple Groups</h2>
          <p className="text-ink-muted mb-6">
            You can have multiple independent radio groups on the same page by using different name attributes.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-ink-muted">Delivery Speed</p>
                <div className="flex flex-col gap-3 pl-4">
                  <Radio
                    label="Standard (5-7 days)"
                    name="delivery"
                    value="standard"
                    checked={deliverySpeed === 'standard'}
                    onChange={setDeliverySpeed}
                  />
                  <Radio
                    label="Express (2-3 days)"
                    name="delivery"
                    value="express"
                    checked={deliverySpeed === 'express'}
                    onChange={setDeliverySpeed}
                  />
                  <Radio
                    label="Overnight"
                    name="delivery"
                    value="overnight"
                    checked={deliverySpeed === 'overnight'}
                    onChange={setDeliverySpeed}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-ink-muted">Theme Preference</p>
                <div className="flex flex-col gap-3 pl-4">
                  <Radio
                    label="Light"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={setTheme}
                  />
                  <Radio
                    label="Dark"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={setTheme}
                  />
                  <Radio
                    label="System"
                    name="theme"
                    value="system"
                    checked={theme === 'system'}
                    onChange={setTheme}
                  />
                </div>
              </div>
            </div>
          </div>
          <CodeBlock code={`const [deliverySpeed, setDeliverySpeed] = useState('standard');
const [theme, setTheme] = useState('light');

// Delivery options (name="delivery")
<Radio
  label="Standard"
  name="delivery"
  value="standard"
  checked={deliverySpeed === 'standard'}
  onChange={setDeliverySpeed}
/>

// Theme options (name="theme")
<Radio
  label="Light"
  name="theme"
  value="light"
  checked={theme === 'light'}
  onChange={setTheme}
/>`} />
        </section>

        {/* Without Label */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Without Label</h2>
          <p className="text-ink-muted mb-6">
            Radio buttons can be used without labels for compact layouts.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex gap-6">
              <Radio name="compact" value="1" checked={false} onChange={() => {}} />
              <Radio name="compact" value="2" checked={true} onChange={() => {}} />
              <Radio name="compact" value="3" checked={false} disabled onChange={() => {}} />
            </div>
          </div>
          <CodeBlock code={`<Radio name="compact" value="1" checked={false} onChange={handleChange} />
<Radio name="compact" value="2" checked={true} onChange={handleChange} />`} />
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
            Here's a complete example showing how to use the Radio component in a settings form.
          </p>
          <CodeBlock code={`import { useState } from 'react';
import Radio from './components/Radio';

function SettingsForm() {
  const [settings, setSettings] = useState({
    notifications: 'all',
    privacy: 'public',
    language: 'en',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings saved:', settings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Notification Frequency</h3>
        <div className="space-y-2">
          <Radio
            label="All notifications"
            name="notifications"
            value="all"
            checked={settings.notifications === 'all'}
            onChange={(value) =>
              setSettings({ ...settings, notifications: value })
            }
          />
          <Radio
            label="Important only"
            name="notifications"
            value="important"
            checked={settings.notifications === 'important'}
            onChange={(value) =>
              setSettings({ ...settings, notifications: value })
            }
          />
          <Radio
            label="None"
            name="notifications"
            value="none"
            checked={settings.notifications === 'none'}
            onChange={(value) =>
              setSettings({ ...settings, notifications: value })
            }
          />
        </div>
      </div>

      <button type="submit">Save Settings</button>
    </form>
  );
}`} />
        </section>
      </div>
    </div>
  );
}
