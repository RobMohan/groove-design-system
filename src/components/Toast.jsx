import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react';

const variants = {
  info: { icon: Info, accent: 'text-primary' },
  success: { icon: CheckCircle, accent: 'text-positive' },
  warning: { icon: AlertTriangle, accent: 'text-warning' },
  error: { icon: AlertCircle, accent: 'text-destructive' },
};

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>');
  return ctx;
};

const ToastItem = ({ toast, onDismiss }) => {
  const config = variants[toast.variant] || variants.info;
  const Icon = config.icon;
  // Errors interrupt the user immediately; everything else is announced politely.
  const isAssertive = toast.variant === 'error' || toast.variant === 'destructive';

  const timerRef = useRef(null);
  const startRef = useRef(0);
  const remainingRef = useRef(toast.duration);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    if (toast.duration === Infinity) return;
    clear();
    startRef.current = Date.now();
    timerRef.current = setTimeout(() => onDismiss(toast.id), remainingRef.current);
  }, [toast.duration, toast.id, onDismiss, clear]);

  const pause = useCallback(() => {
    if (toast.duration === Infinity) return;
    clear();
    remainingRef.current -= Date.now() - startRef.current;
  }, [toast.duration, clear]);

  useEffect(() => {
    resume();
    return clear;
  }, [resume, clear]);

  const handleAction = () => {
    toast.action?.onClick?.();
    onDismiss(toast.id);
  };

  return (
    <div
      role={isAssertive ? 'alert' : 'status'}
      aria-live={isAssertive ? 'assertive' : 'polite'}
      onMouseEnter={pause}
      onMouseLeave={resume}
      className="flex items-start gap-3 w-80 p-4 bg-surface-raised rounded-control shadow-elevation-4 border border-line animate-slide-in-right"
    >
      <Icon size={20} className={`shrink-0 mt-0.5 ${config.accent}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {toast.title && <p className="font-semibold text-ink">{toast.title}</p>}
        {toast.description && (
          <p className={`text-sm text-ink-muted ${toast.title ? 'mt-0.5' : ''}`}>
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            onClick={handleAction}
            className="mt-2 text-sm font-semibold text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 rounded"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 text-ink-muted hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-focus rounded"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children, position = 'bottom-right' }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((cur) => cur.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options) => {
    const id = Math.random().toString(36).substr(2, 9);
    const next = {
      id,
      title: '',
      description: '',
      variant: 'info',
      duration: 4000,
      ...(typeof options === 'string' ? { description: options } : options),
    };
    setToasts((cur) => [...cur, next]);
    return id;
  }, []);

  const positionClasses = {
    'top-right': 'top-4 right-4 items-end',
    'top-left': 'top-4 left-4 items-start',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {createPortal(
        <div
          className={`fixed z-toast flex flex-col gap-3 ${positionClasses[position] || positionClasses['bottom-right']}`}
        >
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
