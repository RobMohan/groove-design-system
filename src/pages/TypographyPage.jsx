import React from 'react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const TypeSpecimen = ({ label, variants }) => (
  <div className="border-b border-line pb-8 mb-8">
    <div className="grid grid-cols-4 gap-4 items-center">
      <div className="text-sm font-semibold text-ink-muted uppercase tracking-wider">
        {label}
      </div>
      {variants.map((variant, index) => (
        <div key={index} className="bg-surface-raised p-4 rounded-lg border border-line">
          <p className={variant.className} style={variant.style}>
            {variant.text}
          </p>
          <p className="text-xs text-ink-muted mt-2 font-mono">{variant.label}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function TypographyPage() {
  const typeStyles = [
    {
      label: 'H1',
      variants: [
        { text: 'H1 Bold', label: 'text-5xl font-bold', className: 'text-5xl font-bold' },
        { text: 'H1 Regular', label: 'text-5xl font-normal', className: 'text-5xl font-normal' },
        { text: 'H1 Light', label: 'text-5xl font-light', className: 'text-5xl font-light' },
      ]
    },
    {
      label: 'H2',
      variants: [
        { text: 'H2 Bold', label: 'text-4xl font-bold', className: 'text-4xl font-bold' },
        { text: 'H2 Regular', label: 'text-4xl font-normal', className: 'text-4xl font-normal' },
        { text: 'H2 Light', label: 'text-4xl font-light', className: 'text-4xl font-light' },
      ]
    },
    {
      label: 'H3',
      variants: [
        { text: 'H3 Bold', label: 'text-3xl font-bold', className: 'text-3xl font-bold' },
        { text: 'H3 Regular', label: 'text-3xl font-normal', className: 'text-3xl font-normal' },
        { text: 'H3 Light', label: 'text-3xl font-light', className: 'text-3xl font-light' },
      ]
    },
    {
      label: 'H4',
      variants: [
        { text: 'H4 Bold', label: 'text-2xl font-bold', className: 'text-2xl font-bold' },
        { text: 'H4 Regular', label: 'text-2xl font-normal', className: 'text-2xl font-normal' },
        { text: 'H4 Light', label: 'text-2xl font-light', className: 'text-2xl font-light' },
      ]
    },
    {
      label: 'Headline',
      variants: [
        { text: 'Headline Bold', label: 'text-xl font-bold', className: 'text-xl font-bold' },
        { text: 'Headline Regular', label: 'text-xl font-normal', className: 'text-xl font-normal' },
        { text: 'Headline Light', label: 'text-xl font-light', className: 'text-xl font-light' },
      ]
    },
    {
      label: 'Body',
      variants: [
        { text: 'Body Bold', label: 'text-base font-bold', className: 'text-base font-bold' },
        { text: 'Body Regular', label: 'text-base font-normal', className: 'text-base font-normal' },
        { text: 'Body Light', label: 'text-base font-light', className: 'text-base font-light' },
      ]
    },
    {
      label: 'Subtitle',
      variants: [
        { text: 'Subtitle Bold', label: 'text-sm font-bold', className: 'text-sm font-bold' },
        { text: 'Subtitle Regular', label: 'text-sm font-normal', className: 'text-sm font-normal' },
        { text: 'Subtitle Light', label: 'text-sm font-light', className: 'text-sm font-light' },
      ]
    },
    {
      label: 'Caption',
      variants: [
        { text: 'Caption Bold', label: 'text-xs font-bold', className: 'text-xs font-bold' },
        { text: 'Caption Regular', label: 'text-xs font-normal', className: 'text-xs font-normal' },
        { text: 'Caption Light', label: 'text-xs font-light', className: 'text-xs font-light' },
      ]
    },
    {
      label: 'Footnote',
      variants: [
        { text: 'FOOTNOTE BOLD', label: 'text-[10px] font-bold uppercase', className: 'text-[10px] font-bold uppercase' },
        { text: 'FOOTNOTE REGULAR', label: 'text-[10px] font-normal uppercase', className: 'text-[10px] font-normal uppercase' },
        { text: '', label: '', className: '' },
      ]
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Typography</h1>
          <p className="text-xl text-ink-muted">
            A comprehensive type system designed for hierarchy, readability, and consistency across all interfaces.
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-ink-muted mb-4">
            Our typography system uses a modular scale with 9 distinct text styles, each available in multiple weights.
            This creates clear visual hierarchy and ensures consistency across all content types.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2 text-blue-900">Font Family</h3>
            <p className="text-blue-800 mb-2">
              The design system uses <span className="font-mono font-semibold">Inter</span> as the primary typeface,
              providing excellent readability and a modern, professional appearance.
            </p>
            <p className="text-sm text-blue-700 font-mono">
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
            </p>
          </div>
        </section>

        {/* Type Scale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Type Scale</h2>
          <p className="text-ink-muted mb-8">
            Each text style is available in three weights: Bold, Regular, and Light (except Footnote).
          </p>

          <div className="bg-surface-muted p-8 rounded-lg">
            {typeStyles.map((style, index) => (
              <TypeSpecimen key={index} {...style} />
            ))}
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Usage Guidelines</h2>
          <div className="grid gap-6">
            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="text-xl font-bold mb-3">Headings (H1-H4)</h3>
              <ul className="space-y-2 text-ink-muted">
                <li><span className="font-semibold">H1:</span> Main page titles and hero sections (48px / 3rem)</li>
                <li><span className="font-semibold">H2:</span> Major section headings (36px / 2.25rem)</li>
                <li><span className="font-semibold">H3:</span> Subsection headings (30px / 1.875rem)</li>
                <li><span className="font-semibold">H4:</span> Minor headings and card titles (24px / 1.5rem)</li>
              </ul>
            </div>

            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="text-xl font-bold mb-3">Body Text</h3>
              <ul className="space-y-2 text-ink-muted">
                <li><span className="font-semibold">Headline:</span> Emphasized paragraphs and lead text (20px / 1.25rem)</li>
                <li><span className="font-semibold">Body:</span> Standard body text and content (16px / 1rem)</li>
                <li><span className="font-semibold">Subtitle:</span> Secondary information and labels (14px / 0.875rem)</li>
                <li><span className="font-semibold">Caption:</span> Helper text, image captions, timestamps (12px / 0.75rem)</li>
                <li><span className="font-semibold">Footnote:</span> Minimal text, legal copy, metadata (10px / 0.625rem)</li>
              </ul>
            </div>

            <div className="bg-surface-raised rounded-lg border border-line p-6">
              <h3 className="text-xl font-bold mb-3">Font Weights</h3>
              <ul className="space-y-2 text-ink-muted">
                <li><span className="font-semibold">Bold (700):</span> Use for emphasis, headings, and important UI elements</li>
                <li><span className="font-semibold">Regular (400):</span> Default weight for most text content</li>
                <li><span className="font-semibold">Light (300):</span> Use sparingly for de-emphasized text or elegant headings</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Implementation Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Implementation</h2>
          <p className="text-ink-muted mb-6">
            Use Tailwind's utility classes to apply typography styles consistently.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Headings</h3>
              <CodeBlock code={`<!-- H1 -->
<h1 className="text-5xl font-bold">Main Page Title</h1>

<!-- H2 -->
<h2 className="text-4xl font-semibold">Section Heading</h2>

<!-- H3 -->
<h3 className="text-3xl font-semibold">Subsection</h3>

<!-- H4 -->
<h4 className="text-2xl font-semibold">Card Title</h4>`} />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Body Text</h3>
              <CodeBlock code={`<!-- Headline -->
<p className="text-xl font-normal">Important introduction text</p>

<!-- Body -->
<p className="text-base font-normal">Standard paragraph text</p>

<!-- Subtitle -->
<p className="text-sm text-gray-600">Secondary information</p>

<!-- Caption -->
<p className="text-xs text-gray-500">Helper text or image caption</p>`} />
            </div>
          </div>
        </section>

        {/* Real-World Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Example in Context</h2>
          <p className="text-ink-muted mb-6">
            Here's how different text styles work together in a card component.
          </p>

          <div className="bg-surface-raised rounded-lg border border-line p-8 max-w-2xl">
            <h3 className="text-2xl font-bold mb-2">Product Launch Announcement</h3>
            <p className="text-sm text-ink-muted mb-4">Posted on January 11, 2026</p>
            <p className="text-xl font-normal mb-4 text-ink-muted">
              We're excited to introduce our latest feature update, bringing powerful new capabilities to your workflow.
            </p>
            <p className="text-base font-normal text-ink-muted mb-6">
              This update includes enhanced collaboration tools, improved performance, and a redesigned interface
              that makes it easier than ever to get your work done. Our team has been working hard to deliver
              these improvements based on your feedback.
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-line">
              <p className="text-xs text-ink-muted">Updated 2 hours ago</p>
              <p className="text-xs text-ink-subtle">•</p>
              <p className="text-xs text-ink-muted">5 min read</p>
            </div>
          </div>

          <div className="mt-6">
            <CodeBlock code={`<div className="bg-white rounded-lg border border-gray-200 p-8">
  {/* H3 - Card Title */}
  <h3 className="text-2xl font-bold mb-2">
    Product Launch Announcement
  </h3>

  {/* Caption - Metadata */}
  <p className="text-sm text-gray-500 mb-4">
    Posted on January 11, 2026
  </p>

  {/* Headline - Lead paragraph */}
  <p className="text-xl font-normal mb-4 text-gray-700">
    We're excited to introduce our latest feature...
  </p>

  {/* Body - Main content */}
  <p className="text-base font-normal text-gray-600 mb-6">
    This update includes enhanced collaboration tools...
  </p>

  {/* Caption - Footer metadata */}
  <div className="flex items-center gap-4">
    <p className="text-xs text-gray-500">Updated 2 hours ago</p>
    <p className="text-xs text-gray-500">5 min read</p>
  </div>
</div>`} />
          </div>
        </section>

        {/* Accessibility */}
        <section className="mb-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2 text-blue-900">Accessibility Best Practices</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• Maintain a minimum font size of 16px (1rem) for body text</li>
              <li>• Use semantic HTML headings (h1-h6) to create proper document structure</li>
              <li>• Ensure sufficient color contrast between text and backgrounds (WCAG AA: 4.5:1 for normal text)</li>
              <li>• Use font-weight and size to create hierarchy instead of relying solely on color</li>
              <li>• Avoid using all caps for long passages of text (except for Footnote style)</li>
              <li>• Line height should be at least 1.5x the font size for body text</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
