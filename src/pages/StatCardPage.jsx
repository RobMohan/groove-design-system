import React from 'react';
import StatCard from '../components/StatCard';
import { DollarSign, Users, Activity, Star, TrendingUp, TrendingDown } from 'lucide-react';

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{code}</code>
  </pre>
);

const PropsTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-line">
          <th className="py-3 px-4 font-semibold">Prop</th>
          <th className="py-3 px-4 font-semibold">Type</th>
          <th className="py-3 px-4 font-semibold">Default</th>
          <th className="py-3 px-4 font-semibold">Description</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">value</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string | number</td>
          <td className="py-3 px-4 font-mono text-xs">required</td>
          <td className="py-3 px-4">Main metric value to display</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">label</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">required</td>
          <td className="py-3 px-4">Label describing the metric</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">icon</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">LucideIcon</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Icon component from lucide-react (optional)</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">trend</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Trend indicator with icon (e.g., "+20%") (optional)</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">trendLabel</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">undefined</td>
          <td className="py-3 px-4">Alternative trend text without icon (optional)</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">trendType</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">'positive' | 'neutral' | 'negative'</td>
          <td className="py-3 px-4 font-mono text-xs">'positive'</td>
          <td className="py-3 px-4">Color styling for the trend</td>
        </tr>
        <tr className="border-b border-line">
          <td className="py-3 px-4 font-mono text-sm">className</td>
          <td className="py-3 px-4 font-mono text-xs text-ink-muted">string</td>
          <td className="py-3 px-4 font-mono text-xs">''</td>
          <td className="py-3 px-4">Additional CSS classes</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function StatCardPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Stat Card</h1>
          <p className="text-xl text-ink-muted">
            Dashboard-style metric cards for displaying statistics with trend indicators and icons.
          </p>
        </div>

        {/* Import */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Import</h2>
          <CodeBlock code={`import StatCard from './components/StatCard';`} />
        </section>

        {/* Basic Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Basic Example</h2>
          <p className="text-ink-muted mb-6">
            A stat card with a value, label, icon, and positive trend.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <StatCard
              value="$12,234"
              label="Total Revenue"
              icon={DollarSign}
              trend="+20.1% from last month"
              trendType="positive"
            />
            <StatCard
              value="2,350"
              label="Active Users"
              icon={Users}
              trend="+180.1% from last month"
              trendType="positive"
            />
          </div>
          <CodeBlock code={`import { DollarSign } from 'lucide-react';

<StatCard
  value="$12,234"
  label="Total Revenue"
  icon={DollarSign}
  trend="+20.1% from last month"
  trendType="positive"
/>`} />
        </section>

        {/* Trend Types */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Trend Types</h2>
          <p className="text-ink-muted mb-6">
            Three trend types with different color styling: positive (green), neutral (gray), and negative (red).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <StatCard
              value="12,234"
              label="Sales"
              icon={Activity}
              trend="+19% from last month"
              trendType="positive"
            />
            <StatCard
              value="4.9"
              label="Average Rating"
              icon={Star}
              trend="No change"
              trendType="neutral"
            />
            <StatCard
              value="89"
              label="Support Tickets"
              icon={Activity}
              trend="-5% from last month"
              trendType="negative"
            />
          </div>
          <CodeBlock code={`<StatCard
  value="12,234"
  label="Sales"
  trend="+19%"
  trendType="positive"
/>

<StatCard
  value="4.9"
  label="Rating"
  trend="No change"
  trendType="neutral"
/>

<StatCard
  value="89"
  label="Tickets"
  trend="-5%"
  trendType="negative"
/>`} />
        </section>

        {/* Trend Label */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Trend Label</h2>
          <p className="text-ink-muted mb-6">
            Use trendLabel instead of trend for descriptive text without the trending icon.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <StatCard
              value="4.9"
              label="Average Rating"
              icon={Star}
              trendLabel="Based on 1,234 reviews"
              trendType="neutral"
            />
            <StatCard
              value="98%"
              label="Uptime"
              icon={Activity}
              trendLabel="Last 30 days"
              trendType="positive"
            />
          </div>
          <CodeBlock code={`<StatCard
  value="4.9"
  label="Average Rating"
  icon={Star}
  trendLabel="Based on 1,234 reviews"
  trendType="neutral"
/>`} />
        </section>

        {/* Dashboard Layout */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Dashboard Layout</h2>
          <p className="text-ink-muted mb-6">
            Stat cards work great in grid layouts for dashboards and analytics views.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            <StatCard
              value="$12,234"
              label="Total Revenue"
              icon={DollarSign}
              trend="+20.1%"
              trendType="positive"
            />
            <StatCard
              value="2,350"
              label="Active Users"
              icon={Users}
              trend="+180.1%"
              trendType="positive"
            />
            <StatCard
              value="12,234"
              label="Sales"
              icon={Activity}
              trend="+19%"
              trendType="positive"
            />
            <StatCard
              value="4.9"
              label="Rating"
              icon={Star}
              trendLabel="1,234 reviews"
              trendType="neutral"
            />
          </div>
          <CodeBlock code={`<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard value="$12,234" label="Revenue" trend="+20.1%" />
  <StatCard value="2,350" label="Users" trend="+180.1%" />
  <StatCard value="12,234" label="Sales" trend="+19%" />
  <StatCard value="4.9" label="Rating" trendLabel="1,234 reviews" />
</div>`} />
        </section>

        {/* Props Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Props</h2>
          <div className="bg-surface-raised rounded-lg border border-line overflow-hidden">
            <PropsTable />
          </div>
        </section>

        {/* Usage Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
          <p className="text-ink-muted mb-6">
            Here's a complete example of using stat cards in a dashboard.
          </p>
          <CodeBlock code={`import StatCard from './components/StatCard';
import { DollarSign, Users, Activity, Star } from 'lucide-react';

function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        value="$12,234"
        label="Total Revenue"
        icon={DollarSign}
        trend="+20.1% from last month"
        trendType="positive"
      />
      
      <StatCard
        value="2,350"
        label="Active Users"
        icon={Users}
        trend="+180.1% from last month"
        trendType="positive"
      />
      
      <StatCard
        value="12,234"
        label="Sales"
        icon={Activity}
        trend="+19% from last month"
        trendType="positive"
      />
      
      <StatCard
        value="4.9"
        label="Average Rating"
        icon={Star}
        trendLabel="Based on 1,234 reviews"
        trendType="neutral"
      />
    </div>
  );
}`} />
        </section>
      </div>
    </div>
  );
}