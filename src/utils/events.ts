import type { CalendarEvent } from '../types';

export interface EventOccurrence {
  event: CalendarEvent;
  label: string;
}

export function eventsOnDate(events: CalendarEvent[], iso: string): EventOccurrence[] {
  const out: EventOccurrence[] = [];
  for (const ev of events) {
    if (ev.mode === 'simple') {
      if (iso >= ev.from && iso <= ev.to) out.push({ event: ev, label: ev.name });
    } else {
      const match = ev.dates.find((d) => d.date === iso);
      if (match) out.push({ event: ev, label: match.label || ev.name });
    }
  }
  return out;
}

export function eventDates(event: CalendarEvent): string[] {
  if (event.mode === 'simple') {
    const dates: string[] = [];
    const from = new Date(event.from);
    const to = new Date(event.to);
    const cur = new Date(from);
    while (cur <= to) {
      dates.push(
        `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`
      );
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  }
  return event.dates.map((d) => d.date);
}
