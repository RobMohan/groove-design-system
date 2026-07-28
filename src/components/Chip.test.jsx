import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chip from './Chip';

describe('Chip', () => {
  it('renders its label', () => {
    render(<Chip>Design</Chip>);
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('removes via the dismiss button', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>Tag</Chip>);
    await user.click(screen.getByRole('button', { name: 'Remove Tag' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('acts as a button when clickable', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Chip clickable onClick={onClick}>Filter</Chip>);
    const chip = screen.getByRole('button', { name: 'Filter' });
    await user.click(chip);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('activates a clickable chip with the keyboard', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Chip clickable onClick={onClick}>Filter</Chip>);
    screen.getByRole('button', { name: 'Filter' }).focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('reflects the selected state via aria-pressed', () => {
    render(<Chip clickable selected onClick={() => {}}>Open</Chip>);
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-pressed', 'true');
  });
});
