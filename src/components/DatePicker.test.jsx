import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from './DatePicker';

describe('DatePicker', () => {
  it('renders a trigger with the placeholder', () => {
    render(<DatePicker onChange={() => {}} placeholder="Pick a date" />);
    expect(screen.getByRole('button', { name: /pick a date/i })).toBeInTheDocument();
  });

  it('opens a calendar grid on click', async () => {
    const user = userEvent.setup();
    render(<DatePicker onChange={() => {}} />);
    await user.click(screen.getByRole('button', { name: /select a date/i }));
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('selects a day and calls onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /select a date/i }));
    const focusedDay = screen.getByRole('grid').querySelector('[data-focused="true"]');
    await user.click(focusedDay);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it('displays the formatted selected value', () => {
    const value = new Date(2026, 0, 15);
    render(<DatePicker value={value} onChange={() => {}} />);
    expect(screen.getByText('01/15/2026')).toBeInTheDocument();
  });
});
