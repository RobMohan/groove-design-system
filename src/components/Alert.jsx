import React from 'react';
import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react';

const variants = {
  info: {
    icon: Info,
    container: 'bg-primary/10 border-primary/30',
    iconColor: 'text-primary',
    title: 'text-ink',
  },
  success: {
    icon: CheckCircle,
    container: 'bg-positive/10 border-positive/30',
    iconColor: 'text-positive',
    title: 'text-ink',
  },
  warning: {
    icon: AlertTriangle,
    container: 'bg-yellow-400/15 border-yellow-500/40',
    iconColor: 'text-yellow-600',
    title: 'text-ink',
  },
  error: {
    icon: AlertCircle,
    container: 'bg-destructive/10 border-destructive/30',
    iconColor: 'text-destructive',
    title: 'text-ink',
  },
};

const Alert = ({
  variant = 'info',
  title,
  children,
  icon,
  onClose,
  className = '',
  ...props
}) => {
  const config = variants[variant] || variants.info;
  const Icon = icon || config.icon;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-control border ${config.container} ${className}`}
      {...props}
    >
      <Icon size={20} className={`shrink-0 mt-0.5 ${config.iconColor}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {title && <p className={`font-semibold ${config.title}`}>{title}</p>}
        {children && (
          <div className={`text-sm text-ink-muted ${title ? 'mt-1' : ''}`}>{children}</div>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          className="shrink-0 text-ink-muted hover:text-ink transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
