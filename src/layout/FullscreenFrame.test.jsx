import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FullscreenFrame from './FullscreenFrame';

let root;
beforeEach(() => {
  // The real app mounts into #root; the frame makes it inert while expanded.
  root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
});
afterEach(() => {
  root.remove();
  document.body.style.overflow = '';
});

const setup = () =>
  render(
    <FullscreenFrame label="Demo app" toolbar={<span>Toolbar</span>}>
      <input aria-label="note" />
      <button type="button">Inside</button>
    </FullscreenFrame>,
    { container: root },
  );

const expand = async (user) => user.click(screen.getByRole('button', { name: 'Expand' }));

describe('FullscreenFrame', () => {
  it('shows the app inline with a toolbar and an Expand button', () => {
    setup();
    expect(screen.getByText('Toolbar')).toBeInTheDocument();
    expect(screen.getByLabelText('note')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Demo app' })).toBeNull();
  });

  it('expands to a full-window layer, blocks the page behind it and takes focus', async () => {
    const user = userEvent.setup();
    setup();
    await expand(user);

    const region = screen.getByRole('region', { name: 'Demo app' });
    expect(region).toHaveClass('fixed', 'inset-0');
    expect(within(region).getByLabelText('note')).toBeInTheDocument();
    expect(root).toHaveAttribute('inert');
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByRole('button', { name: 'Exit full screen' })).toHaveFocus();
    expect(screen.getByText(/Showing full screen/)).toBeInTheDocument();
  });

  it('moves the same app instead of re-creating it, so state survives both ways', async () => {
    const user = userEvent.setup();
    setup();
    const before = screen.getByLabelText('note');
    await user.type(before, 'half-typed order');

    await expand(user);
    const expanded = screen.getByLabelText('note');
    expect(expanded).toBe(before);
    expect(expanded).toHaveValue('half-typed order');

    await user.click(screen.getByRole('button', { name: 'Exit full screen' }));
    expect(screen.getByLabelText('note')).toBe(before);
    expect(before).toHaveValue('half-typed order');
  });

  it('exits with the button, restoring the page and returning focus to Expand', async () => {
    const user = userEvent.setup();
    setup();
    await expand(user);
    await user.click(screen.getByRole('button', { name: 'Exit full screen' }));

    expect(screen.queryByRole('region')).toBeNull();
    expect(root).not.toHaveAttribute('inert');
    expect(document.body.style.overflow).toBe('');
    expect(screen.getByRole('button', { name: 'Expand' })).toHaveFocus();
  });

  it('exits with Escape', async () => {
    const user = userEvent.setup();
    setup();
    await expand(user);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('region')).toBeNull();
    expect(screen.getByRole('button', { name: 'Expand' })).toHaveFocus();
  });

  it('lets an open dialog or menu inside the app take the Escape first', async () => {
    const user = userEvent.setup();
    setup();
    await expand(user);

    const dialog = document.createElement('div');
    dialog.setAttribute('role', 'dialog');
    document.body.appendChild(dialog);
    await user.keyboard('{Escape}');
    expect(screen.getByRole('region', { name: 'Demo app' })).toBeInTheDocument();

    dialog.remove();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('asks the site to switch theme from the full-screen bar', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    window.addEventListener('groove:toggle-theme', onToggle);
    setup();
    await expand(user);
    await user.click(screen.getByRole('button', { name: /Switch to (dark|light) mode/ }));
    expect(onToggle).toHaveBeenCalledTimes(1);
    window.removeEventListener('groove:toggle-theme', onToggle);
  });

  it('releases the page if it unmounts while expanded', async () => {
    const user = userEvent.setup();
    const { unmount } = setup();
    await expand(user);
    unmount();
    expect(root).not.toHaveAttribute('inert');
    expect(document.body.style.overflow).toBe('');
    expect(document.querySelector('[role="region"]')).toBeNull();
  });
});
