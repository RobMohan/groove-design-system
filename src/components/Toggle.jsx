import React from 'react';

const Toggle = ({
  checked = false,
  disabled = false,
  label = '',
  onChange,
  className = '',
  id,
  ...props
}) => {
  const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

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
          id={toggleId}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        <label
          htmlFor={toggleId}
          className={`
            relative flex items-center w-[52px] h-[28px] rounded-[16px] border
            transition-all duration-200 cursor-pointer
            ${
              disabled
                ? 'bg-surface-muted border-line cursor-not-allowed'
                : checked
                ? 'bg-primary border-primary'
                : 'bg-surface-raised border-line-strong'
            }
          `}
        >
          <div
            className={`
              absolute w-[24px] h-[24px] rounded-full transition-all duration-200
              ${
                disabled
                  ? 'bg-ink opacity-20'
                  : checked
                  ? 'bg-white left-[26px]'
                  : 'bg-ink-subtle left-[2px]'
              }
            `}
          />
        </label>
      </div>
      {label && (
        <label
          htmlFor={toggleId}
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

export default Toggle;
