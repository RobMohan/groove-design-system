import React from 'react';

const Card = ({
  title,
  description,
  children,
  footer,
  className = ''
}) => {
  return (
    <div className={`bg-surface-raised rounded-2xl p-8 shadow-elevation-3 ${className}`}>
      {title && (
        <h3 className="text-2xl font-bold text-ink mb-2">{title}</h3>
      )}

      {description && (
        <p className="text-ink-muted text-base mb-4">{description}</p>
      )}

      {children && (
        <div className="text-ink">{children}</div>
      )}

      {footer && (
        <div className="mt-6">{footer}</div>
      )}
    </div>
  );
};

export default Card;