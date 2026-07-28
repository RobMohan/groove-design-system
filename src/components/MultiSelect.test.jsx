import { describe, it, expect, vi } from 'vitest';
import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultiSelect from './MultiSelect';

const options = ['Red', 'Green', 'Blue'];

describe('MultiSelect', () => {
  it('renders a combobox with the placeholder', () => {
    render(<MultiSelect options={options} placeholder="Pick colors" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Pick colors')).toBeInTheDocument();
  });

  it('adds a value on selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MultiSelect options={options} onChange={onChange} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Green' }));
    expect(onChange).toHaveBeenCalledWith(['Green']);
  });

  it('removes a value via its pill', async () => {
    const user = userEvent.setup();
    function Wrapper() {
      const [v, setV] = useState(['Green', 'Blue']);
      return <MultiSelect options={options} value={v} onChange={setV} />;
    }
    render(<Wrapper />);
    expect(screen.getByRole('button', { name: 'Remove Green' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove Green' }));
    expect(screen.queryByRole('button', { name: 'Remove Green' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Blue' })).toBeInTheDocument();
  });

  it('clears all selections', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MultiSelect options={options} defaultValue={['Red', 'Blue']} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
