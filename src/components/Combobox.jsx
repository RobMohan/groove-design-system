import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  forwardRef,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, X, Loader2 } from 'lucide-react';

/* Normalize an option into a predictable shape. Bare strings are allowed. */
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

/* Default typeahead: case-insensitive substring match on the label. */
const defaultFilterFn = (option, query) =>
  option.label.toLowerCase().includes(query.trim().toLowerCase());

const sizeClasses = {
  sm: { control: 'min-h-8 px-2 text-sm', icon: 16, chevron: 16 },
  md: { control: 'min-h-10 px-3 text-base', icon: 18, chevron: 18 },
  lg: { control: 'min-h-12 px-3.5 text-lg', icon: 20, chevron: 20 },
};

/*
 * Combobox / Autocomplete — a text-filterable single-select with typeahead.
 * The floating listbox is portaled to <body> at z-popover so it clears modals.
 */
const Combobox = forwardRef(
  (
    {
      options = [],
      value,
      defaultValue,
      onChange,
      placeholder = 'Search…',
      label,
      clearable = false,
      disabled = false,
      loading = false,
      emptyMessage = 'No results found',
      filterFn = defaultFilterFn,
      size = 'md',
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id || `combobox-${reactId}`;
    const listId = `${inputId}-listbox`;
    const optionId = (index) => `${inputId}-opt-${index}`;

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? value : internalValue;

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const rootRef = useRef(null);
    const listRef = useRef(null);
    const inputRef = useRef(null);

    const setRefs = (node) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const items = options.map(normalize);
    const selectedOption = items.find((o) => o.value === currentValue);

    // Only treat the text as a filter once the user has typed something other
    // than the current selection's label, so re-opening shows the full list.
    const showingSelectedLabel =
      selectedOption && query === selectedOption.label;
    const trimmed = query.trim();
    const filtered =
      !trimmed || showingSelectedLabel
        ? items
        : items.filter((o) => filterFn(o, query));

    // Build group buckets (preserving first-seen order) and a flat, index-tagged
    // navigable list that mirrors the rendered order.
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
    }, []);

    const openMenu = useCallback(() => {
      if (disabled) return;
      setOpen(true);
    }, [disabled]);

    // Position the portaled listbox under the control and keep it there while
    // scrolling / resizing.
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

    // Move the initial highlight to the selected option (or first enabled one).
    useEffect(() => {
      if (!open) return;
      const selIdx = flatOptions.findIndex(
        (o) => o.value === currentValue && !o.disabled
      );
      const firstIdx = flatOptions.findIndex((o) => !o.disabled);
      setActiveIndex(selIdx >= 0 ? selIdx : firstIdx);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // When the menu is closed, mirror the selected label back into the input.
    useEffect(() => {
      if (!open) setQuery(selectedOption ? selectedOption.label : '');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentValue, open]);

    // Close when clicking outside both the control and the portaled listbox.
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
      if (!isControlled) setInternalValue(opt.value);
      onChange?.(opt.value);
      setQuery(opt.label);
      close();
      inputRef.current?.focus();
    };

    const clear = (e) => {
      e.stopPropagation();
      if (!isControlled) setInternalValue('');
      onChange?.('');
      setQuery('');
      setActiveIndex(-1);
      inputRef.current?.focus();
    };

    const handleInput = (e) => {
      setQuery(e.target.value);
      if (!open) openMenu();
      const firstIdx = flatOptions.findIndex((o) => !o.disabled);
      setActiveIndex(firstIdx);
    };

    const handleKeyDown = (e) => {
      if (disabled) return;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!open) openMenu();
          else setActiveIndex((i) => nextEnabled(i, 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!open) openMenu();
          else setActiveIndex((i) => nextEnabled(i, -1));
          break;
        case 'Home':
          if (open) {
            e.preventDefault();
            setActiveIndex(nextEnabled(-1, 1));
          }
          break;
        case 'End':
          if (open) {
            e.preventDefault();
            setActiveIndex(nextEnabled(flatOptions.length, -1));
          }
          break;
        case 'Enter':
          if (open && flatOptions[activeIndex]) {
            e.preventDefault();
            selectOption(flatOptions[activeIndex]);
          }
          break;
        case 'Escape':
          if (open) {
            e.preventDefault();
            close();
          }
          break;
        default:
          break;
      }
    };

    const borderClass = disabled
      ? 'border-line'
      : open
      ? 'border-primary'
      : 'border-line-strong';

    const activeId =
      open && flatOptions[activeIndex] ? optionId(activeIndex) : undefined;

    return (
      <div className={`flex flex-col gap-2 ${className}`} ref={rootRef}>
        {label && (
          <label
            htmlFor={inputId}
            className={`text-base leading-6 ${
              disabled ? 'text-ink-subtle' : 'text-ink'
            }`}
          >
            {label}
          </label>
        )}

        <div
          className={`flex items-center gap-2 bg-surface-raised rounded-control border transition-colors ${borderClass} ${
            sizes.control
          } ${
            disabled ? 'cursor-not-allowed opacity-60' : ''
          } focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-surface`}
        >
          {selectedOption?.icon && (
            <selectedOption.icon
              size={sizes.icon}
              className="shrink-0 text-ink-muted"
              aria-hidden="true"
            />
          )}
          <input
            ref={setRefs}
            id={inputId}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            autoComplete="off"
            disabled={disabled}
            placeholder={placeholder}
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={openMenu}
            onClick={openMenu}
            className="flex-1 min-w-0 bg-transparent outline-none text-ink placeholder-ink-muted disabled:cursor-not-allowed"
            {...props}
          />
          {loading && (
            <Loader2
              size={sizes.chevron}
              className="shrink-0 animate-spin text-ink-muted"
              aria-hidden="true"
            />
          )}
          {clearable && selectedOption && !disabled && !loading && (
            <button
              type="button"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={clear}
              aria-label="Clear selection"
              className="shrink-0 rounded-full p-0.5 text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"
            >
              <X size={sizes.chevron} />
            </button>
          )}
          <ChevronDown
            size={sizes.chevron}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => (open ? close() : openMenu())}
            className={`shrink-0 cursor-pointer text-ink-muted transition-transform ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </div>

        {open &&
          createPortal(
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label={label || placeholder}
              style={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                width: coords.width,
                maxHeight: '15rem',
              }}
              className="z-popover overflow-auto bg-surface-raised rounded-control shadow-elevation-4 border border-line py-1 animate-fade-in"
            >
              {loading ? (
                <li
                  role="presentation"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-ink-muted"
                >
                  <Loader2 size={16} className="animate-spin" /> Loading…
                </li>
              ) : flatOptions.length === 0 ? (
                <li
                  role="presentation"
                  className="px-3 py-2 text-sm text-ink-subtle"
                >
                  {emptyMessage}
                </li>
              ) : (
                groups.map((group) => (
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
                      const isSelected = opt.value === currentValue;
                      const isActive = index === activeIndex;
                      const Icon = opt.icon;
                      return (
                        <li
                          key={String(opt.value)}
                          id={optionId(index)}
                          role="option"
                          aria-selected={isSelected}
                          aria-disabled={opt.disabled || undefined}
                          onMouseEnter={() =>
                            !opt.disabled && setActiveIndex(index)
                          }
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
                ))
              )}
            </ul>,
            document.body
          )}
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';

export default Combobox;
