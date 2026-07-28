import React from 'react';

/*
 * A structured list of rows.
 * <List> renders a semantic <ul>; pass `dividers` to draw a rule between rows.
 * <ListItem> renders a row with optional leading/trailing slots and two lines
 * of text. Rows become interactive when `onClick` (or `interactive`) is set.
 */
const List = ({ dividers = false, className = '', children, ...props }) => (
  <ul
    className={`bg-surface-raised ${dividers ? 'divide-y divide-line' : ''} ${className}`}
    {...props}
  >
    {children}
  </ul>
);

export const ListItem = ({
  leading,
  primary,
  secondary,
  trailing,
  interactive = false,
  selected = false,
  disabled = false,
  onClick,
  className = '',
  children,
  ...props
}) => {
  const isInteractive = interactive || typeof onClick === 'function';

  const body = (
    <>
      {leading != null && <span className="shrink-0 flex items-center">{leading}</span>}
      <span className="min-w-0 flex-1 flex flex-col">
        {primary != null && (
          <span className={`truncate ${selected ? 'text-primary font-medium' : 'text-ink'}`}>
            {primary}
          </span>
        )}
        {secondary != null && (
          <span className="truncate text-sm text-ink-muted">{secondary}</span>
        )}
        {children}
      </span>
      {trailing != null && (
        <span className="shrink-0 flex items-center text-ink-muted">{trailing}</span>
      )}
    </>
  );

  if (isInteractive) {
    return (
      <li className={className} {...props}>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-current={selected ? 'true' : undefined}
          className={`flex items-center gap-3 w-full text-left px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-inset ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : selected
              ? 'bg-primary/10 hover:bg-primary/15'
              : 'hover:bg-surface-muted'
          }`}
        >
          {body}
        </button>
      </li>
    );
  }

  return (
    <li
      aria-current={selected ? 'true' : undefined}
      className={`flex items-center gap-3 px-4 py-3 ${selected ? 'bg-primary/10' : ''} ${className}`}
      {...props}
    >
      {body}
    </li>
  );
};

export default List;
