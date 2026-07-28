import React from 'react';
import Badge from '../components/Badge';

const Release = ({ version, date, children }) => (
  <div className="relative pl-8 pb-10 border-l border-line last:border-0 last:pb-0">
    <span className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-pill bg-primary border-2 border-surface" />
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-2xl font-bold">{version}</h2>
      <span className="text-sm text-ink-subtle">{date}</span>
    </div>
    {children}
  </div>
);

const Change = ({ type, children }) => {
  const map = {
    Added: 'positive',
    Changed: 'default',
    Fixed: 'warning',
  };
  return (
    <li className="flex gap-3 mb-2">
      <span className="shrink-0 mt-0.5">
        <Badge type={map[type] || 'default'}>{type}</Badge>
      </span>
      <span className="text-ink-muted text-sm pt-0.5">{children}</span>
    </li>
  );
};

export default function ChangelogPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Changelog</h1>
          <p className="text-xl text-ink-muted">
            Groove follows <a className="text-primary" href="https://semver.org" target="_blank" rel="noopener noreferrer">Semantic Versioning</a>.
            Breaking changes bump the major version; new components and props are minor; fixes are patch.
          </p>
        </div>

        <div className="mt-8">
          <Release version="2.0.0" date="July 2026">
            <p className="text-ink-muted mb-4">
              The parity release — a major expansion bringing Groove to full design-system coverage, with a
              coordinated accessibility pass across shipped components.
            </p>
            <ul>
              <Change type="Added">
                21 components: Combobox, Multi-Select, Segmented Control, Popover, Drawer, Command Palette,
                Slider, Date Picker, File Upload, Stepper, List, Empty State, Chip, Icon Button, Button Group,
                Link, Banner, Divider, Number Input, Field, and a documented Pagination.
              </Change>
              <Change type="Added">
                7 foundations: Accessibility, Motion, Layout, Layering (z-index scale), Iconography, Sizing,
                and Color Usage — plus site guides (Overview, Installation, Theming, Contributing).
              </Change>
              <Change type="Added">
                Semantic <code>focus</code> ring token, a <code>warning</code> color scale, a named z-index
                layering scale, and full-edge slide animations.
              </Change>
              <Change type="Changed">
                Accessibility remediation: Modal focus trap/restore, Tabs ARIA + keyboard, Tooltip focus-access
                + portal, Menu roving focus, Toggle <code>role="switch"</code>, and consistent input aria wiring.
              </Change>
              <Change type="Fixed">
                Overlay stacking (Select/Menu opening behind Modals) via portals and the new layering scale.
              </Change>
            </ul>
          </Release>

          <Release version="1.1.0" date="June 2026">
            <p className="text-ink-muted mb-4">Tier-1 and Tier-2 component build-out.</p>
            <ul>
              <Change type="Added">
                Select, Modal, Toast, Alert, Spinner, Progress, Textarea, Avatar, Accordion, Breadcrumbs,
                Menu, Skeleton.
              </Change>
              <Change type="Changed">DataTable rewritten on TanStack Table with filtering, search, and selection.</Change>
              <Change type="Added">Full light/dark theming with semantic CSS-variable tokens.</Change>
            </ul>
          </Release>

          <Release version="1.0.0" date="May 2026">
            <p className="text-ink-muted mb-4">Initial release.</p>
            <ul>
              <Change type="Added">Foundations (color, typography, spacing, elevation, radius) and core components: Button, Card, Badge, Checkbox, Radio, Toggle, Tabs, Tooltip, Text Input.</Change>
            </ul>
          </Release>
        </div>
      </div>
    </div>
  );
}
