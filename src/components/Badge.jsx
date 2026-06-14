import React from 'react';

const Badge = ({
  children,
  type = 'default',
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center px-2.5 py-1 rounded text-xs font-normal';

  const types = {
    default: 'bg-primary/15 text-primary',
    warning: 'bg-yellow-400 text-black',
    positive: 'bg-positive text-white',
    negative: 'bg-destructive text-white'
  };

  const badgeClasses = `${baseStyles} ${types[type]} ${className}`;

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};

export default Badge;
