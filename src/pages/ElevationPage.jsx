import React from 'react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const ElevationCard = ({ token, className, usage }) => (
  <div className="flex flex-col items-center gap-4 p-8 bg-gray-50 rounded-lg border border-gray-200">
    <div className={`w-full h-24 bg-white rounded-card flex items-center justify-center ${className}`}>
      <span className="font-mono text-sm text-gray-700">{className}</span>
    </div>
    <div className="text-center">
      <p className="font-semibold text-gray-900">{token}</p>
      <p className="text-sm text-gray-500 mt-1">{usage}</p>
    </div>
  </div>
);

export default function ElevationPage() {
  const levels = [
    { token: 'Level 1', className: 'shadow-elevation-1', usage: 'Subtle separation — inputs, list rows' },
    { token: 'Level 2', className: 'shadow-elevation-2', usage: 'Resting cards and panels' },
    { token: 'Level 3', className: 'shadow-elevation-3', usage: 'Hovered cards, dropdowns' },
    { token: 'Level 4', className: 'shadow-elevation-4', usage: 'Popovers, menus' },
    { token: 'Level 5', className: 'shadow-elevation-5', usage: 'Modals and dialogs' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Elevation</h1>
          <p className="text-xl text-gray-600">
            A five-step shadow scale that conveys depth and layering across surfaces.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-600 mb-4">
            Elevation communicates how close an element is to the user. The higher the level,
            the more an element appears to float above the page. Use the lowest elevation that
            still creates the needed separation.
          </p>
          <CodeBlock code={`<div className="shadow-elevation-2 rounded-card">Resting card</div>
<div className="shadow-elevation-5 rounded-modal">Dialog</div>`} />
        </section>

        {/* Scale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Scale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((l) => (
              <ElevationCard key={l.token} {...l} />
            ))}
          </div>
        </section>

        {/* Guidelines */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Usage Guidelines</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Match elevation to interaction</h3>
              <p className="text-gray-600">Transient surfaces (menus, popovers, modals) sit higher than persistent ones (cards, inputs).</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Elevate on hover</h3>
              <p className="text-gray-600">Lifting an interactive card from Level 2 to Level 3 on hover signals it can be acted on.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Don't over-stack</h3>
              <p className="text-gray-600">Too many competing shadows flatten the hierarchy. Reserve the highest levels for true overlays.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
