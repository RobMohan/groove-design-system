import React, { useState } from 'react';
import Toggle from '../components/Toggle';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const rows = [
  ['checked', 'boolean', 'false', 'Whether the toggle is on (sets aria-checked on the switch)'],
  ['disabled', 'boolean', 'false', 'Whether the toggle is disabled'],
  ['label', 'string', "''", 'Label text next to the switch; clicking it toggles'],
  ['description', 'string', "''", 'Help text under the label; linked with aria-describedby'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Track size: 36x20 / 52x28 / 64x36'],
  ['labelPosition', "'left' | 'right'", "'right'", 'Which side of the switch the label sits on'],
  ['onChange', 'function', 'undefined', 'Called with the next checked boolean'],
  ['id', 'string', 'auto-generated', 'Custom ID for the switch button'],
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

export default function TogglePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [settings, setSettings] = useState({
    autoSave: true,
    spellCheck: false,
    showLineNumbers: true,
    autoFormat: true,
  });

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Toggle</h1>
          <p className="text-xl text-ink-muted">
            A toggle switch component for binary on/off settings and feature flags.
          </p>
        </div>

        {/* Import */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Toggle from './components/Toggle';`} />
        </section>

        {/* States */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">States</h2>
          <p className="text-ink-muted mb-6">
            Off (default), on, and disabled, with a visible focus ring.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-col gap-4">
              <Toggle label="Off (default)" checked={false} onChange={() => {}} />
              <Toggle label="On" checked={true} onChange={() => {}} />
              <Toggle label="Disabled (off)" checked={false} disabled onChange={() => {}} />
              <Toggle label="Disabled (on)" checked={true} disabled onChange={() => {}} />
            </div>
          </div>
          <CodeBlock code={`<Toggle label="Off" checked={false} onChange={handleChange} />
<Toggle label="On" checked={true} onChange={handleChange} />
<Toggle label="Disabled" disabled checked={false} onChange={handleChange} />
<Toggle label="Disabled" disabled checked={true} onChange={handleChange} />`} />
        </section>

        {/* With Label */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With Label</h2>
          <p className="text-ink-muted mb-6">
            Toggles can display optional labels that are clickable to toggle the state.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-col gap-4">
              <Toggle
                label="Enable dark mode"
                checked={darkMode}
                onChange={setDarkMode}
              />
              <Toggle
                label="Enable notifications"
                checked={notifications}
                onChange={setNotifications}
              />
            </div>
          </div>
          <CodeBlock code={`const [darkMode, setDarkMode] = useState(false);

<Toggle
  label="Enable dark mode"
  checked={darkMode}
  onChange={setDarkMode}
/>`} />
        </section>

        {/* Settings Panel */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Settings Panel</h2>
          <p className="text-ink-muted mb-6">
            Toggles are perfect for settings panels where users can enable or disable features.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-ink-muted">Editor Preferences</p>
              <div className="space-y-4 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink">Auto-save</p>
                    <p className="text-sm text-ink-muted">Automatically save changes</p>
                  </div>
                  <Toggle
                    checked={settings.autoSave}
                    onChange={(checked) =>
                      setSettings({ ...settings, autoSave: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink">Spell check</p>
                    <p className="text-sm text-ink-muted">Check spelling as you type</p>
                  </div>
                  <Toggle
                    checked={settings.spellCheck}
                    onChange={(checked) =>
                      setSettings({ ...settings, spellCheck: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink">Show line numbers</p>
                    <p className="text-sm text-ink-muted">Display line numbers in editor</p>
                  </div>
                  <Toggle
                    checked={settings.showLineNumbers}
                    onChange={(checked) =>
                      setSettings({ ...settings, showLineNumbers: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink">Auto-format</p>
                    <p className="text-sm text-ink-muted">Format code on save</p>
                  </div>
                  <Toggle
                    checked={settings.autoFormat}
                    onChange={(checked) =>
                      setSettings({ ...settings, autoFormat: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <CodeBlock code={`const [settings, setSettings] = useState({
  autoSave: true,
  spellCheck: false,
  showLineNumbers: true,
});

<div className="flex items-center justify-between">
  <div>
    <p className="font-medium">Auto-save</p>
    <p className="text-sm text-gray-600">Automatically save changes</p>
  </div>
  <Toggle
    checked={settings.autoSave}
    onChange={(checked) =>
      setSettings({ ...settings, autoSave: checked })
    }
  />
</div>`} />
        </section>

        {/* Without Label */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Without Label</h2>
          <p className="text-ink-muted mb-6">
            Toggles can be used without labels for compact layouts or when the context is clear.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex gap-6">
              <Toggle checked={false} onChange={() => {}} />
              <Toggle checked={true} onChange={() => {}} />
              <Toggle checked={false} disabled onChange={() => {}} />
            </div>
          </div>
          <CodeBlock code={`<Toggle checked={false} onChange={handleChange} />
<Toggle checked={true} onChange={handleChange} />`} />
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8">
            <div className="space-y-4 text-ink-muted">
              <div>
                <p className="font-semibold text-ink mb-2">When to use toggles vs checkboxes:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    <strong>Use toggles</strong> for settings that take effect immediately (e.g., "Enable dark mode")
                  </li>
                  <li>
                    <strong>Use checkboxes</strong> for options that require submission or confirmation (e.g., form selections)
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-ink mb-2">Labeling:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Use clear, descriptive labels that explain what will happen when toggled</li>
                  <li>Phrase labels as positive actions (e.g., "Enable notifications" instead of "Disable notifications")</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-ink mb-2">Immediate feedback:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Toggles should provide immediate visual feedback when state changes</li>
                  <li>Consider adding toast notifications for important state changes</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Sizes, description, label position */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sizes, description &amp; label position</h2>
          <p className="text-ink-muted mb-6">
            Three sizes, optional help text, and the label can sit on either side of the switch.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-6">
                <Toggle size="sm" label="Small" checked onChange={() => {}} />
                <Toggle size="md" label="Medium" checked onChange={() => {}} />
                <Toggle size="lg" label="Large" checked onChange={() => {}} />
              </div>
              <Toggle
                label="Marketing emails"
                description="Product news, at most once a month."
                checked={notifications}
                onChange={setNotifications}
              />
              <Toggle label="Label on the left" labelPosition="left" checked onChange={() => {}} />
            </div>
          </div>
          <CodeBlock code={`<Toggle size="lg" label="Large" checked onChange={handleChange} />
<Toggle label="Marketing emails" description="Product news, at most once a month." ... />
<Toggle label="Label on the left" labelPosition="left" ... />`} />
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
            Here's a complete example showing how to use the Toggle component in a preferences panel.
          </p>
          <CodeBlock code={`import { useState } from 'react';
import Toggle from './components/Toggle';

function PreferencesPanel() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    twoFactorAuth: true,
  });

  const handleToggle = (key, value) => {
    setPreferences({ ...preferences, [key]: value });

    // You might want to save to API here
    console.log(\`\${key} set to \${value}\`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Account Preferences</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-gray-600">
              Receive email updates about your account
            </p>
          </div>
          <Toggle
            checked={preferences.emailNotifications}
            onChange={(checked) =>
              handleToggle('emailNotifications', checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-gray-600">
              Add an extra layer of security
            </p>
          </div>
          <Toggle
            checked={preferences.twoFactorAuth}
            onChange={(checked) =>
              handleToggle('twoFactorAuth', checked)
            }
          />
        </div>
      </div>
    </div>
  );
}`} />
        </section>
      </div>
    </div>
  );
}
