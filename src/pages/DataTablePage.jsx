import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { RefreshCw } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const PropsTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="py-3 px-4 font-semibold">Prop</th>
          <th className="py-3 px-4 font-semibold">Type</th>
          <th className="py-3 px-4 font-semibold">Default</th>
          <th className="py-3 px-4 font-semibold">Description</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">columns</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">array</td>
          <td className="py-3 px-4 font-mono text-xs">[]</td>
          <td className="py-3 px-4">Array of column configuration objects</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">data</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">array</td>
          <td className="py-3 px-4 font-mono text-xs">[]</td>
          <td className="py-3 px-4">Array of data objects to display in rows</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">itemsPerPage</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">number</td>
          <td className="py-3 px-4 font-mono text-xs">5</td>
          <td className="py-3 px-4">Number of items to display per page</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">showPagination</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">boolean</td>
          <td className="py-3 px-4 font-mono text-xs">true</td>
          <td className="py-3 px-4">Show or hide pagination controls</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">selectable</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">boolean</td>
          <td className="py-3 px-4 font-mono text-xs">false</td>
          <td className="py-3 px-4">Add a checkbox column for row selection</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">searchable</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">boolean</td>
          <td className="py-3 px-4 font-mono text-xs">false</td>
          <td className="py-3 px-4">Show a global search field in the toolbar</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">showColumnVisibility</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">boolean</td>
          <td className="py-3 px-4 font-mono text-xs">false</td>
          <td className="py-3 px-4">Show a menu to toggle column visibility</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">onRowSelectionChange</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">function</td>
          <td className="py-3 px-4 font-mono text-xs">—</td>
          <td className="py-3 px-4">Callback fired with the array of selected rows</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">emptyMessage</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">string</td>
          <td className="py-3 px-4 font-mono text-xs">'No results found.'</td>
          <td className="py-3 px-4">Message shown when there are no rows</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">className</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">string</td>
          <td className="py-3 px-4 font-mono text-xs">''</td>
          <td className="py-3 px-4">Additional CSS classes</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const ColumnConfigTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="py-3 px-4 font-semibold">Property</th>
          <th className="py-3 px-4 font-semibold">Type</th>
          <th className="py-3 px-4 font-semibold">Required</th>
          <th className="py-3 px-4 font-semibold">Description</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">key</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">string</td>
          <td className="py-3 px-4 font-mono text-xs">Yes</td>
          <td className="py-3 px-4">The key to access data in the row object</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">header</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">string</td>
          <td className="py-3 px-4 font-mono text-xs">Yes</td>
          <td className="py-3 px-4">Header text to display for this column</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">sortable</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">boolean</td>
          <td className="py-3 px-4 font-mono text-xs">No</td>
          <td className="py-3 px-4">Enable sorting for this column</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">filterable</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">boolean</td>
          <td className="py-3 px-4 font-mono text-xs">No</td>
          <td className="py-3 px-4">Show filter icon for this column</td>
        </tr>
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 font-mono text-sm">render</td>
          <td className="py-3 px-4 font-mono text-xs text-gray-600">function</td>
          <td className="py-3 px-4 font-mono text-xs">No</td>
          <td className="py-3 px-4">Custom render function (value, row) =&gt; ReactNode</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function DataTablePage() {
  const [selectedRows, setSelectedRows] = useState([]);

  // Sample data for examples
  const basicData = [
    { id: 'TKT-001', title: 'Login Issue', status: 'Open', priority: 'High' },
    { id: 'TKT-002', title: 'Feature Request', status: 'In Progress', priority: 'Medium' },
    { id: 'TKT-003', title: 'Bug Report', status: 'Closed', priority: 'Low' },
    { id: 'TKT-004', title: 'Payment Error', status: 'Open', priority: 'Critical' },
    { id: 'TKT-005', title: 'UI Enhancement', status: 'Open', priority: 'Low' },
  ];

  const basicColumns = [
    { key: 'id', header: 'Ticket ID', sortable: true },
    { key: 'title', header: 'Title' },
    { key: 'status', header: 'Status' },
    { key: 'priority', header: 'Priority', sortable: true },
  ];

  const customData = [
    { id: 'TKT-001', title: 'Login Issue', status: 'open', assignee: 'John Doe', date: '2025-01-15' },
    { id: 'TKT-002', title: 'Feature Request', status: 'progress', assignee: 'Jane Smith', date: '2025-01-14' },
    { id: 'TKT-003', title: 'Bug Report', status: 'closed', assignee: 'Bob Johnson', date: '2025-01-13' },
    { id: 'TKT-004', title: 'Payment Error', status: 'open', assignee: 'Alice Brown', date: '2025-01-12' },
    { id: 'TKT-005', title: 'UI Enhancement', status: 'progress', assignee: 'Charlie Wilson', date: '2025-01-11' },
    { id: 'TKT-006', title: 'Database Optimization', status: 'closed', assignee: 'Diana Prince', date: '2025-01-10' },
    { id: 'TKT-007', title: 'API Integration', status: 'open', assignee: 'Ethan Hunt', date: '2025-01-09' },
  ];

  const customColumns = [
    {
      key: 'id',
      header: 'Ticket ID',
      sortable: true,
      filterable: true
    },
    {
      key: 'title',
      header: 'Title',
      render: (value) => (
        <span className="text-base text-gray-700 font-medium">{value}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const statusTypes = {
          open: 'warning',
          progress: 'default',
          closed: 'positive'
        };
        const statusLabels = {
          open: 'Open',
          progress: 'In Progress',
          closed: 'Closed'
        };
        return <Badge type={statusTypes[value]}>{statusLabels[value]}</Badge>;
      }
    },
    {
      key: 'assignee',
      header: 'Assignee',
      sortable: true
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (value) => (
        <span className="text-base text-gray-600">{new Date(value).toLocaleDateString()}</span>
      )
    },
  ];

  const actionData = [
    { id: 'TKT-001', title: 'Login Issue', status: 'open' },
    { id: 'TKT-002', title: 'Feature Request', status: 'progress' },
    { id: 'TKT-003', title: 'Bug Report', status: 'closed' },
  ];

  const actionColumns = [
    { key: 'id', header: 'Ticket ID', sortable: true },
    { key: 'title', header: 'Title' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const statusTypes = {
          open: 'warning',
          progress: 'default',
          closed: 'positive'
        };
        const statusLabels = {
          open: 'Open',
          progress: 'In Progress',
          closed: 'Closed'
        };
        return <Badge type={statusTypes[value]}>{statusLabels[value]}</Badge>;
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <button className="text-primary font-semibold text-base hover:underline">
            View
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <RefreshCw size={20} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Data Table</h1>
          <p className="text-xl text-gray-600">
            A flexible, feature-rich table powered by <a href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TanStack Table</a> — sorting,
            column &amp; global filtering, row selection, column visibility, pagination, and custom cell rendering.
          </p>
        </div>

        {/* Import */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import DataTable from './components/DataTable';`} />
        </section>

        {/* Basic Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
          <p className="text-gray-600 mb-6">
            Create a simple data table by providing columns and data arrays. The component automatically handles layout and styling.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <DataTable columns={basicColumns} data={basicData} />
          </div>
          <CodeBlock code={`const columns = [
  { key: 'id', header: 'Ticket ID', sortable: true },
  { key: 'title', header: 'Title' },
  { key: 'status', header: 'Status' },
  { key: 'priority', header: 'Priority', sortable: true },
];

const data = [
  { id: 'TKT-001', title: 'Login Issue', status: 'Open', priority: 'High' },
  { id: 'TKT-002', title: 'Feature Request', status: 'In Progress', priority: 'Medium' },
  { id: 'TKT-003', title: 'Bug Report', status: 'Closed', priority: 'Low' },
];

<DataTable columns={columns} data={data} />`} />
        </section>

        {/* Sorting and Filtering */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Sorting and Filtering</h2>
          <p className="text-gray-600 mb-6">
            Enable sorting by adding <code className="bg-gray-100 px-2 py-1 rounded text-sm">sortable: true</code> to a column.
            Click a header's sort icon to cycle ascending → descending → unsorted. Add <code className="bg-gray-100 px-2 py-1 rounded text-sm">filterable: true</code> to
            reveal a per-column filter — click the filter icon to type a value, and it narrows the rows live.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <DataTable columns={customColumns} data={customData} />
          </div>
          <CodeBlock code={`const columns = [
  {
    key: 'id',
    header: 'Ticket ID',
    sortable: true,
    filterable: true
  },
  { key: 'title', header: 'Title' },
  { key: 'assignee', header: 'Assignee', sortable: true },
];`} />
        </section>

        {/* Custom Cell Rendering */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Custom Cell Rendering</h2>
          <p className="text-gray-600 mb-6">
            Use the <code className="bg-gray-100 px-2 py-1 rounded text-sm">render</code> function to customize how cell content is displayed.
            Perfect for badges, icons, buttons, and formatted data.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <DataTable columns={actionColumns} data={actionData} itemsPerPage={3} />
          </div>
          <CodeBlock code={`import Badge from './components/Badge';

const columns = [
  { key: 'id', header: 'Ticket ID' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => {
      const statusTypes = {
        open: 'warning',
        progress: 'default',
        closed: 'positive'
      };
      return <Badge type={statusTypes[value]}>{value}</Badge>;
    }
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (_, row) => (
      <button className="text-primary font-semibold hover:underline">
        View Details
      </button>
    )
  }
];`} />
        </section>

        {/* Pagination */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Pagination</h2>
          <p className="text-gray-600 mb-6">
            Pagination is enabled by default. Control items per page with the <code className="bg-gray-100 px-2 py-1 rounded text-sm">itemsPerPage</code> prop,
            or disable it entirely with <code className="bg-gray-100 px-2 py-1 rounded text-sm">showPagination=&#123;false&#125;</code>.
          </p>
          <CodeBlock code={`// 10 items per page
<DataTable columns={columns} data={data} itemsPerPage={10} />

// Disable pagination
<DataTable columns={columns} data={data} showPagination={false} />`} />
        </section>

        {/* Search, Selection & Column Visibility */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Search, Selection &amp; Columns</h2>
          <p className="text-gray-600 mb-6">
            Turn on the toolbar features with <code className="bg-gray-100 px-2 py-1 rounded text-sm">searchable</code> (global search across all columns),
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">selectable</code> (row checkboxes with a select-all), and
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">showColumnVisibility</code> (a menu to show/hide columns).
            Use <code className="bg-gray-100 px-2 py-1 rounded text-sm">onRowSelectionChange</code> to react to the current selection.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
            <DataTable
              columns={customColumns}
              data={customData}
              selectable
              searchable
              showColumnVisibility
              itemsPerPage={5}
              onRowSelectionChange={setSelectedRows}
            />
            <p className="mt-4 text-sm text-gray-600">
              Selected rows: <span className="font-mono">{selectedRows.length}</span>
              {selectedRows.length > 0 && (
                <> — {selectedRows.map((r) => r.id).join(', ')}</>
              )}
            </p>
          </div>
          <CodeBlock code={`const [selected, setSelected] = useState([]);

<DataTable
  columns={columns}
  data={data}
  selectable
  searchable
  showColumnVisibility
  onRowSelectionChange={setSelected}
/>`} />
        </section>

        {/* Props Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Props</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
            <PropsTable />
          </div>
          <h3 className="text-xl font-bold mb-4">Column Configuration</h3>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <ColumnConfigTable />
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Keep it scannable:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Use clear, concise column headers</li>
                  <li>Align text left for readability</li>
                  <li>Limit columns to what's essential (5-8 columns max)</li>
                  <li>Consider hiding less important data on mobile</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Sorting and filtering:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Enable sorting for columns with comparable data (numbers, dates, alphabetical)</li>
                  <li>Show visual indicators for the current sort state</li>
                  <li>Only show filter icons where filtering makes sense</li>
                  <li>Provide clear feedback when filters are active</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Performance:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Use pagination for large datasets (more than 50 items)</li>
                  <li>Consider virtual scrolling for extremely large tables</li>
                  <li>Avoid complex calculations in render functions</li>
                  <li>Memoize expensive operations</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Accessibility:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Use semantic HTML (table, thead, tbody, th, td)</li>
                  <li>Provide clear labels for interactive elements</li>
                  <li>Ensure keyboard navigation works properly</li>
                  <li>Use appropriate ARIA labels for screen readers</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Mobile considerations:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Make tables horizontally scrollable on small screens</li>
                  <li>Consider a card layout for mobile instead of a table</li>
                  <li>Prioritize the most important columns</li>
                  <li>Ensure touch targets are large enough (minimum 44x44px)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
          <p className="text-gray-600 mb-6">
            Here's a complete example showing a ticket management table with custom rendering, sorting, and actions.
          </p>
          <CodeBlock code={`import DataTable from './components/DataTable';
import Badge from './components/Badge';
import { RefreshCw } from 'lucide-react';

function TicketList() {
  const columns = [
    {
      key: 'id',
      header: 'Ticket ID',
      sortable: true,
      filterable: true
    },
    {
      key: 'title',
      header: 'Title',
      render: (value) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const types = {
          open: 'warning',
          progress: 'default',
          closed: 'positive'
        };
        return <Badge type={types[value]}>{value}</Badge>;
      }
    },
    {
      key: 'assignee',
      header: 'Assignee',
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => viewTicket(row.id)}
            className="text-primary font-semibold hover:underline"
          >
            View
          </button>
          <button
            onClick={() => refreshTicket(row.id)}
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      )
    }
  ];

  const data = [
    { id: 'TKT-001', title: 'Login Issue', status: 'open', assignee: 'John Doe' },
    { id: 'TKT-002', title: 'Feature Request', status: 'progress', assignee: 'Jane Smith' },
    // ... more data
  ];

  return <DataTable columns={columns} data={data} itemsPerPage={10} />;
}`} />
        </section>
      </div>
    </div>
  );
}
