import React from 'react';
import { Loader2 } from 'lucide-react';

// Variant styles mirror Button.jsx so an IconButton reads as the same family of controls.
const variants = {
  primary: 'bg-primary hover:bg-primary-hover active:bg-primary-pressed text-white disabled:bg-primary-disabled',
  secondary: 'bg-secondary hover:bg-secondary-hover active:bg-secondary-pressed text-white disabled:bg-secondary-disabled',
  destructive: 'bg-destructive hover:bg-destructive-hover active:bg-destructive-pressed text-white disabled:bg-destructive-disabled',
  positive: 'bg-positive hover:bg-positive-hover active:bg-positive-pressed text-white disabled:bg-positive-disabled',
  outline: 'bg-surface-raised border-2 border-line-strong hover:bg-surface-muted text-ink disabled:bg-surface-muted disabled:text-ink-subtle',
  ghost: 'bg-transparent hover:bg-surface-muted text-ink disabled:text-ink-subtle',
  link: 'bg-transparent hover:underline text-primary disabled:text-primary-disabled',
};

const sizes = {
  sm: { box: 'p-1.5', icon: 16 },
  md: { box: 'p-2.5', icon: 20 },
  lg: { box: 'p-3', icon: 24 },
};

const IconButton = ({
  icon: Icon,
  label,
  'aria-label': ariaLabel,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const resolvedLabel = ariaLabel ?? label;

  if (!resolvedLabel && typeof console !== 'undefined') {
    // Icon-only controls are invisible to screen readers without an accessible name.
    console.warn(
      'IconButton: an accessible name is required. Pass `aria-label` (or `label`).'
    );
  }

  const sz = sizes[size] || sizes.md;
  const base =
    'inline-flex items-center justify-center rounded-control transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 disabled:cursor-not-allowed';
  const classes = `${base} ${variants[variant] || variants.primary} ${sz.box} ${className}`;
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      aria-label={resolvedLabel}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      className={classes}
      {...props}
    >
      {loading ? (
        <Loader2 size={sz.icon} className="animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon size={sz.icon} aria-hidden="true" />
      )}
    </button>
  );
};

export default IconButton;
