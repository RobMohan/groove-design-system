import React, { useState, useRef, useId } from 'react';

/*
 * Accessible tabs following the ARIA tabs pattern.
 *
 * tabs: array of { label, content?, id?, icon?, disabled? }
 *   - A stable id is derived as `tab.id ?? tab.value ?? index`, so tabs without
 *     ids fall back to their index (preserving the original index-based API).
 *
 * Controlled:   pass `value` (the active tab's id) + `onChange(value, index)`.
 * Uncontrolled: pass `defaultValue` (id) or `defaultTab` (index).
 *
 * variant: 'underline' (default) | 'pill' | 'enclosed'
 * orientation: 'horizontal' (default) | 'vertical'
 */
const getTabId = (tab, index) => tab.id ?? tab.value ?? index;

const Tabs = ({
  tabs = [],
  value,
  defaultValue,
  defaultTab = 0,
  onChange,
  variant = 'underline',
  orientation = 'horizontal',
  className = '',
}) => {
  const baseId = useId();
  const isControlled = value !== undefined;
  const isVertical = orientation === 'vertical';

  const initialId =
    defaultValue !== undefined
      ? defaultValue
      : tabs[defaultTab]
      ? getTabId(tabs[defaultTab], defaultTab)
      : tabs[0]
      ? getTabId(tabs[0], 0)
      : undefined;

  const [internalValue, setInternalValue] = useState(initialId);
  const activeValue = isControlled ? value : internalValue;
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t, i) => getTabId(t, i) === activeValue)
  );

  const tabRefs = useRef([]);

  const activate = (index) => {
    const tab = tabs[index];
    if (!tab || tab.disabled) return;
    const id = getTabId(tab, index);
    if (!isControlled) setInternalValue(id);
    onChange?.(id, index);
  };

  const focusTab = (index) => {
    tabRefs.current[index]?.focus();
  };

  const moveFocus = (start, dir) => {
    const count = tabs.length;
    for (let step = 1; step <= count; step++) {
      const next = (start + dir * step + count) % count;
      if (!tabs[next]?.disabled) {
        activate(next);
        focusTab(next);
        return;
      }
    }
  };

  const handleKeyDown = (e, index) => {
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
    if (e.key === nextKey) {
      e.preventDefault();
      moveFocus(index, 1);
    } else if (e.key === prevKey) {
      e.preventDefault();
      moveFocus(index, -1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      moveFocus(-1, 1);
    } else if (e.key === 'End') {
      e.preventDefault();
      moveFocus(tabs.length, -1);
    }
  };

  const listBase = variant === 'enclosed'
    ? ''
    : variant === 'pill'
    ? 'gap-1'
    : isVertical
    ? 'border-l border-line-strong'
    : 'border-b border-line-strong';

  const tabClasses = (isActive, disabled) => {
    const base =
      'inline-flex items-center gap-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-focus focus:ring-inset disabled:opacity-40 disabled:cursor-not-allowed';
    if (variant === 'pill') {
      return `${base} px-3 py-1.5 rounded-pill ${
        isActive ? 'bg-primary text-white' : 'text-ink-muted hover:bg-surface-muted'
      }`;
    }
    if (variant === 'enclosed') {
      return `${base} px-4 py-2 -mb-px rounded-t-control border ${
        isActive
          ? 'bg-surface-raised border-line-strong border-b-surface-raised text-primary'
          : 'border-transparent text-ink-muted hover:text-ink'
      }`;
    }
    // underline
    if (isVertical) {
      return `${base} px-3 py-2 -ml-px border-l-2 ${
        isActive ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'
      }`;
    }
    return `${base} px-3 py-2 -mb-px border-b-2 ${
      isActive ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'
    }`;
  };

  const activeContent = tabs[activeIndex]?.content;

  return (
    <div className={`${isVertical ? 'flex gap-4' : ''} ${className}`}>
      <div
        role="tablist"
        aria-orientation={orientation}
        className={`flex ${isVertical ? 'flex-col shrink-0' : 'flex-wrap'} ${
          variant === 'enclosed' && !isVertical ? 'border-b border-line-strong' : ''
        } ${listBase}`}
      >
        {tabs.map((tab, index) => {
          const id = getTabId(tab, index);
          const isActive = index === activeIndex;
          return (
            <button
              key={id}
              ref={(el) => (tabRefs.current[index] = el)}
              role="tab"
              type="button"
              id={`${baseId}-tab-${id}`}
              aria-selected={isActive}
              aria-controls={tab.content != null ? `${baseId}-panel-${id}` : undefined}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => activate(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={tabClasses(isActive, tab.disabled)}
            >
              {tab.icon && <tab.icon size={16} aria-hidden="true" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeContent != null && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${getTabId(tabs[activeIndex], activeIndex)}`}
          aria-labelledby={`${baseId}-tab-${getTabId(tabs[activeIndex], activeIndex)}`}
          tabIndex={0}
          className={`focus:outline-none ${isVertical ? 'flex-1' : 'mt-4'}`}
        >
          {activeContent}
        </div>
      )}
    </div>
  );
};

export default Tabs;
