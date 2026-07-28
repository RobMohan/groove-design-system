import React, { useState, useRef, useEffect, useCallback, useLayoutEffect, useId } from 'react';
import Portal from './Portal';

const VIEWPORT_PADDING = 8;
const OPPOSITE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

function computeCoords(anchor, tip, side, gap) {
  let top = 0;
  let left = 0;
  if (side === 'top') {
    top = anchor.top - tip.height - gap;
    left = anchor.left + anchor.width / 2 - tip.width / 2;
  } else if (side === 'bottom') {
    top = anchor.bottom + gap;
    left = anchor.left + anchor.width / 2 - tip.width / 2;
  } else if (side === 'left') {
    left = anchor.left - tip.width - gap;
    top = anchor.top + anchor.height / 2 - tip.height / 2;
  } else {
    left = anchor.right + gap;
    top = anchor.top + anchor.height / 2 - tip.height / 2;
  }
  return { top, left };
}

function resolveSide(anchor, tip, side, gap) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const fits = {
    top: anchor.top - tip.height - gap >= 0,
    bottom: anchor.bottom + tip.height + gap <= vh,
    left: anchor.left - tip.width - gap >= 0,
    right: anchor.right + tip.width + gap <= vw,
  };
  if (!fits[side] && fits[OPPOSITE[side]]) return OPPOSITE[side];
  return side;
}

/**
 * Tooltip — informative text shown on hover AND keyboard focus.
 *
 * Portals to <body> at `z-tooltip`, positions against the trigger with basic
 * collision flipping, opens/closes on a delay, hides on blur/Escape, and wires
 * `aria-describedby` from the trigger to the tooltip.
 */
const Tooltip = ({
  children,
  content,
  position = 'top',
  openDelay = 150,
  closeDelay = 100,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [resolvedSide, setResolvedSide] = useState(position);
  const anchorRef = useRef(null);
  const tipRef = useRef(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);
  const tooltipId = useId();

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const show = useCallback(() => {
    clearTimers();
    openTimer.current = setTimeout(() => setIsVisible(true), openDelay);
  }, [openDelay]);

  const hide = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setIsVisible(false), closeDelay);
  }, [closeDelay]);

  // Clear timers on unmount.
  useEffect(() => () => clearTimers(), []);

  // Position the tooltip once it is visible.
  useLayoutEffect(() => {
    if (!isVisible) return undefined;
    const update = () => {
      const anchorEl = anchorRef.current;
      const tipEl = tipRef.current;
      if (!anchorEl || !tipEl) return;
      const anchor = anchorEl.getBoundingClientRect();
      const tip = tipEl.getBoundingClientRect();
      const side = resolveSide(anchor, tip, position, 8);
      let { top, left } = computeCoords(anchor, tip, side, 8);
      left = Math.max(
        VIEWPORT_PADDING,
        Math.min(left, window.innerWidth - tip.width - VIEWPORT_PADDING)
      );
      top = Math.max(
        VIEWPORT_PADDING,
        Math.min(top, window.innerHeight - tip.height - VIEWPORT_PADDING)
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
  }, [isVisible, position]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isVisible) {
      clearTimers();
      setIsVisible(false);
    }
  };

  const child = React.isValidElement(children)
    ? React.cloneElement(children, {
        'aria-describedby': isVisible && content ? tooltipId : children.props['aria-describedby'],
      })
    : children;

  return (
    <>
      <span
        ref={anchorRef}
        className={`inline-flex ${className}`}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onKeyDown={handleKeyDown}
      >
        {child}
      </span>
      {isVisible && content && (
        <Portal>
          <div
            ref={tipRef}
            id={tooltipId}
            role="tooltip"
            style={{ position: 'fixed', top: coords.top, left: coords.left }}
            className="z-tooltip pointer-events-none bg-surface-inverse text-ink-inverse text-sm px-3 py-1.5 rounded-control shadow-elevation-3 max-w-xs animate-fade-in"
            data-side={resolvedSide}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
};

export default Tooltip;
