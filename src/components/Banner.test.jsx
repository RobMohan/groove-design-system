import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Banner from './Banner';

describe('Banner', () => {
  it('renders the title and body as a status', () => {
    render(<Banner tone="info" title="Heads up">Body text</Banner>);
    const region = screen.getByRole('status');
    expect(region).toHaveTextContent('Heads up');
    expect(region).toHaveTextContent('Body text');
  });

  it('uses an assertive alert role for the destructive tone', () => {
    render(<Banner tone="destructive" title="Payment failed">Fix it</Banner>);
    const region = screen.getByRole('alert');
    expect(region).toHaveAttribute('aria-live', 'assertive');
  });

  it('dismisses when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Banner tone="info" title="Bye" dismissible onDismiss={onDismiss}>x</Banner>);
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Bye')).not.toBeInTheDocument();
  });

  it('renders action content', () => {
    render(
      <Banner tone="info" title="News" actions={<button>Act</button>}>
        body
      </Banner>
    );
    expect(screen.getByRole('button', { name: 'Act' })).toBeInTheDocument();
  });
});
