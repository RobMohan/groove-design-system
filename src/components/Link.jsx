import React from 'react';
import { ExternalLink } from 'lucide-react';

const variants = {
  default: 'text-primary hover:text-primary-hover',
  subtle: 'text-ink hover:text-primary',
  quiet: 'text-ink-muted hover:text-ink',
};

const underlines = {
  hover: 'no-underline hover:underline',
  always: 'underline',
  none: 'no-underline',
};

// Semantic anchor. Renders a native <a> by default, but `as` lets you swap in a
// router component (e.g. react-router's Link) while keeping styling and a11y intact.
const Link = ({
  as: Component = 'a',
  href,
  variant = 'default',
  underline = 'hover',
  external = false,
  disabled = false,
  onClick,
  className = '',
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center gap-1 rounded-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2';
  const classes = `${base} ${variants[variant] || variants.default} ${
    underlines[underline] || underlines.hover
  } ${disabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`;

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  const shared = {
    className: classes,
    'aria-disabled': disabled || undefined,
    onClick: handleClick,
    ...externalProps,
    ...props,
  };

  const body = (
    <>
      {children}
      {external && <ExternalLink size={14} className="shrink-0" aria-hidden="true" />}
    </>
  );

  if (Component === 'a') {
    return (
      <a href={disabled ? undefined : href} {...shared}>
        {body}
      </a>
    );
  }

  // Custom component (e.g. router Link) — forward href for elements that use it;
  // router-specific props such as `to` flow through {...props}.
  return (
    <Component href={href} {...shared}>
      {body}
    </Component>
  );
};

export default Link;
