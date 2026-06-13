import React, { useState } from 'react';
import Modal from '../components/Modal';
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

export default function ModalPage() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Modal</h1>
          <p className="text-xl text-gray-600">
            A focused overlay dialog rendered in a portal, with backdrop, Escape-to-close, and scroll lock.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import Modal from './components/Modal';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic dialog</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <Button onClick={() => setBasicOpen(true)}>Open modal</Button>
            <Modal
              isOpen={basicOpen}
              onClose={() => setBasicOpen(false)}
              title="Share this project"
            >
              <p>
                Anyone with the link can view this project. You can revoke access at any time
                from the settings page.
              </p>
            </Modal>
          </div>
          <CodeBlock code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open modal</Button>

<Modal isOpen={open} onClose={() => setOpen(false)} title="Share this project">
  <p>Anyone with the link can view this project.</p>
</Modal>`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">With footer actions</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              Delete account
            </Button>
            <Modal
              isOpen={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              title="Delete account?"
              size="sm"
              footer={
                <>
                  <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={() => setConfirmOpen(false)}>Delete</Button>
                </>
              }
            >
              <p>This action is permanent and cannot be undone.</p>
            </Modal>
          </div>
          <CodeBlock code={`<Modal
  isOpen={open}
  onClose={close}
  title="Delete account?"
  size="sm"
  footer={
    <>
      <Button variant="outline" onClick={close}>Cancel</Button>
      <Button variant="destructive" onClick={confirm}>Delete</Button>
    </>
  }
>
  <p>This action is permanent and cannot be undone.</p>
</Modal>`} />
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
                <PropRow name="isOpen" type="boolean" def="—" desc="Whether the modal is visible" />
                <PropRow name="onClose" type="function" def="—" desc="Called on overlay click, Escape, or close button" />
                <PropRow name="title" type="string" def="—" desc="Header title" />
                <PropRow name="children" type="node" def="—" desc="Body content" />
                <PropRow name="footer" type="node" def="—" desc="Footer content (usually action buttons)" />
                <PropRow name="size" type="'sm'|'md'|'lg'|'xl'" def="'md'" desc="Maximum width" />
                <PropRow name="closeOnOverlay" type="boolean" def="true" desc="Close when the backdrop is clicked" />
                <PropRow name="showClose" type="boolean" def="true" desc="Show the header close button" />
                <PropRow name="className" type="string" def="''" desc="Additional CSS classes on the dialog" />
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
