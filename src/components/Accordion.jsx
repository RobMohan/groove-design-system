import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Accordion = ({
  items = [],
  allowMultiple = false,
  defaultOpen = [],
  className = '',
}) => {
  const [openItems, setOpenItems] = useState(() => new Set(defaultOpen));

  const toggle = (index) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) next.clear();
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className={`divide-y divide-line border border-line rounded-card overflow-hidden ${className}`}>
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        const panelId = `accordion-panel-${index}`;
        const buttonId = `accordion-button-${index}`;
        return (
          <div key={index} className="bg-surface-raised">
            <h3>
              <button
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => !item.disabled && toggle(index)}
                className={`flex items-center justify-between w-full gap-4 px-4 py-4 text-left transition-colors ${
                  item.disabled
                    ? 'text-ink-subtle cursor-not-allowed'
                    : 'text-ink hover:bg-surface-muted'
                }`}
              >
                <span className="font-medium">{item.title}</span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-ink-muted transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </h3>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="px-4 pb-4 text-ink-muted"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
