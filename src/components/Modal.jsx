import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  showClose = true,
  className = '',
}) => {
  const dialogRef = useRef(null);

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog.
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onMouseDown={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        className={`w-full ${sizeMap[size] || sizeMap.md} bg-surface-raised rounded-modal shadow-elevation-5 outline-none animate-scale-in ${className}`}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between gap-4 p-5 border-b border-line">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-ink">
                {title}
              </h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="-mr-1 -mt-1 p-1 rounded text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        <div className="p-5 text-ink">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 p-5 border-t border-line">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
