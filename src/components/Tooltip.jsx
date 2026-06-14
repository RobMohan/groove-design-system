import React, { useState } from 'react';

const Tooltip = ({
  children,
  content,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-[7.5px] border-r-[7.5px] border-t-[9px] border-l-transparent border-r-transparent border-t-surface-inverse',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-[7.5px] border-r-[7.5px] border-b-[9px] border-l-transparent border-r-transparent border-b-surface-inverse',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-[7.5px] border-b-[7.5px] border-l-[9px] border-t-transparent border-b-transparent border-l-surface-inverse',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-[7.5px] border-b-[7.5px] border-r-[9px] border-t-transparent border-b-transparent border-r-surface-inverse',
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div
          className={`absolute z-50 ${positionClasses[position]}`}
          role="tooltip"
        >
          <div className="bg-surface-inverse text-ink-inverse text-base px-3 py-2 rounded whitespace-nowrap relative">
            {content}
            <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
