import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Home, Folder } from 'lucide-react';
import AppShell, { PageHeader, useAppShell } from './AppShell';

// ---- A controllable ResizeObserver ---------------------------------------------

let observers = [];
class FakeResizeObserver {
  constructor(cb) {
    this.cb = cb;
    observers.push(this);
  }
  observe() {}
  disconnect() {
    observers = observers.filter((o) => o !== this);
  }
}
const resizeTo = (width) =>
  act(() => {
    observers.forEach((o) => o.cb([{ contentRect: { width } }]));
  });

beforeEach(() => {
  observers = [];
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
});
afterEach(() => vi.unstubAllGlobals());

// ---- Fixtures --------------------------------------------------------------------

const navigation = [
  {
    title: 'Workspace',
    items: [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'projects', label: 'Projects', icon: Folder, badge: 6 },
    ],
  },
  { title: 'Links', items: [{ id: 'docs', label: 'Docs', href: 'https://example.com/docs' }, { id: 'to', label: 'Routed', to: '/routed' }] },
];

const setup = (props = {}) =>
  render(
    <MemoryRouter>
      <AppShell
        brand={{ logo: <span data-testid="logo" />, name: 'Northwind' }}
        navigation={navigation}
        activeId="home"
        {...props}
      >
        <p>Page content</p>
      </AppShell>
    </MemoryRouter>,
  );

// ---- Tests -----------------------------------------------------------------------

