import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import Portal from './Portal';

const VIEWPORT_PADDING = 8;

/*
 * A dropdown action menu.
 * - trigger: element to render as the toggle (cloned with onClick + aria props)
 * - items: array of { label, icon, onClick, disabled, danger } or { divider: true }
 *
 * The list portals to <body> at `z-popover` so it clears open Modals, supports
 * arrow-key roving focus (+ Home/End), and closes on Esc / outside-click.
 */
const Menu = ({ trigger, items = [], align = 'left', className = '' }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const itemRefs = useRef([]);

  // Indices of actionable items (skip dividers + disabled) for roving focus.
  const enabledIndices = items.reduce((acc, item, index) => {
    if (!item.divider && !item.disabled) acc.push(index);
    return acc;
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const restoreFocus = useCallback(() => {
    const el = triggerRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]');
    (el || triggerRef.current)?.focus?.();
  }, []);

  // Position the menu under the trigger (fixed coords, recompute on scroll/resize).
  useLayoutEffect(() => {
    if (!open) return undefined;
    const update = () => {
      const triggerEl = triggerRef.current;
      const menuEl = menuRef.current;
      if (!triggerEl || !menuEl) return;
      const t = triggerEl.getBoundingClientRect();
      const m = menuEl.getBoundingClientRect();
      let left = align === 'right' ? t.right - m.width : t.left;
      let top = t.bottom + 8;
      left = Math.max(
        VIEWPORT_PADDING,
        Math.min(left, window.innerWidth - m.width - VIEWPORT_PADDING)
      );
      if (top + m.height > window.innerHeight - VIEWPORT_PADDING) {
        top = Math.max(VIEWPORT_PADDING, t.top - m.height - 8);
      }
      setCoords({ top, left });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, align]);

  // Focus the first item when the menu opens.
  useEffect(() => {
    if (open && enabledIndices.length > 0) {
      setActiveIndex(enabledIndices[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Move DOM focus to the active item.
  useEffect(() => {
    if (open && activeIndex >= 0) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [open, activeIndex]);

  // Outside-click closes.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (menuRef.current?.contains(e.target) || triggerRef.current?.contains(e.target)) return;
      close();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open, close]);

  const handleSelect = (item) => {
    if (item.disabled) return;
    item.onClick?.();
    close();
    restoreFocus();
  };

  const moveActive = (dir) => {
    if (enabledIndices.length === 0) return;
    const pos = enabledIndices.indexOf(activeIndex);
    const nextPos =
      pos === -1
        ? 0
        : (pos + dir + enabledIndices.length) % enabledIndices.length;
    setActiveIndex(enabledIndices[nextPos]);
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveActive(-1);
        break;
      case 'Home':
        e.preventDefault();
        if (enabledIndices.length) setActiveIndex(enabledIndices[0]);
        break;
      case 'End':
        e.preventDefault();
        if (enabledIndices.length) setActiveIndex(enabledIndices[enabledIndices.length - 1]);
        break;
      case 'Escape':
        e.preventDefault();
        close();
        restoreFocus();
        break;
      case 'Tab':
        close();
        break;
      default:
        break;
    }
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
    <span className={`inline-block ${className}`} ref={triggerRef}>
      {triggerEl}
      {open && (
        <Portal>
          <div
            ref={menuRef}
            role="menu"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            style={{ position: 'fixed', top: coords.top, left: coords.left }}
            className="z-popover min-w-[12rem] bg-surface-raised rounded-control shadow-elevation-4 border border-line py-1 outline-none animate-scale-in"
          >
            {items.map((item, index) =>
              item.divider ? (
                <div key={index} role="separator" className="my-1 border-t border-line" />
              ) : (
                <button
                  key={index}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  role="menuitem"
                  tabIndex={index === activeIndex ? 0 : -1}
                  disabled={item.disabled}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => !item.disabled && setActiveIndex(index)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left transition-colors outline-none ${
                    item.disabled
                      ? 'text-ink-subtle cursor-not-allowed'
                      : item.danger
                      ? 'text-destructive hover:bg-destructive/10 focus:bg-destructive/10'
                      : 'text-ink hover:bg-surface-muted focus:bg-surface-muted'
                  }`}
                >
                  {item.icon && <item.icon size={16} className="shrink-0" aria-hidden="true" />}
                  {item.label}
                </button>
              )
            )}
          </div>
        </Portal>
      )}
    </span>
  );
};

export default Menu;
