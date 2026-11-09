import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minimize2, Moon, Sun } from 'lucide-react';
import Button from '../components/Button';
import IconButton from '../components/IconButton';

/*
 * FullscreenFrame: shows its children in a frame on the page, with an Expand
 * button that makes them fill the whole browser window.
 *
 * The children are rendered once into a host element, and that element is moved
 * between the inline slot and the full-window layer. Moving a node (instead of
 * rendering the children twice) keeps the app's state: the open view, the
 * collapsed sidebar, anything typed into a field.
 *
 * While expanded, the rest of the page is made inert, page scroll is locked,
 * focus moves to the Exit button, and Escape exits (unless a dialog or menu
 * inside the app is open, in which case Escape closes that first).
 */

const THEME_EVENT = 'groove:toggle-theme';
const isDark = () => document.documentElement.classList.contains('dark');

function ThemeButton() {
  const [dark, setDark] = useState(isDark);
  // The site layout owns the theme; follow its class so the icon is always right.
  useEffect(() => {
    const observer = new MutationObserver(() => setDark(isDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return (
    <IconButton
      icon={dark ? Sun : Moon}
      label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      variant="ghost"
      size="sm"
      onClick={() => window.dispatchEvent(new Event(THEME_EVENT))}
    />
  );
}

export default function FullscreenFrame({ children, label, toolbar, slotClassName = '', slotStyle }) {
  const [expanded, setExpanded] = useState(false);
  // One stable element holds the children for the life of the component.
  const [host] = useState(() => document.createElement('div'));
  const inlineMount = useRef(null);
  const overlayMount = useRef(null);
  const expandWrap = useRef(null);
  const exitWrap = useRef(null);
  const wasExpanded = useRef(false);

  useEffect(() => {
    host.className = 'h-full';
  }, [host]);

  // Move the host into whichever mount is showing.
  useLayoutEffect(() => {
    (expanded ? overlayMount.current : inlineMount.current)?.appendChild(host);
  }, [expanded, host]);

  const exit = useCallback(() => setExpanded(false), []);

  useEffect(() => {
    if (!expanded) return undefined;
    const root = document.getElementById('root');
    const previousOverflow = document.body.style.overflow;
    root?.setAttribute('inert', '');
    document.body.style.overflow = 'hidden';
    exitWrap.current?.querySelector('button')?.focus();

    const onKeyDown = (event) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      // Let an open dialog or menu inside the app take the Escape first.
      if (document.querySelector('[role="dialog"], [role="menu"]')) return;
      exit();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      root?.removeAttribute('inert');
      document.body.style.overflow = previousOverflow;
    };
  }, [expanded, exit]);

  // Return focus to the Expand button after leaving full screen.
  useEffect(() => {
    if (wasExpanded.current && !expanded) expandWrap.current?.querySelector('button')?.focus();
    wasExpanded.current = expanded;
  }, [expanded]);

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>{toolbar}</div>
        <span ref={expandWrap}>
          <Button variant="outline" size="small" icon={Maximize2} onClick={() => setExpanded(true)}>
            Expand
          </Button>
        </span>
      </div>

      <div className={`relative ${slotClassName}`} style={slotStyle}>
        <div ref={inlineMount} className="h-full" />
        {expanded && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-muted p-6 text-center text-sm text-ink-muted">
            Showing full screen. Press Esc to bring it back.
          </div>
        )}
      </div>

      {createPortal(children, host)}

      {expanded &&
        createPortal(
          <div
            role="region"
            aria-label={label}
            className="fixed inset-0 z-modal flex flex-col bg-surface-muted"
          >
            <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface-raised px-4">
              <p className="truncate text-sm font-medium text-ink">{label}</p>
              <div className="flex items-center gap-2">
                <ThemeButton />
                <span ref={exitWrap}>
                  <Button variant="outline" size="small" icon={Minimize2} onClick={exit}>
                    Exit full screen
                  </Button>
                </span>
              </div>
            </div>
            <div ref={overlayMount} className="min-h-0 flex-1" />
          </div>,
          document.body,
        )}
    </>
  );
}
