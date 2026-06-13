import React from 'react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const SpacingRow = ({ token, rem, px }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
    <div className="w-24 flex-shrink-0">
      <p className="font-mono font-semibold text-gray-900">{token}</p>
    </div>
    <div className="w-32 flex-shrink-0 text-sm text-gray-600 font-mono">
      {rem} / {px}px
    </div>
    <div className="flex-1">
      <div className="h-6 bg-primary rounded" style={{ width: `${px}px`, maxWidth: '100%' }} />
    </div>
  </div>
);

export default function SpacingPage() {
  const scale = [
    { token: '0', rem: '0rem', px: 0 },
    { token: '0.5', rem: '0.125rem', px: 2 },
    { token: '1', rem: '0.25rem', px: 4 },
    { token: '2', rem: '0.5rem', px: 8 },
    { token: '3', rem: '0.75rem', px: 12 },
    { token: '4', rem: '1rem', px: 16 },
    { token: '5', rem: '1.25rem', px: 20 },
    { token: '6', rem: '1.5rem', px: 24 },
    { token: '8', rem: '2rem', px: 32 },
    { token: '10', rem: '2.5rem', px: 40 },
    { token: '12', rem: '3rem', px: 48 },
    { token: '16', rem: '4rem', px: 64 },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Spacing</h1>
          <p className="text-xl text-gray-600">
            A consistent 4px-based spacing scale for margins, padding, and gaps across the system.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-600 mb-4">
            Spacing is built on a 4px base unit. Each step in the scale is a multiple of 4,
            which keeps layouts rhythmic and predictable. Use these tokens for padding (<span className="font-mono text-sm">p-*</span>),
            margin (<span className="font-mono text-sm">m-*</span>), and fl/grid gaps (<span className="font-mono text-sm">gap-*</span>).
          </p>
          <CodeBlock code={`<div className="p-4 gap-2">   {/* 16px padding, 8px gap */}
<div className="mt-6 mb-8">    {/* 24px top, 32px bottom */}`} />
        </section>

        {/* Scale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Scale</h2>
          <div className="space-y-3">
            {scale.map((s) => (
              <SpacingRow key={s.token} {...s} />
            ))}
          </div>
        </section>

        {/* Guidelines */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Usage Guidelines</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Component padding</h3>
              <p className="text-gray-600">Use <span className="font-mono text-sm">2</span>–<span className="font-mono text-sm">4</span> (8–16px) for the internal padding of controls and cards.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Stacking content</h3>
              <p className="text-gray-600">Use <span className="font-mono text-sm">4</span>–<span className="font-mono text-sm">8</span> (16–32px) between related blocks, and <span className="font-mono text-sm">12</span>+ (48px+) between major sections.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-lg mb-2">Stay on the scale</h3>
              <p className="text-gray-600">Avoid arbitrary values like <span className="font-mono text-sm">p-[13px]</span>. Round to the nearest scale step to preserve vertical rhythm.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
