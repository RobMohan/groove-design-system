import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

/* ---- native Date helpers (no external date library) ---- */
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a, b) =>
  a && b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const clamp = (d, min, max) => {
  if (min && d < startOfDay(min)) return startOfDay(min);
  if (max && d > startOfDay(max)) return startOfDay(max);
  return d;
};

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const defaultFormat = (date) => {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}/${dd}/${date.getFullYear()}`;
};

/* Build a 6-row x 7-col grid of Date objects covering the given month. */
const buildWeeks = (viewDate) => {
  const first = startOfMonth(viewDate);
  const gridStart = addDays(first, -first.getDay());
  const weeks = [];
  for (let w = 0; w < 6; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      days.push(addDays(gridStart, w * 7 + d));
    }
    weeks.push(days);
  }
  return weeks;
};

const DatePicker = ({
  value = null,
  onChange,
  min,
  max,
  disabledDates,
  placeholder = 'Select a date',
  format = defaultFormat,
  disabled = false,
  id,
  className = '',
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => startOfMonth(value || new Date()));
  const [focusedDate, setFocusedDate] = useState(() => startOfDay(value || new Date()));
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const gridRef = useRef(null);
  const inputId = id || `datepicker-${React.useId()}`;
  const gridLabelId = `${inputId}-label`;

  const today = useMemo(() => startOfDay(new Date()), []);

  const isDisabled = useCallback(
    (date) => {
      const d = startOfDay(date);
      if (min && d < startOfDay(min)) return true;
      if (max && d > startOfDay(max)) return true;
      if (typeof disabledDates === 'function') return disabledDates(d);
      if (Array.isArray(disabledDates)) return disabledDates.some((dd) => isSameDay(dd, d));
      return false;
    },
    [min, max, disabledDates]
  );

  const positionPanel = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    });
  }, []);

  const openPanel = useCallback(() => {
    if (disabled) return;
    const initial = clamp(startOfDay(value || new Date()), min, max);
    setFocusedDate(initial);
    setViewDate(startOfMonth(initial));
    positionPanel();
    setOpen(true);
  }, [disabled, value, min, max, positionPanel]);

  const closePanel = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  // Keep the visible month in sync with the focused day.
  useEffect(() => {
    if (
      focusedDate.getFullYear() !== viewDate.getFullYear() ||
      focusedDate.getMonth() !== viewDate.getMonth()
    ) {
      setViewDate(startOfMonth(focusedDate));
    }
  }, [focusedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Outside click / resize / scroll while open.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        panelRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onReflow = () => positionPanel();
    document.addEventListener('mousedown', onDown);
    window.addEventListener('resize', onReflow);
    window.addEventListener('scroll', onReflow, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('resize', onReflow);
      window.removeEventListener('scroll', onReflow, true);
    };
  }, [open, positionPanel]);

  // Move DOM focus to the focused day whenever it changes while open.
  useEffect(() => {
    if (!open) return;
    const node = gridRef.current?.querySelector('[data-focused="true"]');
    node?.focus();
  }, [open, focusedDate]);

  const selectDate = (date) => {
    if (isDisabled(date)) return;
    onChange?.(startOfDay(date));
    closePanel();
  };

  const handleGridKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedDate((d) => addDays(d, -1));
        break;
      case 'ArrowRight':
        e.preventDefault();
        setFocusedDate((d) => addDays(d, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedDate((d) => addDays(d, -7));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedDate((d) => addDays(d, 7));
        break;
      case 'Home':
        e.preventDefault();
        setFocusedDate((d) => addDays(d, -d.getDay()));
        break;
      case 'End':
        e.preventDefault();
        setFocusedDate((d) => addDays(d, 6 - d.getDay()));
        break;
      case 'PageUp':
        e.preventDefault();
        setFocusedDate((d) => addMonths(d, -1));
        break;
      case 'PageDown':
        e.preventDefault();
        setFocusedDate((d) => addMonths(d, 1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        selectDate(focusedDate);
        break;
      case 'Escape':
        e.preventDefault();
        closePanel();
        break;
      default:
        break;
    }
  };

  const weeks = buildWeeks(viewDate);
  const viewMonth = viewDate.getMonth();

  const panel = (
    <div
      ref={panelRef}
      style={{ position: 'absolute', top: coords.top, left: coords.left }}
      className="z-popover w-72 bg-surface-raised rounded-card shadow-elevation-5 border border-line p-3 animate-scale-in"
    >
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => setViewDate((d) => addMonths(d, -1))}
          className="p-1.5 rounded-control text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <span id={gridLabelId} className="text-sm font-semibold text-ink" aria-live="polite">
          {MONTHS[viewMonth]} {viewDate.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => setViewDate((d) => addMonths(d, 1))}
          className="p-1.5 rounded-control text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-focus"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Calendar grid */}
      <div
        ref={gridRef}
        role="grid"
        aria-labelledby={gridLabelId}
        onKeyDown={handleGridKeyDown}
      >
        <div role="row" className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((wd) => (
            <span
              key={wd}
              role="columnheader"
              aria-label={wd}
              className="flex items-center justify-center h-8 text-xs font-medium text-ink-subtle"
            >
              {wd}
            </span>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div role="row" key={wi} className="grid grid-cols-7">
            {week.map((day) => {
              const outside = day.getMonth() !== viewMonth;
              const selected = isSameDay(day, value);
              const isFocused = isSameDay(day, focusedDate);
              const isToday = isSameDay(day, today);
              const dayDisabled = isDisabled(day);
              return (
                <div role="gridcell" key={day.getTime()} className="flex items-center justify-center p-0.5">
                  <button
                    type="button"
                    tabIndex={isFocused ? 0 : -1}
                    data-focused={isFocused ? 'true' : undefined}
                    disabled={dayDisabled}
                    aria-selected={selected}
                    aria-current={isToday ? 'date' : undefined}
                    aria-label={`${MONTHS[day.getMonth()]} ${day.getDate()}, ${day.getFullYear()}`}
                    onClick={() => selectDate(day)}
                    className={`flex items-center justify-center w-9 h-9 rounded-control text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-1 ${
                      dayDisabled
                        ? 'text-ink-subtle opacity-40 cursor-not-allowed'
                        : selected
                        ? 'bg-primary text-white font-semibold'
                        : outside
                        ? 'text-ink-subtle hover:bg-surface-muted'
                        : 'text-ink hover:bg-surface-muted'
                    } ${isToday && !selected ? 'ring-1 ring-primary' : ''}`}
                  >
                    {day.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`inline-block ${className}`} {...props}>
      <button
        type="button"
        ref={triggerRef}
        id={inputId}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex items-center justify-between gap-2 w-56 h-10 px-3 bg-surface-raised rounded-control border text-left transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 ${
          disabled
            ? 'border-line cursor-not-allowed opacity-60'
            : open
            ? 'border-primary'
            : 'border-line-strong hover:border-primary'
        }`}
      >
        <span className={`truncate ${value ? 'text-ink' : 'text-ink-muted'}`}>
          {value ? format(value) : placeholder}
        </span>
        <CalendarIcon size={18} className="shrink-0 text-ink-muted" aria-hidden="true" />
      </button>
      {open && createPortal(panel, document.body)}
    </div>
  );
};

export default DatePicker;
