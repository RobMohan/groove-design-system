import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
} from 'react';
import { Check, Minus } from 'lucide-react';

const CheckboxGroupContext = createContext(null);

const BOX = {
  sm: { box: 'w-5 h-5', icon: 12, text: 'text-sm', gap: 'gap-2' },
  md: { box: 'w-6 h-6', icon: 14, text: 'text-base', gap: 'gap-3' },
  lg: { box: 'w-7 h-7', icon: 16, text: 'text-lg', gap: 'gap-3' },
};

/**
 * Checkbox — a single checkbox with optional indeterminate state, size
 * variants, an error/invalid state, and description/help text.
 *
 * Use standalone (controlled via `checked` / `onChange(checked)`) or inside a
 * <CheckboxGroup>, where `checked` and `onChange` are managed for you and you
 * only supply a `value`.
 */
const Checkbox = ({
  checked = false,
  indeterminate = false,
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
  const group = useContext(CheckboxGroupContext);
  const inGroup = group != null && value !== undefined;

  const reactId = useId();
  const checkboxId = id || `checkbox-${reactId}`;
  const descId = description ? `${checkboxId}-description` : undefined;
  const errorId = typeof error === 'string' && error ? `${checkboxId}-error` : undefined;

  const effChecked = inGroup ? group.value.includes(value) : checked;
  const effDisabled = inGroup ? disabled || group.disabled : Boolean(disabled);
  const effSize = size || (group && group.size) || 'md';
  const effName = name || (group && group.name);
  const hasError = Boolean(error) || (inGroup && group.invalid);

  const cfg = BOX[effSize] || BOX.md;
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const describedBy = [descId, errorId].filter(Boolean).join(' ') || undefined;

  const handleChange = (e) => {
    if (effDisabled) return;
    if (inGroup) {
      group.toggle(value);
    } else if (onChange) {
      onChange(e.target.checked);
    }
  };

  const boxStateClasses = effDisabled
    ? 'bg-surface-muted border-line cursor-not-allowed'
    : hasError
    ? 'bg-surface-raised border-2 border-destructive'
    : effChecked || indeterminate
    ? 'bg-primary border-primary'
    : 'bg-surface-raised border-line-strong hover:border-primary';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className={`inline-flex items-start ${cfg.gap}`}>
        <span className="relative inline-flex items-center shrink-0">
          <input
            ref={inputRef}
            type="checkbox"
            id={checkboxId}
            name={effName}
            value={value}
            checked={effChecked}
            disabled={effDisabled}
            onChange={handleChange}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={describedBy}
            className="sr-only peer"
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={`flex items-center justify-center ${cfg.box} rounded border transition-all duration-200 ${
              effDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
            } peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 ${boxStateClasses}`}
          >
            {indeterminate ? (
              <Minus
                size={cfg.icon}
                className={effDisabled ? 'text-ink-subtle' : 'text-white'}
                strokeWidth={3}
              />
            ) : (
              effChecked && (
                <Check
                  size={cfg.icon}
                  className={effDisabled ? 'text-ink-subtle' : 'text-white'}
                  strokeWidth={3}
                />
              )
            )}
          </label>
        </span>

        {(label || description) && (
          <span className="flex flex-col">
            {label && (
              <label
                htmlFor={checkboxId}
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
 * CheckboxGroup — groups checkboxes under a shared label with an array value.
 *
 * Provide either an `options` array or nest <Checkbox value="..."> children.
 * `value` is an array of the checked values; `onChange` receives the next array.
 */
export const CheckboxGroup = ({
  label = '',
  description = '',
  error = '',
  value = [],
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
  const groupId = name || `checkbox-group-${reactId}`;
  const labelId = label ? `${groupId}-label` : undefined;
  const descId = description ? `${groupId}-description` : undefined;
  const errorId = typeof error === 'string' && error ? `${groupId}-error` : undefined;
  const describedBy = [descId, errorId].filter(Boolean).join(' ') || undefined;

  const toggle = (optValue) => {
    if (!onChange) return;
    const exists = value.includes(optValue);
    onChange(exists ? value.filter((v) => v !== optValue) : [...value, optValue]);
  };

  const ctx = {
    value,
    name: groupId,
    size,
    disabled,
    invalid: Boolean(error),
    toggle,
  };

  return (
    <CheckboxGroupContext.Provider value={ctx}>
      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
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
                <Checkbox
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
    </CheckboxGroupContext.Provider>
  );
};

export default Checkbox;
