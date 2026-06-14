import React, { useState, useRef, useEffect, useCallback } from 'react';

const alignClasses = {
  left: 'left-0',
  right: 'right-0',
};

/*
 * A dropdown action menu.
 * - trigger: element to render as the toggle (cloned with onClick + aria props)
 * - items: array of { label, icon, onClick, disabled, danger } or { divider: true }
 */
const Menu = ({
  trigger,
  items = [],
  align = 'left',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const handleSelect = (item) => {
    if (item.disabled) return;
    item.onClick?.();
    close();
  };

  const triggerEl = React.isValidElement(trigger)
    ? React.cloneElement(trigger, {
        onClick: (e) => {
          trigger.props.onClick?.(e);
          setOpen((o) => !o);
        },
        'aria-haspopup': 'menu',
        'aria-expanded': open,
      })
    : trigger;

  return (
    <div className={`relative inline-block ${className}`} ref={rootRef}>
      {triggerEl}
      {open && (
        <div
          role="menu"
          className={`absolute z-30 mt-2 min-w-[12rem] bg-surface-raised rounded-control shadow-elevation-4 border border-line py-1 ${
            alignClasses[align] || alignClasses.left
          }`}
        >
          {items.map((item, index) =>
            item.divider ? (
              <div key={index} role="separator" className="my-1 border-t border-line" />
            ) : (
              <button
                key={index}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleSelect(item)}
                className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left transition-colors ${
                  item.disabled
                    ? 'text-ink-subtle cursor-not-allowed'
                    : item.danger
                    ? 'text-destructive hover:bg-destructive/10'
                    : 'text-ink hover:bg-surface-muted'
                }`}
              >
                {item.icon && <item.icon size={16} className="shrink-0" aria-hidden="true" />}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;
