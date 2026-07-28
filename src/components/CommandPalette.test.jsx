import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommandPalette from './CommandPalette';

afterEach(() => {
  document.body.style.overflow = '';
});

const items = [
  { id: 'home', label: 'Go to Home', group: 'Navigation', onSelect: vi.fn() },
  { id: 'settings', label: 'Open Settings', group: 'Actions', onSelect: vi.fn() },
  { id: 'profile', label: 'Open Profile', group: 'Navigation', onSelect: vi.fn() },
];

describe('CommandPalette', () => {
  it('renders nothing when closed', () => {
    render(<CommandPalette open={false} onClose={() => {}} items={items} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders items grouped when open', () => {
    render(<CommandPalette open onClose={() => {}} items={items} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Go to Home')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('filters items as the user types', async () => {
    const user = userEvent.setup();
    render(<CommandPalette open onClose={() => {}} items={items} />);
    await user.keyboard('profile');
    expect(screen.getByText('Open Profile')).toBeInTheDocument();
    expect(screen.queryByText('Go to Home')).not.toBeInTheDocument();
  });

  it('shows the empty message when nothing matches', async () => {
    const user = userEvent.setup();
    render(<CommandPalette open onClose={() => {}} items={items} emptyMessage="Nothing here" />);
    await user.keyboard('zzzz');
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('runs an item on click and closes', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSelect = vi.fn();
    render(
      <CommandPalette open onClose={onClose} items={[{ id: 'a', label: 'Run action', onSelect }]} />
    );
    await user.click(screen.getByRole('option', { name: /run action/i }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('selects the active item with the keyboard', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CommandPalette open onClose={() => {}} items={[{ id: 'a', label: 'First', onSelect }]} />
    );
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} items={items} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
