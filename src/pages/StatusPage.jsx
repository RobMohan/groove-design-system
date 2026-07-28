import React from 'react';
import { Link } from 'react-router-dom';

const StatusBadge = ({ status }) => {
  const styles = {
    Stable: 'bg-positive/10 text-positive border-positive/40',
    Beta: 'bg-warning/10 text-warning border-warning/40',
    Deprecated: 'bg-destructive/10 text-destructive border-destructive/40',
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-pill border ${styles[status] || styles.Beta}`}>
      {status}
    </span>
  );
};

export default function StatusPage() {
  const components = [
    // Stable — long-standing core components
    { name: 'Button', path: '/button', status: 'Stable', notes: 'Variants, sizes, icons, states — API is settled.' },
    { name: 'Badge', path: '/badge', status: 'Stable', notes: 'Status and label chips.' },
    { name: 'Card', path: '/card', status: 'Stable', notes: 'Container primitive for grouped content.' },
    { name: 'Stat Card', path: '/stat-card', status: 'Stable', notes: 'Metric display card.' },
    { name: 'Text Input', path: '/text-input', status: 'Stable', notes: 'Single-line field with label and helper text.' },
    { name: 'Checkbox', path: '/checkbox', status: 'Stable', notes: 'Boolean and indeterminate states.' },
    { name: 'Radio', path: '/radio', status: 'Stable', notes: 'Single-select groups.' },
    { name: 'Toggle', path: '/toggle', status: 'Stable', notes: 'On/off switch.' },
    { name: 'Tabs', path: '/tabs', status: 'Stable', notes: 'Sectioned content navigation.' },
    { name: 'Tooltip', path: '/tooltip', status: 'Stable', notes: 'Hover/focus hint with role="tooltip".' },
    { name: 'Data Table', path: '/data-table', status: 'Stable', notes: 'TanStack-powered sorting and pagination.' },

    // Beta — recently added (Tier-1 & Tier-2 waves)
    { name: 'Select', path: '/select', status: 'Beta', notes: 'Listbox popover; keyboard model still being hardened.' },
    { name: 'Textarea', path: '/textarea', status: 'Beta', notes: 'Multi-line field; auto-resize under evaluation.' },
    { name: 'Alert', path: '/alert', status: 'Beta', notes: 'Inline messaging with role="alert".' },
    { name: 'Modal', path: '/modal', status: 'Beta', notes: 'Dialog with focus trap and Escape handling.' },
    { name: 'Toast', path: '/toast', status: 'Beta', notes: 'Provider + useToast(); positions may change.' },
    { name: 'Spinner', path: '/spinner', status: 'Beta', notes: 'Indeterminate loading indicator.' },
    { name: 'Progress', path: '/progress', status: 'Beta', notes: 'Determinate/indeterminate bar with progressbar role.' },
    { name: 'Avatar', path: '/avatar', status: 'Beta', notes: 'Image/initials fallback.' },
    { name: 'Skeleton', path: '/skeleton', status: 'Beta', notes: 'Loading placeholder shapes.' },
    { name: 'Accordion', path: '/accordion', status: 'Beta', notes: 'Expandable sections with aria-expanded.' },
    { name: 'Breadcrumbs', path: '/breadcrumbs', status: 'Beta', notes: 'Navigation trail with aria-current.' },
    { name: 'Menu', path: '/menu', status: 'Beta', notes: 'Dropdown with roving keyboard focus.' },
  ];

  const counts = components.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Component Status</h1>
          <p className="text-xl text-ink-muted">
            A maturity matrix for every component in Groove, so you know what you can depend on and what's still settling.
          </p>
        </div>

        {/* Legend */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Maturity levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-raised rounded-lg border border-line p-5">
              <StatusBadge status="Stable" />
              <p className="text-ink-muted mt-3 text-sm">
                API is settled and unlikely to change. Safe for production; breaking changes only with a major release.
              </p>
            </div>
            <div className="bg-surface-raised rounded-lg border border-line p-5">
              <StatusBadge status="Beta" />
              <p className="text-ink-muted mt-3 text-sm">
                Usable and documented, but the API or behavior may still change based on feedback. Pin your version.
              </p>
            </div>
            <div className="bg-surface-raised rounded-lg border border-line p-5">
              <StatusBadge status="Deprecated" />
              <p className="text-ink-muted mt-3 text-sm">
                Scheduled for removal. Avoid in new work and migrate away; a replacement is noted where one exists.
              </p>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-4">
            <div className="bg-surface-raised rounded-lg border border-line px-6 py-4">
              <p className="text-3xl font-bold text-ink">{counts.Stable || 0}</p>
              <p className="text-sm text-ink-muted">Stable</p>
            </div>
            <div className="bg-surface-raised rounded-lg border border-line px-6 py-4">
              <p className="text-3xl font-bold text-ink">{counts.Beta || 0}</p>
              <p className="text-sm text-ink-muted">Beta</p>
            </div>
            <div className="bg-surface-raised rounded-lg border border-line px-6 py-4">
              <p className="text-3xl font-bold text-ink">{counts.Deprecated || 0}</p>
              <p className="text-sm text-ink-muted">Deprecated</p>
            </div>
          </div>
        </section>

        {/* Matrix */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Status matrix</h2>
          <div className="bg-surface-raised rounded-lg border border-line overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 px-4 font-semibold">Component</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {components.map((c) => (
                  <tr key={c.name} className="border-b border-line last:border-b-0">
                    <td className="py-3 px-4">
                      <Link to={c.path} className="font-medium text-primary hover:underline">{c.name}</Link>
                    </td>
                    <td className="py-3 px-4"><StatusBadge status={c.status} /></td>
                    <td className="py-3 px-4 text-ink-muted">{c.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-ink-muted text-sm mt-4">
            No components are deprecated in the current release. When one is scheduled for removal, it will be listed
            here with its replacement and target removal version — see{' '}
            <Link to="/changelog" className="text-primary hover:underline">Changelog &amp; Versioning</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
