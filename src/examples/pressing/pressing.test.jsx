import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../../components/Toast';
import AppShellExample from '../AppShellExample';
import { ColumnChart, OutputTable, StageBars, niceTicks } from './charts';
import {
  DAILY_TARGET,
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
} from './data';

// ---- Data: every number must agree with every other ------------------------------

describe('pressing plant data', () => {
  it("today's output is the same number everywhere", () => {
    expect(recordsToday).toBe(8420);
    expect(output[output.length - 1].value).toBe(recordsToday);
    expect(presses.reduce((n, p) => n + p.today, 0)).toBe(recordsToday);
  });

  it('counts open orders from the stages, excluding shipped', () => {
    expect(openOrders).toBe(21);
    expect(stages.filter((s) => s !== 'Shipped').reduce((n, s) => n + stageCounts[s], 0)).toBe(openOrders);
    expect(Object.keys(stageCounts).sort()).toEqual([...stages].sort());
  });

  it('keeps orders consistent', () => {
    expect(new Set(orders.map((o) => o.id)).size).toBe(orders.length);
    for (const o of orders) expect(stages).toContain(o.stage);
  });

  it('derives the running count and the comparison to the weekday average', () => {
    expect(runningPresses).toBe(presses.filter((p) => p.status === 'Running').length);
    expect(vsAveragePct).toBe(4);
  });

  it('flags low stock below the threshold', () => {
    expect(inventory.filter(isLow).map((i) => i.name)).toEqual(['Color pigment', 'Center labels', 'Inner sleeves']);
  });
});

// ---- Chart ---------------------------------------------------------------------

describe('niceTicks', () => {
  it('picks clean steps from zero', () => {
    expect(niceTicks(8610)).toEqual([0, 3000, 6000, 9000]);
    expect(niceTicks(100)).toEqual([0, 50, 100]);
    expect(niceTicks(0)[0]).toBe(0);
  });
});

describe('ColumnChart', () => {
  const chart = () =>
    render(<ColumnChart data={output} target={DAILY_TARGET} aria-label="Records pressed per day" />);

  it('labels only the latest value and the peak, and names the target', () => {
    const { container } = chart();
    const labels = [...container.querySelectorAll('svg text')].map((t) => t.textContent);
    expect(labels).toContain('8,610'); // peak
    expect(labels).toContain('8,420'); // latest
    expect(labels).not.toContain('7,950'); // not every bar
    expect(labels).toContain('Target 8,000');
    expect(labels).toContain('9,000');
  });

  it('draws no bar for a zero day', () => {
    const { container } = chart();
    // 14 days, 2 with no output
    expect(container.querySelectorAll('svg path')).toHaveLength(12);
  });

  it('shows a tooltip with the value and the gap to target on hover', () => {
    const { container } = chart();
    const bands = container.querySelectorAll('svg rect');
    fireEvent.pointerEnter(bands[4]); // Oct 28
    expect(screen.getByText('8,390')).toBeInTheDocument();
    expect(screen.getByText('390 above target')).toBeInTheDocument();
    fireEvent.pointerLeave(screen.getByRole('group', { name: 'Records pressed per day' }));
    expect(screen.queryByText('390 above target')).toBeNull();
  });

  it('says "No shift" for a day with no output', () => {
    const { container } = chart();
    fireEvent.pointerEnter(container.querySelectorAll('svg rect')[1]); // Oct 25
    expect(screen.getByText('No shift')).toBeInTheDocument();
  });

  it('is readable from the keyboard with a live announcement', async () => {
    const user = userEvent.setup();
    chart();
    const group = screen.getByRole('group', { name: 'Records pressed per day' });
    await user.tab();
    expect(group).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByText('Nov 6: 8,420 records, 420 above target')).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByText('Nov 5: 7,720 records, 280 below target')).toBeInTheDocument();
    await user.keyboard('{Home}');
    expect(screen.getByText('Oct 24: 3,180 records, 4,820 below target')).toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('Oct 25: 0 records, no shift')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByText('No shift')).toBeNull();
  });
});

