import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Boxes, BookOpen, Rocket, Check, ArrowRight } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const StructureCard = ({ icon: Icon, title, children }) => (
  <div className="bg-surface-raised rounded-lg border border-line p-6">
    <div className="flex items-center gap-3 mb-3">
      <span className="flex items-center justify-center w-10 h-10 rounded-control bg-primary/10 text-primary">
        <Icon size={20} />
      </span>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
    </div>
    <div className="text-ink-muted space-y-2">{children}</div>
  </div>
);

export default function OverviewPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Getting Started</h1>
          <p className="text-xl text-ink-muted">
            Groove is a React design system for building consistent, accessible product interfaces —
            a set of design foundations, ready-made components, and the guidelines that hold them together.
          </p>
        </div>

        {/* What is Groove */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What is Groove?</h2>
          <p className="text-ink-muted mb-4">
            Groove pairs a small, deliberate set of <span className="font-semibold text-ink">design tokens</span> —
            color, typography, spacing, elevation, and radius — with a library of{' '}
            <span className="font-semibold text-ink">React components</span> built on top of them. Everything is
            styled with semantic, theme-aware Tailwind tokens, so the same components adapt automatically to light
            and dark themes without one-off overrides.
          </p>
          <p className="text-ink-muted">
            The goal is consistency without friction: reach for a component instead of rebuilding one, and lean on
            the tokens instead of hard-coded values, so every screen feels like part of the same product.
          </p>
        </section>

        {/* When to use it */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">When to use Groove</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-positive/5 border border-positive rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-ink">
                <span className="text-positive text-xl leading-none">✓</span> Reach for Groove when
              </h3>
              <ul className="space-y-3 text-ink-muted">
                <li className="flex gap-2"><span className="text-positive" aria-hidden="true">✓</span><span>You're building an internal tool or product UI and want a consistent, accessible baseline.</span></li>
                <li className="flex gap-2"><span className="text-positive" aria-hidden="true">✓</span><span>You need light and dark theming to work out of the box.</span></li>
                <li className="flex gap-2"><span className="text-positive" aria-hidden="true">✓</span><span>You want standard components (buttons, inputs, modals, tables) without reinventing behavior and a11y.</span></li>
              </ul>
            </div>
            <div className="bg-destructive/5 border border-destructive rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-ink">
                <span className="text-destructive text-xl leading-none">✗</span> Consider alternatives when
              </h3>
              <ul className="space-y-3 text-ink-muted">
                <li className="flex gap-2"><span className="text-destructive" aria-hidden="true">✗</span><span>You need a fully bespoke, art-directed marketing site with a unique visual language.</span></li>
                <li className="flex gap-2"><span className="text-destructive" aria-hidden="true">✗</span><span>Your project can't use React 18 or Tailwind CSS.</span></li>
                <li className="flex gap-2"><span className="text-destructive" aria-hidden="true">✗</span><span>You require a component not yet in the library — check Component Status first.</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* How it's structured */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">How Groove is structured</h2>
          <p className="text-ink-muted mb-6">
            The system is organized into three layers. Foundations define the raw design decisions, components apply
            them, and guides explain how to install, theme, and extend everything.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StructureCard icon={Palette} title="Foundations">
              <p>
                The design primitives every component is built from: <Link to="/color-tokens" className="text-primary hover:underline">Color Tokens</Link>,{' '}
                <Link to="/typography" className="text-primary hover:underline">Typography</Link>,{' '}
                <Link to="/spacing" className="text-primary hover:underline">Spacing</Link>,{' '}
                <Link to="/elevation" className="text-primary hover:underline">Elevation</Link>, and{' '}
                <Link to="/radius" className="text-primary hover:underline">Radius</Link>, plus Accessibility and Color Usage guidance.
              </p>
            </StructureCard>
            <StructureCard icon={Boxes} title="Components">
              <p>
                Ready-made, accessible React components — from <Link to="/button" className="text-primary hover:underline">Button</Link> and{' '}
                <Link to="/text-input" className="text-primary hover:underline">Text Input</Link> to{' '}
                <Link to="/modal" className="text-primary hover:underline">Modal</Link> and{' '}
                <Link to="/data-table" className="text-primary hover:underline">Data Table</Link>. Each documents its props, variants, and states.
              </p>
            </StructureCard>
            <StructureCard icon={BookOpen} title="Guides">
              <p>
                Practical how-tos: Installation &amp; Usage, Theming, Contributing, Changelog &amp; Versioning, and the
                live Component Status matrix.
              </p>
            </StructureCard>
          </div>
        </section>

        {/* First component in 5 minutes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Rocket size={24} className="text-primary" /> Your first component in 5 minutes
          </h2>
          <p className="text-ink-muted mb-6">
            Assuming you already have a React 18 + Tailwind project (see{' '}
            <Link to="/installation" className="text-primary hover:underline">Installation</Link> for the full setup),
            here's the shortest path from zero to a working, themed button.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-pill bg-primary text-white text-sm font-bold">1</span>
                Wrap your app with the Toast provider
              </h3>
              <p className="text-ink-muted mb-3">
                A single provider at the root enables toast notifications anywhere in the tree.
              </p>
              <CodeBlock code={`// main.jsx
import { ToastProvider } from './components/Toast';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <App />
  </ToastProvider>
);`} />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-pill bg-primary text-white text-sm font-bold">2</span>
                Import a component and use it
              </h3>
              <p className="text-ink-muted mb-3">
                Components are plain React — import, render, done. They're already styled with semantic tokens.
              </p>
              <CodeBlock code={`import Button from './components/Button';
import { Download } from 'lucide-react';

function Toolbar() {
  return (
    <div className="flex gap-3">
      <Button variant="primary" icon={Download}>Download</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  );
}`} />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-pill bg-primary text-white text-sm font-bold">3</span>
                Build with tokens, not raw values
              </h3>
              <p className="text-ink-muted mb-3">
                Compose layouts with the semantic tokens so your own markup themes alongside the components.
              </p>
              <CodeBlock code={`<div className="bg-surface-raised text-ink border border-line rounded-card p-6 shadow-elevation-2">
  <h2 className="text-2xl font-bold">Welcome</h2>
  <p className="text-ink-muted">This card is theme-aware in both light and dark modes.</p>
</div>`} />
            </div>
          </div>

          <div className="mt-6 bg-primary/5 border border-primary/40 rounded-lg p-6 flex items-start gap-3">
            <Check size={20} className="text-primary shrink-0 mt-0.5" />
            <p className="text-ink-muted">
              That's it. Because everything reads from semantic tokens, toggling the theme flips your whole UI with no
              extra work. Next, read <Link to="/installation" className="text-primary hover:underline font-medium">Installation &amp; Usage</Link>{' '}
              for the Tailwind wiring, or <Link to="/theming" className="text-primary hover:underline font-medium">Theming</Link> to customize the palette.
            </p>
          </div>
        </section>

        {/* Next steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Where to next</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { to: '/installation', label: 'Installation & Usage', desc: 'Set up dependencies, Tailwind, and providers.' },
              { to: '/theming', label: 'Theming', desc: 'Customize tokens and build dark mode.' },
              { to: '/accessibility', label: 'Accessibility', desc: 'Our WCAG 2.2 AA baseline and patterns.' },
              { to: '/status', label: 'Component Status', desc: 'See what is Stable vs. Beta.' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center justify-between bg-surface-raised rounded-lg border border-line p-5 hover:border-line-strong transition-colors"
              >
                <div>
                  <p className="font-semibold text-ink">{item.label}</p>
                  <p className="text-sm text-ink-muted">{item.desc}</p>
                </div>
                <ArrowRight size={18} className="text-ink-subtle group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
