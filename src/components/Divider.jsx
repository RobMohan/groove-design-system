import React from 'react';

/*
 * A thin rule that separates content.
 * - orientation: 'horizontal' (default) | 'vertical'
 * - label: optional node rendered inline within a horizontal divider
 * - labelPosition: 'left' | 'center' (default) | 'right'
 * - variant: 'solid' (default) | 'dashed'
 * Renders role="separator" + aria-orientation for assistive tech.
 */
const Divider = ({
  orientation = 'horizontal',
  label,
  labelPosition = 'center',
  variant = 'solid',
  className = '',
  ...props
}) => {
  const isVertical = orientation === 'vertical';
  const borderStyle = variant === 'dashed' ? 'border-dashed' : 'border-solid';

  if (isVertical) {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`inline-block self-stretch min-h-[1em] border-l ${borderStyle} border-line ${className}`}
        {...props}
      />
    );
  }

  if (label != null && label !== false) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={`flex items-center gap-3 text-sm font-medium text-ink-muted ${className}`}
        {...props}
      >
        {labelPosition !== 'left' && (
          <span className={`flex-1 border-t ${borderStyle} border-line`} aria-hidden="true" />
        )}
        <span className="shrink-0">{label}</span>
        {labelPosition !== 'right' && (
          <span className={`flex-1 border-t ${borderStyle} border-line`} aria-hidden="true" />
        )}
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={`w-full border-t ${borderStyle} border-line ${className}`}
      {...props}
    />
  );
};

export default Divider;
