import React from 'react';

const heightMap = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

const colorMap = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  positive: 'bg-positive',
  destructive: 'bg-destructive',
};

const Progress = ({
  value = 0,
  max = 100,
  indeterminate = false,
  color = 'primary',
  size = 'md',
  showLabel = false,
  label,
  className = '',
  ...props
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const height = heightMap[size] || heightMap.md;
  const barColor = colorMap[color] || colorMap.primary;

  return (
    <div className={className} {...props}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-ink-muted">{label || 'Progress'}</span>
          {showLabel && !indeterminate && (
            <span className="text-sm font-medium text-ink">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : Math.round(value)}
        className={`relative w-full overflow-hidden rounded-pill bg-surface-muted ${height}`}
      >
        {indeterminate ? (
          <div
            className={`absolute inset-y-0 left-0 w-1/3 rounded-pill ${barColor} animate-progress-indeterminate`}
          />
        ) : (
          <div
            className={`h-full rounded-pill ${barColor} transition-[width] duration-300 ease-out`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
};

export default Progress;
