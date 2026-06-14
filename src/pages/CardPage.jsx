import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

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
          <td className="py-3 px-4 font-mono text-sm">title</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Card title (optional)</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">description</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Card description (optional)</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">children</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">ReactNode</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Card content (optional)</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">footer</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">ReactNode</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Footer content, typically buttons (optional)</td>
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

export default function CardPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Card</h1>
          <p className="text-xl text-ink-muted">
            A flexible content card component for displaying information with optional headers, content, and footers.
          </p>
        </div>

        {/* Import */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Card from './components/Card';`} />
        </section>

        {/* Basic Card */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic Card</h2>
          <p className="text-ink-muted mb-6">
            A simple card with just a title and description.
          </p>
          <div className="mb-4">
            <Card
              title="Simple Card"
              description="A basic card with title and description using your design system colors."
            />
          </div>
          <CodeBlock code={`<Card
  title="Simple Card"
  description="A basic card with title and description."
/>`} />
        </section>

        {/* Card with Content */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Card with Content</h2>
          <p className="text-ink-muted mb-6">
            Add custom content to the card body using the children prop.
          </p>
          <div className="mb-4">
            <Card
              title="Card with Content"
              description="This card demonstrates the content area."
            >
              <p className="text-base">
                This is the main content area of the card. It uses your design system 
                typography and spacing variables. You can add any React components here.
              </p>
            </Card>
          </div>
          <CodeBlock code={`<Card
  title="Card with Content"
  description="This card demonstrates the content area."
>
  <p>Your custom content here</p>
</Card>`} />
        </section>

        {/* Card with Footer */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Card with Footer</h2>
          <p className="text-ink-muted mb-6">
            Add action buttons or other footer content using the footer prop.
          </p>
          <div className="mb-4">
            <Card
              title="Complete Card"
              description="A card with all sections: header, content, and footer."
              footer={
                <div className="flex gap-3">
                  <Button variant="primary">Save</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              }
            >
              <p className="text-base">
                Content goes here with proper spacing and typography from your design system.
              </p>
            </Card>
          </div>
          <CodeBlock code={`<Card
  title="Complete Card"
  description="A card with header, content, and footer."
  footer={
    <div className="flex gap-3">
      <Button variant="primary">Save</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  }
>
  <p>Card content here</p>
</Card>`} />
        </section>

        {/* Multiple Cards Layout */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Grid Layout</h2>
          <p className="text-ink-muted mb-6">
            Cards work great in grid layouts for displaying multiple items.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <Card
              title="Feature One"
              description="Description of feature one"
            />
            <Card
              title="Feature Two"
              description="Description of feature two"
            />
            <Card
              title="Feature Three"
              description="Description of feature three"
            />
          </div>
          <CodeBlock code={`<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card title="Feature One" description="..." />
  <Card title="Feature Two" description="..." />
  <Card title="Feature Three" description="..." />
</div>`} />
        </section>

        {/* Props Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Props</h2>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <PropsTable />
          </div>
        </section>

        {/* Usage Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
          <p className="text-ink-muted mb-6">
            Here's a complete example of a card used in a settings form.
          </p>
          <CodeBlock code={`import Card from './components/Card';
import Button from './components/Button';

function SettingsForm() {
  const handleSave = () => {
    console.log('Settings saved');
  };

  return (
    <Card
      title="User Settings"
      description="Update your account preferences"
      footer={
        <div className="flex gap-3">
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
          <Button variant="outline">
            Cancel
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Your form fields here */}
        <p>Form content goes here...</p>
      </div>
    </Card>
  );
}`} />
        </section>
      </div>
    </div>
  );
}