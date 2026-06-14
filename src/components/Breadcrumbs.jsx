import React from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

/*
 * items: array of { label, href, onClick }. The last item is treated as the
 * current page (not a link). When there are more items than `maxItems`, the
 * middle is collapsed behind an ellipsis.
 */
const Breadcrumbs = ({
  items = [],
  separator,
  maxItems,
  className = '',
}) => {
  const Separator = () =>
    separator !== undefined ? (
      <span className="text-ink-subtle select-none" aria-hidden="true">{separator}</span>
    ) : (
      <ChevronRight size={16} className="text-ink-subtle shrink-0" aria-hidden="true" />
    );

  let display = items;
  let collapsed = false;
  if (maxItems && items.length > maxItems) {
    display = [items[0], ...items.slice(items.length - (maxItems - 1))];
    collapsed = true;
  }

  const renderCrumb = (item, isLast) => {
    if (isLast) {
      return (
        <span className="text-ink font-medium" aria-current="page">
          {item.label}
        </span>
      );
    }
    if (item.href || item.onClick) {
      return (
        <a
          href={item.href || '#'}
          onClick={item.onClick}
          className="text-ink-muted hover:text-primary transition-colors"
        >
          {item.label}
        </a>
      );
    }
    return <span className="text-ink-muted">{item.label}</span>;
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {display.map((item, index) => {
          const isLast = index === display.length - 1;
          const showEllipsis = collapsed && index === 1;
          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <li className="flex items-center">
                  <Separator />
                </li>
              )}
              <li className="flex items-center">
                {showEllipsis && (
                  <>
                    <MoreHorizontal size={16} className="text-ink-subtle" aria-label="More" />
                    <span className="mx-2"><Separator /></span>
                  </>
                )}
                {renderCrumb(item, isLast)}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
