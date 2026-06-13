import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from './Select';

const options = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
  { value: 'c', label: 'Cherry', disabled: true },
];

describe('Select Component', () => {
  it('shows the placeholder when nothing is selected', () => {
    render(<Select options={options} placeholder="Pick one" onChange={() => {}} />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('opens the listbox on click and lists options', async () => {
    const user = userEvent.setup();
    render(<Select options={options} onChange={() => {}} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /apple/i })).toBeInTheDocument();
  });

  it('selects an option and calls onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('option', { name: /banana/i }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('does not select a disabled option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('option', { name: /cherry/i }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders the selected label', () => {
    render(<Select options={options} value="a" onChange={() => {}} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('supports keyboard selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    const trigger = screen.getByRole('button');
    trigger.focus();
    await user.keyboard('{ArrowDown}'); // open
    await user.keyboard('{ArrowDown}'); // move to Banana (index 1)
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<Select options={options} disabled onChange={() => {}} />);
    await user.click(screen.getByRole('button'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
