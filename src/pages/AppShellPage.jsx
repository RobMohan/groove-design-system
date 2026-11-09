import React, { useState } from 'react';
import SegmentedControl from '../components/SegmentedControl';
import AppShellExample from '../examples/AppShellExample';
import FullscreenFrame from '../layout/FullscreenFrame';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const Code = ({ children }) => <code className="bg-surface-muted px-2 py-1 rounded text-sm">{children}</code>;

const PropsTable = ({ rows, first = 'Prop' }) => (
  <div className="bg-surface-raised rounded-lg border border-line overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-line">
          <th className="py-3 px-4 font-semibold">{first}</th>
          <th className="py-3 px-4 font-semibold">Type</th>
          <th className="py-3 px-4 font-semibold">Default</th>
          <th className="py-3 px-4 font-semibold">Description</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {rows.map(([prop, type, def, desc]) => (
          <tr key={prop} className="border-b border-line last:border-0">
            <td className="py-3 px-4 font-mono text-sm whitespace-nowrap">{prop}</td>
            <td className="py-3 px-4 font-mono text-xs text-ink-muted">{type}</td>
            <td className="py-3 px-4 font-mono text-xs">{def}</td>
            <td className="py-3 px-4">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const appShellRows = [
  ['brand', '{ logo, name }', '—', 'Top of the sidebar. The logo stays visible when the sidebar is collapsed; the name is hidden.'],
  ['navigation', 'Array<{ title?, items }>', '[]', 'Sidebar sections. Each item is described in the table below.'],
  ['activeId', 'string', '—', 'The id of the active item. It gets aria-current="page" and the active style.'],
  ['onNavigate', '(item, event) => void', '—', 'Called when an item is chosen. Also closes the mobile slide-over.'],
  ['collapsible', 'boolean', 'true', 'Show the collapse toggle at the bottom of the sidebar (wide layout only).'],
  ['collapsed', 'boolean', '—', 'Controlled collapsed state. Omit it to let the shell manage its own.'],
  ['defaultCollapsed', 'boolean', 'false', 'Initial state when uncontrolled.'],
  ['onCollapsedChange', '(collapsed) => void', '—', 'Called when the toggle is used.'],
  ['sidebarFooter', 'node | ({ compact, collapsed }) => node', '—', 'Content pinned above the collapse toggle. A plain node is hidden while collapsed; pass a function to adapt instead.'],
  ['title', 'node', '—', 'Header title, used when there are no breadcrumbs.'],
  ['breadcrumbs', 'Array<{ label, to?, href?, onClick? }>', '—', 'Header trail, rendered with Breadcrumbs. In the compact layout only the current page is shown.'],
  ['search', '{ placeholder?, shortcut?, onClick }', '—', 'A search trigger in the header. It becomes an icon button in the compact layout. Open a Command Palette from onClick.'],
  ['actions', 'node | ({ compact, collapsed }) => node', '—', 'Header actions, shown before the account menu. Use the function form to change them in the compact layout.'],
  ['user', '{ name, email?, src?, status? }', '—', 'The signed-in person. Renders an avatar button that opens userMenu.'],
  ['userMenu', 'Menu items', '[]', 'Items for the account menu, in the same shape the Menu component takes.'],
  ['breakpoint', 'number', '768', 'Width in px of the shell itself below which the compact layout is used.'],
  ['fluid', 'boolean', 'false', 'Let content fill the full width instead of capping it at 72rem.'],
  ['linkComponent', 'Component', 'react-router Link', 'Used for items and breadcrumbs that set `to`.'],
  ['navLabel', 'string', "'Primary'", 'Accessible name of the sidebar navigation landmark.'],
  ['className', 'string', "''", 'Additional classes on the outer element.'],
  ['children', 'node', '—', 'The page content, rendered in the scrolling main area.'],
];

const itemRows = [
  ['id', 'string', '—', 'Identifies the item. Match it with activeId.'],
  ['label', 'string', '—', 'Visible text. Kept for screen readers and the tooltip when the sidebar is collapsed.'],
  ['icon', 'component', '—', 'A Lucide icon component (20px).'],
  ['to', 'string', '—', 'Renders a router link.'],
  ['href', 'string', '—', 'Renders a plain anchor.'],
  ['onClick', '(event) => void', '—', 'Runs on activation. With neither to nor href the item is a button.'],
  ['badge', 'string | number', '—', 'A count or tag on the right. Collapsed, it becomes a dot and stays in the accessible name.'],
];

const pageHeaderRows = [
  ['title', 'string', '—', 'The page heading.'],
  ['description', 'string', '—', 'Supporting text under the heading.'],
  ['actions', 'node', '—', 'Page-level buttons, aligned right and wrapping on narrow widths.'],
  ['as', "'h1' | 'h2' | …", "'h1'", 'The heading element. Use h2 when the shell is embedded in a page that already has an h1.'],
];

const viewports = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'mobile', label: 'Mobile' },
];
const widths = { desktop: '100%', tablet: '820px', mobile: '390px' };

export default function AppShellPage() {
  const [viewport, setViewport] = useState('desktop');

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">App Shell</h1>
          <p className="text-xl text-ink-muted">
            The frame around an application: a collapsible sidebar, a header with search and an account menu, and a
            scrolling content area. A clean starting point to copy into a new app.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Try it</h2>
          <p className="text-ink-muted mb-4">
            This is a working record pressing plant dashboard built on the shell, with an accessible chart, live press
            status and an order list. Click through the sidebar, expand it from the icon rail, press{' '}
            <kbd className="text-xs font-mono border border-line rounded px-1.5 py-0.5">⌘K</kbd> (or{' '}
            <kbd className="text-xs font-mono border border-line rounded px-1.5 py-0.5">Ctrl K</kbd>) to search, and open the
            account menu. Switch the width to see the compact layout, press Expand to fill the whole browser, and use the theme toggle in the site sidebar to see dark mode.
          </p>
          <FullscreenFrame
            label="Deep Groove, a record pressing plant app built on App Shell"
            toolbar={
              <SegmentedControl
                aria-label="Preview width"
                size="sm"
                options={viewports}
                value={viewport}
                onChange={setViewport}
              />
            }
            slotClassName="mx-auto h-[680px] max-w-full overflow-hidden rounded-card border border-line shadow-elevation-3 transition-[width] duration-300 motion-reduce:transition-none"
            slotStyle={{ width: widths[viewport] }}
          >
            <AppShellExample />
          </FullscreenFrame>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import AppShell, { PageHeader } from './components/AppShell';`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic usage</h2>
          <p className="text-ink-muted mb-4">
            The shell fills its parent, so give it a height. Pass your navigation and the active item, then render
            the page as children.
          </p>
          <CodeBlock
            code={`import { LayoutDashboard, ListChecks, Settings } from 'lucide-react';

const navigation = [
  {
    title: 'Plant',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard, to: '/' },
      { id: 'orders', label: 'Orders', icon: ListChecks, to: '/orders', badge: 21 },
    ],
  },
  { title: 'Account', items: [{ id: 'settings', label: 'Settings', icon: Settings, to: '/settings' }] },
];

<div className="h-screen">
  <AppShell
    brand={{ logo: <MyLogo />, name: 'Deep Groove' }}
    navigation={navigation}
    activeId="orders"
    breadcrumbs={[{ label: 'Deep Groove' }, { label: 'Orders' }]}
    user={{ name: 'Dana Reyes', email: 'dana@deepgroove.example' }}
    userMenu={[{ label: 'Sign out', danger: true, onClick: signOut }]}
  >
    <PageHeader title="Orders" description="Every job from mastering to shipment." />
    {/* page content */}
  </AppShell>
</div>`}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Anatomy</h2>
          <ul className="space-y-3 text-ink-muted">
            <li><span className="font-semibold text-ink">Sidebar.</span> Brand, grouped navigation, an optional footer, and the collapse toggle. It collapses to an icon rail with tooltips.</li>
            <li><span className="font-semibold text-ink">Header.</span> Breadcrumbs or a title on the left; search, actions and the account menu on the right. It gains a soft shadow once the content scrolls beneath it.</li>
            <li><span className="font-semibold text-ink">Main.</span> The only scrolling region. Content is capped at 72rem and centered unless you set <Code>fluid</Code>.</li>
            <li><span className="font-semibold text-ink">Slide-over.</span> In the compact layout the sidebar moves into a panel opened from a header button.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Navigation items</h2>
          <p className="text-ink-muted mb-4">
            An item is a router link when it sets <Code>to</Code>, an anchor when it sets <Code>href</Code>, and a button
            otherwise. The shell does not own your routes: set <Code>activeId</Code> from your router or from state.
          </p>
          <PropsTable rows={itemRows} first="Field" />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Search with the Command Palette</h2>
          <p className="text-ink-muted mb-4">
            The header search is a trigger, not a field. Open a <Code>CommandPalette</Code> from it and bind the shortcut
            with <Code>useCommandK</Code>, as the demo above does.
          </p>
          <CodeBlock
            code={`import CommandPalette, { useCommandK } from './components/CommandPalette';

const [open, setOpen] = useState(false);
useCommandK(() => setOpen((o) => !o));

<AppShell search={{ placeholder: 'Search…', shortcut: '⌘K', onClick: () => setOpen(true) }} … />
<CommandPalette open={open} onClose={() => setOpen(false)} items={commands} />`}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Responsive behavior</h2>
          <p className="text-ink-muted mb-4">
            The layout follows the width of the shell itself, not the browser window, so it behaves the same full-page
            or inside a frame. Below <Code>breakpoint</Code> (768px by default) the sidebar becomes a slide-over opened
            from a menu button, and breadcrumbs shrink to the current page. Between that and 1100px the account button drops
            its name, and below 900px search becomes an icon. Use the function form of <Code>actions</Code> to change what shows:
          </p>
          <CodeBlock
            code={`<AppShell
  actions={({ compact }) => (
    <>
      <IconButton icon={Bell} label="Notifications" variant="ghost" />
      {!compact && <Button size="small" icon={Plus}>New</Button>}
    </>
  )}
/>`}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sizing page content</h2>
          <p className="text-ink-muted mb-4">
            Tailwind&apos;s <Code>sm:</Code> and <Code>lg:</Code> breakpoints follow the browser window, but the shell
            follows its own width, so a framed or side-by-side shell would get desktop layouts in a narrow space. Inside
            the shell, read the real layout with <Code>useAppShell()</Code> and size your content from that:
          </p>
          <CodeBlock
            code={`import { useAppShell } from './components/AppShell';

function Stats() {
  const { compact, tight, width } = useAppShell(); // compact: < 768px, tight: < 1100px
  return (
    <div className={\`grid gap-4 \${compact ? 'grid-cols-1' : 'grid-cols-3'}\`}>
      {/* … */}
    </div>
  );
}`}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Collapsible sidebar</h2>
          <p className="text-ink-muted mb-4">
            The shell remembers nothing between visits. To persist the choice, control it:
          </p>
          <CodeBlock
            code={`const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar') === 'collapsed');

<AppShell
  collapsed={collapsed}
  onCollapsedChange={(next) => {
    setCollapsed(next);
    localStorage.setItem('sidebar', next ? 'collapsed' : 'open');
  }}
  …
/>`}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Page header</h2>
          <p className="text-ink-muted mb-4">A heading row for the top of each page inside the shell.</p>
          <PropsTable rows={pageHeaderRows} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Props</h2>
          <PropsTable rows={appShellRows} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
          <ul className="list-disc pl-5 space-y-2 text-ink-muted">
            <li>Landmarks: a labelled <Code>aside</Code> and <Code>nav</Code> for the sidebar, a <Code>header</Code>, and one <Code>main</Code> that receives focus from the skip link.</li>
            <li>A &quot;Skip to main content&quot; link appears on first Tab.</li>
            <li>The active item has <Code>aria-current=&quot;page&quot;</Code>. Section titles are visual only; each list is labelled with its title.</li>
            <li>When the sidebar is collapsed, labels stay in the accessibility tree and show as tooltips on hover and keyboard focus.</li>
            <li>The slide-over is a modal dialog: focus moves in and loops, Escape closes it, and focus returns to the menu button.</li>
            <li>The collapse toggle reports <Code>aria-expanded</Code>. The menu button reports it too, for the slide-over.</li>
            <li>Motion respects reduced-motion preferences.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Usage</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 rounded-lg border border-positive bg-positive/5 p-5">
              <div className="font-semibold text-ink mb-2">✓ Do</div>
              <ul className="text-sm text-ink-muted space-y-1 list-disc pl-4">
                <li>Keep primary navigation to 5–8 items, grouped under short titles.</li>
                <li>Set <Code>activeId</Code> from your router so the sidebar always matches the page.</li>
                <li>Put the one main action for the app in the header, and page actions in <Code>PageHeader</Code>.</li>
              </ul>
            </div>
            <div className="flex-1 rounded-lg border border-destructive bg-destructive/5 p-5">
              <div className="font-semibold text-ink mb-2">✗ Don&apos;t</div>
              <ul className="text-sm text-ink-muted space-y-1 list-disc pl-4">
                <li>Nest a second sidebar inside the content area. Use Tabs for sub-sections.</li>
                <li>Use icons without labels as the only navigation; collapse is for power users.</li>
                <li>Render the shell without a height. It fills its parent and will collapse to nothing.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
