import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default', 
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover active:bg-primary-pressed text-white focus:ring-blue-400 disabled:bg-primary-disabled',
    secondary: 'bg-secondary hover:bg-secondary-hover active:bg-secondary-pressed text-white focus:ring-purple-400 disabled:bg-secondary-disabled',
    destructive: 'bg-destructive hover:bg-destructive-hover active:bg-destructive-pressed text-white focus:ring-red-400 disabled:bg-destructive-disabled',
    positive: 'bg-positive hover:bg-positive-hover active:bg-positive-pressed text-white focus:ring-green-400 disabled:bg-positive-disabled',
    outline: 'bg-surface-raised border-2 border-line-strong hover:bg-surface-muted text-ink focus:ring-gray-300 disabled:bg-surface-muted disabled:text-ink-subtle',
    ghost: 'bg-transparent hover:bg-surface-muted text-ink focus:ring-gray-300 disabled:text-ink-subtle',
    link: 'bg-transparent hover:underline text-primary focus:ring-blue-300 disabled:text-primary-disabled'
  };
  
  const sizes = {
    small: 'px-4 py-2 text-sm',
    default: 'px-5 py-2.5 text-base',
    large: 'px-6 py-3 text-lg',
    icon: 'p-2.5'
  };
  
  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  const iconSize = size === 'small' ? 16 : size === 'large' ? 22 : 18;
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={iconSize} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={iconSize} />}
    </button>
  );
};

export default Button;