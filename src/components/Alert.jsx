import React, { useState } from 'react';
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
    container: 'bg-warning/10 border-warning/30',
    iconColor: 'text-warning',
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
  actions,
  onClose,
  dismissible = false,
  className = '',
  ...props
}) => {
  const config = variants[variant] || variants.info;
  const Icon = icon || config.icon;
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const showDismiss = Boolean(onClose) || dismissible;

  const handleDismiss = () => {
    setLeaving(true);
    if (onClose) {
      // Backward-compatible: let the parent own removal.
      onClose();
    } else {
      // Self-managed: fade out, then unmount.
      setTimeout(() => setVisible(false), 200);
    }
  };

  if (!visible) return null;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-control border transition-opacity duration-200 ${
        leaving ? 'opacity-0' : 'opacity-100'
      } ${config.container} ${className}`}
      {...props}
    >
      <Icon size={20} className={`shrink-0 mt-0.5 ${config.iconColor}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {title && <p className={`font-semibold ${config.title}`}>{title}</p>}
        {children && (
          <div className={`text-sm text-ink-muted ${title ? 'mt-1' : ''}`}>{children}</div>
        )}
        {actions && <div className="mt-3 flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {showDismiss && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="shrink-0 text-ink-muted hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-focus rounded"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
