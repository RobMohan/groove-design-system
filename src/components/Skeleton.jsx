import React from 'react';

const variantClasses = {
  text: 'rounded',
  circle: 'rounded-pill',
  rect: 'rounded-control',
};

const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  style = {},
  ...props
}) => {
  const defaultHeight = variant === 'text' ? '1em' : undefined;

  return (
    <span
      aria-hidden="true"
      className={`block bg-surface-muted animate-pulse ${variantClasses[variant] || variantClasses.text} ${className}`}
      style={{ width, height: height ?? defaultHeight, ...style }}
      {...props}
    />
  );
};

/* Convenience: a few stacked text lines, last one shortened. */
export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} />
    ))}
  </div>
);

export default Skeleton;
