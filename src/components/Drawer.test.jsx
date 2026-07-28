import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Drawer from './Drawer';

afterEach(() => {
  document.body.style.overflow = '';
});

describe('Drawer', () => {
  it('renders nothing when closed', () => {
    render(
      <Drawer open={false} onClose={() => {}} title="Filters">
        Body
      </Drawer>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a labelled modal dialog when open', () => {
    render(
      <Drawer open onClose={() => {}} title="Filters">
        Body content
      </Drawer>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Filters');
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('closes via the close button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Filters">
        Body
      </Drawer>
    );
    await user.click(screen.getByRole('button', { name: /close drawer/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Filters">
        Body
      </Drawer>
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when the overlay is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Filters">
        Body
      </Drawer>
    );
    // The scrim is the dialog's parent element.
    const scrim = screen.getByRole('dialog').parentElement;
    await user.click(scrim);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll while open', () => {
    const { rerender } = render(
      <Drawer open onClose={() => {}} title="Filters">
        Body
      </Drawer>
    );
    expect(document.body.style.overflow).toBe('hidden');
    rerender(
      <Drawer open={false} onClose={() => {}} title="Filters">
        Body
      </Drawer>
    );
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('applies the side-specific slide animation', () => {
    render(
      <Drawer open onClose={() => {}} side="left" title="Nav">
        Body
      </Drawer>
    );
    expect(screen.getByRole('dialog').className).toContain('animate-slide-in-from-left');
  });

  it('moves focus into the drawer on open', () => {
    render(
      <Drawer open onClose={() => {}} title="Filters">
        <button>Inside</button>
      </Drawer>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });
});
