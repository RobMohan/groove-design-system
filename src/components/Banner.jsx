import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react';

// Page-level, full-width status band. Sits at the top of a page/section rather than
// inline (that's Alert's job). Destructive tone is announced assertively.
const tones = {
  info: { icon: Info, container: 'bg-primary/10 border-primary/30', accent: 'text-primary', role: 'status' },
  positive: { icon: CheckCircle, container: 'bg-positive/10 border-positive/30', accent: 'text-positive', role: 'status' },
  warning: { icon: AlertTriangle, container: 'bg-warning/10 border-warning/30', accent: 'text-warning', role: 'status' },
  destructive: { icon: AlertCircle, container: 'bg-destructive/10 border-destructive/30', accent: 'text-destructive', role: 'alert' },
};

const Banner = ({
  tone = 'info',
  title,
  children,
  icon,
  actions,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}) => {
  const cfg = tones[tone] || tones.info;
  const Icon = icon || cfg.icon;
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  return (
    <div
      role={cfg.role}
      aria-live={cfg.role === 'alert' ? 'assertive' : 'polite'}
      className={`w-full flex items-center gap-3 border-y px-4 py-3 text-ink ${cfg.container} ${className}`}
      {...props}
    >
      <Icon size={20} className={`shrink-0 ${cfg.accent}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-ink">{title}</p>}
        {children && (
          <div className={`text-sm text-ink-muted ${title ? 'mt-0.5' : ''}`}>{children}</div>
        )}
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
      {dismissible && (
        <button
          type="button"
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

export default Banner;
