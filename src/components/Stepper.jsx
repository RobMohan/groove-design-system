import React from 'react';
import { Check, X } from 'lucide-react';

/*
 * A multi-step progress indicator.
 * - steps: array of { label, description?, icon? } (icon is a lucide component)
 * - activeStep: index of the current step (used to derive status when a step
 *   does not carry an explicit `status`)
 * - orientation: 'horizontal' (default) | 'vertical'
 * - clickable + onStepClick(index): make steps interactive
 * Each step can override its derived state with status:
 *   'complete' | 'current' | 'upcoming' | 'error'.
 * Rendered as an ordered list; the current step carries aria-current="step".
 */
const Stepper = ({
  steps = [],
  activeStep = 0,
  orientation = 'horizontal',
  clickable = false,
  onStepClick,
  className = '',
  ...props
}) => {
  const isVertical = orientation === 'vertical';

  const getStatus = (step, index) => {
    if (step.status) return step.status;
    if (index < activeStep) return 'complete';
    if (index === activeStep) return 'current';
    return 'upcoming';
  };

  const indicatorClasses = {
    complete: 'bg-primary border-primary text-white',
    current: 'bg-surface-raised border-primary text-primary',
    upcoming: 'bg-surface-raised border-line-strong text-ink-subtle',
    error: 'bg-destructive border-destructive text-white',
  };

  const labelClasses = {
    complete: 'text-ink',
    current: 'text-ink font-semibold',
    upcoming: 'text-ink-subtle',
    error: 'text-destructive font-semibold',
  };

  const renderIndicator = (step, status, index) => {
    let inner;
    if (step.icon) {
      const Icon = step.icon;
      inner = <Icon size={16} aria-hidden="true" />;
    } else if (status === 'complete') {
      inner = <Check size={16} aria-hidden="true" />;
    } else if (status === 'error') {
      inner = <X size={16} aria-hidden="true" />;
    } else {
      inner = <span className="text-sm font-medium">{index + 1}</span>;
    }
    return (
      <span
        className={`flex items-center justify-center w-8 h-8 shrink-0 rounded-pill border-2 transition-colors ${indicatorClasses[status]}`}
      >
        {inner}
      </span>
    );
  };

  return (
    <ol
      className={`flex ${isVertical ? 'flex-col' : 'items-start'} ${className}`}
      {...props}
    >
      {steps.map((step, index) => {
        const status = getStatus(step, index);
        const isLast = index === steps.length - 1;
        const isInteractive = clickable && !!onStepClick;
        const lineColor = index < activeStep ? 'border-primary' : 'border-line';

        const content = (
          <>
            {renderIndicator(step, status, index)}
            <span className={`flex flex-col ${isVertical ? '' : 'text-left'}`}>
              <span className={`text-sm leading-tight ${labelClasses[status]}`}>{step.label}</span>
              {step.description && (
                <span className="text-xs text-ink-muted mt-0.5">{step.description}</span>
              )}
            </span>
          </>
        );

        const innerClasses = `flex items-center gap-3 ${
          isInteractive
            ? 'rounded-control focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 -m-1 p-1'
            : ''
        }`;

        const Interactive = isInteractive ? 'button' : 'span';
        const interactiveProps = isInteractive
          ? { type: 'button', onClick: () => onStepClick(index) }
          : {};

        if (isVertical) {
          return (
            <li
              key={index}
              aria-current={status === 'current' ? 'step' : undefined}
              className="flex gap-3"
            >
              <div className="flex flex-col items-center self-stretch">
                <Interactive {...interactiveProps} className={isInteractive ? 'rounded-pill focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2' : ''}>
                  {renderIndicator(step, status, index)}
                </Interactive>
                {!isLast && <span className={`w-px flex-1 my-1 border-l-2 ${lineColor}`} aria-hidden="true" />}
              </div>
              <div className={`flex flex-col ${isLast ? '' : 'pb-8'}`}>
                <span className={`text-sm leading-tight ${labelClasses[status]}`}>{step.label}</span>
                {step.description && (
                  <span className="text-xs text-ink-muted mt-0.5">{step.description}</span>
                )}
              </div>
            </li>
          );
        }

        return (
          <li
            key={index}
            aria-current={status === 'current' ? 'step' : undefined}
            className={`flex items-center ${isLast ? '' : 'flex-1'}`}
          >
            <Interactive {...interactiveProps} className={innerClasses}>
              {content}
            </Interactive>
            {!isLast && <span className={`flex-1 mx-3 border-t-2 ${lineColor}`} aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;
