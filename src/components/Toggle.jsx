import React, { useId } from 'react';

const SIZE = {
  sm: { track: 'w-9 h-5', thumb: 'w-4 h-4', on: 'left-[18px]', off: 'left-[2px]', text: 'text-sm' },
  md: { track: 'w-[52px] h-7', thumb: 'w-6 h-6', on: 'left-[26px]', off: 'left-[2px]', text: 'text-base' },
  lg: { track: 'w-16 h-9', thumb: 'w-8 h-8', on: 'left-[30px]', off: 'left-[2px]', text: 'text-lg' },
};

/**
 * Toggle — an on/off switch.
 *
 * Renders the accessible switch pattern (`role="switch"` + `aria-checked`),
 * supports size variants, an optional label + description, and label position
 * (left or right of the switch). Controlled via `checked` / `onChange(checked)`.
 */
const Toggle = ({
  checked = false,
  disabled = false,
  label = '',
  description = '',
  onChange,
  size = 'md',
  labelPosition = 'right',
  className = '',
  id,
  ...props
}) => {
  const cfg = SIZE[size] || SIZE.md;
  const reactId = useId();
  const switchId = id || `toggle-${reactId}`;
  const labelId = label ? `${switchId}-label` : undefined;
  const descId = description ? `${switchId}-description` : undefined;
  const describedBy = descId || undefined;

  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };

  const trackClasses = disabled
    ? 'bg-surface-muted border-line cursor-not-allowed'
    : checked
    ? 'bg-primary border-primary'
    : 'bg-surface-raised border-line-strong';

  const thumbClasses = disabled
    ? 'bg-ink opacity-20'
    : checked
    ? 'bg-white'
    : 'bg-ink-subtle';

  const labelBlock = (label || description) && (
    <span className="flex flex-col">
      {label && (
        <span
          id={labelId}
          onClick={toggle}
          className={`${cfg.text} leading-6 ${
            disabled ? 'text-ink-subtle cursor-not-allowed' : 'text-ink cursor-pointer'
          }`}
        >
          {label}
        </span>
      )}
      {description && (
        <span id={descId} className="text-sm text-ink-muted">
          {description}
        </span>
      )}
    </span>
  );

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {labelPosition === 'left' && labelBlock}

      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        disabled={disabled}
        onClick={toggle}
        className={`relative inline-flex items-center shrink-0 ${cfg.track} rounded-pill border transition-colors duration-200 ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 ${trackClasses}`}
        {...props}
      >
        <span
          className={`absolute top-1/2 -translate-y-1/2 ${cfg.thumb} rounded-full transition-all duration-200 ${
            checked ? cfg.on : cfg.off
          } ${thumbClasses}`}
        />
      </button>

      {labelPosition === 'right' && labelBlock}
    </div>
  );
};

export default Toggle;
