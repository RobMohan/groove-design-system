import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';

const TextInput = ({
  label,
  placeholder = 'Placeholder',
  value = '',
  onChange,
  disabled = false,
  error = '',
  showIcon = true,
  id,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `text-input-${Math.random().toString(36).substr(2, 9)}`;

  const getBorderClasses = () => {
    if (disabled) return 'border border-[#c4c3c3]';
    if (error) return 'border-2 border-[#b72518]';
    if (isFocused) return 'border-2 border-[#588ae0]';
    return 'border border-[#5f5b5b]';
  };

  const getLabelColor = () => {
    if (disabled) return 'text-[#c4c3c3]';
    return 'text-[#3f3d3d]';
  };

  const getInputColor = () => {
    if (disabled) return 'text-[#c4c3c3] placeholder-[#c4c3c3] cursor-not-allowed';
    return 'text-black placeholder-[#3f3d3d]';
  };

  const getIconColor = () => {
    if (disabled) return 'text-[#c4c3c3]';
    return 'text-[#3f3d3d]';
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`text-base leading-6 font-normal ${getLabelColor()}`}
        >
          {label}
        </label>
      )}
      <div
        className={`flex items-center h-10 px-2 bg-white rounded gap-2 ${getBorderClasses()} ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`flex-1 min-w-0 text-base leading-6 bg-transparent outline-none ${getInputColor()}`}
          {...props}
        />
        {showIcon && !error && (
          <Search size={20} className={`shrink-0 ${getIconColor()}`} />
        )}
        {error && (
          <AlertCircle size={20} className="shrink-0 text-[#b72518]" />
        )}
      </div>
      {error && typeof error === 'string' && (
        <p className="text-sm text-[#b72518]">{error}</p>
      )}
    </div>
  );
};

export default TextInput;
