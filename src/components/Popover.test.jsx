import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Popover from './Popover';

describe('Popover', () => {
  it('is closed by default and opens on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<button>Open</button>} content={<div>Panel body</div>} />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Panel body')).toBeInTheDocument();
  });

  it('reflects open state via aria-expanded on the trigger', async () => {
    const user = userEvent.setup();
    render(<Popover trigger={<button>Open</button>} content="Hi" />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('moves focus into the panel on open', async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<button>Open</button>}
        content={<button>Inside</button>}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<button>Open</button>}
        content={<button>Inside</button>}
      />
    );
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
    expect(trigger).toHaveFocus();
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Popover trigger={<button>Open</button>} content="Panel" />
        <button>Outside</button>
      </div>
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports controlled mode via open + onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Popover
        open={false}
        onOpenChange={onOpenChange}
        trigger={<button>Open</button>}
        content="Panel"
      />
    );
    // Controlled + open=false: no panel yet.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
