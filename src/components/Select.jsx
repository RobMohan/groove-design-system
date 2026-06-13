import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/* Normalize an option into { value, label, disabled }. Strings are allowed. */
const normalize = (opt) =>
  typeof opt === 'object' && opt !== null
    ? { value: opt.value, label: opt.label ?? String(opt.value), disabled: !!opt.disabled }
    : { value: opt, label: String(opt), disabled: false };

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  disabled = false,
  error = '',
  id,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const items = options.map(normalize);
  const selected = items.find((o) => o.value === value);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, close]);

  const selectOption = (opt) => {
    if (opt.disabled) return;
    onChange?.(opt.value);
    close();
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      setOpen(true);
      // Highlight the selected option, or the first one if nothing is selected.
      setActiveIndex(Math.max(0, items.findIndex((o) => o.value === value)));
      return;
    }
    if (open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[activeIndex]) selectOption(items[activeIndex]);
      }
    }
  };

  const getBorderClasses = () => {
    if (disabled) return 'border border-line';
    if (error) return 'border-2 border-destructive';
    if (open) return 'border-2 border-primary';
    return 'border border-line-strong';
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`} ref={rootRef}>
      {label && (
        <label
          htmlFor={selectId}
          className={`text-base leading-6 font-normal ${disabled ? 'text-ink-subtle' : 'text-ink'}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`flex items-center justify-between w-full h-10 px-3 bg-surface-raised rounded-control gap-2 text-left transition-colors ${getBorderClasses()} ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <span className={`truncate ${selected ? 'text-ink' : disabled ? 'text-ink-subtle' : 'text-ink-muted'}`}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${
              disabled ? 'text-ink-subtle' : 'text-ink-muted'
            }`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            aria-labelledby={selectId}
            className="absolute z-20 mt-1 w-full max-h-60 overflow-auto bg-surface-raised rounded-control shadow-elevation-4 border border-line py-1"
          >
            {items.length === 0 && (
              <li className="px-3 py-2 text-sm text-ink-subtle">No options</li>
            )}
            {items.map((opt, index) => {
              const isSelected = opt.value === value;
              const isActive = index === activeIndex;
              return (
                <li
                  key={String(opt.value)}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(opt)}
                  className={`flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors ${
                    opt.disabled
                      ? 'text-ink-subtle cursor-not-allowed'
                      : `cursor-pointer text-ink ${isActive ? 'bg-surface-muted' : ''}`
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check size={16} className="shrink-0 text-primary" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {error && typeof error === 'string' && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default Select;
