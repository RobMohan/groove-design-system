import React, { useRef, useState, useEffect, useMemo, useCallback, useId } from 'react';
import { Search } from 'lucide-react';
import Portal from './Portal';
import useFocusTrap from '../hooks/useFocusTrap';

/**
 * useCommandK — wire ⌘K (macOS) / Ctrl+K (Windows/Linux) to a callback.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   useCommandK(() => setOpen((o) => !o));
 */
export function useCommandK(callback) {
  const cbRef = useRef(callback);
  useEffect(() => {
    cbRef.current = callback;
  });
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        cbRef.current?.(e);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
}

function filterItems(items, query) {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => {
    const haystack = `${item.label} ${item.group || ''} ${item.keywords || ''}`.toLowerCase();
    return haystack.includes(q);
  });
}

/**
 * CommandPalette — a ⌘K search + action overlay.
 *
 * Centered modal dialog at `z-popover`, a filter input, Up/Down to move the
 * active item, Enter to run it, Esc to close. Results are grouped, focus is
 * trapped, and body scroll is locked.
 */
const CommandPalette = ({
  open,
  onClose,
  items = [],
  placeholder = 'Type a command or search…',
  emptyMessage = 'No results found.',
  className = '',
  ...props
}) => {
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();

  useFocusTrap(panelRef, {
    active: open,
    onEscape: () => onClose?.(),
    initialFocusRef: inputRef,
  });

  // Reset query + active item each time the palette opens.
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const filtered = useMemo(() => filterItems(items, query), [items, query]);

  // Keep the active index in range as the filtered list changes.
  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  // Group results while preserving the flat index used for keyboard nav.
  const groups = useMemo(() => {
    const map = new Map();
    filtered.forEach((item, index) => {
      const key = item.group || '';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({ item, index });
    });
    return Array.from(map.entries());
  }, [filtered]);

  const runItem = useCallback(
    (item) => {
      if (!item || item.disabled) return;
      item.onSelect?.(item);
      onClose?.();
    },
    [onClose]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runItem(filtered[activeIndex]);
    }
  };

  // Scroll the active option into view.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex, open]);

  if (!open) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-popover flex items-start justify-center p-4 pt-[15vh] bg-black/50 animate-fade-in"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose?.();
        }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onKeyDown={handleKeyDown}
          className={`w-full max-w-xl bg-surface-raised rounded-modal shadow-elevation-5 border border-line overflow-hidden outline-none animate-scale-in ${className}`}
          {...props}
        >
          <div className="flex items-center gap-3 px-4 border-b border-line">
            <Search size={18} className="text-ink-muted shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              placeholder={placeholder}
              className="flex-1 bg-transparent py-4 text-base text-ink placeholder:text-ink-subtle outline-none"
            />
          </div>

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className="max-h-80 overflow-y-auto py-2"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-ink-muted">{emptyMessage}</li>
            ) : (
              groups.map(([groupName, entries]) => (
                <li key={groupName || '__ungrouped'} role="presentation">
                  {groupName && (
                    <div className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                      {groupName}
                    </div>
                  )}
                  <ul role="presentation">
                    {entries.map(({ item, index }) => {
                      const ItemIcon = item.icon;
                      const isActive = index === activeIndex;
                      return (
                        <li key={item.id ?? index} role="presentation">
                          <button
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            data-index={index}
                            disabled={item.disabled}
                            onClick={() => runItem(item)}
                            onMouseMove={() => setActiveIndex(index)}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm transition-colors ${
                              item.disabled
                                ? 'text-ink-subtle cursor-not-allowed'
                                : isActive
                                ? 'bg-primary/10 text-ink'
                                : 'text-ink hover:bg-surface-muted'
                            }`}
                          >
                            {ItemIcon && (
                              <ItemIcon size={16} className="shrink-0 text-ink-muted" aria-hidden="true" />
                            )}
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.shortcut && (
                              <kbd className="ml-auto text-xs text-ink-subtle font-mono border border-line rounded px-1.5 py-0.5">
                                {item.shortcut}
                              </kbd>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </Portal>
  );
};

export default CommandPalette;
