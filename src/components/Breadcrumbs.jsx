import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

/*
 * items: array of { label, to?, href?, onClick }. The last item is treated as
 * the current page (not a link).
 *   - `to`   → renders a react-router <Link> (or `linkComponent` if provided)
 *   - `href` → renders a plain <a>
 * When there are more items than `maxItems`, the middle collapses behind an
 * interactive ellipsis button that expands the full trail when activated.
 */
const Breadcrumbs = ({
  items = [],
  separator,
  maxItems,
  linkComponent,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  const LinkComponent = linkComponent || Link;

  const Separator = () =>
    separator !== undefined ? (
      <span className="text-ink-subtle select-none" aria-hidden="true">{separator}</span>
    ) : (
      <ChevronRight size={16} className="text-ink-subtle shrink-0" aria-hidden="true" />
    );

  const renderCrumb = (item, isLast) => {
    if (isLast) {
      return (
        <span className="text-ink font-medium" aria-current="page">
          {item.label}
        </span>
      );
    }
    if (item.to != null) {
      return (
        <LinkComponent
          to={item.to}
          onClick={item.onClick}
          className="text-ink-muted hover:text-primary transition-colors rounded focus:outline-none focus:ring-2 focus:ring-focus"
        >
          {item.label}
        </LinkComponent>
      );
    }
    if (item.href || item.onClick) {
      return (
        <a
          href={item.href || '#'}
          onClick={item.onClick}
          className="text-ink-muted hover:text-primary transition-colors rounded focus:outline-none focus:ring-2 focus:ring-focus"
        >
          {item.label}
        </a>
      );
    }
    return <span className="text-ink-muted">{item.label}</span>;
  };

  const lastIndex = items.length - 1;
  const collapse = maxItems && items.length > maxItems && !expanded;

  let entries;
  if (collapse) {
    const tailStart = items.length - (maxItems - 1);
    entries = [
      { kind: 'crumb', item: items[0], index: 0 },
      { kind: 'ellipsis' },
      ...items.slice(tailStart).map((item, i) => ({ kind: 'crumb', item, index: tailStart + i })),
    ];
  } else {
    entries = items.map((item, index) => ({ kind: 'crumb', item, index }));
  }

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {entries.map((entry, i) => (
          <React.Fragment key={entry.kind === 'ellipsis' ? 'ellipsis' : entry.index}>
            {i > 0 && (
              <li className="flex items-center">
                <Separator />
              </li>
            )}
            <li className="flex items-center">
              {entry.kind === 'ellipsis' ? (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  aria-label="Show all breadcrumbs"
                  aria-expanded={false}
                  className="flex items-center rounded p-0.5 text-ink-subtle hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
                >
                  <MoreHorizontal size={16} aria-hidden="true" />
                </button>
              ) : (
                renderCrumb(entry.item, entry.index === lastIndex)
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
