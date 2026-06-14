import React from 'react';
import Tooltip from '../components/Tooltip';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { Info, HelpCircle, Settings, AlertCircle } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

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
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">children</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">ReactNode</td>
          <td className="py-3 px-4 font-mono text-xs">required</td>
          <td className="py-3 px-4">The element that triggers the tooltip on hover</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">content</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">required</td>
          <td className="py-3 px-4">The text content to display in the tooltip</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">position</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">
            'top' | 'bottom' | 'left' | 'right'
          </td>
          <td className="py-3 px-4 font-mono text-xs">'top'</td>
          <td className="py-3 px-4">Position of the tooltip relative to the trigger element</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">className</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">''</td>
          <td className="py-3 px-4">Additional CSS classes</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function TooltipPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Tooltip</h1>
          <p className="text-xl text-ink-muted">
            A tooltip component that displays informative text when users hover over an element.
          </p>
        </div>

        {/* Import */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Tooltip from './components/Tooltip';`} />
        </section>

        {/* Basic Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
          <p className="text-ink-muted mb-6">
            Wrap any element with the Tooltip component and provide content to display.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex items-center justify-center gap-8">
              <Tooltip content="This is a tooltip">
                <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                  Hover me
                </button>
              </Tooltip>
            </div>
          </div>
          <CodeBlock code={`<Tooltip content="This is a tooltip">
  <button>Hover me</button>
</Tooltip>`} />
        </section>

        {/* Positions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Positions</h2>
          <p className="text-ink-muted mb-6">
            Tooltips can be positioned on any side of the trigger element: top, bottom, left, or right.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-12 mb-4">
            <div className="flex flex-col items-center gap-12">
              <Tooltip content="Tooltip on top" position="top">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Top
                </button>
              </Tooltip>

              <div className="flex items-center gap-12">
                <Tooltip content="Tooltip on left" position="left">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Left
                  </button>
                </Tooltip>

                <Tooltip content="Tooltip on right" position="right">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Right
                  </button>
                </Tooltip>
              </div>

              <Tooltip content="Tooltip on bottom" position="bottom">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Bottom
                </button>
              </Tooltip>
            </div>
          </div>
          <CodeBlock code={`<Tooltip content="Tooltip on top" position="top">
  <button>Top</button>
</Tooltip>

<Tooltip content="Tooltip on bottom" position="bottom">
  <button>Bottom</button>
</Tooltip>

<Tooltip content="Tooltip on left" position="left">
  <button>Left</button>
</Tooltip>

<Tooltip content="Tooltip on right" position="right">
  <button>Right</button>
</Tooltip>`} />
        </section>

        {/* With Icons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With Icons</h2>
          <p className="text-ink-muted mb-6">
            Tooltips work great with icon buttons to provide context.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex items-center justify-center gap-6">
              <Tooltip content="More information">
                <button className="p-2 rounded hover:bg-surface-muted">
                  <Info size={24} className="text-blue-500" />
                </button>
              </Tooltip>

              <Tooltip content="Get help">
                <button className="p-2 rounded hover:bg-surface-muted">
                  <HelpCircle size={24} className="text-green-500" />
                </button>
              </Tooltip>

              <Tooltip content="Settings">
                <button className="p-2 rounded hover:bg-surface-muted">
                  <Settings size={24} className="text-ink-muted" />
                </button>
              </Tooltip>

              <Tooltip content="Warning: This action cannot be undone">
                <button className="p-2 rounded hover:bg-surface-muted">
                  <AlertCircle size={24} className="text-red-500" />
                </button>
              </Tooltip>
            </div>
          </div>
          <CodeBlock code={`import { Info, HelpCircle, Settings, AlertCircle } from 'lucide-react';

<Tooltip content="More information">
  <button>
    <Info size={24} />
  </button>
</Tooltip>

<Tooltip content="Get help">
  <button>
    <HelpCircle size={24} />
  </button>
</Tooltip>`} />
        </section>

        {/* With Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With Buttons</h2>
          <p className="text-ink-muted mb-6">
            Add tooltips to buttons to provide additional context or help text.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex items-center justify-center gap-4">
              <Tooltip content="Save your changes">
                <Button variant="primary">Save</Button>
              </Tooltip>

              <Tooltip content="Discard all changes">
                <Button variant="destructive">Delete</Button>
              </Tooltip>

              <Tooltip content="Download as PDF">
                <Button variant="outline">Export</Button>
              </Tooltip>
            </div>
          </div>
          <CodeBlock code={`<Tooltip content="Save your changes">
  <Button variant="primary">Save</Button>
</Tooltip>

<Tooltip content="Discard all changes">
  <Button variant="destructive">Delete</Button>
</Tooltip>`} />
        </section>

        {/* With Text */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With Text and Badges</h2>
          <p className="text-ink-muted mb-6">
            Tooltips can be used with any element, including text and badges.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-ink-muted">Project Status:</span>
                <Tooltip content="This project is currently in progress">
                  <Badge type="warning">In Progress</Badge>
                </Tooltip>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-ink-muted">Account Status:</span>
                <Tooltip content="Your account is active and verified">
                  <Badge type="positive">Active</Badge>
                </Tooltip>
              </div>

              <div className="flex items-center gap-3">
                <Tooltip content="Hover over any underlined text for more info" position="right">
                  <span className="text-blue-600 underline cursor-help">
                    Technical term
                  </span>
                </Tooltip>
                <span className="text-ink-muted">used in the documentation</span>
              </div>
            </div>
          </div>
          <CodeBlock code={`<Tooltip content="This project is currently in progress">
  <Badge type="warning">In Progress</Badge>
</Tooltip>

<Tooltip content="Hover over any underlined text for more info">
  <span className="underline cursor-help">Technical term</span>
</Tooltip>`} />
        </section>

        {/* Disabled Elements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Disabled Elements</h2>
          <p className="text-ink-muted mb-6">
            Show tooltips on disabled elements to explain why they're disabled.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex items-center justify-center gap-4">
              <Tooltip content="You don't have permission to delete">
                <div className="inline-block">
                  <Button variant="destructive" disabled>
                    Delete
                  </Button>
                </div>
              </Tooltip>

              <Tooltip content="Save all files before exporting">
                <div className="inline-block">
                  <Button variant="primary" disabled>
                    Export
                  </Button>
                </div>
              </Tooltip>
            </div>
          </div>
          <CodeBlock code={`<Tooltip content="You don't have permission to delete">
  <div className="inline-block">
    <Button variant="destructive" disabled>
      Delete
    </Button>
  </div>
</Tooltip>`} />
        </section>

        {/* Props Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Props</h2>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <PropsTable />
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
          <div className="bg-surface-raised rounded-lg border border-line p-8">
            <div className="space-y-4 text-ink-muted">
              <div>
                <p className="font-semibold text-ink mb-2">Keep it concise:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Limit tooltip content to 1-2 short sentences</li>
                  <li>Avoid complex formatting or lengthy explanations</li>
                  <li>Use clear, simple language</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-ink mb-2">Don't hide critical information:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Tooltips should supplement, not replace, visible information</li>
                  <li>Don't use tooltips for essential instructions or warnings</li>
                  <li>Important actions should have clear labels without requiring a tooltip</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-ink mb-2">Position wisely:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Default to top position for most cases</li>
                  <li>Use other positions when space is constrained</li>
                  <li>Ensure tooltips don't cover important content</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-ink mb-2">Accessibility:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Tooltips are triggered by hover, making them inaccessible for keyboard-only users</li>
                  <li>For critical information, consider using visible labels or help text instead</li>
                  <li>Ensure the tooltip has role="tooltip" for screen readers</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-ink mb-2">Mobile considerations:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Tooltips don't work well on touch devices (no hover state)</li>
                  <li>Consider alternative patterns for mobile, such as info buttons with modals</li>
                  <li>Test on actual mobile devices to ensure good user experience</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
          <p className="text-ink-muted mb-6">
            Here's a complete example showing how to use tooltips in a toolbar.
          </p>
          <CodeBlock code={`import Tooltip from './components/Tooltip';
import { Bold, Italic, Underline, Link, Image, AlignLeft } from 'lucide-react';

function TextEditor() {
  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        <Tooltip content="Bold (Ctrl+B)">
          <button className="p-2 rounded hover:bg-gray-200">
            <Bold size={18} />
          </button>
        </Tooltip>

        <Tooltip content="Italic (Ctrl+I)">
          <button className="p-2 rounded hover:bg-gray-200">
            <Italic size={18} />
          </button>
        </Tooltip>

        <Tooltip content="Underline (Ctrl+U)">
          <button className="p-2 rounded hover:bg-gray-200">
            <Underline size={18} />
          </button>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Tooltip content="Insert link">
          <button className="p-2 rounded hover:bg-gray-200">
            <Link size={18} />
          </button>
        </Tooltip>

        <Tooltip content="Insert image">
          <button className="p-2 rounded hover:bg-gray-200">
            <Image size={18} />
          </button>
        </Tooltip>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Tooltip content="Align left">
          <button className="p-2 rounded hover:bg-gray-200">
            <AlignLeft size={18} />
          </button>
        </Tooltip>
      </div>

      {/* Editor area */}
      <div className="p-4 min-h-[200px]">
        <textarea
          className="w-full h-full resize-none outline-none"
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
}`} />
        </section>
      </div>
    </div>
  );
}
