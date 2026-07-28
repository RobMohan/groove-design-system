import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload, { formatBytes } from './FileUpload';

const makeFile = (name, size, type = 'text/plain') => {
  const file = new File(['a'.repeat(size)], name, { type });
  return file;
};

describe('FileUpload', () => {
  it('renders a click-to-upload dropzone', () => {
    render(<FileUpload onFiles={() => {}} />);
    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
  });

  it('accepts a selected file and lists it', async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    const { container } = render(<FileUpload onFiles={onFiles} />);
    const input = container.querySelector('input[type="file"]');
    await user.upload(input, makeFile('report.txt', 20));
    expect(onFiles).toHaveBeenCalled();
    expect(screen.getByText('report.txt')).toBeInTheDocument();
  });

  it('rejects a file over maxSize', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload maxSize={10} onFiles={() => {}} />);
    const input = container.querySelector('input[type="file"]');
    await user.upload(input, makeFile('big.txt', 50));
    expect(screen.getByRole('alert')).toHaveTextContent(/exceeds/i);
  });

  it('removes a listed file', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload onFiles={() => {}} />);
    const input = container.querySelector('input[type="file"]');
    await user.upload(input, makeFile('doc.txt', 20));
    await user.click(screen.getByRole('button', { name: /remove doc.txt/i }));
    expect(screen.queryByText('doc.txt')).not.toBeInTheDocument();
  });

  it('formats bytes for display', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(20 * 1024)).toBe('20 KB');
  });
});
