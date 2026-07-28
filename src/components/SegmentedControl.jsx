import React, {
  useState,
  useRef,
  useLayoutEffect,
  useId,
  forwardRef,
} from 'react';

/* Normalize an option into { value, label, icon, disabled }. Strings are allowed. */
const normalize = (opt) =>
  typeof opt === 'object' && opt !== null
    ? {
        value: opt.value,
        label: opt.label ?? String(opt.value),
        icon: opt.icon,
        disabled: !!opt.disabled,
      }
    : { value: opt, label: String(opt), disabled: false };

const sizeClasses = {
  sm: { seg: 'h-8 text-sm px-3 gap-1.5', icon: 14, pad: 'p-0.5' },
  md: { seg: 'h-10 text-base px-4 gap-2', icon: 16, pad: 'p-1' },
  lg: { seg: 'h-12 text-lg px-5 gap-2', icon: 18, pad: 'p-1' },
};

/*
 * Segmented Control — an iOS-style single-select among 2–5 joined options with
 * an animated sliding indicator. Exposes role=radiogroup with roving-tabindex
 * radios and full arrow-key navigation.
 */
const SegmentedControl = forwardRef(
  (
    {
      options = [],
      value,
      defaultValue,
      onChange,
      size = 'md',
      fullWidth = false,
      disabled = false,
      'aria-label': ariaLabel,
      className = '',
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const items = options.map(normalize);

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(
      defaultValue ?? items[0]?.value
    );
    const currentValue = isControlled ? value : internalValue;

    const selectedIndex = items.findIndex((o) => o.value === currentValue);
    const sizes = sizeClasses[size] || sizeClasses.md;

    const btnRefs = useRef([]);
    const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

    // Slide the active indicator under the selected segment.
    useLayoutEffect(() => {
      const el = btnRefs.current[selectedIndex];
      if (el) {
        setIndicator({
          left: el.offsetLeft,
          width: el.offsetWidth,
          ready: true,
        });
      } else {
        setIndicator((prev) => ({ ...prev, ready: false }));
      }
    }, [selectedIndex, size, fullWidth, items.length]);

    const select = (opt) => {
      if (disabled || opt.disabled) return;
      if (!isControlled) setInternalValue(opt.value);
      onChange?.(opt.value);
    };

    const focusIndex = (index) => {
      const el = btnRefs.current[index];
      el?.focus();
    };

    // Arrow keys move selection (and focus) to the next/previous enabled option.
    const moveTo = (from, dir) => {
      const count = items.length;
      let idx = from;
      for (let n = 0; n < count; n++) {
        idx = (idx + dir + count) % count;
        if (!items[idx].disabled) {
          select(items[idx]);
          focusIndex(idx);
          return;
        }
      }
    };

    const handleKeyDown = (e, index) => {
      if (disabled) return;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          moveTo(index, 1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          moveTo(index, -1);
          break;
        case 'Home':
          e.preventDefault();
          moveTo(-1, 1);
          break;
        case 'End':
          e.preventDefault();
          moveTo(0, -1);
          break;
        default:
          break;
      }
    };

    // Roving tabindex: the selected radio is focusable; fall back to the first.
    const tabbableIndex =
      selectedIndex >= 0
        ? selectedIndex
        : items.findIndex((o) => !o.disabled);

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        className={`relative inline-flex items-center ${sizes.pad} bg-surface-muted rounded-control border border-line ${
          fullWidth ? 'flex w-full' : ''
        } ${disabled ? 'opacity-60' : ''} ${className}`}
        {...props}
      >
        {/* Sliding active indicator */}
        {indicator.ready && (
          <span
            aria-hidden="true"
            className="absolute top-1 bottom-1 rounded-control bg-surface-raised shadow-elevation-1 transition-all duration-200 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        )}

        {items.map((opt, index) => {
          const isSelected = index === selectedIndex;
          const Icon = opt.icon;
          return (
            <button
              key={String(opt.value)}
              ref={(el) => (btnRefs.current[index] = el)}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled || opt.disabled}
              tabIndex={index === tabbableIndex ? 0 : -1}
              onClick={() => select(opt)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`relative z-[1] inline-flex items-center justify-center font-medium rounded-control transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                sizes.seg
              } ${fullWidth ? 'flex-1' : ''} ${
                opt.disabled || disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              } ${
                isSelected
                  ? 'text-ink'
                  : opt.disabled
                  ? 'text-ink-subtle'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {Icon && <Icon size={sizes.icon} aria-hidden="true" />}
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';

export default SegmentedControl;
