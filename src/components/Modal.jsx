import React, { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';
import Portal from './Portal';
import useFocusTrap from '../hooks/useFocusTrap';

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw]',
};

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  showClose = true,
  className = '',
  ...props
}) => {
  const dialogRef = useRef(null);
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const descId = `${generatedId}-desc`;

  // Trap focus inside the dialog, restore it on close, and close on Escape.
  useFocusTrap(dialogRef, {
    active: isOpen,
    onEscape: () => onClose?.(),
  });

  // Lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-overlay flex items-center justify-center p-4 bg-black/50 animate-fade-in"
        onMouseDown={(e) => {
          if (closeOnOverlay && e.target === e.currentTarget) onClose?.();
        }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descId : undefined}
          tabIndex={-1}
          className={`relative z-modal w-full ${sizeMap[size] || sizeMap.md} bg-surface-raised rounded-modal shadow-elevation-5 outline-none animate-scale-in ${className}`}
          {...props}
        >
          {(title || showClose) && (
            <div className="flex items-start justify-between gap-4 p-5 border-b border-line">
              {title && (
                <h2 id={titleId} className="text-lg font-semibold text-ink">
                  {title}
                </h2>
              )}
              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="-mr-1 -mt-1 p-1 rounded-control text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          <div className="p-5 text-ink">
            {description && (
              <p id={descId} className="text-ink-muted mb-4">
                {description}
              </p>
            )}
            {children}
          </div>

          {footer && (
            <div className="flex items-center justify-end gap-3 p-5 border-t border-line">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
