export function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function parseISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDayLabel(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

export function formatMonthYear(d: Date): string {
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export function formatMonthShort(d: Date): string {
  return d.toLocaleDateString(undefined, { month: 'short' });
}

export function formatFullDate(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatShortDate(d: Date): string {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function startOfWeek(d: Date): Date {
  const result = new Date(d);
  result.setDate(result.getDate() - result.getDay());
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getWeekDates(anchor: Date): Date[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const gridStart = addDays(first, -startOffset);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}
