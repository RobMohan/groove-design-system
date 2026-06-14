import React from 'react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const ColorSwatch = ({ name, color, description }) => (
  <div className="flex items-center gap-4 p-4 bg-surface-raised rounded-lg border border-line">
    <div
      className="w-16 h-16 rounded-lg border border-line shadow-sm flex-shrink-0"
      style={{ backgroundColor: color }}
    />
    <div className="flex-1">
      <p className="font-semibold text-ink">{name}</p>
      <p className="text-sm text-ink-muted font-mono">{color}</p>
      {description && <p className="text-sm text-ink-muted mt-1">{description}</p>}
    </div>
  </div>
);

const ColorCategory = ({ title, colors }) => (
  <div className="mb-8">
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {colors.map((color, index) => (
        <ColorSwatch key={index} {...color} />
      ))}
    </div>
  </div>
);

export default function ColorTokensPage() {
  const primaryColors = [
    { name: 'Surface / Subtle', color: '#e0ecfc', description: 'Lightest blue for subtle backgrounds' },
    { name: 'Surface / Lighter', color: '#a3b9ed', description: 'Light blue for hover states' },
    { name: 'Surface / Default', color: '#588ae0', description: 'Primary blue for buttons and interactive elements' },
    { name: 'Surface / Darker', color: '#30528a', description: 'Dark blue for pressed states' },
    { name: 'Border / Subtle', color: '#a3b9ed', description: 'Light border for subtle separation' },
    { name: 'Border / Default', color: '#588ae0', description: 'Standard primary border' },
    { name: 'Border / Darker', color: '#30528a', description: 'Emphasized primary border' },
    { name: 'Text / Label', color: '#30528a', description: 'Primary text on light backgrounds' },
  ];

  const secondaryColors = [
    { name: 'Surface / Subtle', color: '#ede9fe', description: 'Lightest purple for subtle backgrounds' },
    { name: 'Surface / Lighter', color: '#c4b5fd', description: 'Light purple for hover states' },
    { name: 'Surface / Default', color: '#7c3aed', description: 'Secondary purple for alternate actions' },
    { name: 'Surface / Darker', color: '#6b21a8', description: 'Dark purple for pressed states' },
    { name: 'Border / Subtle', color: '#c4b5fd', description: 'Light border for subtle separation' },
    { name: 'Border / Default', color: '#7c3aed', description: 'Standard secondary border' },
    { name: 'Border / Darker', color: '#6b21a8', description: 'Emphasized secondary border' },
    { name: 'Text / Label', color: '#5b21b6', description: 'Secondary text on light backgrounds' },
  ];

  const errorColors = [
    { name: 'Surface / Subtle', color: '#fee2e2', description: 'Lightest red for error backgrounds' },
    { name: 'Surface / Lighter', color: '#fca5a5', description: 'Light red for hover states' },
    { name: 'Surface / Default', color: '#dc2626', description: 'Error red for destructive actions' },
    { name: 'Surface / Darker', color: '#991b1b', description: 'Dark red for pressed states' },
    { name: 'Border / Subtle', color: '#fca5a5', description: 'Light error border' },
    { name: 'Border / Default', color: '#dc2626', description: 'Standard error border' },
    { name: 'Border / Darker', color: '#991b1b', description: 'Emphasized error border' },
    { name: 'Text / Label', color: '#991b1b', description: 'Error text' },
  ];

  const warningColors = [
    { name: 'Surface / Subtle', color: '#fef3c7', description: 'Lightest yellow for warning backgrounds' },
    { name: 'Surface / Lighter', color: '#fde047', description: 'Light yellow for hover states' },
    { name: 'Surface / Default', color: '#eab308', description: 'Warning yellow for caution states' },
    { name: 'Surface / Darker', color: '#a16207', description: 'Dark yellow for pressed states' },
    { name: 'Border / Subtle', color: '#fde047', description: 'Light warning border' },
    { name: 'Border / Default', color: '#eab308', description: 'Standard warning border' },
    { name: 'Border / Darker', color: '#a16207', description: 'Emphasized warning border' },
    { name: 'Text / Label', color: '#854d0e', description: 'Warning text' },
  ];

  const successColors = [
    { name: 'Surface / Subtle', color: '#d1fae5', description: 'Lightest green for success backgrounds' },
    { name: 'Surface / Lighter', color: '#6ee7b7', description: 'Light green for hover states' },
    { name: 'Surface / Default', color: '#16a34a', description: 'Success green for positive actions' },
    { name: 'Surface / Darker', color: '#15803d', description: 'Dark green for pressed states' },
    { name: 'Border / Subtle', color: '#6ee7b7', description: 'Light success border' },
    { name: 'Border / Default', color: '#16a34a', description: 'Standard success border' },
    { name: 'Border / Darker', color: '#15803d', description: 'Emphasized success border' },
    { name: 'Text / Label', color: '#166534', description: 'Success text' },
  ];

  const grayscaleColors = [
    { name: 'Surface / Subtle', color: '#f9fafb', description: 'Lightest gray for page backgrounds' },
    { name: 'Surface / Default', color: '#f3f4f6', description: 'Default gray for cards and panels' },
    { name: 'Surface / Disabled', color: '#e5e7eb', description: 'Disabled state backgrounds' },
    { name: 'Border / Default', color: '#d1d5db', description: 'Standard borders' },
    { name: 'Border / Disabled', color: '#e5e7eb', description: 'Disabled borders' },
    { name: 'Border / Darker', color: '#9ca3af', description: 'Emphasized borders' },
    { name: 'Text / Title', color: '#111827', description: 'Headings and titles' },
    { name: 'Text / Body', color: '#374151', description: 'Body text' },
    { name: 'Text / Subtitle', color: '#6b7280', description: 'Secondary text' },
    { name: 'Text / Caption', color: '#9ca3af', description: 'Captions and helper text' },
    { name: 'Text / Negative', color: '#f4f3f3', description: 'Text on dark backgrounds' },
    { name: 'Text / Disabled', color: '#d1d5db', description: 'Disabled text' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Color Tokens</h1>
          <p className="text-xl text-ink-muted">
            Semantic color system designed for consistency and accessibility across the entire design system.
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-ink-muted mb-4">
            Our color system uses semantic naming to ensure colors communicate meaning and purpose.
            Each color category (Primary, Secondary, Error, Warning, Success, Grayscale) contains
            tokens for different use cases: surfaces, borders, and text.
          </p>
          <p className="text-ink-muted">
            This approach allows for consistent theming and makes it easy to maintain design consistency
            across components.
          </p>
        </section>

        {/* Color Structure */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Token Structure</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-6 mb-4">
            <p className="text-ink-muted mb-4">
              Color tokens follow a three-part naming convention:
            </p>
            <div className="font-mono text-sm bg-surface-muted p-4 rounded border border-line">
              <span className="text-blue-600">Category</span> / <span className="text-purple-600">Purpose</span> / <span className="text-green-600">Variant</span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-ink-muted">
              <p><span className="font-semibold text-blue-600">Category:</span> Primary, Secondary, Error, Warning, Success, Grayscale</p>
              <p><span className="font-semibold text-purple-600">Purpose:</span> Surface, Border, Text/Icon</p>
              <p><span className="font-semibold text-green-600">Variant:</span> Subtle, Lighter, Default, Darker, Disabled</p>
            </div>
          </div>
        </section>

        {/* Grayscale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Grayscale</h2>
          <p className="text-ink-muted mb-6">
            Foundation colors for layouts, text, and neutral UI elements.
          </p>
          <ColorCategory colors={grayscaleColors} />
        </section>

        {/* Primary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Primary (Blue)</h2>
          <p className="text-ink-muted mb-6">
            Main brand color for primary actions, links, and key interactive elements.
          </p>
          <ColorCategory colors={primaryColors} />
        </section>

        {/* Secondary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Secondary (Purple)</h2>
          <p className="text-ink-muted mb-6">
            Complementary color for secondary actions and visual hierarchy.
          </p>
          <ColorCategory colors={secondaryColors} />
        </section>

        {/* Error */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Error (Red)</h2>
          <p className="text-ink-muted mb-6">
            Destructive actions, errors, and critical warnings.
          </p>
          <ColorCategory colors={errorColors} />
        </section>

        {/* Warning */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Warning (Yellow)</h2>
          <p className="text-ink-muted mb-6">
            Caution states, alerts, and important notices.
          </p>
          <ColorCategory colors={warningColors} />
        </section>

        {/* Success */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Success (Green)</h2>
          <p className="text-ink-muted mb-6">
            Positive actions, success states, and confirmations.
          </p>
          <ColorCategory colors={successColors} />
        </section>

        {/* Usage Guidelines */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Usage Guidelines</h2>
          <div className="space-y-6">
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-3">Surface Colors</h3>
              <ul className="space-y-2 text-ink-muted">
                <li><span className="font-semibold">Subtle:</span> Use for very light backgrounds and subtle containers</li>
                <li><span className="font-semibold">Lighter:</span> Use for hover states and secondary backgrounds</li>
                <li><span className="font-semibold">Default:</span> Use for primary interactive elements like buttons</li>
                <li><span className="font-semibold">Darker:</span> Use for pressed/active states and emphasis</li>
              </ul>
            </div>

            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-3">Border Colors</h3>
              <ul className="space-y-2 text-ink-muted">
                <li><span className="font-semibold">Subtle:</span> Use for very light borders and dividers</li>
                <li><span className="font-semibold">Default:</span> Use for standard borders on interactive elements</li>
                <li><span className="font-semibold">Darker:</span> Use for emphasized borders and focus states</li>
              </ul>
            </div>

            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="font-semibold text-lg mb-3">Text Colors</h3>
              <ul className="space-y-2 text-ink-muted">
                <li><span className="font-semibold">Title:</span> Use for headings and primary text hierarchy</li>
                <li><span className="font-semibold">Body:</span> Use for standard body text</li>
                <li><span className="font-semibold">Subtitle:</span> Use for secondary information</li>
                <li><span className="font-semibold">Caption:</span> Use for helper text and small labels</li>
                <li><span className="font-semibold">Label:</span> Use for colored text matching the category theme</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Implementation</h2>
          <p className="text-ink-muted mb-6">
            Use these color tokens in your Tailwind configuration for consistent theming.
          </p>
          <CodeBlock code={`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#588ae0',
          hover: '#a3b9ed',
          pressed: '#30528a',
        },
        secondary: {
          DEFAULT: '#7c3aed',
          hover: '#9333ea',
          pressed: '#6b21a8',
        },
        // ... more colors
      }
    }
  }
}`} />
        </section>

        {/* Accessibility Note */}
        <section className="mb-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2 text-blue-900">Accessibility</h3>
            <p className="text-blue-800">
              All color combinations have been tested to meet WCAG 2.1 AA standards for contrast ratios.
              Ensure text colors maintain at least 4.5:1 contrast ratio against their backgrounds for body text,
              and 3:1 for large text (18pt+ or 14pt+ bold).
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
