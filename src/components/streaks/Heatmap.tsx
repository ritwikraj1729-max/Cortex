import { useMemo } from 'react';
import { addDays, startOfWeek, toISODate, formatMonthShort, isSameDay } from '../../utils/date';
import { cn } from '../../utils/cn';

interface HeatmapProps {
  dates: string[];
  color: string;
  onToggle: (date: string) => void;
}

const WEEKS = 26;

/** GitHub only labels Monday, Wednesday and Friday to keep the gutter quiet. */
const DAY_ROWS = [
  { row: 1, label: 'Mon' },
  { row: 3, label: 'Wed' },
  { row: 5, label: 'Fri' },
];
const ALL_ROWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Heatmap({ dates, color, onToggle }: HeatmapProps) {
  const dateSet = useMemo(() => new Set(dates), [dates]);
  const today = useMemo(() => new Date(), []);

  const columns = useMemo(() => {
    const currentWeekStart = startOfWeek(today);
    const firstWeekStart = addDays(currentWeekStart, -7 * (WEEKS - 1));
    return Array.from({ length: WEEKS }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(firstWeekStart, w * 7 + d)));
  }, [today]);

  const monthLabels = useMemo(() => {
    const labels: { col: number; label: string }[] = [];
    let lastMonth = -1;
    columns.forEach((col, i) => {
      const firstDay = col[0];
      if (firstDay.getMonth() !== lastMonth) {
        labels.push({ col: i, label: formatMonthShort(firstDay) });
        lastMonth = firstDay.getMonth();
      }
    });
    return labels;
  }, [columns]);

  return (
    <div className="flex w-full gap-2">
      {/* weekday gutter, aligned to the same 7-row grid */}
      <div className="w-7 shrink-0" aria-hidden="true">
        {/* spacer matching the month-label row (h-3 + mb-1.5 = 18px) */}
        <div className="h-[18px]" />
        <div
          className="grid"
          style={{
            gridTemplateRows: 'repeat(7, 14px)',
            rowGap: '3px',
          }}
        >
          {ALL_ROWS.map((d, i) => (
            <div key={d} className="flex items-center justify-end pr-1 font-mono text-[8px] font-semibold uppercase tracking-wider text-slate-600">
              {DAY_ROWS.find((x) => x.row === i)?.label ?? ''}
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        {/* month labels */}
        <div className="relative mb-1.5 h-3 w-full">
          {monthLabels.map((m) => (
            <span
              key={m.col}
              className="absolute font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-500"
              style={{ left: `${(m.col / WEEKS) * 100}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* fluid grid: 26 week-columns share the full card width */}
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))`,
            // fixed rows keep the weekday gutter perfectly aligned
            gridTemplateRows: 'repeat(7, 14px)',
            rowGap: '3px',
            columnGap: '3px',
            gridAutoFlow: 'column',
          }}
        >
          {columns.flatMap((col) =>
            col.map((d) => {
              const iso = toISODate(d);
              const active = dateSet.has(iso);
              const isToday = isSameDay(d, today);
              const isFuture = d.getTime() > today.getTime() && !isToday;
              return (
                <button
                  key={iso}
                  disabled={isFuture}
                  onClick={() => onToggle(iso)}
                  title={`${d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} — ${
                    isFuture ? 'Upcoming' : active ? 'Active' : 'No activity'
                  }`}
                  className={cn(
                    'h-full w-full rounded-[3px] transition-all duration-150',
                    isFuture
                      ? 'cursor-default bg-white/[0.025]'
                      : 'cursor-pointer hover:scale-[1.25] hover:ring-2 hover:ring-white/40',
                    isToday && 'ring-[1.5px] ring-slate-200/70'
                  )}
                  style={{
                    background: isFuture ? undefined : active ? color : 'rgba(255,255,255,0.055)',
                    boxShadow: isFuture ? undefined : `inset 0 0 0 1px ${color}14`,
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
