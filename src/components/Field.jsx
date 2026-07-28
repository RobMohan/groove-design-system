import React, { createContext, useContext, useId } from 'react';

/**
 * FieldContext exposes the generated id + aria wiring so a nested input can
 * consume it with the useField() hook instead of the render-prop form.
 */
const FieldContext = createContext(null);

export const useField = () => useContext(FieldContext);

/**
 * Field — a form-control wrapper that standardizes the label, required marker,
 * description/help text, error message and (crucially) the accessibility wiring
 * that ties them all to a single input.
 *
 * It auto-generates a stable id and derives `aria-describedby` (pointing at the
 * description and/or error) and `aria-invalid`. Those are handed to the child
 * input two ways:
 *   1. Render prop:  <Field ...>{(field) => <input {...field} />}</Field>
 *   2. Context:      const field = useField();  inside a child component
 *
 * Groove inputs (TextInput / Textarea / Select / NumberInput) all accept `id`,
 * `aria-describedby`, `aria-invalid` and `required` via prop-spread, so the
 * `field` object plugs straight in.
 */
const Field = ({
  label,
  required = false,
  optional = false,
  description,
  error,
  size = 'md',
  id: idProp,
  className = '',
  children,
  ...props
}) => {
  const reactId = useId();
  const id = idProp || `field-${reactId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = typeof error === 'string' && error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const invalid = Boolean(error);

  // The bundle handed to the child input (render prop, context, or manual spread).
  const field = {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': invalid || undefined,
    required: required || undefined,
    size,
  };

  const labelSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';

  return (
    <FieldContext.Provider value={field}>
      <div className={`flex flex-col gap-1.5 ${className}`} {...props}>
        {label && (
          <label
            htmlFor={id}
            className={`font-medium leading-6 ${labelSize} text-ink`}
          >
            {label}
            {required && (
              <span className="text-destructive" aria-hidden="true">
                {' '}*
              </span>
            )}
            {optional && !required && (
              <span className="text-ink-subtle font-normal"> (optional)</span>
            )}
          </label>
        )}

        {description && (
          <p id={descriptionId} className="text-sm text-ink-muted">
            {description}
          </p>
        )}

        {typeof children === 'function' ? children(field) : children}

        {typeof error === 'string' && error && (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
};

export default Field;
