import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './Toast';

const Trigger = ({ options }) => {
  const { toast } = useToast();
  return <button onClick={() => toast(options)}>Notify</button>;
};

const renderWithProvider = (ui) => render(<ToastProvider>{ui}</ToastProvider>);

describe('Toast system', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws when useToast is used outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger options="hi" />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });

  it('shows a toast when triggered', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Trigger options={{ title: 'Saved', description: 'Done' }} />);
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('supports the string shorthand', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Trigger options="Quick note" />);
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByText('Quick note')).toBeInTheDocument();
  });

  it('dismisses a toast via its close button', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Trigger options={{ title: 'Closable', duration: Infinity }} />);
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByText('Closable')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /dismiss notification/i }));
    expect(screen.queryByText('Closable')).not.toBeInTheDocument();
  });

  it('auto-dismisses after the duration', () => {
    vi.useFakeTimers();
    const { container } = render(
      <ToastProvider>
        <Trigger options={{ title: 'Temp', duration: 1000 }} />
      </ToastProvider>
    );
    act(() => {
      container.querySelector('button').click();
    });
    expect(screen.getByText('Temp')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.queryByText('Temp')).not.toBeInTheDocument();
  });
});
