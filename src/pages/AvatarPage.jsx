import React from 'react';
import Avatar, { AvatarGroup } from '../components/Avatar';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const PropRow = ({ name, type, def, desc }) => (
  <tr className="border-b border-gray-100">
    <td className="py-3 px-4 font-mono text-sm">{name}</td>
    <td className="py-3 px-4 font-mono text-xs text-gray-600">{type}</td>
    <td className="py-3 px-4 font-mono text-xs">{def}</td>
    <td className="py-3 px-4">{desc}</td>
  </tr>
);

export default function AvatarPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Avatar</h1>
          <p className="text-xl text-gray-600">
            A compact visual representation of a user, with image, initials, status, and grouping support.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Avatar, { AvatarGroup } from './components/Avatar';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sizes</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 flex items-center gap-8">
            <Avatar name="Jane Doe" size="xs" />
            <Avatar name="Jane Doe" size="sm" />
            <Avatar name="Jane Doe" size="md" />
            <Avatar name="Jane Doe" size="lg" />
            <Avatar name="Jane Doe" size="xl" />
          </div>
          <CodeBlock code={`<Avatar name="Jane Doe" size="xs" />
<Avatar name="Jane Doe" size="sm" />
<Avatar name="Jane Doe" size="md" />
<Avatar name="Jane Doe" size="lg" />
<Avatar name="Jane Doe" size="xl" />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Shapes</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 flex items-center gap-8">
            <Avatar name="Jane Doe" shape="circle" size="lg" />
            <Avatar name="Jane Doe" shape="square" size="lg" />
          </div>
          <CodeBlock code={`<Avatar name="Jane Doe" shape="circle" />
<Avatar name="Jane Doe" shape="square" />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Image</h2>
          <p className="text-gray-600 mb-4">
            Provide a <code className="bg-gray-100 px-2 py-1 rounded text-sm">src</code> to render a photo.
            If the image fails to load, the avatar gracefully falls back to the initials derived from{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">name</code>.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 flex items-center gap-8">
            <Avatar src="https://i.pravatar.cc/150?img=12" alt="Profile photo" name="Jane Doe" size="lg" />
            <Avatar src="https://invalid.example/broken.png" name="Jane Doe" size="lg" />
          </div>
          <CodeBlock code={`{/* Loads the image */}
<Avatar src="https://i.pravatar.cc/150?img=12" alt="Profile photo" name="Jane Doe" />

{/* Broken src falls back to initials */}
<Avatar src="https://invalid.example/broken.png" name="Jane Doe" />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Status indicator</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 flex items-center gap-8">
            <Avatar name="Jane Doe" size="lg" status="online" />
            <Avatar name="Jane Doe" size="lg" status="away" />
            <Avatar name="Jane Doe" size="lg" status="busy" />
            <Avatar name="Jane Doe" size="lg" status="offline" />
          </div>
          <CodeBlock code={`<Avatar name="Jane Doe" status="online" />
<Avatar name="Jane Doe" status="away" />
<Avatar name="Jane Doe" status="busy" />
<Avatar name="Jane Doe" status="offline" />`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Avatar Group</h2>
          <p className="text-gray-600 mb-4">
            Cluster overlapping avatars with <code className="bg-gray-100 px-2 py-1 rounded text-sm">AvatarGroup</code>.
            Use <code className="bg-gray-100 px-2 py-1 rounded text-sm">max</code> to cap the number shown and render a{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">+N</code> overflow chip.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <AvatarGroup max={3} size="lg">
              <Avatar name="Jane Doe" />
              <Avatar name="John Smith" />
              <Avatar name="Amy Lee" />
              <Avatar name="Carlos Ruiz" />
              <Avatar name="Priya Patel" />
            </AvatarGroup>
          </div>
          <CodeBlock code={`<AvatarGroup max={3} size="lg">
  <Avatar name="Jane Doe" />
  <Avatar name="John Smith" />
  <Avatar name="Amy Lee" />
  <Avatar name="Carlos Ruiz" />
  <Avatar name="Priya Patel" />
</AvatarGroup>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Props</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold">Prop</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Default</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <PropRow name="src" type="string" def="—" desc="Image URL; falls back to initials on error" />
                <PropRow name="alt" type="string" def="''" desc="Alt text for the image; defaults to name" />
                <PropRow name="name" type="string" def="''" desc="Full name used to derive initials and labels" />
                <PropRow name="size" type="'xs'|'sm'|'md'|'lg'|'xl'" def="'md'" desc="Size of the avatar" />
                <PropRow name="shape" type="'circle'|'square'" def="'circle'" desc="Outline shape" />
                <PropRow name="status" type="'online'|'away'|'busy'|'offline'" def="—" desc="Renders a status dot" />
                <PropRow name="className" type="string" def="''" desc="Additional CSS classes" />
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">AvatarGroup props</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold">Prop</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Default</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <PropRow name="children" type="ReactNode" def="—" desc="Avatar elements to cluster together" />
                <PropRow name="max" type="number" def="—" desc="Maximum avatars shown before a +N chip" />
                <PropRow name="size" type="'xs'|'sm'|'md'|'lg'|'xl'" def="'md'" desc="Applied to all child avatars" />
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
