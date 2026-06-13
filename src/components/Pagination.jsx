import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Build the list of page numbers to display, inserting `'…'` ellipsis markers
 * when there are more pages than `maxButtons` slots.
 */
const getPageItems = (currentPage, totalPages, maxButtons = 7) => {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const siblings = 1;
  const pages = new Set([1, totalPages]);
  for (let p = currentPage - siblings; p <= currentPage + siblings; p++) {
    if (p > 1 && p < totalPages) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) items.push(`ellipsis-${p}`);
    items.push(p);
    prev = p;
  }
  return items;
};

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  maxButtons = 7,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const goTo = (page) => {
    const next = Math.max(1, Math.min(page, totalPages));
    if (next !== currentPage) onPageChange?.(next);
  };

  const items = getPageItems(currentPage, totalPages, maxButtons);

  return (
    <nav
      className={`flex items-center justify-center gap-1 ${className}`}
      role="navigation"
      aria-label="Pagination"
    >
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 rounded-pill transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-muted"
        aria-label="Previous page"
      >
        <ChevronLeft size={20} className="text-ink" />
      </button>

      {items.map((item) =>
        typeof item === 'string' ? (
          <span
            key={item}
            className="flex items-center justify-center w-9 h-9 text-ink-subtle select-none"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => goTo(item)}
            aria-current={currentPage === item ? 'page' : undefined}
            className={`flex items-center justify-center w-9 h-9 rounded-pill text-sm font-medium transition-colors ${
              currentPage === item
                ? 'bg-primary text-white'
                : 'text-ink hover:bg-surface-muted'
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-9 h-9 rounded-pill transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-muted"
        aria-label="Next page"
      >
        <ChevronRight size={20} className="text-ink" />
      </button>
    </nav>
  );
};

export default Pagination;
