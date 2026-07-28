import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary hover:bg-primary-hover active:bg-primary-pressed text-white disabled:bg-primary-disabled',
    secondary: 'bg-secondary hover:bg-secondary-hover active:bg-secondary-pressed text-white disabled:bg-secondary-disabled',
    destructive: 'bg-destructive hover:bg-destructive-hover active:bg-destructive-pressed text-white disabled:bg-destructive-disabled',
    positive: 'bg-positive hover:bg-positive-hover active:bg-positive-pressed text-white disabled:bg-positive-disabled',
    outline: 'bg-surface-raised border-2 border-line-strong hover:bg-surface-muted text-ink disabled:bg-surface-muted disabled:text-ink-subtle',
    ghost: 'bg-transparent hover:bg-surface-muted text-ink disabled:text-ink-subtle',
    link: 'bg-transparent hover:underline text-primary disabled:text-primary-disabled'
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    default: 'px-5 py-2.5 text-base',
    large: 'px-6 py-3 text-lg',
    icon: 'p-2.5'
  };

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  const iconSize = size === 'small' ? 16 : size === 'large' ? 22 : 18;
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 size={iconSize} className="animate-spin" aria-hidden="true" />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={iconSize} />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={iconSize} />}
    </button>
  );
};

export default Button;
