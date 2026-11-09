import React, { useMemo, useState } from 'react';
import {
  Bell,
  FolderKanban,
  HelpCircle,
  Layers,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  User,
  Users,
} from 'lucide-react';
import AppShell, { PageHeader, useAppShell } from '../components/AppShell';
import Avatar from '../components/Avatar';
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

/*
 * A small workspace app that shows the shell in use. Copy this file as the
 * starting point for a real app: swap the views, keep the wiring.
 */

const people = {
  jordan: { name: 'Jordan Lee', role: 'Product designer', email: 'jordan@northwind.io', status: 'online' },
  priya: { name: 'Priya Shah', role: 'Engineering lead', email: 'priya@northwind.io', status: 'online' },
  marcus: { name: 'Marcus Webb', role: 'Frontend engineer', email: 'marcus@northwind.io', status: 'away' },
  elena: { name: 'Elena Rossi', role: 'Content strategist', email: 'elena@northwind.io', status: 'offline' },
  sam: { name: 'Sam Okafor', role: 'QA engineer', email: 'sam@northwind.io', status: 'busy' },
  ana: { name: 'Ana Duarte', role: 'Researcher', email: 'ana@northwind.io', status: 'online' },
};

const projects = [
  { id: 1, name: 'Checkout redesign', owner: 'priya', status: 'Active', progress: 72, due: 'Nov 21' },
  { id: 2, name: 'Design tokens v2', owner: 'jordan', status: 'Active', progress: 45, due: 'Dec 2' },
  { id: 3, name: 'Onboarding emails', owner: 'elena', status: 'Paused', progress: 30, due: 'Dec 12' },
  { id: 4, name: 'Accessibility audit', owner: 'sam', status: 'Active', progress: 88, due: 'Nov 14' },
  { id: 5, name: 'Help center refresh', owner: 'ana', status: 'Done', progress: 100, due: 'Oct 30' },
  { id: 6, name: 'Billing migration', owner: 'marcus', status: 'Paused', progress: 12, due: 'Jan 9' },
];

const statusColor = { Active: 'positive', Paused: 'warning', Done: 'neutral' };

const activity = [
  { who: 'priya', text: 'merged "Update checkout summary layout"', when: '12 min ago' },
  { who: 'jordan', text: 'commented on Design tokens v2', when: '1 hour ago' },
  { who: 'sam', text: 'closed 4 accessibility issues', when: '3 hours ago' },
  { who: 'ana', text: 'uploaded 6 research recordings', when: 'Yesterday' },
];

