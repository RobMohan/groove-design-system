import React from 'react';
import { Keyboard, Eye, Volume2, MousePointer2 } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const Principle = ({ icon: Icon, title, children }) => (
  <div className="bg-surface-raised rounded-card border border-line p-6">
    <div className="flex items-center gap-3 mb-3">
      <span className="flex items-center justify-center w-10 h-10 rounded-pill bg-primary/10 text-primary">
        <Icon size={20} />
      </span>
      <h3 className="font-semibold text-ink">{title}</h3>
    </div>
    <p className="text-sm text-ink-muted">{children}</p>
  </div>
);

const notes = [
  ['Modal / Drawer', 'Focus is trapped while open and restored to the trigger on close; Escape and scrim dismiss.'],
  ['Menu / Combobox / Select', 'Full arrow-key navigation, aria-activedescendant, listboxes portal above modals.'],
  ['Tabs', 'tablist / tab / tabpanel roles, aria-selected, and arrow-key navigation.'],
  ['Tooltip', 'Opens on focus as well as hover; wired to its trigger via aria-describedby.'],
  ['Toggle', 'Exposes role="switch" with aria-checked.'],
  ['Inputs / Field', 'Labels tied by id; errors linked via aria-describedby with aria-invalid.'],
  ['Slider / Date Picker', 'role="slider" / role="grid" with complete keyboard models.'],
];

export default function AccessibilityPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Accessibility</h1>
          <p className="text-xl text-ink-muted">
            Groove targets <strong>WCAG 2.2 Level AA</strong>. Accessibility is built into every component —
            keyboard support, focus management, semantic roles, and sufficient contrast are the default, not an add-on.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Principles</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Principle icon={Keyboard} title="Keyboard first">
              Everything works without a mouse. Tab reaches every control; Arrow/Enter/Escape behave as expected.
            </Principle>
            <Principle icon={Eye} title="Visible focus">
              A consistent, theme-aware focus ring (<code>ring-focus</code>) marks the focused element in both themes.
            </Principle>
            <Principle icon={Volume2} title="Announced to AT">
              Semantic roles and ARIA state keep screen readers in sync with what's on screen.
            </Principle>
            <Principle icon={MousePointer2} title="Forgiving targets">
              Interactive controls meet the 44×44px minimum target size and never rely on color alone.
            </Principle>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Color &amp; contrast</h2>
          <p className="text-ink-muted mb-4">
            Meet these ratios against the background the content actually sits on — verified in both light and dark themes.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 px-4 font-semibold text-sm">Content</th>
                  <th className="py-3 px-4 font-semibold text-sm">Minimum ratio</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-line"><td className="py-3 px-4">Body text (&lt; 18px)</td><td className="py-3 px-4 font-mono">4.5 : 1</td></tr>
                <tr className="border-b border-line"><td className="py-3 px-4">Large text (≥ 18px bold / 24px)</td><td className="py-3 px-4 font-mono">3 : 1</td></tr>
                <tr><td className="py-3 px-4">UI borders, icons, focus rings</td><td className="py-3 px-4 font-mono">3 : 1</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Focus &amp; reduced motion</h2>
          <p className="text-ink-muted mb-4">
            Use the semantic focus token on every interactive element, and respect users who prefer less motion.
          </p>
          <CodeBlock code={`/* Consistent, theme-aware focus ring */
className="focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"

/* Honor prefers-reduced-motion */
<div className="motion-reduce:transition-none motion-reduce:animate-none" />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Per-component notes</h2>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 px-4 font-semibold text-sm">Component</th>
                  <th className="py-3 px-4 font-semibold text-sm">Built-in behavior</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {notes.map(([c, n]) => (
                  <tr key={c} className="border-b border-line last:border-0">
                    <td className="py-3 px-4 font-medium text-ink whitespace-nowrap">{c}</td>
                    <td className="py-3 px-4 text-ink-muted">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Testing checklist</h2>
          <div className="bg-surface-raised rounded-card border border-line p-6">
            <ul className="space-y-2 text-ink-muted">
              <li className="flex gap-2"><span className="text-positive">✓</span> Tab through the whole flow — order is logical and focus is always visible.</li>
              <li className="flex gap-2"><span className="text-positive">✓</span> Operate every control with the keyboard only.</li>
              <li className="flex gap-2"><span className="text-positive">✓</span> Check contrast in both light and dark themes.</li>
              <li className="flex gap-2"><span className="text-positive">✓</span> Verify labels and errors are announced by a screen reader.</li>
              <li className="flex gap-2"><span className="text-positive">✓</span> Confirm nothing essential relies on color alone.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
