import React, { useState } from 'react';

const sizeMap = {
  xs: { box: 'w-6 h-6', text: 'text-xs', dot: 'w-1.5 h-1.5' },
  sm: { box: 'w-8 h-8', text: 'text-sm', dot: 'w-2 h-2' },
  md: { box: 'w-10 h-10', text: 'text-base', dot: 'w-2.5 h-2.5' },
  lg: { box: 'w-14 h-14', text: 'text-lg', dot: 'w-3 h-3' },
  xl: { box: 'w-20 h-20', text: 'text-2xl', dot: 'w-4 h-4' },
};

const statusColors = {
  online: 'bg-positive',
  away: 'bg-yellow-500',
  busy: 'bg-destructive',
  offline: 'bg-ink-subtle',
};

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

const Avatar = ({
  src,
  alt = '',
  name = '',
  size = 'md',
  shape = 'circle',
  status,
  className = '',
  ...props
}) => {
  const [imgError, setImgError] = useState(false);
  const dims = sizeMap[size] || sizeMap.md;
  const radius = shape === 'square' ? 'rounded-card' : 'rounded-pill';
  const showImage = src && !imgError;
  const initials = getInitials(name);

  return (
    <span className={`relative inline-flex shrink-0 ${className}`} {...props}>
      <span
        className={`inline-flex items-center justify-center overflow-hidden bg-surface-muted text-ink-muted font-medium ${dims.box} ${dims.text} ${radius}`}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : initials ? (
          <span aria-hidden="true">{initials}</span>
        ) : (
          // Generic fallback glyph
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-2/3 h-2/3" aria-hidden="true">
            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6Z" />
          </svg>
        )}
      </span>
      {!showImage && !initials && <span className="sr-only">{alt || name || 'User avatar'}</span>}
      {status && (
        <span
          className={`absolute bottom-0 right-0 block rounded-pill ring-2 ring-surface-raised ${dims.dot} ${
            statusColors[status] || statusColors.offline
          }`}
          aria-label={status}
        />
      )}
    </span>
  );
};

/* Overlapping cluster of avatars with an optional "+N" overflow chip. */
export const AvatarGroup = ({ children, max, size = 'md', className = '' }) => {
  const items = React.Children.toArray(children);
  const shown = max ? items.slice(0, max) : items;
  const overflow = max ? items.length - shown.length : 0;
  const dims = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center ${className}`}>
      {shown.map((child, i) => (
        <div key={i} className="-ml-2 first:ml-0 ring-2 ring-surface-raised rounded-pill">
          {React.isValidElement(child) ? React.cloneElement(child, { size }) : child}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={`-ml-2 inline-flex items-center justify-center bg-surface-muted text-ink-muted font-medium ring-2 ring-surface-raised rounded-pill ${dims.box} ${dims.text}`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};

export default Avatar;
