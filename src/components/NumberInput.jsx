import React, { forwardRef, useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';

const SIZES = {
  sm: { box: 'h-8', text: 'text-sm', pad: 'pl-2', stepIcon: 12 },
  md: { box: 'h-10', text: 'text-base', pad: 'pl-3', stepIcon: 14 },
  lg: { box: 'h-12', text: 'text-lg', pad: 'pl-3', stepIcon: 16 },
};

const toDisplay = (v, precision) => {
  if (v === '' || v === null || v === undefined || Number.isNaN(v)) return '';
  if (typeof v === 'number' && precision != null) return v.toFixed(precision);
  return String(v);
};

const parse = (str) => {
  if (typeof str !== 'string' || str.trim() === '') return '';
  const n = Number(str);
  return Number.isNaN(n) ? '' : n;
};

/**
 * NumberInput — a numeric field with increment/decrement steppers.
 *
 * Exposes the WAI-ARIA spinbutton pattern (role="spinbutton",
 * aria-valuenow/valuemin/valuemax) and ArrowUp / ArrowDown keyboard control.
 * Controlled: pass `value` (number | '') and `onChange(nextValue)`.
 */
const NumberInput = forwardRef(function NumberInput(
  {
    label,
    value = '',
    onChange,
    min,
    max,
    step = 1,
    precision,
    disabled = false,
    error = '',
    helperText = '',
    required = false,
    size = 'md',
    placeholder = '0',
    id,
    className = '',
    'aria-describedby': ariaDescribedByProp,
    'aria-invalid': ariaInvalidProp,
    ...props
  },
  ref
) {
  const cfg = SIZES[size] || SIZES.md;
  const reactId = React.useId();
  const inputId = id || `number-input-${reactId}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(() => toDisplay(value, precision));

  // Reflect external value changes (e.g. steppers, form resets) unless the
  // user is mid-edit, so typing "1." isn't reformatted out from under them.
  useEffect(() => {
    if (!focused) setDraft(toDisplay(value, precision));
  }, [value, precision, focused]);

  const hasError = Boolean(error);
  const numericValue = typeof value === 'number' ? value : undefined;

  const clamp = (n) => {
    let next = n;
    if (min != null && next < min) next = min;
    if (max != null && next > max) next = max;
    return next;
  };

  const applyPrecision = (n) =>
    precision != null ? Number(n.toFixed(precision)) : n;

  const atMax = max != null && numericValue != null && numericValue >= max;
  const atMin = min != null && numericValue != null && numericValue <= min;

  const doStep = (dir) => {
    if (disabled) return;
    const base = typeof value === 'number' ? value : 0;
    const next = applyPrecision(clamp(base + dir * step));
    setDraft(toDisplay(next, precision));
    if (onChange) onChange(next);
  };

  const handleInput = (e) => {
    const raw = e.target.value;
    setDraft(raw);
    if (onChange) onChange(parse(raw));
  };

  const handleBlur = () => {
    setFocused(false);
    const parsed = parse(draft);
    if (parsed === '') {
      setDraft('');
      if (onChange) onChange('');
      return;
    }
    const next = applyPrecision(clamp(parsed));
    setDraft(toDisplay(next, precision));
    if (next !== value && onChange) onChange(next);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      doStep(1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      doStep(-1);
    }
    if (props.onKeyDown) props.onKeyDown(e);
  };

  const describedByIds = [];
  if (hasError && typeof error === 'string') describedByIds.push(errorId);
  else if (helperText) describedByIds.push(helperId);
  if (ariaDescribedByProp) describedByIds.push(ariaDescribedByProp);
  const describedBy = describedByIds.join(' ') || undefined;

  const borderClasses = disabled
    ? 'border border-line'
    : hasError
    ? 'border-2 border-destructive'
    : focused
    ? 'border-2 border-primary'
    : 'border border-line-strong';

  const stepBtnBase =
    'flex items-center justify-center flex-1 px-1.5 text-ink-muted transition-colors ' +
    'disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:text-ink enabled:hover:bg-surface-muted ' +
    'focus:outline-none';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`font-medium leading-6 ${cfg.text} ${
            disabled ? 'text-ink-subtle' : 'text-ink'
          }`}
        >
          {label}
          {required && (
            <span className="text-destructive" aria-hidden="true">
              {' '}*
            </span>
          )}
        </label>
      )}

      <div
        className={`flex items-stretch ${cfg.box} bg-surface-raised rounded-control overflow-hidden ${borderClasses} ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
      >
        <input
          ref={ref}
          id={inputId}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          value={focused ? draft : toDisplay(value, precision)}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          required={required || undefined}
          aria-valuenow={numericValue}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-invalid={hasError ? true : ariaInvalidProp}
          aria-describedby={describedBy}
          className={`flex-1 min-w-0 ${cfg.pad} ${cfg.text} bg-transparent outline-none ${
            disabled
              ? 'text-ink-subtle placeholder-ink-subtle cursor-not-allowed'
              : 'text-ink placeholder-ink-muted'
          }`}
          {...props}
        />

        {hasError && (
          <span className="flex items-center px-2 shrink-0">
            <AlertCircle size={cfg.stepIcon + 4} className="text-destructive" />
          </span>
        )}

        <div className="flex flex-col shrink-0 border-l border-line divide-y divide-line">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Increase value"
            disabled={disabled || atMax}
            onClick={() => doStep(1)}
            className={stepBtnBase}
          >
            <ChevronUp size={cfg.stepIcon} />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Decrease value"
            disabled={disabled || atMin}
            onClick={() => doStep(-1)}
            className={stepBtnBase}
          >
            <ChevronDown size={cfg.stepIcon} />
          </button>
        </div>
      </div>

      {hasError && typeof error === 'string' ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm text-ink-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default NumberInput;
