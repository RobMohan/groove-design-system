import { useEffect, useRef } from 'react';

// Elements that can receive keyboard focus.
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Collect the tabbable elements inside a container, in DOM order.
 * Skips elements that are explicitly hidden or aria-hidden. We intentionally
 * avoid offsetParent-based visibility checks so this behaves correctly in jsdom.
 */
export function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) =>
      !el.hasAttribute('hidden') &&
      el.getAttribute('aria-hidden') !== 'true' &&
      el.tabIndex !== -1
  );
}

/**
 * useFocusTrap — keep keyboard focus inside a container while it is active.
 *
 * - Moves focus into the container when it becomes active (initialFocusRef,
 *   else the first focusable child, else the container itself).
 * - Loops Tab / Shift+Tab so focus never escapes the container.
 * - Calls `onEscape` when Escape is pressed.
 * - Restores focus to whatever was focused before activation on cleanup.
 *
 * @param {React.RefObject<HTMLElement>} containerRef - ref to the trap container
 * @param {Object} [options]
 * @param {boolean} [options.active=true] - whether the trap is engaged
 * @param {Function} [options.onEscape] - called with the KeyboardEvent on Escape
 * @param {React.RefObject<HTMLElement>} [options.initialFocusRef] - element to focus first
 * @param {boolean} [options.restoreFocus=true] - restore focus to the prior element on close
 */
export default function useFocusTrap(containerRef, options = {}) {
  const { active = true, onEscape, initialFocusRef, restoreFocus = true } = options;

  // Keep callbacks/refs in mutable refs so the main effect only re-runs on `active`.
  const onEscapeRef = useRef(onEscape);
  const initialFocusRef2 = useRef(initialFocusRef);
  const restoreFocusRef = useRef(restoreFocus);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    onEscapeRef.current = onEscape;
    initialFocusRef2.current = initialFocusRef;
    restoreFocusRef.current = restoreFocus;
  });

  useEffect(() => {
    if (!active) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Move focus into the trap.
    const focusables = getFocusableElements(container);
    const initial = initialFocusRef2.current?.current || focusables[0] || container;
    if (initial === container && !container.hasAttribute('tabindex')) {
      container.setAttribute('tabindex', '-1');
    }
    // Defer to the next frame so portal children are mounted before focusing.
    const raf = requestAnimationFrame(() => {
      if (typeof initial?.focus === 'function') initial.focus();
    });
    // Also try synchronously (helps tests that don't flush rAF).
    if (typeof initial?.focus === 'function') initial.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onEscapeRef.current?.(e);
        return;
      }
      if (e.key !== 'Tab') return;

      const items = getFocusableElements(container);
      if (items.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey) {
        if (activeEl === first || !container.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else if (activeEl === last || !container.contains(activeEl)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handleKeyDown);
      const toRestore = previouslyFocused.current;
      if (
        restoreFocusRef.current &&
        toRestore &&
        typeof toRestore.focus === 'function' &&
        document.contains(toRestore)
      ) {
        toRestore.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, containerRef]);
}
