import React, { forwardRef, useEffect, useRef, useState } from 'react';

const SIZES = {
  sm: { text: 'text-sm', pad: 'px-2.5 py-1.5' },
  md: { text: 'text-base', pad: 'px-3 py-2' },
  lg: { text: 'text-lg', pad: 'px-3.5 py-2.5' },
};

/**
 * Textarea — a multi-line text field.
 *
 * Adds optional `autoResize` (grows with content), a character counter,
 * helper text, three sizes, and the error + `aria-invalid` / `aria-describedby`
 * wiring that matches TextInput.
 */
const Textarea = forwardRef(function Textarea(
  {
    label,
    placeholder = 'Placeholder',
    value = '',
    onChange,
    disabled = false,
    error = '',
    helperText = '',
    required = false,
    rows = 4,
    maxLength,
    showCount = false,
    autoResize = false,
    size = 'md',
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
  const textareaId = id || `textarea-${reactId}`;
  const helperId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;
  const countId = `${textareaId}-count`;

  const hasError = Boolean(error);
  const stringValue = value == null ? '' : String(value);

  const innerRef = useRef(null);
  const setRefs = (node) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  // Grow the field to fit its content when autoResize is enabled.
  useEffect(() => {
    if (!autoResize) return;
    const el = innerRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value, autoResize]);

  const getBorderClasses = () => {
    if (disabled) return 'border border-line';
    if (hasError) return 'border-2 border-destructive';
    if (isFocused) return 'border-2 border-primary';
    return 'border border-line-strong';
  };

  const describedByIds = [];
  if (hasError && typeof error === 'string') describedByIds.push(errorId);
  else if (helperText) describedByIds.push(helperId);
  if (showCount && maxLength) describedByIds.push(countId);
  if (ariaDescribedByProp) describedByIds.push(ariaDescribedByProp);
  const describedBy = describedByIds.join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
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

      <div className={`bg-surface-raised rounded-control ${getBorderClasses()}`}>
        <textarea
          ref={setRefs}
          id={textareaId}
          rows={rows}
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
          className={`w-full ${cfg.pad} ${cfg.text} leading-6 bg-transparent outline-none rounded-control ${
            autoResize ? 'resize-none overflow-hidden' : 'resize-y'
          } ${
            disabled
              ? 'text-ink-subtle placeholder-ink-subtle cursor-not-allowed resize-none'
              : 'text-ink placeholder-ink-muted'
          }`}
          {...props}
        />
      </div>

      <div className="flex items-start justify-between gap-2 min-h-[1.25rem]">
        {hasError && typeof error === 'string' ? (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-sm text-ink-muted">
            {helperText}
          </p>
        ) : (
          <span />
        )}
        {showCount && maxLength && (
          <span id={countId} className="text-sm text-ink-subtle shrink-0 tabular-nums">
            {stringValue.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

export default Textarea;
