import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Slider from './Slider';

describe('Slider', () => {
  it('renders a slider exposing its value range', () => {
    render(<Slider value={20} onChange={() => {}} min={0} max={100} aria-label="Volume" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '20');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
  });

  it('increments with ArrowRight by the step', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider value={20} onChange={onChange} step={10} aria-label="Volume" />);
    screen.getByRole('slider').focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(30);
  });

  it('jumps to min/max with Home/End', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider value={50} onChange={onChange} min={0} max={100} aria-label="Volume" />);
    const slider = screen.getByRole('slider');
    slider.focus();
    await user.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith(0);
    await user.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith(100);
  });

  it('renders two thumbs for a range', () => {
    render(<Slider value={[20, 80]} onChange={() => {}} aria-label="Price" />);
    expect(screen.getAllByRole('slider')).toHaveLength(2);
  });

  it('does not respond to keys when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider value={20} onChange={onChange} disabled aria-label="Volume" />);
    const slider = screen.getByRole('slider');
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
  });
});
