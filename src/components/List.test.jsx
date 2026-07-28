import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import List, { ListItem } from './List';

describe('List', () => {
  it('renders a list of items with primary and secondary text', () => {
    render(
      <List>
        <ListItem primary="Documents" secondary="Shared with you" />
        <ListItem primary="Photos" secondary="Private" />
      </List>
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Shared with you')).toBeInTheDocument();
  });

  it('makes a row interactive when onClick is set', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <List>
        <ListItem primary="Row" onClick={onClick} />
      </List>
    );
    await user.click(screen.getByRole('button', { name: /row/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('marks a selected row with aria-current', () => {
    render(
      <List>
        <ListItem primary="Active" selected onClick={() => {}} />
      </List>
    );
    expect(screen.getByRole('button', { name: /active/i })).toHaveAttribute('aria-current', 'true');
  });
});
