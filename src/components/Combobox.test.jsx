import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Combobox from './Combobox';

const options = ['Apple', 'Banana', 'Cherry'];

describe('Combobox', () => {
  it('renders a combobox input', () => {
    render(<Combobox options={options} placeholder="Fruit" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('opens and lists options on click', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
  });

  it('filters options as the user types', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('Ban');
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument();
  });

  it('selects an option on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox options={options} onChange={onChange} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Cherry' }));
    expect(onChange).toHaveBeenCalledWith('Cherry');
  });

  it('shows the empty message when nothing matches', async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} emptyMessage="No fruit" />);
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('zzz');
    expect(screen.getByText('No fruit')).toBeInTheDocument();
  });
});
