import React from 'react';

// Visually joins a set of Buttons (or IconButtons) into a single segmented control.
// When `attached`, inner corners are squared off and adjacent borders collapse so the
// group reads as one unit. When not attached, children are simply spaced with a gap.
const ButtonGroup = ({
  children,
  orientation = 'horizontal',
  attached = true,
  size,
  className = '',
  ...props
}) => {
  const isHorizontal = orientation !== 'vertical';
  const items = React.Children.toArray(children).filter(Boolean);

  const layout = isHorizontal ? 'flex-row' : 'flex-col';
  const container = attached
    ? `inline-flex ${layout} isolate`
    : `inline-flex ${layout} gap-2`;

  return (
    <div role="group" className={`${container} ${className}`} {...props}>
      {items.map((child, index) => {
        if (!React.isValidElement(child)) return child;

        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        let joinClasses = '';
        if (attached && items.length > 1) {
          if (isHorizontal) {
            joinClasses = isFirst
              ? 'rounded-r-none'
              : isLast
              ? 'rounded-l-none -ml-px'
              : 'rounded-none -ml-px';
          } else {
            joinClasses = isFirst
              ? 'rounded-b-none'
              : isLast
              ? 'rounded-t-none -mt-px'
              : 'rounded-none -mt-px';
          }
          // Keep the focused/hovered segment's ring and borders above its neighbors.
          joinClasses += ' focus-within:z-10 hover:z-10 focus:z-10';
        }

        const nextProps = {
          className: `${child.props.className || ''} ${joinClasses}`.trim(),
        };
        // Let the group set a shared size unless the child already specifies one.
        if (size !== undefined && child.props.size === undefined) {
          nextProps.size = size;
        }

        return React.cloneElement(child, nextProps);
      })}
    </div>
  );
};

export default ButtonGroup;
