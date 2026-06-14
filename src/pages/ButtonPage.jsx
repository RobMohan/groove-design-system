import React, { useState } from 'react';
import Button from '../components/Button';
import { Download, Plus, Trash2, Settings, Heart } from 'lucide-react';

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
          <td className="py-3 px-4 font-mono text-sm">variant</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">
            'primary' | 'secondary' | 'destructive' | 'positive' | 'outline' | 'ghost' | 'link'
          </td>
          <td className="py-3 px-4 font-mono text-xs">'primary'</td>
          <td className="py-3 px-4">Visual style variant</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">size</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">
            'small' | 'default' | 'large' | 'icon'
          </td>
          <td className="py-3 px-4 font-mono text-xs">'default'</td>
          <td className="py-3 px-4">Button size</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">disabled</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">boolean</td>
          <td className="py-3 px-4 font-mono text-xs">false</td>
          <td className="py-3 px-4">Disabled state</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">icon</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">LucideIcon</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Icon component from lucide-react</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">iconPosition</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">'left' | 'right'</td>
          <td className="py-3 px-4 font-mono text-xs">'left'</td>
          <td className="py-3 px-4">Position of the icon</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">onClick</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">function</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Click handler</td>
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

export default function ButtonPage() {
  const [likes, setLikes] = useState(0);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Button</h1>
          <p className="text-xl text-ink-muted">
            A versatile button component with multiple variants, sizes, and interactive states.
          </p>
        </div>

        {/* Import */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Button from './components/Button';`} />
        </section>

        {/* Variants */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Variants</h2>
          <p className="text-ink-muted mb-6">
            The Button component comes in 7 different visual styles to fit various use cases.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="positive">Positive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          <CodeBlock code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="positive">Positive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`} />
        </section>

        {/* Sizes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sizes</h2>
          <p className="text-ink-muted mb-6">
            Four different sizes to match your interface needs.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="small">Small</Button>
              <Button size="default">Default</Button>
              <Button size="large">Large</Button>
              <Button size="icon" icon={Settings} />
            </div>
          </div>
          <CodeBlock code={`<Button size="small">Small</Button>
<Button size="default">Default</Button>
<Button size="large">Large</Button>
<Button size="icon" icon={Settings} />`} />
        </section>

        {/* With Icons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With Icons</h2>
          <p className="text-ink-muted mb-6">
            Add icons from lucide-react to enhance your buttons. Icons can be positioned on the left or right.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" icon={Download}>Download</Button>
              <Button variant="secondary" icon={Plus}>Add Item</Button>
              <Button variant="destructive" icon={Trash2}>Delete</Button>
              <Button 
                variant="outline" 
                icon={Heart}
                onClick={() => setLikes(likes + 1)}
              >
                Like {likes > 0 && `(${likes})`}
              </Button>
            </div>
          </div>
          <CodeBlock code={`import { Download, Plus, Trash2 } from 'lucide-react';

<Button variant="primary" icon={Download}>Download</Button>
<Button variant="secondary" icon={Plus}>Add Item</Button>
<Button variant="destructive" icon={Trash2}>Delete</Button>`} />
        </section>

        {/* Disabled State */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Disabled State</h2>
          <p className="text-ink-muted mb-6">
            All button variants support the disabled state.
          </p>
          <div className="bg-surface-raised rounded-lg border border-line p-8 mb-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" disabled>Primary</Button>
              <Button variant="secondary" disabled>Secondary</Button>
              <Button variant="destructive" disabled>Destructive</Button>
              <Button variant="outline" disabled>Outline</Button>
            </div>
          </div>
          <CodeBlock code={`<Button variant="primary" disabled>Disabled</Button>`} />
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
            Here's a complete example showing how to use the Button component in a form.
          </p>
          <CodeBlock code={`import Button from './components/Button';
import { Save } from 'lucide-react';

function MyForm() {
  const handleSave = () => {
    console.log('Saving...');
  };

  return (
    <div className="flex gap-3">
      <Button 
        variant="primary" 
        icon={Save}
        onClick={handleSave}
      >
        Save Changes
      </Button>
      <Button variant="outline">
        Cancel
      </Button>
    </div>
  );
}`} />
        </section>
      </div>
    </div>
  );
}