import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Menu from './Menu';

const makeItems = (overrides = {}) => [
  { label: 'Edit', onClick: overrides.onEdit || (() => {}) },
  { label: 'Duplicate', onClick: overrides.onDuplicate || (() => {}) },
  { divider: true },
  {
    label: 'Delete',
    danger: true,
    disabled: overrides.deleteDisabled || false,
    onClick: overrides.onDelete || (() => {}),
  },
];

describe('Menu Component', () => {
  it('is closed initially', () => {
    render(<Menu trigger={<button>Open</button>} items={makeItems()} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens on trigger click and renders menuitems', async () => {
    const user = userEvent.setup();
    render(<Menu trigger={<button>Open</button>} items={makeItems()} />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
  });

  it('fires an item onClick and closes the menu', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<Menu trigger={<button>Open</button>} items={makeItems({ onEdit })} />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('does not fire onClick for a disabled item', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <Menu
        trigger={<button>Open</button>}
        items={makeItems({ onDelete, deleteDisabled: true })}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Menu trigger={<button>Open</button>} items={makeItems()} />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('reflects open state via aria-expanded on the trigger', async () => {
    const user = userEvent.setup();
    render(<Menu trigger={<button>Open</button>} items={makeItems()} />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});
