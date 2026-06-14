import React from 'react';

const Radio = ({
  checked = false,
  disabled = false,
  label = '',
  onChange,
  className = '',
  id,
  name,
  value,
  ...props
}) => {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative inline-flex items-center">
        <input
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        <label
          htmlFor={radioId}
          className={`
            flex items-center justify-center w-7 h-7 rounded-full border
            transition-all duration-200 cursor-pointer relative
            ${
              disabled
                ? 'bg-surface-muted border-line cursor-not-allowed'
                : checked
                ? 'bg-surface-raised border-2 border-primary'
                : 'bg-surface-raised border border-line-strong hover:border-primary'
            }
          `}
        >
          {checked && !disabled && (
            <div className="absolute w-[18px] h-[18px] rounded-full bg-primary" />
          )}
        </label>
      </div>
      {label && (
        <label
          htmlFor={radioId}
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

export default Radio;
