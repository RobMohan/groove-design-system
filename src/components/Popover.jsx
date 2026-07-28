import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useId,
} from 'react';
import Portal from './Portal';
import { getFocusableElements } from '../hooks/useFocusTrap';

const VIEWPORT_PADDING = 8;

function parsePlacement(placement) {
  const [side, align = 'center'] = String(placement).split('-');
  return { side, align };
}

// Given the anchor + panel rects, return {top,left} in viewport (fixed) coords.
function computeCoords(anchor, panel, side, align, offset) {
  let top = 0;
  let left = 0;

  if (side === 'top') top = anchor.top - panel.height - offset;
  else if (side === 'bottom') top = anchor.bottom + offset;
  else if (side === 'left') left = anchor.left - panel.width - offset;
  else if (side === 'right') left = anchor.right + offset;

  if (side === 'top' || side === 'bottom') {
    if (align === 'start') left = anchor.left;
    else if (align === 'end') left = anchor.right - panel.width;
    else left = anchor.left + anchor.width / 2 - panel.width / 2;
  } else {
    if (align === 'start') top = anchor.top;
    else if (align === 'end') top = anchor.bottom - panel.height;
    else top = anchor.top + anchor.height / 2 - panel.height / 2;
  }

  return { top, left };
}

// Flip to the opposite side when the preferred side would overflow the viewport.
function resolveSide(anchor, panel, side, offset) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const fits = {
    top: anchor.top - panel.height - offset >= 0,
    bottom: anchor.bottom + panel.height + offset <= vh,
    left: anchor.left - panel.width - offset >= 0,
    right: anchor.right + panel.width + offset <= vw,
  };
  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
  if (!fits[side] && fits[opposite[side]]) return opposite[side];
  return side;
}

/**
 * Popover — an anchored floating panel for arbitrary content.
 *
 * Portals to <body>, positions itself against the trigger with basic collision
 * flipping, sits at `z-popover` (clears an open Modal), moves focus into the
 * panel, closes on Escape / outside-click / blur, and animates in.
 */
const Popover = ({
  trigger,
  children,
  content,
  placement = 'bottom',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  offset = 8,
  closeOnBlur = true,
  closeOnEsc = true,
  showArrow = false,
  className = '',
  ...props
}) => {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const anchorRef = useRef(null);
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);
  const panelId = useId();

  const { side: baseSide, align } = parsePlacement(placement);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [resolvedSide, setResolvedSide] = useState(baseSide);

  const setOpen = useCallback(
    (next) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const open = useCallback(() => setOpen(true), [setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);
  const toggle = useCallback(() => setOpen(!isOpen), [setOpen, isOpen]);

  // Position the panel against the anchor (recompute on scroll/resize).
  useLayoutEffect(() => {
    if (!isOpen) return undefined;
    const update = () => {
      const anchorEl = anchorRef.current;
      const panelEl = panelRef.current;
      if (!anchorEl || !panelEl) return;
      const anchor = anchorEl.getBoundingClientRect();
      const panel = panelEl.getBoundingClientRect();
      const side = resolveSide(anchor, panel, baseSide, offset);
      let { top, left } = computeCoords(anchor, panel, side, align, offset);
      // Clamp into the viewport along the cross axis.
      left = Math.max(
        VIEWPORT_PADDING,
        Math.min(left, window.innerWidth - panel.width - VIEWPORT_PADDING)
      );
      top = Math.max(
        VIEWPORT_PADDING,
        Math.min(top, window.innerHeight - panel.height - VIEWPORT_PADDING)
      );
      setCoords({ top, left });
      setResolvedSide(side);
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [isOpen, baseSide, align, offset]);

  // Move focus into the panel on open; restore to the trigger on close.
  useEffect(() => {
    if (!isOpen) return undefined;
    previouslyFocused.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panelEl = panelRef.current;
    const focusables = panelEl ? getFocusableElements(panelEl) : [];
    (focusables[0] || panelEl)?.focus?.();
    return () => {
      const el = previouslyFocused.current;
      if (el && typeof el.focus === 'function' && document.contains(el)) el.focus();
    };
  }, [isOpen]);

  // Outside-click closes.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointerDown = (e) => {
      if (
        panelRef.current?.contains(e.target) ||
        anchorRef.current?.contains(e.target)
      ) {
        return;
      }
      close();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [isOpen, close]);

  const handleKeyDown = (e) => {
    if (closeOnEsc && e.key === 'Escape') {
      e.stopPropagation();
      close();
    }
  };

  // Close when focus leaves the panel entirely (Tab out).
  const handleBlur = (e) => {
    if (!closeOnBlur) return;
    const next = e.relatedTarget;
    if (
      next &&
      (panelRef.current?.contains(next) || anchorRef.current?.contains(next))
    ) {
      return;
    }
    close();
  };

  const triggerEl = React.isValidElement(trigger)
    ? React.cloneElement(trigger, {
        onClick: (e) => {
          trigger.props.onClick?.(e);
          toggle();
        },
        'aria-haspopup': 'dialog',
        'aria-expanded': isOpen,
        'aria-controls': isOpen ? panelId : undefined,
      })
    : trigger;

  const arrowSide = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[
    resolvedSide
  ];
  const arrowStyle = {
    top: { top: '100%', left: '50%', transform: 'translate(-50%, -50%) rotate(45deg)' },
    bottom: { top: 0, left: '50%', transform: 'translate(-50%, -50%) rotate(45deg)' },
    left: { left: '100%', top: '50%', transform: 'translate(-50%, -50%) rotate(45deg)' },
    right: { left: 0, top: '50%', transform: 'translate(-50%, -50%) rotate(45deg)' },
  }[arrowSide];

  return (
    <>
      <span ref={anchorRef} className={`inline-flex ${className}`}>
        {triggerEl}
      </span>
      {isOpen && (
        <Portal>
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            style={{ position: 'fixed', top: coords.top, left: coords.left }}
            className="z-popover min-w-[10rem] max-w-xs bg-surface-raised text-ink rounded-card border border-line shadow-elevation-4 p-4 outline-none animate-scale-in"
            {...props}
          >
            {showArrow && (
              <span
                aria-hidden="true"
                className="absolute w-2.5 h-2.5 bg-surface-raised border-line"
                style={{
                  ...arrowStyle,
                  borderTopWidth: arrowSide === 'top' ? 1 : 0,
                  borderLeftWidth: arrowSide === 'left' ? 1 : 0,
                  borderRightWidth: arrowSide === 'right' ? 1 : 0,
                  borderBottomWidth: arrowSide === 'bottom' ? 1 : 0,
                  borderStyle: 'solid',
                }}
              />
            )}
            {content ?? children}
          </div>
        </Portal>
      )}
    </>
  );
};

export default Popover;
