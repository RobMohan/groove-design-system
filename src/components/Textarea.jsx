import React, { useState } from 'react';

const Textarea = ({
  label,
  placeholder = 'Placeholder',
  value = '',
  onChange,
  disabled = false,
  error = '',
  rows = 4,
  maxLength,
  showCount = false,
  id,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const getBorderClasses = () => {
    if (disabled) return 'border border-line';
    if (error) return 'border-2 border-destructive';
    if (isFocused) return 'border-2 border-primary';
    return 'border border-line-strong';
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className={`text-base leading-6 font-normal ${disabled ? 'text-ink-subtle' : 'text-ink'}`}
        >
          {label}
        </label>
      )}
      <div className={`bg-surface-raised rounded-control ${getBorderClasses()}`}>
        <textarea
          id={textareaId}
          rows={rows}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-3 py-2 text-base leading-6 bg-transparent outline-none resize-y rounded-control ${
            disabled
              ? 'text-ink-subtle placeholder-ink-subtle cursor-not-allowed resize-none'
              : 'text-ink placeholder-ink-muted'
          }`}
          {...props}
        />
      </div>
      <div className="flex items-center justify-between gap-2 min-h-[1.25rem]">
        {error && typeof error === 'string' ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <span />
        )}
        {showCount && maxLength && (
          <span className="text-sm text-ink-subtle shrink-0">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default Textarea;
