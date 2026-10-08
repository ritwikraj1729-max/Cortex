import { addDays, parseISO, toISODate } from './date';

export function currentStreakLength(dates: string[]): number {
  const set = new Set(dates);
  let cursor = new Date();
  if (!set.has(toISODate(cursor))) {
    cursor = addDays(cursor, -1);
    if (!set.has(toISODate(cursor))) return 0;
  }
  let count = 0;
  while (set.has(toISODate(cursor))) {
    count++;
    cursor = addDays(cursor, -1);
  }
  return count;
}

export function bestStreakLength(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = parseISO(sorted[i - 1]);
    const cur = parseISO(sorted[i]);
    const diffDays = Math.round((cur.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      run++;
    } else if (diffDays > 1) {
      run = 1;
    }
    best = Math.max(best, run);
  }
  return best;
}
