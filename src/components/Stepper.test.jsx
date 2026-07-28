import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Stepper from './Stepper';

const steps = [
  { label: 'Account' },
  { label: 'Payment' },
  { label: 'Confirm' },
];

describe('Stepper', () => {
  it('renders every step label', () => {
    render(<Stepper steps={steps} activeStep={1} />);
    steps.forEach((s) => expect(screen.getByText(s.label)).toBeInTheDocument());
  });

  it('marks the active step with aria-current', () => {
    render(<Stepper steps={steps} activeStep={1} />);
    const current = screen.getByText('Payment').closest('li');
    expect(current).toHaveAttribute('aria-current', 'step');
  });

  it('calls onStepClick when clickable', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<Stepper steps={steps} activeStep={1} clickable onStepClick={onStepClick} />);
    await user.click(screen.getByText('Account'));
    expect(onStepClick).toHaveBeenCalledWith(0);
  });
});
