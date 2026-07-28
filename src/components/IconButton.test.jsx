import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Trash2 } from 'lucide-react';
import IconButton from './IconButton';

describe('IconButton', () => {
  it('renders a button with the accessible name', () => {
    render(<IconButton icon={Trash2} aria-label="Delete" />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('calls onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton icon={Trash2} aria-label="Delete" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows a busy, disabled state when loading', () => {
    render(<IconButton icon={Trash2} aria-label="Saving" loading />);
    const btn = screen.getByRole('button', { name: 'Saving' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('warns when no accessible name is provided', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<IconButton icon={Trash2} />);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
