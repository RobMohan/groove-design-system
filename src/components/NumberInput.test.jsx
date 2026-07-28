import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberInput from './NumberInput';

describe('NumberInput', () => {
  it('renders a spinbutton exposing the current value', () => {
    render(<NumberInput label="Qty" value={5} onChange={() => {}} min={0} max={10} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('aria-valuenow', '5');
    expect(input).toHaveAttribute('aria-valuemin', '0');
    expect(input).toHaveAttribute('aria-valuemax', '10');
  });

  it('increments when the stepper is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput value={5} onChange={onChange} step={1} />);
    await user.click(screen.getByLabelText('Increase value'));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('increments with the ArrowUp key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput value={5} onChange={onChange} />);
    await user.click(screen.getByRole('spinbutton'));
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('disables the increment control at max', () => {
    render(<NumberInput value={10} max={10} onChange={() => {}} />);
    expect(screen.getByLabelText('Increase value')).toBeDisabled();
  });

  it('shows an error message', () => {
    render(<NumberInput value={-1} onChange={() => {}} error="Must be positive." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Must be positive.');
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true');
  });
});
