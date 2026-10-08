import type { Entry } from '../types';

export function sortedEntries(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
}

export function deltaPct(entries: Entry[]): number | null {
  const sorted = sortedEntries(entries);
  if (sorted.length < 2) return null;
  const last = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];
  if (prev.value === 0) return null;
  return ((last.value - prev.value) / prev.value) * 100;
}

export function deltaForIndex(sorted: Entry[], idx: number): number | null {
  if (idx === 0) return null;
  const prev = sorted[idx - 1];
  const cur = sorted[idx];
  if (prev.value === 0) return null;
  return ((cur.value - prev.value) / prev.value) * 100;
}
