import React from 'react';
import { Loader2 } from 'lucide-react';

const sizeMap = { sm: 16, md: 24, lg: 40, xl: 56 };

const colorMap = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  positive: 'text-positive',
  destructive: 'text-destructive',
  neutral: 'text-ink-muted',
};

const Spinner = ({
  size = 'md',
  color = 'primary',
  label,
  className = '',
  ...props
}) => {
  const px = typeof size === 'number' ? size : sizeMap[size] || sizeMap.md;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2 ${className}`}
      {...props}
    >
      <Loader2
        size={px}
        className={`animate-spin ${colorMap[color] || colorMap.primary}`}
        aria-hidden="true"
      />
      {label && <span className="text-sm text-ink-muted">{label}</span>}
      <span className="sr-only">{label || 'Loading'}</span>
    </div>
  );
};

export default Spinner;
