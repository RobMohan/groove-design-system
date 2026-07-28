import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  forwardRef,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, X, Search } from 'lucide-react';

/* Normalize an option into { value, label, icon, group, disabled }. Strings are allowed. */
const normalize = (opt) =>
  typeof opt === 'object' && opt !== null
    ? {
        value: opt.value,
        label: opt.label ?? String(opt.value),
        icon: opt.icon,
        group: opt.group,
        disabled: !!opt.disabled,
      }
    : { value: opt, label: String(opt), disabled: false };

const sizeClasses = {
  sm: { trigger: 'h-8 px-2.5 text-sm', icon: 16, chevron: 16 },
  md: { trigger: 'h-10 px-3 text-base', icon: 18, chevron: 20 },
  lg: { trigger: 'h-12 px-3.5 text-lg', icon: 20, chevron: 22 },
};

/*
 * Select — a custom single-select dropdown with full keyboard support.
 * The dropdown is portaled to <body> at z-popover so it clears open modals.
 * Optional `searchable` typeahead, option groups, per-option icons, `clearable`
 * and `size` variants. The original { options, value, onChange, ... } API is
 * unchanged.
 */
const Select = forwardRef(
  (
    {
      options = [],
      value,
      onChange,
      placeholder = 'Select an option',
      label,
      disabled = false,
      error = '',
      searchable = false,
      clearable = false,
      size = 'md',
      emptyMessage = 'No options',
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const selectId = id || `select-${reactId}`;
    const listId = `${selectId}-listbox`;
    const optionId = (index) => `${selectId}-opt-${index}`;

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [query, setQuery] = useState('');
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const rootRef = useRef(null);
    const listRef = useRef(null);
    const triggerRef = useRef(null);
    const searchRef = useRef(null);

    const setTriggerRef = (node) => {
      triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const items = options.map(normalize);
    const selected = items.find((o) => o.value === value);

    const trimmed = query.trim();
    const filtered =
      searchable && trimmed
        ? items.filter((o) =>
            o.label.toLowerCase().includes(trimmed.toLowerCase())
          )
        : items;

    // Group buckets (first-seen order) + a flat, index-tagged navigable list.
    const groups = [];
    const groupMap = new Map();
    const flatOptions = [];
    filtered.forEach((opt) => {
      const key = opt.group || '';
      let bucket = groupMap.get(key);
      if (!bucket) {
        bucket = { label: key, options: [] };
        groupMap.set(key, bucket);
        groups.push(bucket);
      }
      bucket.options.push({ opt, index: flatOptions.length });
      flatOptions.push(opt);
    });

    const sizes = sizeClasses[size] || sizeClasses.md;

    const close = useCallback(() => {
      setOpen(false);
      setActiveIndex(-1);
      setQuery('');
    }, []);

    const openMenu = useCallback(() => {
      if (disabled) return;
      setOpen(true);
      const selIdx = items.findIndex((o) => o.value === value && !o.disabled);
      const firstIdx = items.findIndex((o) => !o.disabled);
      setActiveIndex(selIdx >= 0 ? selIdx : firstIdx);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled, value]);

    // Position the portaled listbox and keep it aligned on scroll / resize.
    const updateCoords = useCallback(() => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setCoords({ top: r.bottom + 4, left: r.left, width: r.width });
    }, []);

    useEffect(() => {
      if (!open) return;
      updateCoords();
      window.addEventListener('resize', updateCoords);
      window.addEventListener('scroll', updateCoords, true);
      return () => {
        window.removeEventListener('resize', updateCoords);
        window.removeEventListener('scroll', updateCoords, true);
      };
    }, [open, updateCoords]);

    // Focus the search box when a searchable menu opens.
    useEffect(() => {
      if (open && searchable) searchRef.current?.focus();
    }, [open, searchable]);

    // Close on outside click (accounting for the portaled listbox).
    useEffect(() => {
      if (!open) return;
      const onDown = (e) => {
        const inRoot = rootRef.current && rootRef.current.contains(e.target);
        const inList = listRef.current && listRef.current.contains(e.target);
        if (!inRoot && !inList) close();
      };
      document.addEventListener('mousedown', onDown);
      return () => document.removeEventListener('mousedown', onDown);
    }, [open, close]);

    const nextEnabled = (from, dir) => {
      let idx = from;
      for (let n = 0; n < flatOptions.length; n++) {
        idx += dir;
        if (idx < 0 || idx >= flatOptions.length) return from;
        if (!flatOptions[idx].disabled) return idx;
      }
      return from;
    };

    const selectOption = (opt) => {
      if (!opt || opt.disabled) return;
      onChange?.(opt.value);
      close();
      triggerRef.current?.focus();
    };

    const clear = (e) => {
      e.stopPropagation();
      onChange?.('');
    };

    // Shared navigation, used by the trigger (non-searchable) and search box.
    const navKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => nextEnabled(i, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => nextEnabled(i, -1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActiveIndex(nextEnabled(-1, 1));
      } else if (e.key === 'End') {
        e.preventDefault();
        setActiveIndex(nextEnabled(flatOptions.length, -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatOptions[activeIndex]) selectOption(flatOptions[activeIndex]);
      }
    };

    const handleTriggerKeyDown = (e) => {
      if (disabled) return;
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (
        !open &&
        (e.key === 'Enter' ||
          e.key === ' ' ||
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp')
      ) {
        e.preventDefault();
        openMenu();
        return;
      }
      if (open && !searchable) navKey(e);
    };

    const handleSearchKeyDown = (e) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
        return;
      }
      navKey(e);
    };

    const getBorderClasses = () => {
      if (disabled) return 'border border-line';
      if (error) return 'border-2 border-destructive';
      if (open) return 'border-2 border-primary';
      return 'border border-line-strong';
    };

    const activeId =
      open && flatOptions[activeIndex] ? optionId(activeIndex) : undefined;

    const renderOptions = () => {
      if (flatOptions.length === 0) {
        return (
          <li role="presentation" className="px-3 py-2 text-sm text-ink-subtle">
            {searchable && trimmed ? emptyMessage : emptyMessage}
          </li>
        );
      }
      return groups.map((group) => (
        <React.Fragment key={group.label || '__ungrouped'}>
          {group.label && (
            <li
              role="presentation"
              className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-subtle"
            >
              {group.label}
            </li>
          )}
          {group.options.map(({ opt, index }) => {
            const isSelected = opt.value === value;
            const isActive = index === activeIndex;
            const Icon = opt.icon;
            return (
              <li
                key={String(opt.value)}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled || undefined}
                onMouseEnter={() => !opt.disabled && setActiveIndex(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(opt)}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  opt.disabled
                    ? 'text-ink-subtle cursor-not-allowed'
                    : `cursor-pointer text-ink ${
                        isActive ? 'bg-surface-muted' : ''
                      }`
                }`}
              >
                {Icon && (
                  <Icon
                    size={16}
                    className="shrink-0 text-ink-muted"
                    aria-hidden="true"
                  />
                )}
                <span className="flex-1 truncate">{opt.label}</span>
                {isSelected && (
                  <Check
                    size={16}
                    className="shrink-0 text-primary"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </React.Fragment>
      ));
    };

    return (
      <div className={`flex flex-col gap-2 ${className}`} ref={rootRef}>
        {label && (
          <label
            htmlFor={selectId}
            className={`text-base leading-6 font-normal ${
              disabled ? 'text-ink-subtle' : 'text-ink'
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            id={selectId}
            ref={setTriggerRef}
            disabled={disabled}
            onClick={() => (open ? close() : openMenu())}
            onKeyDown={handleTriggerKeyDown}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-activedescendant={!searchable ? activeId : undefined}
            className={`flex items-center justify-between w-full bg-surface-raised rounded-control gap-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
              sizes.trigger
            } ${getBorderClasses()} ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            {...props}
          >
            {selected?.icon && (
              <selected.icon
                size={sizes.icon}
                className="shrink-0 text-ink-muted"
                aria-hidden="true"
              />
            )}
            <span
              className={`flex-1 truncate ${
                selected
                  ? 'text-ink'
                  : disabled
                  ? 'text-ink-subtle'
                  : 'text-ink-muted'
              }`}
            >
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown
              size={sizes.chevron}
              className={`shrink-0 transition-transform ${
                open ? 'rotate-180' : ''
              } ${disabled ? 'text-ink-subtle' : 'text-ink-muted'}`}
              aria-hidden="true"
            />
          </button>

          {clearable && selected && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={clear}
              aria-label="Clear selection"
              className="absolute top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"
              style={{ right: `calc(${sizes.chevron}px + 1rem)` }}
            >
              <X size={sizes.chevron} />
            </button>
          )}
        </div>

        {open &&
          createPortal(
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-labelledby={selectId}
              aria-activedescendant={activeId}
              style={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                width: coords.width,
                maxHeight: '15rem',
              }}
              className="z-popover overflow-auto bg-surface-raised rounded-control shadow-elevation-4 border border-line py-1 animate-fade-in"
            >
              {searchable && (
                <li role="presentation" className="px-2 pb-1">
                  <div className="flex items-center gap-2 px-2 h-9 bg-surface-muted rounded-control">
                    <Search size={16} className="shrink-0 text-ink-muted" />
                    <input
                      ref={searchRef}
                      type="text"
                      role="combobox"
                      aria-expanded={open}
                      aria-controls={listId}
                      aria-autocomplete="list"
                      aria-activedescendant={activeId}
                      autoComplete="off"
                      placeholder="Search…"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveIndex(0);
                      }}
                      onKeyDown={handleSearchKeyDown}
                      className="flex-1 min-w-0 bg-transparent outline-none text-sm text-ink placeholder-ink-muted"
                    />
                  </div>
                </li>
              )}
              {renderOptions()}
            </ul>,
            document.body
          )}

        {error && typeof error === 'string' && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
