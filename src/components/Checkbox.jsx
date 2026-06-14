import React from 'react';
import { Check } from 'lucide-react';

const Checkbox = ({
  checked = false,
  disabled = false,
  label = '',
  onChange,
  className = '',
  id,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        <label
          htmlFor={checkboxId}
          className={`
            flex items-center justify-center w-7 h-7 rounded border cursor-pointer
            transition-all duration-200
            ${
              disabled
                ? 'bg-surface-muted border-line cursor-not-allowed'
                : checked
                ? 'bg-primary border-primary'
                : 'bg-surface-raised border-line-strong hover:border-primary'
            }
          `}
        >
          {checked && (
            <Check
              size={14}
              className={disabled ? 'text-ink-subtle' : 'text-white'}
              strokeWidth={3}
            />
          )}
        </label>
      </div>
      {label && (
        <label
          htmlFor={checkboxId}
          className={`
            text-base leading-6
            ${disabled ? 'text-ink-subtle cursor-not-allowed' : 'text-ink cursor-pointer'}
          `}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