describe('OutputTable and StageBars', () => {
  it('lists every day with its gap to target', () => {
    render(<OutputTable data={output} target={DAILY_TARGET} caption="Output" />);
    expect(screen.getAllByRole('row')).toHaveLength(output.length + 1);
    expect(screen.getByRole('row', { name: /Oct 30/ })).toHaveTextContent('8,610');
    expect(screen.getByRole('row', { name: /Oct 30/ })).toHaveTextContent('+610');
    expect(screen.getAllByText('No shift')).toHaveLength(2);
  });

  it('lists every stage with its count, in pipeline order', () => {
    render(<StageBars stages={stages} counts={stageCounts} aria-label="Orders by stage" />);
    const items = within(screen.getByRole('list', { name: 'Orders by stage' })).getAllByRole('listitem');
    expect(items.map((li) => li.textContent)).toEqual(stages.map((s) => `${s}${stageCounts[s]}`));
  });
});

// ---- The whole app ---------------------------------------------------------------

describe('AppShellExample (pressing plant)', () => {
  const app = () =>
    render(
      <MemoryRouter>
        <ToastProvider>
          <AppShellExample />
        </ToastProvider>
      </MemoryRouter>,
    );

  it('opens on the plant overview with consistent headline numbers', () => {
    app();
    expect(screen.getByRole('heading', { name: 'Plant overview' })).toBeInTheDocument();
    // the stat tile and the chart's latest-value label agree
    expect(screen.getAllByText('8,420').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Records pressed today')).toBeInTheDocument();
    expect(screen.getByText(/Day shift · 4 of 6 presses running/)).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Orders by stage' })).toBeInTheDocument();
  });

  it('starts with the sidebar collapsed to the icon rail and expands on request', async () => {
    const user = userEvent.setup();
    app();
    const sidebar = () => screen.getByRole('complementary', { name: 'Sidebar' });
    expect(within(sidebar()).queryByText('Deep Groove')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));
    expect(within(sidebar()).getByText('Deep Groove')).toBeInTheDocument();
  });

  it('switches the chart to its table view', async () => {
    const user = userEvent.setup();
    app();
    await user.click(screen.getByRole('radio', { name: 'Table' }));
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: /Records pressed per day/ })).toBeNull();
  });

  it('shows press status with an icon and a word, not color alone', () => {
    app();
    expect(screen.getAllByText('Running')).toHaveLength(runningPresses);
    expect(screen.getByText('Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Idle')).toBeInTheDocument();
  });

  it('navigates the sidebar and filters orders by phase', async () => {
    const user = userEvent.setup();
    app();
    await user.click(screen.getByRole('button', { name: /Orders/ }));
    expect(screen.getByRole('heading', { name: 'Orders' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').filter((li) => li.textContent.includes('PR-'))).toHaveLength(orders.length);

    await user.click(screen.getByRole('radio', { name: 'Pressing' }));
    const rows = screen.getAllByRole('listitem').filter((li) => li.textContent.includes('PR-'));
    expect(rows).toHaveLength(orders.filter((o) => o.stage === 'Pressing').length);
  });

  it('flags the low-stock materials with a reorder action', async () => {
    const user = userEvent.setup();
    app();
    await user.click(screen.getByRole('button', { name: /Inventory/ }));
    expect(screen.getAllByRole('button', { name: 'Reorder' })).toHaveLength(3);
    await user.click(screen.getAllByRole('button', { name: 'Reorder' })[0]);
    expect(await screen.findByText('Reorder requested')).toBeInTheDocument();
  });

  it('jumps to a view from the command palette', async () => {
    const user = userEvent.setup();
    app();
    await user.click(screen.getByRole('button', { name: /Search or jump to/ }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByText('Go to Presses'));
    expect(await screen.findByRole('heading', { name: 'Presses' })).toBeInTheDocument();
  });
});
