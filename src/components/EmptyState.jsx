import React from 'react';

/*
 * A zero-data / empty view placeholder.
 * - icon: a lucide component OR any node (rendered in a muted badge)
 * - title / description: the message
 * - primaryAction / secondaryAction: nodes (usually <Button>s)
 * - size: 'sm' | 'md' (default) | 'lg'
 */
const sizeMap = {
  sm: { wrap: 'py-8', badge: 'w-10 h-10', icon: 20, title: 'text-base', desc: 'text-sm', gap: 'mt-3' },
  md: { wrap: 'py-12', badge: 'w-14 h-14', icon: 28, title: 'text-lg', desc: 'text-sm', gap: 'mt-4' },
  lg: { wrap: 'py-16', badge: 'w-20 h-20', icon: 36, title: 'text-xl', desc: 'text-base', gap: 'mt-6' },
};

const EmptyState = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  size = 'md',
  className = '',
  ...props
}) => {
  const s = sizeMap[size] || sizeMap.md;

  let iconEl = null;
  if (icon) {
    if (React.isValidElement(icon)) {
      iconEl = icon;
    } else if (typeof icon === 'function') {
      const Icon = icon;
      iconEl = <Icon size={s.icon} aria-hidden="true" />;
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 ${s.wrap} ${className}`}
      {...props}
    >
      {iconEl && (
        <div
          className={`flex items-center justify-center ${s.badge} rounded-pill bg-surface-muted text-ink-muted mb-4`}
        >
          {iconEl}
        </div>
      )}
      {title && <h3 className={`font-semibold text-ink ${s.title}`}>{title}</h3>}
      {description && (
        <p className={`text-ink-muted max-w-sm mt-1 ${s.desc}`}>{description}</p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className={`flex flex-wrap items-center justify-center gap-3 ${s.gap}`}>
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
