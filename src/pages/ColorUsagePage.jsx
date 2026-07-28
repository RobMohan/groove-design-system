import React from 'react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const roles = [
  ['primary', 'bg-primary', 'Primary actions, active/selected states, focus, links.'],
  ['secondary', 'bg-secondary', 'Complementary emphasis where primary would compete.'],
  ['positive', 'bg-positive', 'Success, confirmation, completed states.'],
  ['warning', 'bg-warning', 'Caution — proceed carefully; approaching a limit.'],
  ['destructive', 'bg-destructive', 'Errors and irreversible or dangerous actions.'],
];

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

export default function ColorUsagePage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Color Usage</h1>
          <p className="text-xl text-ink-muted">
            How to apply Groove's color roles with meaning and contrast. For the raw token values, see{' '}
            <span className="text-primary">Color Tokens</span>; this page is about <em>when</em> to reach for each.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Semantic roles</h2>
          <p className="text-ink-muted mb-6">
            Color carries meaning. Reserve each role for its purpose so users learn to trust it.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 px-4 font-semibold text-sm">Role</th>
                  <th className="py-3 px-4 font-semibold text-sm">Swatch</th>
                  <th className="py-3 px-4 font-semibold text-sm">Use for</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {roles.map(([name, bg, use]) => (
                  <tr key={name} className="border-b border-line last:border-0">
                    <td className="py-3 px-4 font-mono text-xs text-ink">{name}</td>
                    <td className="py-3 px-4"><span className={`inline-block w-10 h-6 rounded ${bg}`} /></td>
                    <td className="py-3 px-4 text-ink-muted">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Text on surfaces</h2>
          <p className="text-ink-muted mb-6">
            Pair ink tokens with surface tokens so contrast holds automatically in both themes.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-card border border-line bg-surface p-5">
              <p className="text-ink font-medium">bg-surface</p>
              <p className="text-ink-muted text-sm mt-1">text-ink / text-ink-muted</p>
            </div>
            <div className="rounded-card border border-line bg-surface-raised p-5">
              <p className="text-ink font-medium">bg-surface-raised</p>
              <p className="text-ink-muted text-sm mt-1">Cards, panels, menus</p>
            </div>
            <div className="rounded-card bg-surface-inverse p-5">
              <p className="text-ink-inverse font-medium">bg-surface-inverse</p>
              <p className="text-ink-inverse/70 text-sm mt-1">text-ink-inverse</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Contrast</h2>
          <p className="text-ink-muted mb-4">
            Aim for <strong>4.5:1</strong> for body text and <strong>3:1</strong> for large text and UI. Never
            let color be the only signal — pair it with an icon, label, or shape.
          </p>
          <CodeBlock code={`{/* Meaning comes from icon + text, reinforced by color */}
<Alert type="error" icon={AlertCircle}>Payment failed</Alert>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Dark mode</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <DoCard>
              <li>Use semantic tokens (surface / ink / line) so both themes adapt.</li>
              <li>Re-check contrast in dark mode — light-mode ratios don't transfer.</li>
              <li>Keep brand roles consistent across themes.</li>
            </DoCard>
            <DontCard>
              <li>Don't hard-code <code>gray-*</code> or hex values in components.</li>
              <li>Don't use pure black/white surfaces — use the surface tokens.</li>
              <li>Don't convey status with color alone.</li>
            </DontCard>
          </div>
        </section>
      </div>
    </div>
  );
}
