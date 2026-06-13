import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown, Filter, Search, Columns, X } from 'lucide-react';
import Pagination from './Pagination';

/* Compact checkbox with indeterminate support, styled to match the system. */
const TableCheckbox = ({ checked, indeterminate, onChange, 'aria-label': ariaLabel }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate && !checked;
  }, [indeterminate, checked]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={!!checked}
      onChange={onChange}
      aria-label={ariaLabel}
      className="w-4 h-4 rounded border-line-strong text-primary accent-primary cursor-pointer focus:ring-2 focus:ring-primary/40"
    />
  );
};

const DataTable = ({
  columns = [],
  data = [],
  itemsPerPage = 5,
  showPagination = true,
  selectable = false,
  searchable = false,
  showColumnVisibility = false,
  onRowSelectionChange,
  emptyMessage = 'No results found.',
  className = '',
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [openFilter, setOpenFilter] = useState(null); // column id whose filter input is open
  const [menuOpen, setMenuOpen] = useState(false);

  // Map the friendly column config onto TanStack column definitions.
  const tableColumns = useMemo(() => {
    const defs = columns.map((column) => ({
      id: column.key,
      accessorKey: column.key,
      header: column.header,
      enableSorting: !!column.sortable,
      enableColumnFilter: !!column.filterable,
      filterFn: 'includesString',
      cell: column.render
        ? ({ getValue, row }) => column.render(getValue(), row.original)
        : ({ getValue }) => (
            <span className="text-base text-ink">{getValue()}</span>
          ),
    }));

    if (selectable) {
      defs.unshift({
        id: '__select__',
        enableSorting: false,
        enableColumnFilter: false,
        header: ({ table }) => (
          <TableCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }) => (
          <TableCheckbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            aria-label="Select row"
          />
        ),
      });
    }

    return defs;
  }, [columns, selectable]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: { sorting, columnFilters, globalFilter, rowSelection, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    initialState: { pagination: { pageSize: itemsPerPage } },
  });

  // Notify consumers when selection changes.
  useEffect(() => {
    if (onRowSelectionChange) {
      onRowSelectionChange(table.getSelectedRowModel().rows.map((r) => r.original));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const rows = table.getRowModel().rows;
  const colSpan = tableColumns.length;

  return (
    <div className={`bg-surface-raised rounded-card shadow-elevation-2 border border-line ${className}`}>
      {/* Toolbar */}
      {(searchable || showColumnVisibility) && (
        <div className="flex items-center justify-between gap-3 p-4 border-b border-line">
          {searchable ? (
            <div className="flex items-center h-10 px-3 bg-surface rounded-control border border-line-strong gap-2 w-full max-w-xs">
              <Search size={18} className="shrink-0 text-ink-muted" />
              <input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                aria-label="Search table"
                className="flex-1 min-w-0 text-sm bg-transparent outline-none text-ink placeholder-ink-muted"
              />
            </div>
          ) : (
            <div />
          )}

          {showColumnVisibility && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 h-10 px-3 rounded-control border border-line-strong text-sm font-medium text-ink hover:bg-surface-muted transition-colors"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <Columns size={18} />
                Columns
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-raised rounded-control shadow-elevation-4 border border-line p-2 z-20">
                  {table
                    .getAllLeafColumns()
                    .filter((col) => col.id !== '__select__')
                    .map((col) => (
                      <label
                        key={col.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-ink hover:bg-surface-muted cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={col.getIsVisible()}
                          onChange={col.getToggleVisibilityHandler()}
                          className="w-4 h-4 rounded border-line-strong accent-primary"
                        />
                        {typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id}
                      </label>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const canFilter = header.column.getCanFilter();
                  const sortDir = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="border-b-2 border-line-strong px-2 py-3.5 text-left align-top"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-medium text-ink-muted">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {canSort && (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="text-ink-muted hover:text-ink transition-colors"
                            aria-label={`Sort by ${header.column.columnDef.header}`}
                          >
                            {sortDir === 'asc' ? (
                              <ChevronUp size={18} />
                            ) : sortDir === 'desc' ? (
                              <ChevronDown size={18} />
                            ) : (
                              <ChevronsUpDown size={18} className="opacity-60" />
                            )}
                          </button>
                        )}
                        {canFilter && (
                          <button
                            onClick={() =>
                              setOpenFilter((cur) => (cur === header.column.id ? null : header.column.id))
                            }
                            className={`transition-colors ${
                              header.column.getFilterValue()
                                ? 'text-primary'
                                : 'text-ink-muted hover:text-ink'
                            }`}
                            aria-label={`Filter ${header.column.columnDef.header}`}
                          >
                            <Filter size={18} />
                          </button>
                        )}
                      </div>
                      {canFilter && openFilter === header.column.id && (
                        <div className="mt-2 flex items-center h-8 px-2 bg-surface rounded border border-line-strong gap-1">
                          <input
                            autoFocus
                            value={header.column.getFilterValue() ?? ''}
                            onChange={(e) => header.column.setFilterValue(e.target.value)}
                            placeholder="Filter..."
                            className="flex-1 min-w-0 text-sm bg-transparent outline-none text-ink placeholder-ink-muted"
                          />
                          {header.column.getFilterValue() ? (
                            <button
                              onClick={() => header.column.setFilterValue('')}
                              className="text-ink-muted hover:text-ink"
                              aria-label="Clear filter"
                            >
                              <X size={14} />
                            </button>
                          ) : null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-2 py-10 text-center text-ink-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    row.getIsSelected() ? 'bg-primary/5' : 'hover:bg-surface-muted'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border-b border-line px-2 py-3.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: selection summary + pagination */}
      {(showPagination && pageCount > 1) || selectable ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-line">
          {selectable ? (
            <span className="text-sm text-ink-muted">
              {table.getSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected
            </span>
          ) : (
            <span />
          )}
          {showPagination && pageCount > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pageCount}
              onPageChange={(page) => table.setPageIndex(page - 1)}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default DataTable;
