import React, { useRef, useEffect, useId } from 'react';
import { X } from 'lucide-react';
import Portal from './Portal';
import useFocusTrap from '../hooks/useFocusTrap';

const sideClasses = {
  left: 'top-0 left-0 h-full animate-slide-in-from-left border-r',
  right: 'top-0 right-0 h-full animate-slide-in-from-right border-l',
  top: 'top-0 left-0 w-full animate-slide-in-from-top border-b',
  bottom: 'bottom-0 left-0 w-full animate-slide-in-from-bottom border-t',
};

// Horizontal drawers get a width; vertical drawers get a height.
const sizeClasses = {
  left: { sm: 'w-72', md: 'w-96', lg: 'w-[32rem]' },
  right: { sm: 'w-72', md: 'w-96', lg: 'w-[32rem]' },
  top: { sm: 'h-40', md: 'h-72', lg: 'h-[32rem]' },
  bottom: { sm: 'h-40', md: 'h-72', lg: 'h-[32rem]' },
};

/**
 * Drawer / Sheet — an off-canvas panel that slides in from an edge.
 *
 * Scrim sits at `z-overlay`; the panel at `z-drawer` with an edge-specific
 * slide animation. Traps focus (useFocusTrap), restores focus on close, locks
 * body scroll, and is a labelled modal dialog.
 */
const Drawer = ({
  open,
  onClose,
  side = 'right',
  size = 'md',
  title,
  children,
  footer,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showClose = true,
  className = '',
  ...props
}) => {
  const panelRef = useRef(null);
  const titleId = useId();
  const isHorizontal = side === 'left' || side === 'right';

  useFocusTrap(panelRef, {
    active: open,
    onEscape: closeOnEsc ? () => onClose?.() : undefined,
  });

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const sizeClass = (sizeClasses[side] || sizeClasses.right)[size] || '';

  return (
    <Portal>
      <div
        className="fixed inset-0 z-overlay bg-black/50 animate-fade-in"
        onMouseDown={(e) => {
          if (closeOnOverlayClick && e.target === e.currentTarget) onClose?.();
        }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          tabIndex={-1}
          onMouseDown={(e) => e.stopPropagation()}
          className={`fixed z-drawer flex flex-col ${sideClasses[side] || sideClasses.right} ${
            isHorizontal ? `${sizeClass} max-w-[90vw]` : `${sizeClass} max-h-[90vh]`
          } bg-surface-raised border-line shadow-elevation-5 outline-none ${className}`}
          {...props}
        >
          {(title || showClose) && (
            <div className="flex items-start justify-between gap-4 p-5 border-b border-line shrink-0">
              {title && (
                <h2 id={titleId} className="text-lg font-semibold text-ink">
                  {title}
                </h2>
              )}
              {showClose && (
                <button
                  type="button"
                  onClick={() => onClose?.()}
                  aria-label="Close drawer"
                  className="-mr-1 -mt-1 p-1 rounded-control text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-5 text-ink">{children}</div>

          {footer && (
            <div className="flex items-center justify-end gap-3 p-5 border-t border-line shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};

export default Drawer;
