import React, { useMemo, useState } from 'react';
import {
  Bell,
  Boxes,
  CheckCircle2,
  Disc3,
  HelpCircle,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Pause,
  Play,
  Plus,
  Settings,
  User,
  Wrench,
} from 'lucide-react';
import AppShell, { PageHeader, useAppShell } from '../components/AppShell';
import Button from '../components/Button';
import Chip from '../components/Chip';
import CommandPalette, { useCommandK } from '../components/CommandPalette';
import IconButton from '../components/IconButton';
import Progress from '../components/Progress';
import SegmentedControl from '../components/SegmentedControl';
import StatCard from '../components/StatCard';
import TextInput from '../components/TextInput';
import Toggle from '../components/Toggle';
import { useToast } from '../components/Toast';
import { ColumnChart, OutputTable, StageBars } from './pressing/charts';
import {
  DAILY_TARGET,
  PLANT,
  fmt,
  inventory,
  isLow,
  openOrders,
  orders,
  output,
  presses,
  recordsToday,
  runningPresses,
  stageCounts,
  stages,
  vsAveragePct,
} from './pressing/data';

/*
 * A record pressing plant dashboard built on the shell: the starting point to
 * copy for a real operations app. Swap the views and the data, keep the wiring.
 */

const statusStyle = {
  Running: { color: 'positive', icon: Play },
  Idle: { color: 'neutral', icon: Pause },
  Maintenance: { color: 'warning', icon: Wrench },
};
const stageColor = {
  Mastering: 'neutral',
  Plating: 'neutral',
  'Test pressing': 'warning',
  Pressing: 'primary',
  Packing: 'primary',
  Shipped: 'positive',
};
const orderGroups = {
  All: stages,
  Prepress: ['Mastering', 'Plating', 'Test pressing'],
  Pressing: ['Pressing'],
  Finishing: ['Packing', 'Shipped'],
};

// Status is never color alone: every state carries an icon and a word.
const StatusChip = ({ status }) => {
  const { color, icon } = statusStyle[status];
  return (
    <Chip color={color} icon={icon} size="sm">
      {status}
    </Chip>
  );
};

const Panel = ({ title, description, action, flush = false, children, className = '' }) => (
  <section className={`rounded-card border border-line bg-surface-raised shadow-elevation-1 ${className}`}>
    {(title || action) && (
      <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-ink">{title}</h3>
          {description && <p className="text-sm text-ink-muted">{description}</p>}
        </div>
        {action}
      </div>
    )}
    <div className={flush ? '' : 'p-5'}>{children}</div>
  </section>
);

// ---- Views -------------------------------------------------------------------

