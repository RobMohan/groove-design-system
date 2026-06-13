import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal Component', () => {
  it('renders nothing when closed', () => {
    render(<Modal isOpen={false} onClose={() => {}} title="Hi">Body</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a dialog with title and content when open', () => {
    render(<Modal isOpen onClose={() => {}} title="Share">Body content</Modal>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('closes via the close button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal isOpen onClose={onClose} title="Share">Body</Modal>);
    await user.click(screen.getByRole('button', { name: /close dialog/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal isOpen onClose={onClose} title="Share">Body</Modal>);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders footer content', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Share" footer={<button>Confirm</button>}>
        Body
      </Modal>
    );
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });
});
