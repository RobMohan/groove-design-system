import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataTable from './DataTable';

const columns = [
  { key: 'id', header: 'ID', sortable: true, filterable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
];

const data = [
  { id: 3, name: 'Charlie', role: 'Admin' },
  { id: 1, name: 'Alice', role: 'Editor' },
  { id: 2, name: 'Bob', role: 'Viewer' },
];

describe('DataTable Component', () => {
  describe('Rendering', () => {
    it('renders headers and rows', () => {
      render(<DataTable columns={columns} data={data} />);
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('uses a custom cell renderer', () => {
      const cols = [
        { key: 'name', header: 'Name', render: (v) => <strong>{v.toUpperCase()}</strong> },
      ];
      render(<DataTable columns={cols} data={[{ name: 'alice' }]} />);
      expect(screen.getByText('ALICE')).toBeInTheDocument();
    });

    it('shows the empty message when there is no data', () => {
      render(<DataTable columns={columns} data={[]} emptyMessage="Nothing here" />);
      expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('sorts ascending then descending when the sort control is clicked', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} />);

      const getFirstBodyRowName = () => {
        const rows = screen.getAllByRole('row');
        // rows[0] is the header row
        return within(rows[1]).getByText(/Alice|Bob|Charlie/).textContent;
      };

      await user.click(screen.getByRole('button', { name: /sort by name/i }));
      expect(getFirstBodyRowName()).toBe('Alice');

      await user.click(screen.getByRole('button', { name: /sort by name/i }));
      expect(getFirstBodyRowName()).toBe('Charlie');
    });
  });

  describe('Filtering', () => {
    it('filters rows via a per-column filter input', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} />);

      await user.click(screen.getByRole('button', { name: /filter id/i }));
      const input = screen.getByPlaceholderText('Filter...');
      await user.type(input, '2');

      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
      expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
    });
  });

  describe('Global search', () => {
    it('narrows rows across all columns', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} searchable />);

      await user.type(screen.getByLabelText(/search table/i), 'Admin');
      expect(screen.getByText('Charlie')).toBeInTheDocument();
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });
  });

  describe('Row selection', () => {
    it('selects a row and reports it through onRowSelectionChange', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <DataTable columns={columns} data={data} selectable onRowSelectionChange={onChange} />
      );

      const rowCheckboxes = screen.getAllByRole('checkbox', { name: /select row/i });
      await user.click(rowCheckboxes[0]);

      expect(onChange).toHaveBeenLastCalledWith([data[0]]);
      expect(screen.getByText(/1 of 3 row\(s\) selected/i)).toBeInTheDocument();
    });

    it('selects all rows with the header checkbox', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} selectable />);

      await user.click(screen.getByRole('checkbox', { name: /select all rows/i }));
      expect(screen.getByText(/3 of 3 row\(s\) selected/i)).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('paginates and navigates between pages', async () => {
      const user = userEvent.setup();
      const many = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        role: 'Member',
      }));
      render(<DataTable columns={columns} data={many} itemsPerPage={5} />);

      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.queryByText('User 6')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: '2' }));
      expect(screen.getByText('User 6')).toBeInTheDocument();
      expect(screen.queryByText('User 1')).not.toBeInTheDocument();
    });

    it('does not paginate when showPagination is false', () => {
      const many = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        role: 'Member',
      }));
      render(<DataTable columns={columns} data={many} showPagination={false} />);
      expect(screen.getByText('User 12')).toBeInTheDocument();
    });
  });

  describe('Column visibility', () => {
    it('hides a column from the visibility menu', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={data} showColumnVisibility />);

      await user.click(screen.getByRole('button', { name: /columns/i }));
      const roleToggle = screen.getByRole('checkbox', { name: 'Role' });
      await user.click(roleToggle);

      expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    });
  });
});
