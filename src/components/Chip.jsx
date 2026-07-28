import React from 'react';
import { X } from 'lucide-react';

const colors = {
  neutral: 'bg-surface-muted text-ink border-line',
  primary: 'bg-primary/15 text-primary border-primary/30',
  positive: 'bg-positive/15 text-positive border-positive/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  destructive: 'bg-destructive/15 text-destructive border-destructive/30',
};

// Selected chips flip to a solid fill to read as an active/applied filter.
const selectedColors = {
  neutral: 'bg-ink text-ink-inverse border-ink',
  primary: 'bg-primary text-white border-primary',
  positive: 'bg-positive text-white border-positive',
  warning: 'bg-warning text-white border-warning',
  destructive: 'bg-destructive text-white border-destructive',
};

const sizes = {
  sm: { pad: 'px-2 py-0.5 gap-1 text-xs', icon: 12 },
  md: { pad: 'px-2.5 py-1 gap-1.5 text-sm', icon: 14 },
  lg: { pad: 'px-3 py-1.5 gap-2 text-base', icon: 16 },
};

const Chip = ({
  children,
  label,
  color = 'neutral',
  size = 'md',
  icon: Icon,
  onRemove,
  onClick,
  clickable = false,
  selected = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const content = children ?? label;
  const isClickable = clickable || Boolean(onClick);
  const isRemovable = Boolean(onRemove);
  const isInteractive = isClickable || isRemovable;

  const palette = selected ? selectedColors[color] : colors[color];
  const sz = sizes[size] || sizes.md;

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (isRemovable && (e.key === 'Backspace' || e.key === 'Delete')) {
      e.preventDefault();
      onRemove(e);
      return;
    }
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e);
    }
  };

  const stateClasses = [
    palette,
    isInteractive
      ? 'focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-1'
      : '',
    isClickable && !disabled ? 'cursor-pointer' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={`inline-flex items-center border rounded-pill font-medium select-none align-middle ${sz.pad} ${stateClasses} ${className}`}
      role={isClickable ? 'button' : undefined}
      aria-pressed={isClickable ? selected : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={isInteractive && !disabled ? 0 : undefined}
      onClick={isClickable && !disabled ? onClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      {...props}
    >
      {Icon && <Icon size={sz.icon} className="shrink-0" aria-hidden="true" />}
      <span>{content}</span>
      {isRemovable && (
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onRemove(e);
          }}
          aria-label={`Remove ${typeof content === 'string' ? content : 'item'}`}
          className="shrink-0 -mr-1 ml-0.5 inline-flex items-center justify-center rounded-pill p-0.5 hover:bg-black/10 dark:hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-focus disabled:cursor-not-allowed"
        >
          <X size={sz.icon} aria-hidden="true" />
        </button>
      )}
    </span>
  );
};

export default Chip;
