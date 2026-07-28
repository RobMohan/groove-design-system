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
  sm: { control: 'min-h-8 px-1.5 py-1 text-sm', icon: 14, chevron: 16 },
  md: { control: 'min-h-10 px-2 py-1.5 text-base', icon: 16, chevron: 18 },
  lg: { control: 'min-h-12 px-2.5 py-2 text-lg', icon: 18, chevron: 20 },
};

/*
 * Multi-Select — pick several options; selections render as removable pills
 * inside the control. Shares the Combobox typeahead + portaled listbox model.
 * Backspace on an empty query removes the last pill; a clear-all button resets.
 */
const MultiSelect = forwardRef(
  (
    {
      options = [],
      value,
      defaultValue = [],
      onChange,
      placeholder = 'Select…',
      label,
      clearable = true,
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
    const inputId = id || `multiselect-${reactId}`;
    const listId = `${inputId}-listbox`;
    const optionId = (index) => `${inputId}-opt-${index}`;

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValues = isControlled ? value : internalValue;

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
    const selectedOptions = currentValues
      .map((v) => items.find((o) => o.value === v))
      .filter(Boolean);

    const trimmed = query.trim();
    const filtered = !trimmed ? items : items.filter((o) => filterFn(o, query));

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

    const emit = (next) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    };

    const close = useCallback(() => {
      setOpen(false);
      setActiveIndex(-1);
    }, []);

    const openMenu = useCallback(() => {
      if (disabled) return;
      setOpen(true);
    }, [disabled]);

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

    useEffect(() => {
      if (!open) return;
      setActiveIndex(flatOptions.findIndex((o) => !o.disabled));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

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

    const toggleOption = (opt) => {
      if (!opt || opt.disabled) return;
      const has = currentValues.includes(opt.value);
      emit(
        has
          ? currentValues.filter((v) => v !== opt.value)
          : [...currentValues, opt.value]
      );
      setQuery('');
      inputRef.current?.focus();
    };

    const removeValue = (val) => {
      emit(currentValues.filter((v) => v !== val));
      inputRef.current?.focus();
    };

    const clearAll = (e) => {
      e.stopPropagation();
      emit([]);
      setQuery('');
      inputRef.current?.focus();
    };

    const handleInput = (e) => {
      setQuery(e.target.value);
      if (!open) openMenu();
      setActiveIndex(flatOptions.findIndex((o) => !o.disabled));
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
            toggleOption(flatOptions[activeIndex]);
          }
          break;
        case 'Backspace':
          if (query === '' && currentValues.length > 0) {
            emit(currentValues.slice(0, -1));
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
          onClick={() => !disabled && inputRef.current?.focus()}
          className={`flex flex-wrap items-center gap-1.5 bg-surface-raised rounded-control border transition-colors ${borderClass} ${
            sizes.control
          } ${
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-text'
          } focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-surface`}
        >
          {selectedOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <span
                key={String(opt.value)}
                className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-pill bg-surface-muted text-ink text-sm"
              >
                {Icon && <Icon size={14} className="shrink-0" aria-hidden="true" />}
                <span className="truncate max-w-[10rem]">{opt.label}</span>
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeValue(opt.value);
                  }}
                  aria-label={`Remove ${opt.label}`}
                  className="shrink-0 rounded-full p-0.5 text-ink-muted hover:text-ink hover:bg-surface transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}

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
            placeholder={selectedOptions.length === 0 ? placeholder : ''}
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={openMenu}
            className="flex-1 min-w-[4rem] bg-transparent outline-none text-ink placeholder-ink-muted disabled:cursor-not-allowed"
            {...props}
          />

          {loading && (
            <Loader2
              size={sizes.chevron}
              className="shrink-0 animate-spin text-ink-muted"
              aria-hidden="true"
            />
          )}
          {clearable && selectedOptions.length > 0 && !disabled && !loading && (
            <button
              type="button"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={clearAll}
              aria-label="Clear all"
              className="shrink-0 rounded-full p-0.5 text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"
            >
              <X size={sizes.chevron} />
            </button>
          )}
          <ChevronDown
            size={sizes.chevron}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              open ? close() : openMenu();
            }}
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
              aria-multiselectable="true"
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
                      const isSelected = currentValues.includes(opt.value);
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
                          onClick={() => toggleOption(opt)}
                          className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                            opt.disabled
                              ? 'text-ink-subtle cursor-not-allowed'
                              : `cursor-pointer text-ink ${
                                  isActive ? 'bg-surface-muted' : ''
                                }`
                          }`}
                        >
                          <span
                            className={`grid place-items-center w-4 h-4 shrink-0 rounded border ${
                              isSelected
                                ? 'bg-primary border-primary text-white'
                                : 'border-line-strong'
                            }`}
                          >
                            {isSelected && <Check size={12} />}
                          </span>
                          {Icon && (
                            <Icon
                              size={16}
                              className="shrink-0 text-ink-muted"
                              aria-hidden="true"
                            />
                          )}
                          <span className="flex-1 truncate">{opt.label}</span>
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

MultiSelect.displayName = 'MultiSelect';

export default MultiSelect;
