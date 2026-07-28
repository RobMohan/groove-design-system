import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SegmentedControl from './SegmentedControl';

const options = ['Day', 'Week', 'Month'];

describe('SegmentedControl', () => {
  it('renders a radiogroup of radios', () => {
    render(<SegmentedControl aria-label="Range" options={options} />);
    expect(screen.getByRole('radiogroup', { name: 'Range' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('selects the first option by default', () => {
    render(<SegmentedControl aria-label="Range" options={options} />);
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
  });

  it('selects on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SegmentedControl aria-label="Range" options={options} onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: 'Week' }));
    expect(onChange).toHaveBeenCalledWith('Week');
  });

  it('moves selection with the arrow keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SegmentedControl aria-label="Range" options={options} onChange={onChange} />);
    screen.getByRole('radio', { name: 'Day' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('Week');
  });
});
