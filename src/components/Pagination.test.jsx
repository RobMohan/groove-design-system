import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a button per page when under the max', () => {
    render(<Pagination currentPage={1} totalPages={4} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
  });

  it('marks the current page with aria-current', () => {
    render(<Pagination currentPage={2} totalPages={4} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
  });

  it('calls onPageChange with the clicked page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={4} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables the previous button on the first page', () => {
    render(<Pagination currentPage={1} totalPages={4} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
  });

  it('disables the next button on the last page', () => {
    render(<Pagination currentPage={4} totalPages={4} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
  });

  it('navigates with the next button', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={4} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: /next page/i }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('shows ellipsis when there are more pages than slots', () => {
    render(<Pagination currentPage={5} totalPages={20} onPageChange={() => {}} />);
    // First and last page always present
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument();
    // Distant pages collapsed
    expect(screen.queryByRole('button', { name: '10' })).not.toBeInTheDocument();
  });
});