describe('AppShell structure', () => {
  it('renders the landmarks and content', () => {
    setup();
    expect(screen.getByRole('complementary', { name: 'Sidebar' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('Page content');
    expect(screen.getByText('Northwind')).toBeInTheDocument();
  });

  it('labels each section list with its title', () => {
    setup();
    expect(screen.getByRole('list', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Links' })).toBeInTheDocument();
  });

  it('marks only the active item as the current page', () => {
    setup({ activeId: 'projects' });
    expect(screen.getByRole('button', { name: /Projects/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('renders buttons, anchors and router links by item type', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', 'https://example.com/docs');
    expect(screen.getByRole('link', { name: 'Routed' })).toHaveAttribute('href', '/routed');
  });

  it('calls onNavigate with the item, and the item onClick', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const onClick = vi.fn();
    setup({ onNavigate, navigation: [{ items: [{ id: 'a', label: 'Alpha', onClick }] }] });
    await user.click(screen.getByRole('button', { name: 'Alpha' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({ id: 'a' }), expect.anything());
  });

  it('offers a skip link that moves focus to the main region', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByText('Skip to main content'));
    expect(screen.getByRole('main')).toHaveFocus();
  });
});

describe('collapsible sidebar', () => {
  it('collapses and expands, keeping accessible names', async () => {
    const user = userEvent.setup();
    setup();
    const toggle = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Northwind')).toBeInTheDocument();

    await user.click(toggle);
    const expand = screen.getByRole('button', { name: 'Expand sidebar' });
    expect(expand).toHaveAttribute('aria-expanded', 'false');
    // The brand name is hidden, but nav items are still reachable by name.
    expect(screen.queryByText('Northwind')).toBeNull();
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();

    await user.click(expand);
    expect(screen.getByText('Northwind')).toBeInTheDocument();
  });

  it('keeps the badge count in the accessible name when collapsed', () => {
    setup({ defaultCollapsed: true });
    expect(screen.getByRole('button', { name: 'Projects, 6' })).toBeInTheDocument();
  });

  it('shows a tooltip with the label on hover when collapsed', async () => {
    const user = userEvent.setup();
    setup({ defaultCollapsed: true });
    await user.hover(screen.getByRole('button', { name: 'Home' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Home');
  });

  it('supports a controlled collapsed state', async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();
    setup({ collapsed: false, onCollapsedChange });
    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    // Still expanded: the parent did not update the prop.
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toBeInTheDocument();
  });

  it('hides the toggle when collapsible is false', () => {
    setup({ collapsible: false });
    expect(screen.queryByRole('button', { name: /sidebar/i })).toBeNull();
  });

  it('hides a plain-node footer when collapsed but lets a function adapt', async () => {
    const user = userEvent.setup();
    const { unmount } = setup({ sidebarFooter: <p>Plain footer</p> });
    expect(screen.getByText('Plain footer')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(screen.queryByText('Plain footer')).toBeNull();
    unmount();

    setup({ defaultCollapsed: true, sidebarFooter: ({ collapsed }) => <p>{collapsed ? 'rail' : 'full'}</p> });
    expect(screen.getByText('rail')).toBeInTheDocument();
  });
});

describe('header', () => {
  it('renders breadcrumbs, with the last one as the current page', () => {
    setup({ breadcrumbs: [{ label: 'Workspace', href: '#' }, { label: 'Projects' }] });
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(nav).getByText('Projects')).toHaveAttribute('aria-current', 'page');
  });

  it('falls back to a title when there are no breadcrumbs', () => {
    setup({ title: 'Dashboard' });
    expect(within(screen.getByRole('banner')).getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders a search trigger that reports clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    setup({ search: { placeholder: 'Search docs', shortcut: '⌘K', onClick } });
    const trigger = screen.getByRole('button', { name: /Search docs/ });
    expect(within(trigger).getByText('⌘K')).toBeInTheDocument();
    await user.click(trigger);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders actions, and the function form receives the layout', () => {
    const actions = vi.fn(() => <button type="button">New</button>);
    setup({ actions });
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
    expect(actions).toHaveBeenCalledWith(expect.objectContaining({ compact: false, collapsed: false }));
  });

  it('opens the account menu and runs an item', async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn();
    setup({
      user: { name: 'Jordan Lee', email: 'jordan@example.com' },
      userMenu: [{ label: 'Profile' }, { divider: true }, { label: 'Sign out', danger: true, onClick: onSignOut }],
    });
    await user.click(screen.getByRole('button', { name: /Jordan Lee/ }));
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument();
    await user.click(screen.getByRole('menuitem', { name: 'Sign out' }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it('adds a shadow to the header once the content has scrolled', () => {
    setup();
    const header = screen.getByRole('banner');
    expect(header).not.toHaveClass('shadow-elevation-2');
    const main = screen.getByRole('main');
    Object.defineProperty(main, 'scrollTop', { value: 40, configurable: true });
    fireEvent.scroll(main);
    expect(header).toHaveClass('shadow-elevation-2');
  });

  it('drops the account name below the tight width and turns search into an icon below 900px', async () => {
    setup({
      user: { name: 'Jordan Lee', email: 'jordan@example.com' },
      search: { placeholder: 'Search docs', shortcut: '⌘K', onClick: () => {} },
    });
    resizeTo(1000);
    // Name text is still in the DOM (screen-reader only), the shortcut hint is still shown.
    expect(screen.getByText('Jordan Lee')).toHaveClass('block');
    expect(screen.getByText('⌘K')).toBeInTheDocument();

    resizeTo(850);
    expect(screen.queryByText('⌘K')).toBeNull();
    expect(screen.getByRole('button', { name: 'Search docs' })).toBeInTheDocument();
  });
});

describe('compact layout', () => {
  it('replaces the sidebar with a menu button and shows only the current crumb', () => {
    setup({ breadcrumbs: [{ label: 'Workspace' }, { label: 'Projects' }] });
    resizeTo(500);
    expect(screen.queryByRole('complementary', { name: 'Sidebar' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Breadcrumb' })).toBeNull();
    expect(within(screen.getByRole('banner')).getByText('Projects')).toBeInTheDocument();
  });

  it('opens the navigation as a modal dialog and closes it with Escape, restoring focus', async () => {
    const user = userEvent.setup();
    setup();
    resizeTo(500);
    const opener = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(opener);

    const dialog = screen.getByRole('dialog', { name: 'Navigation' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(opener).toHaveAttribute('aria-expanded', 'true');
    expect(within(dialog).getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(dialog).toContainElement(document.activeElement);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(opener).toHaveFocus();
  });

  it('closes after choosing an item and reports the choice', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    setup({ onNavigate });
    resizeTo(500);
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /Projects/ }));
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({ id: 'projects' }), expect.anything());
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes with its close button and when the shell grows wide again', async () => {
    const user = userEvent.setup();
    setup();
    resizeTo(500);
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    await user.click(screen.getByRole('button', { name: 'Close navigation' }));
    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    resizeTo(1200);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('complementary', { name: 'Sidebar' })).toBeInTheDocument();
  });

  it('honors a custom breakpoint', () => {
    setup({ breakpoint: 1000 });
    resizeTo(900);
    expect(screen.getByRole('button', { name: 'Open navigation' })).toBeInTheDocument();
  });
});

describe('useAppShell and PageHeader', () => {
  it('exposes the layout to children', () => {
    const Probe = () => {
      const { compact, width } = useAppShell();
      return <p>{compact ? 'compact' : 'wide'} {width}</p>;
    };
    render(
      <MemoryRouter>
        <AppShell navigation={navigation}>
          <Probe />
        </AppShell>
      </MemoryRouter>,
    );
    resizeTo(500);
    expect(screen.getByText('compact 500')).toBeInTheDocument();
  });

  it('PageHeader renders the heading level, description and actions', () => {
    render(<PageHeader as="h2" title="Projects" description="All of them" actions={<button type="button">New</button>} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByText('All of them')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
  });
});
