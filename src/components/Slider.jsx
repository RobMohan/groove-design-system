import React, { useState, useRef, forwardRef, useId } from 'react';

const SIZES = {
  sm: { track: 'h-1', thumb: 'w-4 h-4' },
  md: { track: 'h-1.5', thumb: 'w-5 h-5' },
  lg: { track: 'h-2', thumb: 'w-6 h-6' },
};

/**
 * Slider / Range — drag (or key) to pick a numeric value or a [min, max] range.
 *
 * Pass a number for a single-thumb slider or a `[a, b]` tuple for a range.
 * Each thumb is a WAI-ARIA slider (role="slider", aria-valuemin/max/now) with
 * full keyboard support: Arrow keys (± step), PageUp/PageDown (± step×10),
 * Home/End (min/max). Pointer drag is supported via pointer capture.
 */
const Slider = forwardRef(function Slider(
  {
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue,
    onChange,
    disabled = false,
    marks,
    showValue = false,
    size = 'md',
    label,
    'aria-label': ariaLabel,
    className = '',
    ...props
  },
  ref
) {
  const isRange = Array.isArray(value) || Array.isArray(defaultValue);
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(
    defaultValue ?? (isRange ? [min, max] : min)
  );
  const current = isControlled ? value : internal;

  const trackRef = useRef(null);
  const activeThumb = useRef(null);
  const cfg = SIZES[size] || SIZES.md;
  const reactId = useId();

  const clamp = (v) => Math.min(max, Math.max(min, v));
  const roundToStep = (v) => {
    const stepped = Math.round((v - min) / step) * step + min;
    return clamp(Number(stepped.toFixed(6)));
  };
  const pct = (v) => ((v - min) / (max - min)) * 100;

  const emit = (next) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const setThumb = (index, raw) => {
    const val = roundToStep(raw);
    if (isRange) {
      const arr = [current[0], current[1]];
      if (index === 0) arr[0] = Math.min(val, arr[1]);
      else arr[1] = Math.max(val, arr[0]);
      emit(arr);
    } else {
      emit(val);
    }
  };

  const valueFromPointer = (clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return min;
    const ratio = (clientX - rect.left) / rect.width;
    return min + ratio * (max - min);
  };

  const nearestThumb = (v) => {
    if (!isRange) return 0;
    return Math.abs(v - current[0]) <= Math.abs(v - current[1]) ? 0 : 1;
  };

  const onTrackPointerDown = (e) => {
    if (disabled) return;
    const v = valueFromPointer(e.clientX);
    const idx = nearestThumb(v);
    activeThumb.current = idx;
    setThumb(idx, v);
  };

  const onThumbPointerDown = (index) => (e) => {
    if (disabled) return;
    e.stopPropagation();
    activeThumb.current = index;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onThumbPointerMove = (index) => (e) => {
    if (activeThumb.current !== index) return;
    setThumb(index, valueFromPointer(e.clientX));
  };
  const onThumbPointerUp = (index) => (e) => {
    if (activeThumb.current !== index) return;
    activeThumb.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const onThumbKeyDown = (index) => (e) => {
    if (disabled) return;
    const val = isRange ? current[index] : current;
    let next = val;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = val + step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = val - step;
        break;
      case 'PageUp':
        next = val + step * 10;
        break;
      case 'PageDown':
        next = val - step * 10;
        break;
      case 'Home':
        next = min;
        break;
      case 'End':
        next = max;
        break;
      default:
        return;
    }
    e.preventDefault();
    setThumb(index, next);
  };

  const thumbs = isRange ? current : [current];
  const fillLeft = isRange ? pct(current[0]) : 0;
  const fillRight = isRange ? pct(current[1]) : pct(current);

  const marksList = (marks || []).map((m) =>
    typeof m === 'object' ? m : { value: m, label: undefined }
  );

  const displayValue = isRange ? `${current[0]} – ${current[1]}` : current;

  return (
    <div className={`flex flex-col gap-2 ${className}`} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-base text-ink">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium text-ink-muted tabular-nums">{displayValue}</span>
          )}
        </div>
      )}

      <div className={`relative flex items-center ${disabled ? 'opacity-60' : ''}`}>
        <div
          ref={trackRef}
          onPointerDown={onTrackPointerDown}
          className={`relative w-full ${cfg.track} rounded-pill bg-surface-muted ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <div
            className="absolute top-0 bottom-0 rounded-pill bg-primary"
            style={{ left: `${fillLeft}%`, right: `${100 - fillRight}%` }}
          />

          {thumbs.map((v, index) => (
            <button
              key={index}
              type="button"
              role="slider"
              aria-label={
                ariaLabel || (isRange ? `${label || 'value'} ${index === 0 ? 'minimum' : 'maximum'}` : label)
              }
              aria-valuemin={isRange && index === 1 ? current[0] : min}
              aria-valuemax={isRange && index === 0 ? current[1] : max}
              aria-valuenow={v}
              aria-orientation="horizontal"
              aria-disabled={disabled || undefined}
              disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              id={`${reactId}-thumb-${index}`}
              onPointerDown={onThumbPointerDown(index)}
              onPointerMove={onThumbPointerMove(index)}
              onPointerUp={onThumbPointerUp(index)}
              onKeyDown={onThumbKeyDown(index)}
              style={{ left: `${pct(v)}%` }}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 ${cfg.thumb} rounded-full bg-surface-raised border-2 border-primary shadow-elevation-2 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
              }`}
            />
          ))}
        </div>
      </div>

      {marksList.length > 0 && (
        <div className="relative h-5 w-full">
          {marksList.map((m) => (
            <span
              key={m.value}
              className="absolute -translate-x-1/2 text-xs text-ink-subtle"
              style={{ left: `${pct(m.value)}%` }}
            >
              {m.label ?? m.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

export default Slider;
