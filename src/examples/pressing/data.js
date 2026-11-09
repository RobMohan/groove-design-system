// Demo data for "Deep Groove", a fictional record pressing plant.
// Every headline number on the dashboard is derived from these arrays, so the
// stat tiles, charts and lists always agree with each other.

export const PLANT = 'Deep Groove Pressing';

export const stages = ['Mastering', 'Plating', 'Test pressing', 'Pressing', 'Packing', 'Shipped'];

export const presses = [
  { id: 1, status: 'Running', job: 'PR-2041', run: 312, of: 500, cycle: 31, today: 1610 },
  { id: 2, status: 'Running', job: 'PR-2038', run: 880, of: 1000, cycle: 29, today: 1740 },
  { id: 3, status: 'Running', job: 'PR-2044', run: 140, of: 300, cycle: 33, today: 1520 },
  { id: 4, status: 'Idle', job: 'Awaiting stampers', run: 0, of: 0, cycle: 0, today: 640 },
  { id: 5, status: 'Running', job: 'PR-2040', run: 505, of: 750, cycle: 30, today: 1780 },
  { id: 6, status: 'Maintenance', job: 'Steam trap service', run: 0, of: 0, cycle: 0, today: 1130 },
];

export const orders = [
  { id: 'PR-2046', title: 'Tidewater Hymns', customer: 'Lowtide Records', format: '12" LP, 140g black', qty: 500, stage: 'Mastering', due: 'Dec 4' },
  { id: 'PR-2045', title: 'Paper Lanterns', customer: 'Owl & Anchor', format: '7" single, 45 rpm', qty: 300, stage: 'Plating', due: 'Dec 1' },
  { id: 'PR-2044', title: 'Static Bloom', customer: 'Nightshade Records', format: '12" LP, 180g red', qty: 300, stage: 'Pressing', due: 'Nov 21' },
  { id: 'PR-2043', title: 'Salt & Signal', customer: 'Harbor Light', format: '12" LP, 180g black', qty: 1000, stage: 'Test pressing', due: 'Nov 25' },
  { id: 'PR-2041', title: 'Midnight Static', customer: 'Nightshade Records', format: '12" LP, 180g black', qty: 500, stage: 'Pressing', due: 'Nov 14' },
  { id: 'PR-2040', title: 'Copper Wire', customer: 'Fieldnote Audio', format: '12" 2LP, 140g clear', qty: 750, stage: 'Pressing', due: 'Nov 18' },
  { id: 'PR-2039', title: 'Small Hours', customer: 'Lowtide Records', format: '10" EP, 33 rpm', qty: 250, stage: 'Packing', due: 'Nov 12' },
  { id: 'PR-2038', title: 'Greenhouse', customer: 'Owl & Anchor', format: '12" LP, 180g green', qty: 1000, stage: 'Pressing', due: 'Nov 10' },
  { id: 'PR-2036', title: 'Night Ferry', customer: 'Harbor Light', format: '12" LP, 140g black', qty: 500, stage: 'Shipped', due: 'Nov 5' },
  { id: 'PR-2035', title: 'Low Orbit', customer: 'Fieldnote Audio', format: '7" single, 45 rpm', qty: 300, stage: 'Shipped', due: 'Nov 3' },
];

// Orders in flight per stage. Shipped counts this week only.
export const stageCounts = { Mastering: 4, Plating: 3, 'Test pressing': 5, Pressing: 6, Packing: 3, Shipped: 9 };

// Records pressed per day, Oct 24 to Nov 6. The plant runs weekdays, with a short Saturday shift.
export const output = [
  { label: 'Oct 24', value: 3180 },
  { label: 'Oct 25', value: 0 },
  { label: 'Oct 26', value: 7640 },
  { label: 'Oct 27', value: 8120 },
  { label: 'Oct 28', value: 8390 },
  { label: 'Oct 29', value: 7950 },
  { label: 'Oct 30', value: 8610 },
  { label: 'Oct 31', value: 3420 },
  { label: 'Nov 1', value: 0 },
  { label: 'Nov 2', value: 7880 },
  { label: 'Nov 3', value: 8260 },
  { label: 'Nov 4', value: 8540 },
  { label: 'Nov 5', value: 7720 },
  { label: 'Nov 6', value: 8420 },
];
export const DAILY_TARGET = 8000;

export const inventory = [
  { name: 'PVC compound', unit: 'kg', have: 4200, max: 6000 },
  { name: 'Color pigment', unit: 'kg', have: 38, max: 120 },
  { name: 'Center labels', unit: 'pcs', have: 6400, max: 20000 },
  { name: 'Inner sleeves', unit: 'pcs', have: 2100, max: 10000 },
  { name: 'Jackets', unit: 'pcs', have: 5300, max: 8000 },
  { name: 'Shrink wrap', unit: 'rolls', have: 14, max: 20 },
];
export const LOW_STOCK = 0.35;

// ---- Derived figures ---------------------------------------------------------

export const recordsToday = presses.reduce((sum, p) => sum + p.today, 0);
export const runningPresses = presses.filter((p) => p.status === 'Running').length;
export const openOrders = stages.filter((s) => s !== 'Shipped').reduce((sum, s) => sum + stageCounts[s], 0);

// Prior weekdays only (today excluded), so "vs weekday average" compares like with like.
const weekdays = output.filter((d, i) => d.value > 5000 && i < output.length - 1);
export const weekdayAverage = Math.round(weekdays.reduce((s, d) => s + d.value, 0) / weekdays.length);
export const vsAveragePct = Math.round(((recordsToday - weekdayAverage) / weekdayAverage) * 100);

export const isLow = (item) => item.have / item.max < LOW_STOCK;
export const fmt = (n) => n.toLocaleString('en-US');
