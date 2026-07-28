import React, { createContext, useContext, useId, useRef } from 'react';

const RadioGroupContext = createContext(null);

const SIZE = {
  sm: { box: 'w-5 h-5', dot: 'w-2 h-2', text: 'text-sm', gap: 'gap-2' },
  md: { box: 'w-6 h-6', dot: 'w-3 h-3', text: 'text-base', gap: 'gap-3' },
  lg: { box: 'w-7 h-7', dot: 'w-3.5 h-3.5', text: 'text-lg', gap: 'gap-3' },
};

/**
 * Radio — a single radio button. Usable on its own (controlled via `checked` /
 * `onChange(value)`) or, preferably, inside a <RadioGroup> which wires up the
 * shared name, single-value selection and roving arrow-key focus.
 */
const Radio = ({
  checked = false,
  disabled,
  label = '',
  description = '',
  error = '',
  size,
  onChange,
  className = '',
  id,
  name,
  value,
  ...props
}) => {
  const group = useContext(RadioGroupContext);
  const inGroup = group != null && value !== undefined;

  const reactId = useId();
  const radioId = id || `radio-${reactId}`;
  const descId = description ? `${radioId}-description` : undefined;
  const errorId = typeof error === 'string' && error ? `${radioId}-error` : undefined;

  const effChecked = inGroup ? group.value === value : checked;
  const effDisabled = inGroup ? disabled || group.disabled : Boolean(disabled);
  const effSize = size || (group && group.size) || 'md';
  const effName = name || (group && group.name);
  const hasError = Boolean(error) || (inGroup && group.invalid);
  const cfg = SIZE[effSize] || SIZE.md;

  // Roving tabindex: the selected radio is the single tab stop; when nothing is
  // selected the group's first radio becomes focusable.
  let tabIndex;
  if (inGroup) {
    const hasSelection = group.value != null && group.value !== '';
    tabIndex = hasSelection
      ? effChecked
        ? 0
        : -1
      : value === group.firstValue
      ? 0
      : -1;
  }

  const describedBy = [descId, errorId].filter(Boolean).join(' ') || undefined;

  const handleChange = () => {
    if (effDisabled) return;
    if (inGroup) group.onSelect(value);
    else if (onChange) onChange(value);
  };

  const boxStateClasses = effDisabled
    ? 'bg-surface-muted border-line cursor-not-allowed'
    : hasError
    ? 'bg-surface-raised border-2 border-destructive'
    : effChecked
    ? 'bg-surface-raised border-2 border-primary'
    : 'bg-surface-raised border border-line-strong hover:border-primary';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className={`inline-flex items-start ${cfg.gap}`}>
        <span className="relative inline-flex items-center shrink-0">
          <input
            type="radio"
            id={radioId}
            name={effName}
            value={value}
            checked={effChecked}
            disabled={effDisabled}
            onChange={handleChange}
            tabIndex={tabIndex}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={describedBy}
            className="sr-only peer"
            {...props}
          />
          <label
            htmlFor={radioId}
            className={`flex items-center justify-center ${cfg.box} rounded-full transition-all duration-200 relative ${
              effDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
            } peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 ${boxStateClasses}`}
          >
            {effChecked && !effDisabled && (
              <span className={`${cfg.dot} rounded-full bg-primary`} />
            )}
            {effChecked && effDisabled && (
              <span className={`${cfg.dot} rounded-full bg-ink opacity-20`} />
            )}
          </label>
        </span>

        {(label || description) && (
          <span className="flex flex-col">
            {label && (
              <label
                htmlFor={radioId}
                className={`${cfg.text} leading-6 ${
                  effDisabled ? 'text-ink-subtle cursor-not-allowed' : 'text-ink cursor-pointer'
                }`}
              >
                {label}
              </label>
            )}
            {description && (
              <span id={descId} className="text-sm text-ink-muted">
                {description}
              </span>
            )}
          </span>
        )}
      </div>

      {!inGroup && typeof error === 'string' && error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * RadioGroup — a single-select group of radios.
 *
 * Renders `role="radiogroup"`, wires a shared name, tracks one `value`, and
 * implements roving arrow-key focus (Up/Left = previous, Down/Right = next,
 * skipping disabled radios). Provide `options` or nest <Radio value="..."> kids.
 */
export const RadioGroup = ({
  label = '',
  description = '',
  error = '',
  value = '',
  onChange,
  options,
  name,
  disabled = false,
  size = 'md',
  required = false,
  className = '',
  children,
  ...props
}) => {
  const reactId = useId();
  const groupId = name || `radio-group-${reactId}`;
  const labelId = label ? `${groupId}-label` : undefined;
  const descId = description ? `${groupId}-description` : undefined;
  const errorId = typeof error === 'string' && error ? `${groupId}-error` : undefined;
  const describedBy = [descId, errorId].filter(Boolean).join(' ') || undefined;
  const containerRef = useRef(null);

  const childValues = options
    ? options.map((o) => o.value)
    : React.Children.toArray(children)
        .map((c) => c && c.props && c.props.value)
        .filter((v) => v !== undefined);
  const firstValue = childValues[0];

  const ctx = {
    value,
    name: groupId,
    size,
    disabled,
    invalid: Boolean(error),
    firstValue,
    onSelect: (val) => onChange && onChange(val),
  };

  const handleKeyDown = (e) => {
    const nav = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
    if (!nav.includes(e.key) || !containerRef.current) return;
    e.preventDefault();
    const radios = Array.from(
      containerRef.current.querySelectorAll('input[type="radio"]:not([disabled])')
    );
    if (!radios.length) return;
    const forward = e.key === 'ArrowDown' || e.key === 'ArrowRight';
    const currentIndex = radios.indexOf(document.activeElement);
    let nextIndex;
    if (currentIndex === -1) nextIndex = 0;
    else nextIndex = forward
      ? (currentIndex + 1) % radios.length
      : (currentIndex - 1 + radios.length) % radios.length;
    const next = radios[nextIndex];
    next.focus();
    if (onChange) onChange(next.value);
  };

  return (
    <RadioGroupContext.Provider value={ctx}>
      <div
        ref={containerRef}
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        onKeyDown={handleKeyDown}
        className={`flex flex-col gap-3 ${className}`}
        {...props}
      >
        {label && (
          <span id={labelId} className="font-medium text-ink">
            {label}
            {required && (
              <span className="text-destructive" aria-hidden="true">
                {' '}*
              </span>
            )}
          </span>
        )}
        {description && (
          <p id={descId} className="text-sm text-ink-muted">
            {description}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {options
            ? options.map((opt) => (
                <Radio
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  description={opt.description}
                  disabled={opt.disabled}
                />
              ))
            : children}
        </div>

        {errorId && (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </RadioGroupContext.Provider>
  );
};

export default Radio;
