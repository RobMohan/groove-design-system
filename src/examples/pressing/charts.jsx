import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { fmt } from './data';

/*
 * Two small, dependency-free charts for the pressing-plant example, drawn with
 * Groove tokens. Colors come from CSS currentColor + text-* classes, so they
 * follow light and dark mode with no per-theme code.
 *
 * Rules these follow: one series, one color; bars at most 24px with a 4px
 * rounded end and a square baseline; hairline recessive grid; labels in text
 * tokens (never the series color); direct labels only on the latest value and
 * the peak; every value reachable without a pointer (keyboard readout and a
 * table view), because tooltips enhance and never gate.
 */

const HEIGHT = 240;
const BAR_MAX = 24;
const RADIUS = 4;

function useWidth(ref) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const read = () => el.getBoundingClientRect().width || el.offsetWidth || 640;
    setWidth(read());
    if (typeof ResizeObserver === 'undefined') {
      const onResize = () => setWidth(read());
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect?.width;
      if (typeof next === 'number') setWidth(next);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

/** Clean ticks from 0: 1, 2, 3 or 5 times a power of ten. */
export function niceTicks(maxValue, count = 3) {
  const raw = Math.max(maxValue, 1) / count;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 3, 5, 10].map((m) => m * pow).find((s) => s >= raw);
  const top = Math.ceil(maxValue / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
}

// Full numbers under 10,000, compact (10K) once the axis reaches it. One style per axis.
const tickLabel = (n, top) => (top >= 10000 ? (n === 0 ? '0' : `${n / 1000}K`) : fmt(n));

// A column with a 4px rounded top and a square baseline.
const columnPath = (x, w, yTop, base) => {
  const h = base - yTop;
  if (h <= 0) return '';
  const r = Math.min(RADIUS, h, w / 2);
  return `M${x},${base} V${yTop + r} Q${x},${yTop} ${x + r},${yTop} H${x + w - r} Q${x + w},${yTop} ${x + w},${yTop + r} V${base} Z`;
};

const signed = (n) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${fmt(Math.abs(n))}`;

/**
 * ColumnChart: one value per day against a target.
 * @param {{label: string, value: number}[]} data
 */
export function ColumnChart({ data, target, unit = 'records', 'aria-label': ariaLabel }) {
  const wrapRef = useRef(null);
  const width = useWidth(wrapRef);
  const [active, setActive] = useState(null);
  const [announce, setAnnounce] = useState('');

  const margin = { top: 32, right: 16, bottom: 28, left: 52 };
  const plotW = Math.max(0, width - margin.left - margin.right);
  const plotH = HEIGHT - margin.top - margin.bottom;
  const base = margin.top + plotH;

  const maxValue = Math.max(...data.map((d) => d.value), target ?? 0);
  const ticks = useMemo(() => niceTicks(maxValue), [maxValue]);
  const top = ticks[ticks.length - 1];
  const y = (v) => margin.top + plotH * (1 - v / top);

  const band = data.length ? plotW / data.length : 0;
  const barW = Math.max(2, Math.min(BAR_MAX, band - 2));
  const cx = (i) => margin.left + i * band + band / 2;

  const labelEvery = band >= 44 ? 1 : band >= 26 ? 2 : 3;
  const peak = data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);
  const last = data.length - 1;

  const describe = (i) => {
    const { label, value } = data[i];
    const gap = target != null ? value - target : null;
    const versus = gap == null ? '' : value === 0 ? ', no shift' : gap === 0 ? ', on target' : `, ${fmt(Math.abs(gap))} ${gap > 0 ? 'above' : 'below'} target`;
    return `${label}: ${fmt(value)} ${unit}${versus}`;
  };

  const onKeyDown = (event) => {
    const move = (next) => {
      event.preventDefault();
      const i = Math.max(0, Math.min(last, next));
      setActive(i);
      setAnnounce(describe(i));
    };
    if (event.key === 'ArrowRight') move((active ?? last - 1) + 1);
    else if (event.key === 'ArrowLeft') move((active ?? last + 1) - 1);
    else if (event.key === 'Home') move(0);
    else if (event.key === 'End') move(last);
    else if (event.key === 'Escape') setActive(null);
  };

  const tip = active != null ? data[active] : null;
  const tipLeft = tip ? Math.max(76, Math.min(width - 76, cx(active))) : 0;

  return (
    <div
      ref={wrapRef}
      role="group"
      tabIndex={0}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setActive(null)}
      onPointerLeave={() => setActive(null)}
      className="relative rounded-control text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      style={{ height: HEIGHT }}
    >
      <span className="sr-only" aria-live="polite">{announce}</span>

      {width > 0 && (
        <svg width={width} height={HEIGHT} aria-hidden="true" className="block">
          {/* Gridlines and value axis: hairline, solid, recessive. */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={margin.left} x2={margin.left + plotW} y1={y(t)} y2={y(t)} stroke="currentColor" strokeWidth="1" className={t === 0 ? 'text-line-strong' : 'text-line'} />
              <text x={margin.left - 10} y={y(t)} dy="4" textAnchor="end" fontSize="12" fill="currentColor" className="text-ink-muted">
                {tickLabel(t, top)}
              </text>
            </g>
          ))}

          {/* Columns. A day with no output draws nothing; the axis label and tooltip say so. */}
          {data.map((d, i) =>
            d.value > 0 ? (
              <path
                key={d.label}
                d={columnPath(cx(i) - barW / 2, barW, y(d.value), base)}
                fill="currentColor"
                className={`${active === i ? 'text-primary-hover' : 'text-primary'} transition-colors motion-reduce:transition-none`}
              />
            ) : null,
          )}

          {/* Target reference line, labelled directly with a line key in the top margin */}
          {target != null && (
            <g>
              <line x1={margin.left} x2={margin.left + plotW} y1={y(target)} y2={y(target)} stroke="currentColor" strokeWidth="1.5" className="text-ink-muted" />
              <line x1={margin.left} x2={margin.left + 16} y1={11} y2={11} stroke="currentColor" strokeWidth="1.5" className="text-ink-muted" />
              <text x={margin.left + 22} y={11} dy="4" fontSize="12" fill="currentColor" className="text-ink-muted">
                Target {fmt(target)}
              </text>
            </g>
          )}

          {/* Direct labels: the latest value and the peak only */}
          {[...new Set([peak, last])].map((i) =>
            data[i].value > 0 ? (
              <text key={i} x={cx(i)} y={y(data[i].value) - 8} textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor" className="text-ink">
                {fmt(data[i].value)}
              </text>
            ) : null,
          )}

          {/* Category axis */}
          {data.map((d, i) =>
            (last - i) % labelEvery === 0 ? (
              <text key={d.label} x={cx(i)} y={base + 18} textAnchor="middle" fontSize="12" fill="currentColor" className="text-ink-muted">
                {d.label}
              </text>
            ) : null,
          )}

          {/* Hit areas: a full-height band per day, much larger than the mark */}
          {data.map((d, i) => (
            <rect
              key={d.label}
              x={margin.left + i * band}
              y={margin.top}
              width={band}
              height={plotH}
              fill="transparent"
              onPointerEnter={() => setActive(i)}
              onPointerMove={() => active !== i && setActive(i)}
            />
          ))}
        </svg>
      )}

      {tip && (
        <div
          role="presentation"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-control border border-line bg-surface-raised px-3 py-2 shadow-elevation-3"
          style={{ left: tipLeft, top: Math.max(8, y(tip.value) - 10) }}
        >
          <div className="text-base font-semibold leading-tight text-ink">{fmt(tip.value)} <span className="text-xs font-normal text-ink-muted">{unit}</span></div>
          <div className="text-xs text-ink-muted">{tip.label}</div>
          {target != null && (
            <div className="mt-1 text-xs text-ink-muted">
              {tip.value === 0 ? 'No shift' : tip.value === target ? 'On target' : `${fmt(Math.abs(tip.value - target))} ${tip.value > target ? 'above' : 'below'} target`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** The same data as a table: the chart's text alternative. */
export function OutputTable({ data, target, caption, unit = 'Records' }) {
  return (
    <div className="max-h-[240px] overflow-y-auto rounded-control border border-line">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 bg-surface-muted">
          <tr>
            <th scope="col" className="px-3 py-2 font-semibold text-ink">Day</th>
            <th scope="col" className="px-3 py-2 text-right font-semibold text-ink">{unit}</th>
            {target != null && <th scope="col" className="px-3 py-2 text-right font-semibold text-ink">vs target</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label} className="border-t border-line">
              <th scope="row" className="px-3 py-1.5 font-normal text-ink-muted">{d.label}</th>
              <td className="px-3 py-1.5 text-right tabular-nums text-ink">{fmt(d.value)}</td>
              {target != null && <td className="px-3 py-1.5 text-right tabular-nums text-ink-muted">{d.value === 0 ? 'No shift' : signed(d.value - target)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * StageBars: ordered categories (a pipeline) as horizontal bars, one color, the
 * count at each tip. Rendered as a list, so it reads correctly with no pointer.
 */
export function StageBars({ stages, counts, 'aria-label': ariaLabel }) {
  const max = Math.max(...stages.map((s) => counts[s]));
  return (
    <ul aria-label={ariaLabel} className="space-y-3">
      {stages.map((stage) => (
        <li key={stage} className="flex items-center gap-3 text-sm">
          <span className="w-28 shrink-0 text-ink-muted">{stage}</span>
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className="h-3 rounded-r bg-primary"
              style={{ width: `calc((100% - 1.75rem) * ${counts[stage] / max})`, minWidth: 4 }}
              aria-hidden="true"
            />
            <span className="font-medium tabular-nums text-ink">{counts[stage]}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