function Overview({ onNewOrder }) {
  const { compact, width } = useAppShell();
  const [mode, setMode] = useState('Chart');
  const wide = !compact && (width ?? 0) >= 940;
  const statCols = !compact && (width ?? 0) >= 700 ? 'grid-cols-3' : 'grid-cols-1';
  const pressCols = compact ? 'grid-cols-1' : wide ? 'grid-cols-2' : (width ?? 0) >= 700 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <>
      <PageHeader
        as="h2"
        title="Plant overview"
        description={`Friday, Nov 6 · Day shift · ${runningPresses} of ${presses.length} presses running`}
        actions={
          <>
            <Button variant="outline" size="small">Export</Button>
            <Button size="small" icon={Plus} onClick={onNewOrder}>New order</Button>
          </>
        }
      />

      <div className={`mb-6 grid gap-4 ${statCols}`}>
        <StatCard value={fmt(recordsToday)} label="Records pressed today" trend={`+${vsAveragePct}% vs weekday average`} />
        <StatCard value={openOrders} label="Open orders" trendLabel="7 due this week" trendType="neutral" />
        <StatCard value="96%" label="On-time delivery" trend="+1 pt vs last month" />
      </div>

      <Panel
        className="mb-6"
        title="Records pressed per day"
        description={`Last 14 days, against a daily target of ${fmt(DAILY_TARGET)}`}
        action={
          <SegmentedControl
            aria-label="Chart or table view"
            size="sm"
            options={['Chart', 'Table']}
            value={mode}
            onChange={setMode}
          />
        }
      >
        {mode === 'Chart' ? (
          <ColumnChart
            data={output}
            target={DAILY_TARGET}
            aria-label={`Records pressed per day, ${output[0].label} to ${output[output.length - 1].label}. Use the left and right arrow keys to read each day, or switch to the table view.`}
          />
        ) : (
          <OutputTable data={output} target={DAILY_TARGET} caption="Records pressed per day against the daily target" />
        )}
      </Panel>

      <div className={`grid gap-4 ${wide ? 'grid-cols-5' : 'grid-cols-1'}`}>
        <Panel
          className={wide ? 'col-span-2' : ''}
          title="Orders by stage"
          description="Open orders move top to bottom; shipped is this week"
        >
          <StageBars stages={stages} counts={stageCounts} aria-label="Orders by stage" />
        </Panel>

        <Panel className={wide ? 'col-span-3' : ''} title="Press floor" description="Status and output today for each press">
          <ul className={`grid gap-3 ${pressCols}`}>
            {presses.map((p) => (
              <li key={p.id} className="rounded-control border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-ink">Press {p.id}</span>
                  <StatusChip status={p.status} />
                </div>
                <p className="mt-1 truncate text-xs text-ink-muted">
                  {p.status === 'Running' ? `${p.job} · ${fmt(p.run)} of ${fmt(p.of)}` : p.job}
                </p>
                <p className="mt-2 text-sm">
                  <span className="font-semibold tabular-nums text-ink">{fmt(p.today)}</span>{' '}
                  <span className="text-ink-muted">pressed today</span>
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

function Orders({ onNewOrder }) {
  const [filter, setFilter] = useState('All');
  const rows = orders.filter((o) => orderGroups[filter].includes(o.stage));
  return (
    <>
      <PageHeader
        as="h2"
        title="Orders"
        description="Every job from mastering to shipment."
        actions={<Button size="small" icon={Plus} onClick={onNewOrder}>New order</Button>}
      />
      <div className="mb-4">
        <SegmentedControl
          aria-label="Filter orders by phase"
          size="sm"
          value={filter}
          onChange={setFilter}
          options={Object.keys(orderGroups)}
        />
      </div>
      <Panel flush>
        <ul className="divide-y divide-line">
          {rows.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4">
              <div className="min-w-0 flex-1 basis-48">
                <p className="truncate font-medium text-ink">{o.title}</p>
                <p className="truncate text-xs text-ink-muted">{o.id} · {o.customer}</p>
              </div>
              <p className="basis-44 text-sm text-ink-muted">
                {o.format}
                <span className="block text-xs">{fmt(o.qty)} records</span>
              </p>
              <div className="flex w-32 justify-end">
                <Chip color={stageColor[o.stage]} size="sm">{o.stage}</Chip>
              </div>
              <p className="w-16 text-right text-sm tabular-nums text-ink-muted">{o.due}</p>
            </li>
          ))}
        </ul>
        {rows.length === 0 && <p className="px-5 py-8 text-center text-sm text-ink-muted">No orders in this phase.</p>}
      </Panel>
    </>
  );
}

function Presses() {
  const { compact, width } = useAppShell();
  return (
    <>
      <PageHeader as="h2" title="Presses" description="Live status for every press on the floor." />
      <ul className={`grid gap-4 ${compact ? 'grid-cols-1' : (width ?? 0) >= 940 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {presses.map((p) => (
          <li key={p.id}>
            <Panel className="h-full">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="font-semibold text-ink">Press {p.id}</h3>
                <StatusChip status={p.status} />
              </div>
              {p.status === 'Running' ? (
                <Progress value={(p.run / p.of) * 100} size="sm" label={p.job} showLabel />
              ) : (
                <p className="text-sm text-ink-muted">{p.job}</p>
              )}
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-ink-muted">Pressed today</dt>
                  <dd className="font-semibold tabular-nums text-ink">{fmt(p.today)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">Cycle time</dt>
                  <dd className="font-semibold tabular-nums text-ink">{p.cycle ? `${p.cycle} s` : 'Not running'}</dd>
                </div>
              </dl>
            </Panel>
          </li>
        ))}
      </ul>
    </>
  );
}

function Inventory({ onReorder }) {
  return (
    <>
      <PageHeader as="h2" title="Inventory" description="Raw material and packaging on hand." />
      <Panel flush>
        <ul className="divide-y divide-line">
          {inventory.map((item) => (
            <li key={item.name} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4">
              <div className="min-w-0 flex-1 basis-40">
                <p className="font-medium text-ink">{item.name}</p>
                <p className="text-xs tabular-nums text-ink-muted">
                  {fmt(item.have)} of {fmt(item.max)} {item.unit}
                </p>
              </div>
              <div className="w-36">
                <Progress value={(item.have / item.max) * 100} size="sm" aria-label={`${item.name} stock level`} />
              </div>
              <div className="flex w-28 justify-end">
                {isLow(item) ? (
                  <Chip color="warning" size="sm" onClick={() => onReorder(item)}>
                    Reorder
                  </Chip>
                ) : (
                  <Chip color="positive" icon={CheckCircle2} size="sm">
                    In stock
                  </Chip>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

function SettingsView({ toast }) {
  const [name, setName] = useState(PLANT);
  const [faults, setFaults] = useState(true);
  const [summary, setSummary] = useState(false);
  return (
    <>
      <PageHeader as="h2" title="Settings" description="Manage the plant and how you are notified." />
      <div className="max-w-xl space-y-4">
        <Panel title="Plant">
          <TextInput label="Plant name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Plant name" />
        </Panel>
        <Panel title="Notifications">
          <div className="space-y-4">
            <Toggle label="Press fault alerts" description="Get notified when a press stops unexpectedly." checked={faults} onChange={setFaults} />
            <Toggle label="Daily production summary" description="A recap of output and orders at the end of each shift." checked={summary} onChange={setSummary} />
          </div>
        </Panel>
        <Button onClick={() => toast({ title: 'Settings saved', description: 'Your changes are live.', variant: 'success' })}>
          Save changes
        </Button>
      </div>
    </>
  );
}

// ---- App ---------------------------------------------------------------------

const views = { overview: 'Overview', orders: 'Orders', presses: 'Presses', inventory: 'Inventory', settings: 'Settings' };

const navigation = [
  {
    title: 'Plant',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'orders', label: 'Orders', icon: ListChecks, badge: openOrders },
      { id: 'presses', label: 'Presses', icon: Disc3 },
      { id: 'inventory', label: 'Inventory', icon: Boxes, badge: inventory.filter(isLow).length },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'help', label: 'Help center', icon: HelpCircle },
    ],
  },
];

const ShiftCard = () => (
  <div className="rounded-control bg-surface-muted p-3">
    <p className="text-xs font-semibold text-ink">Day shift</p>
    <p className="mb-2 text-xs text-ink-muted">
      {runningPresses} of {presses.length} presses running
    </p>
    <Progress value={(runningPresses / presses.length) * 100} size="sm" aria-label="Presses running" />
  </div>
);

/**
 * @param {{ shortcut?: boolean }} props  shortcut: bind ⌘K / Ctrl K to the palette. Turn it off
 *   on a page that should keep that shortcut for itself; the search button still works.
 */
export default function AppShellExample({ shortcut = true }) {
  const { toast } = useToast();
  const [view, setView] = useState('overview');
  const [paletteOpen, setPaletteOpen] = useState(false);

  useCommandK(() => shortcut && setPaletteOpen((open) => !open));

  const note = (title, description) => toast({ title, description, variant: 'info' });
  const newOrder = () => note('New order', 'This is a demo, so nothing was created.');

  const commands = useMemo(
    () => [
      ...Object.entries(views).map(([id, label]) => ({
        id: `go-${id}`,
        label: `Go to ${label}`,
        group: 'Navigate',
        keywords: id,
        onSelect: () => setView(id),
      })),
      { id: 'new-order', label: 'New order', group: 'Actions', icon: Plus, onSelect: newOrder },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onNavigate = (item) => {
    if (item.id === 'help') note('Help center', 'This is a demo, so there is nowhere to go.');
    else setView(item.id);
  };

  return (
    <>
      <AppShell
        brand={{
          logo: (
            <span className="flex h-8 w-8 items-center justify-center rounded-control bg-primary text-white">
              <Disc3 size={18} aria-hidden="true" />
            </span>
          ),
          name: 'Deep Groove',
        }}
        navigation={navigation}
        activeId={view}
        onNavigate={onNavigate}
        sidebarFooter={<ShiftCard />}
        breadcrumbs={[{ label: 'Deep Groove' }, { label: views[view] }]}
        search={{ placeholder: 'Search or jump to…', shortcut: '⌘K', onClick: () => setPaletteOpen(true) }}
        actions={({ compact }) => (
          <>
            <span className="relative">
              <IconButton icon={Bell} label="Alerts, 2 unread" variant="ghost" onClick={() => note('Alerts', 'Press 6 is in maintenance. Three materials are low.')} />
              <span className="pointer-events-none absolute right-2 top-2 h-2 w-2 rounded-pill bg-destructive ring-2 ring-surface-raised" aria-hidden="true" />
            </span>
            {!compact && (
              <Button size="small" icon={Plus} className="ml-1" onClick={newOrder}>
                New order
              </Button>
            )}
          </>
        )}
        user={{ name: 'Dana Reyes', email: 'dana@deepgroove.example', status: 'online' }}
        userMenu={[
          { label: 'Profile', icon: User, onClick: () => setView('settings') },
          { label: 'Account settings', icon: Settings, onClick: () => setView('settings') },
          { divider: true },
          { label: 'Sign out', icon: LogOut, danger: true, onClick: () => note('Signed out', 'This is a demo, so you are still signed in.') },
        ]}
      >
        {view === 'overview' && <Overview onNewOrder={newOrder} />}
        {view === 'orders' && <Orders onNewOrder={newOrder} />}
        {view === 'presses' && <Presses />}
        {view === 'inventory' && (
          <Inventory onReorder={(item) => note('Reorder requested', `${item.name} added to the purchasing list.`)} />
        )}
        {view === 'settings' && <SettingsView toast={toast} />}
      </AppShell>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        items={commands}
        placeholder="Search or jump to…"
      />
    </>
  );
}
