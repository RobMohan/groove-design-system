import React, { forwardRef, useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';

const SIZES = {
  sm: { box: 'h-8 px-2 gap-1.5', text: 'text-sm', icon: 16 },
  md: { box: 'h-10 px-2 gap-2', text: 'text-base', icon: 20 },
  lg: { box: 'h-12 px-3 gap-2', text: 'text-lg', icon: 22 },
};

/**
 * TextInput — a single-line text field.
 *
 * Supports multiple input types, prefix/suffix (inline) and addon (attached)
 * slots, helper text, a character counter, a required marker, three sizes, and
 * an error state with the `aria-invalid` + `aria-describedby` wiring that links
 * the helper/error text to the input for assistive tech.
 *
 * Note: the search icon is opt-in (`showIcon={false}` by default).
 */
const TextInput = forwardRef(function TextInput(
  {
    label,
    placeholder = 'Placeholder',
    value = '',
    onChange,
    type = 'text',
    disabled = false,
    error = '',
    helperText = '',
    required = false,
    showIcon = false,
    size = 'md',
    prefix,
    suffix,
    addonBefore,
    addonAfter,
    maxLength,
    showCount = false,
    id,
    className = '',
    'aria-describedby': ariaDescribedByProp,
    'aria-invalid': ariaInvalidProp,
    ...props
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);
  const cfg = SIZES[size] || SIZES.md;
  const reactId = React.useId();
  const inputId = id || `text-input-${reactId}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const countId = `${inputId}-count`;

  const hasError = Boolean(error);
  const stringValue = value == null ? '' : String(value);

  const getBorderClasses = () => {
    if (disabled) return 'border border-line';
    if (hasError) return 'border-2 border-destructive';
    if (isFocused) return 'border-2 border-primary';
    return 'border border-line-strong';
  };

  // Merge internally-derived describedby ids with any passed in (e.g. from Field).
  const describedByIds = [];
  if (hasError && typeof error === 'string') describedByIds.push(errorId);
  else if (helperText) describedByIds.push(helperId);
  if (showCount && maxLength) describedByIds.push(countId);
  if (ariaDescribedByProp) describedByIds.push(ariaDescribedByProp);
  const describedBy = describedByIds.join(' ') || undefined;

  // Corner rounding depends on which addons are attached.
  const fieldRounding =
    addonBefore && addonAfter
      ? 'rounded-none'
      : addonBefore
      ? 'rounded-r-control'
      : addonAfter
      ? 'rounded-l-control'
      : 'rounded-control';

  const addonBase =
    'flex items-center px-3 bg-surface-muted text-ink-muted border-line-strong shrink-0 ' +
    cfg.text;

  const trailingIcon = suffix
    ? suffix
    : hasError
    ? <AlertCircle size={cfg.icon} className="shrink-0 text-destructive" />
    : showIcon
    ? <Search size={cfg.icon} className={`shrink-0 ${disabled ? 'text-ink-subtle' : 'text-ink-muted'}`} />
    : null;

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

      <div className="flex items-stretch">
        {addonBefore && (
          <span className={`${addonBase} ${cfg.box.split(' ')[0]} border border-r-0 rounded-l-control`}>
            {addonBefore}
          </span>
        )}

        <div
          className={`flex items-center flex-1 min-w-0 ${cfg.box} bg-surface-raised ${fieldRounding} ${getBorderClasses()} ${
            disabled ? 'cursor-not-allowed' : ''
          }`}
        >
          {prefix && (
            <span className={`shrink-0 ${cfg.text} ${disabled ? 'text-ink-subtle' : 'text-ink-muted'}`}>
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            required={required || undefined}
            aria-invalid={hasError ? true : ariaInvalidProp}
            aria-describedby={describedBy}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`flex-1 min-w-0 ${cfg.text} leading-6 bg-transparent outline-none ${
              disabled
                ? 'text-ink-subtle placeholder-ink-subtle cursor-not-allowed'
                : 'text-ink placeholder-ink-muted'
            }`}
            {...props}
          />

          {showCount && maxLength && (
            <span id={countId} className="shrink-0 text-xs text-ink-subtle tabular-nums">
              {stringValue.length}/{maxLength}
            </span>
          )}

          {trailingIcon}
        </div>

        {addonAfter && (
          <span className={`${addonBase} ${cfg.box.split(' ')[0]} border border-l-0 rounded-r-control`}>
            {addonAfter}
          </span>
        )}
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

export default TextInput;
