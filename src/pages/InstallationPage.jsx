import React from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

export default function InstallationPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Installation &amp; Usage</h1>
          <p className="text-xl text-ink-muted">
            How to add Groove to a React project — dependencies, Tailwind wiring, providers, and importing components.
          </p>
        </div>

        {/* Status callout */}
        <section className="mb-12">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 flex items-start gap-3">
            <Info size={20} className="text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg mb-1 text-ink">Not yet on npm</h3>
              <p className="text-ink-muted">
                Groove is currently consumed by cloning or vendoring the repository into your app — it is not yet
                published to a registry. An npm release under the name <span className="font-mono font-semibold">groove-design-system</span> is
                planned. Snippets below use that intended package name; until it ships, import from your local copy
                (for example <span className="font-mono">./components/Button</span>).
              </p>
            </div>
          </div>
        </section>

        {/* Prerequisites */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
          <p className="text-ink-muted mb-4">
            Groove targets a modern React + Tailwind stack. Make sure your project provides the following peers:
          </p>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 px-4 font-semibold">Dependency</th>
                  <th className="py-3 px-4 font-semibold">Version</th>
                  <th className="py-3 px-4 font-semibold">Why</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-line">
                  <td className="py-3 px-4 font-mono">react</td>
                  <td className="py-3 px-4 font-mono text-ink-muted">^18.0.0</td>
                  <td className="py-3 px-4 text-ink-muted">Peer dependency — components are built for React 18.</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-3 px-4 font-mono">react-dom</td>
                  <td className="py-3 px-4 font-mono text-ink-muted">^18.0.0</td>
                  <td className="py-3 px-4 text-ink-muted">Peer dependency — portals power Modal, Menu, and Toast.</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-3 px-4 font-mono">tailwindcss</td>
                  <td className="py-3 px-4 font-mono text-ink-muted">^3.4.0</td>
                  <td className="py-3 px-4 text-ink-muted">All styling uses Tailwind utilities and the Groove token config.</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-3 px-4 font-mono">lucide-react</td>
                  <td className="py-3 px-4 font-mono text-ink-muted">^0.263.0</td>
                  <td className="py-3 px-4 text-ink-muted">Icon set used across components.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono">@tanstack/react-table</td>
                  <td className="py-3 px-4 font-mono text-ink-muted">^8.0.0</td>
                  <td className="py-3 px-4 text-ink-muted">Only required if you use the Data Table component.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Install */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Install</h2>
          <p className="text-ink-muted mb-3">
            <span className="font-semibold text-ink">Today (local / vendored):</span> clone the repository and install its dependencies.
          </p>
          <CodeBlock code={`git clone https://github.com/RobMohan/groove-design-system.git
cd groove-design-system
npm install`} />
          <p className="text-ink-muted mt-3 mb-3">
            Then copy the <span className="font-mono text-sm">src/components</span>, <span className="font-mono text-sm">tailwind.config.js</span> tokens,
            and <span className="font-mono text-sm">src/styles/global.css</span> into your app, or develop directly inside the repo.
          </p>
          <p className="text-ink-muted mb-3">
            <span className="font-semibold text-ink">Planned (published):</span> once released, installation will be a single command.
          </p>
          <CodeBlock code={`# planned — not yet available
npm install groove-design-system`} />
        </section>

        {/* Tailwind wiring */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Tailwind configuration</h2>
          <p className="text-ink-muted mb-4">
            Groove's look comes from an extended Tailwind theme: semantic color tokens backed by CSS variables, plus
            named radius and elevation scales. Add these to your <span className="font-mono text-sm">tailwind.config.js</span> so
            utilities like <span className="font-mono text-sm">bg-surface</span>, <span className="font-mono text-sm">text-ink</span>,
            and <span className="font-mono text-sm">rounded-card</span> resolve.
          </p>
          <CodeBlock code={`// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // dark theme is toggled by a .dark class on <html>
  theme: {
    extend: {
      colors: {
        // Brand scales (static)
        primary:     { DEFAULT: '#588ae0', hover: '#a3b9ed', pressed: '#30528a', disabled: '#B5AAC8' },
        secondary:   { DEFAULT: '#7c3aed', hover: '#9333ea', pressed: '#6b21a8', disabled: '#DDE4BA' },
        destructive: { DEFAULT: '#dc2626', hover: '#ef4444', pressed: '#991b1b', disabled: '#E89999' },
        positive:    { DEFAULT: '#16a34a', hover: '#22c55e', pressed: '#15803d', disabled: '#86efac' },
        warning:     { DEFAULT: '#d97706', hover: '#f59e0b', pressed: '#b45309', disabled: '#fcd34d' },
        // Semantic, theme-aware tokens (driven by CSS variables)
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          raised:  'rgb(var(--color-surface-raised) / <alpha-value>)',
          muted:   'rgb(var(--color-surface-muted) / <alpha-value>)',
        },
        ink:  {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          muted:   'rgb(var(--color-ink-muted) / <alpha-value>)',
          subtle:  'rgb(var(--color-ink-subtle) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--color-line) / <alpha-value>)',
          strong:  'rgb(var(--color-line-strong) / <alpha-value>)',
        },
        focus: 'rgb(var(--color-focus) / <alpha-value>)',
      },
      borderRadius: { control: '0.5rem', card: '0.75rem', modal: '1rem', pill: '9999px' },
    },
  },
};`} />
          <p className="text-ink-muted mt-4 mb-4">
            The semantic tokens read from CSS variables so a single class flips between light and dark. Import the
            stylesheet that defines them once, at your app entry:
          </p>
          <CodeBlock code={`// main.jsx
import './styles/global.css'; // defines --color-* tokens for :root and .dark`} />
          <p className="text-ink-muted mt-4">
            See <Link to="/theming" className="text-primary hover:underline">Theming</Link> for the full list of tokens
            and how to override them.
          </p>
        </section>

        {/* Provider setup */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Provider setup</h2>
          <p className="text-ink-muted mb-4">
            Most components are self-contained, but toasts need a provider at the root of your app. Wrap your tree in{' '}
            <span className="font-mono text-sm">&lt;ToastProvider&gt;</span> once — it renders a portal and exposes the{' '}
            <span className="font-mono text-sm">useToast()</span> hook everywhere below it.
          </p>
          <CodeBlock code={`// main.jsx
import ReactDOM from 'react-dom/client';
import { ToastProvider } from './components/Toast';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ToastProvider position="bottom-right">
    <App />
  </ToastProvider>
);`} />
          <p className="text-ink-muted mt-4 mb-3">
            Then trigger notifications from any component:
          </p>
          <CodeBlock code={`import { useToast } from './components/Toast';

function SaveButton() {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ variant: 'success', title: 'Saved', description: 'Your changes are live.' })}>
      Save
    </button>
  );
}`} />
        </section>

        {/* Importing components */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Importing components</h2>
          <p className="text-ink-muted mb-4">
            While working from a local copy, import components by relative path. Once the package is published, the
            same imports come from <span className="font-mono text-sm">groove-design-system</span>.
          </p>
          <CodeBlock code={`// Local copy (today)
import Button from './components/Button';
import { useToast } from './components/Toast';

// Published package (planned)
import { Button, useToast } from 'groove-design-system';`} />
          <p className="text-ink-muted mt-4">
            New to the system? Start with the{' '}
            <Link to="/overview" className="text-primary hover:underline">Getting Started</Link> overview, then browse the
            component pages in the sidebar.
          </p>
        </section>
      </div>
    </div>
  );
}