const Panel = ({ title, action, flush = false, children, className = '' }) => (
  <section className={`rounded-card border border-line bg-surface-raised shadow-elevation-1 ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h3 className="font-semibold text-ink">{title}</h3>
        {action}
      </div>
    )}
    <div className={flush ? '' : 'p-5'}>{children}</div>
  </section>
);

function Overview({ onNewProject }) {
  const { compact, width } = useAppShell();
  const split = !compact && (width ?? 0) >= 940;
  return (
    <>
      <PageHeader
        as="h2"
        title="Good morning, Jordan"
        description="Here is what is happening across your workspace today."
        actions={
          <>
            <Button variant="outline" size="small">Export</Button>
            <Button size="small" icon={Plus} onClick={onNewProject}>New project</Button>
          </>
        }
      />
      <div className={`mb-6 grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-3'}`}>
        <StatCard value="12" label="Active projects" trend="+2 this month" />
        <StatCard value="48" label="Open tasks" trendLabel="6 due this week" trendType="neutral" />
        <StatCard value="9" label="Team members" trendLabel="1 invite pending" trendType="neutral" />
      </div>
      <div className={`grid gap-4 ${split ? 'grid-cols-5' : 'grid-cols-1'}`}>
        <Panel title="Recent activity" className={split ? 'col-span-3' : ''}>
          <ul className="space-y-4">
            {activity.map((a) => (
              <li key={a.text} className="flex items-start gap-3">
                <Avatar name={people[a.who].name} size="sm" />
                <p className="min-w-0 flex-1 text-sm text-ink">
                  <span className="font-medium">{people[a.who].name}</span> {a.text}
                </p>
                <span className="shrink-0 text-xs text-ink-muted">{a.when}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Due soon" className={split ? 'col-span-2' : ''}>
          <ul className="space-y-4">
            {projects
              .filter((p) => p.status === 'Active')
              .slice(0, 3)
              .map((p) => (
                <li key={p.id}>
                  <Progress value={p.progress} size="sm" label={p.name} showLabel />
                  <p className="mt-1 text-xs text-ink-muted">Due {p.due}</p>
                </li>
              ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

function Projects({ onNewProject }) {
  const [filter, setFilter] = useState('All');
  const rows = filter === 'All' ? projects : projects.filter((p) => p.status === filter);
  return (
    <>
      <PageHeader
        as="h2"
        title="Projects"
        description="Everything your team is building, in one place."
        actions={<Button size="small" icon={Plus} onClick={onNewProject}>New project</Button>}
      />
      <div className="mb-4">
        <SegmentedControl
          aria-label="Filter projects by status"
          size="sm"
          value={filter}
          onChange={setFilter}
          options={['All', 'Active', 'Paused', 'Done']}
        />
      </div>
      <Panel flush>
        <ul className="divide-y divide-line">
          {rows.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4">
              <div className="min-w-0 flex-1 basis-48">
                <p className="truncate font-medium text-ink">{p.name}</p>
                <p className="text-xs text-ink-muted">Due {p.due}</p>
              </div>
              <Avatar name={people[p.owner].name} size="sm" />
              <div className="w-28">
                <Progress value={p.progress} size="sm" aria-label={`${p.name} progress`} />
              </div>
              <div className="flex w-20 justify-end">
                <Chip color={statusColor[p.status]} size="sm">{p.status}</Chip>
              </div>
            </li>
          ))}
        </ul>
        {rows.length === 0 && <p className="px-5 py-8 text-center text-sm text-ink-muted">No projects match this filter.</p>}
      </Panel>
    </>
  );
}

function Team() {
  const { compact, tight } = useAppShell();
  return (
    <>
      <PageHeader as="h2" title="Team" description="The people you work with." />
      <ul className={`grid gap-4 ${compact ? 'grid-cols-1' : tight ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {Object.values(people).map((person) => (
          <li key={person.email}>
            <Panel>
              <div className="flex items-center gap-3">
                <Avatar name={person.name} status={person.status} />
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{person.name}</p>
                  <p className="truncate text-sm text-ink-muted">{person.role}</p>
                </div>
              </div>
            </Panel>
          </li>
        ))}
      </ul>
    </>
  );
}

function SettingsView({ toast }) {
  const [name, setName] = useState('Northwind');
  const [email, setEmail] = useState(true);
  const [digest, setDigest] = useState(false);
  return (
    <>
      <PageHeader as="h2" title="Settings" description="Manage your workspace and notifications." />
      <div className="max-w-xl space-y-4">
        <Panel title="Workspace">
          <TextInput label="Workspace name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Workspace name" />
        </Panel>
        <Panel title="Notifications">
          <div className="space-y-4">
            <Toggle label="Email notifications" description="Get an email when someone mentions you." checked={email} onChange={setEmail} />
            <Toggle label="Weekly digest" description="A summary of project activity every Monday." checked={digest} onChange={setDigest} />
          </div>
        </Panel>
        <Button onClick={() => toast({ title: 'Settings saved', description: 'Your changes are live.', variant: 'success' })}>
          Save changes
        </Button>
      </div>
    </>
  );
}

const views = { overview: 'Overview', projects: 'Projects', team: 'Team', settings: 'Settings' };

export default function AppShellExample() {
  const { toast } = useToast();
  const [view, setView] = useState('overview');
  const [paletteOpen, setPaletteOpen] = useState(false);

  useCommandK(() => setPaletteOpen((open) => !open));

  const note = (title, description) => toast({ title, description, variant: 'info' });
  const newProject = () => note('New project', 'This is a demo, so nothing was created.');

  const navigation = [
    {
      title: 'Workspace',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'projects', label: 'Projects', icon: FolderKanban, badge: 6 },
        { id: 'team', label: 'Team', icon: Users },
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

  const commands = useMemo(
    () => [
      ...Object.entries(views).map(([id, label]) => ({
        id: `go-${id}`,
        label: `Go to ${label}`,
        group: 'Navigate',
        keywords: id,
        onSelect: () => setView(id),
      })),
      { id: 'new-project', label: 'Create project', group: 'Actions', icon: Plus, onSelect: newProject },
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
              <Layers size={18} aria-hidden="true" />
            </span>
          ),
          name: 'Northwind',
        }}
        navigation={navigation}
        activeId={view}
        onNavigate={onNavigate}
        breadcrumbs={[{ label: 'Workspace' }, { label: views[view] }]}
        search={{ placeholder: 'Search or jump to…', shortcut: '⌘K', onClick: () => setPaletteOpen(true) }}
        actions={({ compact }) => (
          <>
            <span className="relative">
              <IconButton icon={Bell} label="Notifications, 3 unread" variant="ghost" onClick={() => note('Notifications', 'You have 3 unread notifications.')} />
              <span className="pointer-events-none absolute right-2 top-2 h-2 w-2 rounded-pill bg-destructive ring-2 ring-surface-raised" aria-hidden="true" />
            </span>
            {!compact && (
              <Button size="small" icon={Plus} className="ml-1" onClick={newProject}>
                New
              </Button>
            )}
          </>
        )}
        user={{ name: people.jordan.name, email: people.jordan.email, status: 'online' }}
        userMenu={[
          { label: 'Profile', icon: User, onClick: () => setView('team') },
          { label: 'Account settings', icon: Settings, onClick: () => setView('settings') },
          { divider: true },
          { label: 'Sign out', icon: LogOut, danger: true, onClick: () => note('Signed out', 'This is a demo, so you are still signed in.') },
        ]}
      >
        {view === 'overview' && <Overview onNewProject={newProject} />}
        {view === 'projects' && <Projects onNewProject={newProject} />}
        {view === 'team' && <Team />}
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
