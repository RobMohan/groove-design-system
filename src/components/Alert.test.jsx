import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alert from './Alert';

describe('Alert Component', () => {
  it('renders with an alert role', () => {
    render(<Alert title="Note">Body</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders title and body', () => {
    render(<Alert title="Saved">All good</Alert>);
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('does not render a dismiss button without onClose', () => {
    render(<Alert title="Note" />);
    expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument();
  });

  it('renders and fires the dismiss button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Alert title="Note" onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('applies variant container styling', () => {
    render(<Alert variant="error" title="Oops" />);
    expect(screen.getByRole('alert').className).toMatch(/bg-destructive/);
  });
});
