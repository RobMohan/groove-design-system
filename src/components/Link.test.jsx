import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Link from './Link';

describe('Link', () => {
  it('renders an anchor with the href', () => {
    render(<Link href="/pricing">Pricing</Link>);
    const link = screen.getByRole('link', { name: 'Pricing' });
    expect(link).toHaveAttribute('href', '/pricing');
  });

  it('adds target and rel for external links', () => {
    render(<Link href="https://example.com" external>Docs</Link>);
    const link = screen.getByRole('link', { name: /docs/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('blocks navigation and clicks when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Link href="/x" disabled onClick={onClick}>Nope</Link>);
    const link = screen.getByText('Nope');
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders a custom component via `as`', () => {
    const Custom = ({ children, ...props }) => (
      <button type="button" {...props}>{children}</button>
    );
    render(<Link as={Custom}>Go</Link>);
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument();
  });
});
