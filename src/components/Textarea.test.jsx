import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Textarea from './Textarea';

describe('Textarea Component', () => {
  it('renders a label tied to the textarea', () => {
    render(<Textarea label="Notes" />);
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea label="Notes" value="" onChange={onChange} />);
    await user.type(screen.getByLabelText('Notes'), 'hi');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows an error message', () => {
    render(<Textarea label="Notes" error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('renders a character count', () => {
    render(<Textarea label="Bio" maxLength={100} showCount value="hello" onChange={() => {}} />);
    expect(screen.getByText('5/100')).toBeInTheDocument();
  });

  it('disables the field', () => {
    render(<Textarea label="Notes" disabled />);
    expect(screen.getByLabelText('Notes')).toBeDisabled();
  });
});
