import React, { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu as MenuIcon, PanelLeftClose, PanelLeftOpen, Search, X } from 'lucide-react';
import Avatar from './Avatar';
import Breadcrumbs from './Breadcrumbs';
import IconButton from './IconButton';
import Menu from './Menu';
import Tooltip from './Tooltip';
import useFocusTrap from '../hooks/useFocusTrap';

/*
 * AppShell — the frame around an application: a collapsible sidebar, a header
 * with breadcrumbs / search / actions / account menu, and a scrolling content
 * area. It is a starting point to copy, not a router: you own the routes and
 * pass the active item in.
 *
 * Layout is driven by the shell's OWN width (not the viewport), so it behaves
 * the same in a full-page app and in a framed preview. Below `breakpoint` the
 * sidebar becomes a slide-over opened from a header button.
 *
 * Give the shell a height (for example `h-screen`); it fills its parent.
 */

// ---- Hooks -------------------------------------------------------------------

/** Tracks the element's own width in px (null until measured). */
function useElementWidth(ref) {
  const [width, setWidth] = useState(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const read = () => el.getBoundingClientRect().width || el.offsetWidth || window.innerWidth;
    setWidth(read());
    if (typeof ResizeObserver === 'undefined') {
      const onResize = () => setWidth(read());
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect?.width;
      if (typeof next === 'number') setWidth(next);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

// Below these shell widths the header sheds detail to keep the breadcrumbs readable:
// the account button drops its name and email, then search becomes an icon.
const TIGHT_WIDTH = 1100;
const ICON_SEARCH_WIDTH = 900;

/** Controlled when `value` is given, otherwise internal state seeded by `initial`. */
function useControllable(value, initial, onChange) {
  const [internal, setInternal] = useState(initial);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;
  const set = useCallback(
    (next) => {
      if (!controlled) setInternal(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, set];
}

const ShellContext = createContext({ compact: false, tight: false, collapsed: false, width: null });

/**
 * useAppShell — read the shell's current layout from inside its children.
 *
 * Tailwind's `sm:`/`lg:` breakpoints follow the browser window, but the shell
 * follows its own width. Use this to size page content to the space it actually
 * has: `const { compact, width } = useAppShell();` (width is the shell's px width,
 * or null before it is measured).
 */
export const useAppShell = () => useContext(ShellContext);

const resolve = (slot, context) => (typeof slot === 'function' ? slot(context) : slot);

// ---- Sidebar navigation ------------------------------------------------------

const itemBase =
  'group relative flex items-center rounded-control text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus';
const itemIdle = 'text-ink-muted hover:bg-surface-muted hover:text-ink';
const itemActive =
  'bg-primary/10 text-ink before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:rounded-pill before:bg-primary';

function NavItem({ item, active, collapsed, onSelect, LinkComponent }) {
  const Icon = item.icon;
  const classes = `${itemBase} ${active ? itemActive : itemIdle} ${
    collapsed ? 'h-10 w-10 justify-center' : 'w-full gap-3 px-3 py-2.5'
  }`;

  const content = (
    <>
      {Icon && (
        <Icon
          size={20}
          aria-hidden="true"
          className={`shrink-0 ${active ? 'text-primary' : 'text-ink-muted group-hover:text-ink'}`}
        />
      )}
      {/* Collapsed rails keep the label for assistive tech and show it in a tooltip. */}
      <span className={collapsed ? 'sr-only' : 'flex-1 truncate text-left'}>{item.label}</span>
      {item.badge != null &&
        (collapsed ? (
          <>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-pill bg-primary" aria-hidden="true" />
            <span className="sr-only">, {item.badge}</span>
          </>
        ) : (
          <span className="shrink-0 rounded-pill bg-surface-muted px-2 py-0.5 text-xs font-medium text-ink group-hover:bg-surface-raised">
            {item.badge}
          </span>
        ))}
    </>
  );

  const shared = {
    className: classes,
    'aria-current': active ? 'page' : undefined,
    onClick: (event) => {
      item.onClick?.(event);
      onSelect?.(item, event);
    },
  };

  let element;
  if (item.to != null) {
    element = (
      <LinkComponent to={item.to} {...shared}>
        {content}
      </LinkComponent>
    );
  } else if (item.href) {
    element = (
      <a href={item.href} {...shared}>
        {content}
      </a>
    );
  } else {
    element = (
      <button type="button" {...shared}>
        {content}
      </button>
    );
  }

  if (!collapsed) return element;
  return (
    <Tooltip content={item.label} position="right" className="w-full justify-center">
      {element}
    </Tooltip>
  );
}

function SidebarContent({
  brand,
  navigation,
  activeId,
  collapsed,
  footer,
  onSelect,
  LinkComponent,
  toggle,
  onClose,
  navLabel,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={`flex h-16 shrink-0 items-center gap-3 border-b border-line ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
        {brand?.logo && <span className="flex shrink-0 items-center">{brand.logo}</span>}
        {brand?.name && !collapsed && <span className="flex-1 truncate text-base font-semibold text-ink">{brand.name}</span>}
        {onClose && (
          <IconButton icon={X} label="Close navigation" variant="ghost" size="sm" onClick={onClose} className="ml-auto" />
        )}
      </div>

      <nav aria-label={navLabel} className={`min-h-0 flex-1 space-y-6 overflow-y-auto px-3 py-4`}>
        {navigation.map((section, i) => (
          <div key={section.title ?? i}>
            {section.title &&
              (collapsed ? (
                <div className="mx-auto mb-3 h-px w-6 bg-line" aria-hidden="true" />
              ) : (
                <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-ink-muted" aria-hidden="true">
                  {section.title}
                </div>
              ))}
            <ul aria-label={section.title} className={`space-y-1 ${collapsed ? 'flex flex-col items-center' : ''}`}>
              {section.items.map((item) => (
                <li key={item.id ?? item.label} className={collapsed ? 'w-full' : undefined}>
                  <NavItem
                    item={item}
                    active={item.id != null && item.id === activeId}
                    collapsed={collapsed}
                    onSelect={onSelect}
                    LinkComponent={LinkComponent}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {(footer || toggle) && (
        <div className="shrink-0 space-y-2 border-t border-line p-3">
          {footer}
          {toggle}
        </div>
      )}
    </div>
  );
}

// ---- Header pieces -----------------------------------------------------------

function SearchTrigger({ search, compact }) {
  const placeholder = search.placeholder ?? 'Search';
  if (compact) {
    return <IconButton icon={Search} label={placeholder} variant="ghost" onClick={search.onClick} />;
  }
  return (
    <button
      type="button"
      onClick={search.onClick}
      className="flex h-10 w-72 min-w-[8rem] shrink items-center gap-2 rounded-control border-2 border-line-strong bg-surface-raised px-3 text-sm text-ink-muted transition-colors hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <Search size={16} className="shrink-0" aria-hidden="true" />
      <span className="flex-1 truncate text-left">{placeholder}</span>
      {search.shortcut && (
        <kbd className="rounded border border-line bg-surface-muted px-1.5 py-0.5 font-mono text-xs text-ink-muted">
          {search.shortcut}
        </kbd>
      )}
    </button>
  );
}

function AccountMenu({ user, items, condensed }) {
  return (
    <Menu
      align="right"
      items={items}
      trigger={
        <button
          type="button"
          className="flex items-center gap-2 rounded-control p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus hover:bg-surface-muted"
        >
          <Avatar name={user.name} src={user.src} status={user.status} size="sm" />
          {/* Name and email double as the button's accessible name. */}
          <span className={condensed ? 'sr-only' : 'pr-1 text-left leading-tight'}>
            <span className="block text-sm font-medium text-ink">{user.name}</span>
            {user.email && <span className="block text-xs text-ink-muted">{user.email}</span>}
          </span>
          <ChevronDown size={16} className="-ml-0.5 text-ink-muted" aria-hidden="true" />
        </button>
      }
    />
  );
}

// ---- AppShell ----------------------------------------------------------------

const AppShell = ({
  brand,
  navigation = [],
  activeId,
  onNavigate,
  collapsible = true,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  sidebarFooter,
  title,
  breadcrumbs,
  search,
  actions,
  user,
  userMenu = [],
  breakpoint = 768,
  fluid = false,
  linkComponent,
  navLabel = 'Primary',
  className = '',
  children,
}) => {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const panelRef = useRef(null);
  const width = useElementWidth(rootRef);
  const compact = width != null && width < breakpoint;
  const tight = width != null && width < TIGHT_WIDTH;
  const iconSearch = width != null && width < ICON_SEARCH_WIDTH;
  const [collapsed, setCollapsed] = useControllable(collapsedProp, defaultCollapsed, onCollapsedChange);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerId = useId();
  const mainId = useId();
  const LinkComponent = linkComponent || Link;

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Growing back to a wide layout closes the slide-over.
  useEffect(() => {
    if (!compact) setDrawerOpen(false);
  }, [compact]);

  useFocusTrap(panelRef, { active: compact && drawerOpen, onEscape: closeDrawer });

  const handleSelect = (item, event) => {
    onNavigate?.(item, event);
    setDrawerOpen(false);
  };

  const context = { compact, tight, collapsed: compact ? false : collapsed, width };
  const showCollapsed = !compact && collapsed;

  const toggle =
    collapsible && !compact ? (
      <ToggleButton collapsed={collapsed} onClick={() => setCollapsed(!collapsed)} />
    ) : null;

  const sidebarProps = {
    brand,
    navigation,
    activeId,
    // A plain node would overflow the narrow rail; a function can adapt to `collapsed` itself.
    footer: showCollapsed && typeof sidebarFooter !== 'function' ? null : resolve(sidebarFooter, context),
    onSelect: handleSelect,
    LinkComponent,
    navLabel,
  };

  const lastCrumb = breadcrumbs?.[breadcrumbs.length - 1]?.label;

  return (
    <ShellContext.Provider value={context}>
      <div
        ref={rootRef}
        className={`relative isolate flex h-full min-h-0 w-full overflow-hidden bg-surface text-ink ${className}`}
      >
        <a
          href={`#${mainId}`}
          onClick={(event) => {
            event.preventDefault();
            mainRef.current?.focus();
          }}
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-tooltip focus:rounded-control focus:bg-surface-raised focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-ink focus:shadow-elevation-3 focus:outline-none focus:ring-2 focus:ring-focus"
        >
          Skip to main content
        </a>

        {!compact && (
          <aside
            aria-label="Sidebar"
            className={`shrink-0 border-r border-line bg-surface-raised transition-[width] duration-200 motion-reduce:transition-none ${
              showCollapsed ? 'w-[4.5rem]' : 'w-64'
            }`}
          >
            <SidebarContent {...sidebarProps} collapsed={showCollapsed} toggle={toggle} />
          </aside>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header
            className={`relative z-sticky shrink-0 border-b border-line bg-surface-raised transition-shadow motion-reduce:transition-none ${
              scrolled ? 'shadow-elevation-2' : ''
            }`}
          >
            <div className={`flex h-16 items-center gap-3 ${compact ? 'px-4' : 'px-6'}`}>
              {compact && (
                <IconButton
                  icon={MenuIcon}
                  label="Open navigation"
                  variant="ghost"
                  aria-expanded={drawerOpen}
                  aria-controls={drawerId}
                  onClick={() => setDrawerOpen(true)}
                />
              )}

              <div className="min-w-[7rem] max-w-[55%] shrink-0 grow overflow-hidden [&_li]:whitespace-nowrap [&_ol]:flex-nowrap">
                {breadcrumbs?.length ? (
                  compact ? (
                    <div className="truncate text-base font-semibold text-ink">{lastCrumb}</div>
                  ) : (
                    <Breadcrumbs items={breadcrumbs} linkComponent={linkComponent} />
                  )
                ) : (
                  title && <div className="truncate text-base font-semibold text-ink">{title}</div>
                )}
              </div>

              {search && <SearchTrigger search={search} compact={iconSearch} />}
              {actions && <div className="flex shrink-0 items-center gap-1">{resolve(actions, context)}</div>}
              {user && <AccountMenu user={user} items={userMenu} condensed={tight} />}
            </div>
          </header>

          <main
            id={mainId}
            ref={mainRef}
            tabIndex={-1}
            onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 0)}
            className="min-h-0 flex-1 overflow-y-auto focus:outline-none"
          >
            <div className={`${compact ? 'p-4' : tight ? 'p-6' : 'p-8'} ${fluid ? '' : 'mx-auto w-full max-w-6xl'}`}>{children}</div>
          </main>
        </div>

        {compact && drawerOpen && (
          <div className="absolute inset-0 z-drawer">
            <div className="absolute inset-0 animate-fade-in bg-black/50" onClick={closeDrawer} aria-hidden="true" />
            <aside
              id={drawerId}
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="absolute inset-y-0 left-0 w-72 max-w-[85%] animate-slide-in-from-left bg-surface-raised shadow-elevation-5 outline-none motion-reduce:animate-none"
            >
              <SidebarContent {...sidebarProps} collapsed={false} onClose={closeDrawer} />
            </aside>
          </div>
        )}
      </div>
    </ShellContext.Provider>
  );
};

function ToggleButton({ collapsed, onClick }) {
  const label = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
  const button = (
    <button
      type="button"
      aria-label={label}
      aria-expanded={!collapsed}
      onClick={onClick}
      className={`${itemBase} ${itemIdle} ${collapsed ? 'h-10 w-10 justify-center' : 'w-full gap-3 px-3 py-2.5'}`}
    >
      <Icon size={20} aria-hidden="true" className="shrink-0 text-ink-muted group-hover:text-ink" />
      {!collapsed && <span className="flex-1 truncate text-left">Collapse</span>}
    </button>
  );
  return collapsed ? (
    <div className="flex justify-center">
      <Tooltip content={label} position="right">
        {button}
      </Tooltip>
    </div>
  ) : (
    button
  );
}

/*
 * PageHeader — the title row at the top of a page inside the shell: heading,
 * optional description, and a slot for page-level actions.
 */
export function PageHeader({ title, description, actions, as: Heading = 'h1', className = '' }) {
  return (
    <div className={`mb-6 flex flex-wrap items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <Heading className="text-2xl font-bold text-ink">{title}</Heading>
        {description && <p className="mt-1 text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export default AppShell;
