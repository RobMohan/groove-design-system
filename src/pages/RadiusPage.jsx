import React from 'react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const RadiusCard = ({ token, className, value, usage }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
    <div className={`w-20 h-20 bg-primary/15 border-2 border-primary flex-shrink-0 ${className}`} />
    <div className="flex-1">
      <p className="font-mono font-semibold text-gray-900">{className}</p>
      <p className="text-sm text-gray-600 font-mono">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{usage}</p>
    </div>
  </div>
);

export default function RadiusPage() {
  const semantic = [
    { className: 'rounded-control', value: '0.5rem / 8px', usage: 'Buttons, inputs, small controls' },
    { className: 'rounded-card', value: '0.75rem / 12px', usage: 'Cards and panels' },
    { className: 'rounded-modal', value: '1rem / 16px', usage: 'Dialogs and large surfaces' },
    { className: 'rounded-pill', value: '9999px', usage: 'Tags, avatars, fully-rounded chips' },
  ];

  const base = [
    { className: 'rounded-none', value: '0px', usage: 'Flush edges' },
    { className: 'rounded-sm', value: '0.125rem / 2px', usage: 'Subtle softening' },
    { className: 'rounded', value: '0.25rem / 4px', usage: 'Default small radius' },
    { className: 'rounded-lg', value: '0.5rem / 8px', usage: 'General-purpose' },
    { className: 'rounded-full', value: '9999px', usage: 'Circles and pills' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Radius</h1>
          <p className="text-xl text-gray-600">
            Corner-radius tokens that keep component shapes consistent and on-brand.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-600 mb-4">
            Groove defines semantic radius tokens named for their use case, so a control always
            looks like a control and a card always looks like a card — regardless of where it appears.
          </p>
          <CodeBlock code={`<button className="rounded-control">Save</button>
<div className="rounded-card">Card</div>
<div className="rounded-modal">Dialog</div>`} />
        </section>

        {/* Semantic tokens */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Semantic Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {semantic.map((r) => (
              <RadiusCard key={r.className} {...r} />
            ))}
          </div>
        </section>

        {/* Base scale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Base Scale</h2>
          <p className="text-gray-600 mb-6">
            The underlying Tailwind radii remain available for one-off needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {base.map((r) => (
              <RadiusCard key={r.className} {...r} />
            ))}
          </div>
        </section>

        {/* Guidelines */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Usage Guidelines</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Prefer semantic tokens</h3>
              <p className="text-gray-600">Reach for <span className="font-mono text-sm">rounded-control</span>, <span className="font-mono text-sm">rounded-card</span>, and <span className="font-mono text-sm">rounded-modal</span> first so shapes stay consistent if the scale is ever retuned.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Nest smaller inside larger</h3>
              <p className="text-gray-600">An element inside a rounded container should use an equal or smaller radius to avoid corners poking out.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
