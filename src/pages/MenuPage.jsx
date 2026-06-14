import React from 'react';
import { Pencil, Copy, Trash2, MoreVertical } from 'lucide-react';
import Menu from '../components/Menu';
import Button from '../components/Button';

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

export default function MenuPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Menu</h1>
          <p className="text-xl text-gray-600">
            A dropdown action menu that opens from a trigger and lists selectable actions.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Menu from './components/Menu';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic usage</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <Menu
              trigger={<Button variant="outline">Actions</Button>}
              items={[
                { label: 'Edit', icon: Pencil, onClick: () => alert('Edit') },
                { label: 'Duplicate', icon: Copy, onClick: () => alert('Duplicate') },
                { divider: true },
                { label: 'Delete', icon: Trash2, danger: true, onClick: () => alert('Delete') },
              ]}
            />
          </div>
          <CodeBlock code={`<Menu
  trigger={<Button variant="outline">Actions</Button>}
  items={[
    { label: 'Edit', icon: Pencil, onClick: () => handleEdit() },
    { label: 'Duplicate', icon: Copy, onClick: () => handleDuplicate() },
    { divider: true },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => handleDelete() },
  ]}
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Alignment</h2>
          <p className="text-gray-600 mb-4">
            Use <code className="font-mono text-sm">align="right"</code> to anchor the dropdown to
            the right edge of the trigger. This is useful for triggers near the end of a row, such
            as an overflow icon button.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4 flex justify-end">
            <Menu
              align="right"
              trigger={<Button variant="ghost" size="icon" icon={MoreVertical} aria-label="More options" />}
              items={[
                { label: 'Edit', icon: Pencil, onClick: () => alert('Edit') },
                { label: 'Duplicate', icon: Copy, onClick: () => alert('Duplicate') },
                { divider: true },
                { label: 'Delete', icon: Trash2, danger: true, onClick: () => alert('Delete') },
              ]}
            />
          </div>
          <CodeBlock code={`<Menu
  align="right"
  trigger={<Button variant="ghost" size="icon" icon={MoreVertical} aria-label="More options" />}
  items={[
    { label: 'Edit', icon: Pencil, onClick: () => handleEdit() },
    { label: 'Duplicate', icon: Copy, onClick: () => handleDuplicate() },
    { divider: true },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => handleDelete() },
  ]}
/>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Disabled item</h2>
          <p className="text-gray-600 mb-4">
            Set <code className="font-mono text-sm">disabled: true</code> on an item to render it
            unselectable. Its <code className="font-mono text-sm">onClick</code> will not fire.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <Menu
              trigger={<Button variant="outline">Actions</Button>}
              items={[
                { label: 'Edit', icon: Pencil, onClick: () => alert('Edit') },
                { label: 'Duplicate', icon: Copy, disabled: true, onClick: () => alert('Duplicate') },
                { label: 'Delete', icon: Trash2, danger: true, onClick: () => alert('Delete') },
              ]}
            />
          </div>
          <CodeBlock code={`<Menu
  trigger={<Button variant="outline">Actions</Button>}
  items={[
    { label: 'Edit', icon: Pencil, onClick: () => handleEdit() },
    { label: 'Duplicate', icon: Copy, disabled: true, onClick: () => handleDuplicate() },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => handleDelete() },
  ]}
/>`} />
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
                <PropRow name="trigger" type="element" def="—" desc="React element cloned with onClick + aria-haspopup/aria-expanded to toggle the menu" />
                <PropRow name="items" type="array" def="[]" desc="Array of item objects (see shape below)" />
                <PropRow name="align" type="string" def="'left'" desc="'left' or 'right' — which edge of the trigger the dropdown anchors to" />
                <PropRow name="className" type="string" def="''" desc="Additional CSS classes on the wrapper" />
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 mt-4">
            Each entry in <code className="font-mono text-sm">items</code> is either an action of the
            shape{' '}
            <code className="font-mono text-sm">
              {`{ label, icon, onClick, disabled, danger }`}
            </code>{' '}
            or a divider of the shape{' '}
            <code className="font-mono text-sm">{`{ divider: true }`}</code>. The{' '}
            <code className="font-mono text-sm">icon</code> is a Lucide component,{' '}
            <code className="font-mono text-sm">disabled</code> makes the item unselectable, and{' '}
            <code className="font-mono text-sm">danger</code> styles it as a destructive action.
          </p>
        </section>
      </div>
    </div>
  );
}
