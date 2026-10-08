import { useMemo, useState } from 'react';
import { useApp } from '../../store/AppStore';
import { useDragReorder } from './dnd';
import { TaskRow, Divider, EmptyState } from './Rows';
import { Button } from '../ui/Button';
import { IconPlus, IconActivity } from '../ui/Icons';
import { ProgressRing } from '../ui/ProgressRing';
import { QuestFormModal } from './QuestFormModal';
import { getWeekDates, toISODate, formatDayLabel, formatFullDate, parseISO, todayISO } from '../../utils/date';
import { cn } from '../../utils/cn';

export function DailyTab() {
  const { futureTasks, addFutureTask, toggleFutureTask, deleteFutureTask, reorderFutureTasks, pushToast } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => todayISO());

  const today = todayISO();
  const isPast = selectedDate < today;
  const isFuture = selectedDate > today;
  const canAdd = !isPast;

  const taskDnd = useDragReorder((a, b) => reorderFutureTasks(selectedDate, a, b));

  const weekDates = useMemo(() => getWeekDates(new Date()), []);
  const dayTasks = useMemo(() => {
    if (selectedDate < todayISO()) return [];
    return futureTasks.filter((t) => t.date === selectedDate).sort((a, b) => a.order - b.order);
  }, [futureTasks, selectedDate]);

  const active = useMemo(() => dayTasks.filter((t) => !t.completed), [dayTasks]);
  const completed = useMemo(() => dayTasks.filter((t) => t.completed), [dayTasks]);

  const todayTasks = useMemo(
    () => futureTasks.filter((t) => t.date === today),
    [futureTasks, today]
  );
  const total = todayTasks.length;
  const done = todayTasks.filter((t) => t.completed).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="grid grid-cols-[1fr_300px] gap-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-50">7-Day Planner</h2>
          <Button variant="primary" size="sm" onClick={() => setShowAdd(true)} disabled={!canAdd}>
            <IconPlus width={14} height={14} /> Add Quest
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {weekDates.map((d) => {
            const iso = toISODate(d);
            const past = iso < today;
            const isToday = iso === today;
            const selected = iso === selectedDate;
            const hasTasks = !past && futureTasks.some((t) => t.date === iso);
            return (
              <button
                key={iso}
                onClick={() => setSelectedDate(iso)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl border px-1 py-2.5 transition',
                  selected && 'border-indigo-500 bg-indigo-500/15 shadow-[0_0_0_1px_rgba(99,102,241,0.35)]',
                  !selected && isToday && 'border-indigo-500/40 bg-indigo-500/5',
                  !selected && !isToday && !past && 'border-slate-800 hover:bg-white/5',
                  past && !selected && 'border-slate-800/60 opacity-45 hover:opacity-70'
                )}
              >
                <span className={cn('text-[9px] font-bold uppercase tracking-wide', isToday ? 'text-indigo-300' : 'text-slate-500')}>
                  {formatDayLabel(d)}
                </span>
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold',
                    isToday && 'bg-indigo-500 text-white',
                    !isToday && 'text-slate-100'
                  )}
                >
                  {d.getDate()}
                </span>
                <span className={cn('h-1.5 w-1.5 rounded-full', hasTasks ? 'bg-indigo-400' : 'bg-transparent')} />
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-100">{formatFullDate(parseISO(selectedDate))}</p>
            <p className="text-xs text-slate-500">
              {isPast ? 'Past days stay empty' : isFuture ? `${dayTasks.length} planned task(s)` : `${dayTasks.length} quest(s) today`}
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {isPast && <EmptyState>Previous dates are cleared. Set quests for today or upcoming days.</EmptyState>}
          {!isPast && active.length === 0 && completed.length === 0 && (
            <EmptyState>{isFuture ? 'No tasks planned for this day.' : 'No quests yet — add one to get started.'}</EmptyState>
          )}
          {!isPast &&
            active.map((t) => {
              const { isOver, ...row } = taskDnd.rowProps(t.id);
              return (
                <TaskRow
                  key={t.id}
                  task={t}
                  onToggle={() => {
                    toggleFutureTask(t.id);
                    if (!t.completed) pushToast('Quest completed!');
                  }}
                  onDelete={() => deleteFutureTask(t.id)}
                  grip={taskDnd.gripProps(t.id)}
                  row={row}
                  isOver={isOver}
                />
              );
            })}
          {!isPast && completed.length > 0 && (
            <>
              <Divider count={completed.length} />
              {completed.map((t) => {
                const { isOver, ...row } = taskDnd.rowProps(t.id);
                return (
                  <TaskRow
                    key={t.id}
                    task={t}
                    onToggle={() => toggleFutureTask(t.id)}
                    onDelete={() => deleteFutureTask(t.id)}
                    grip={taskDnd.gripProps(t.id)}
                    row={row}
                    isOver={isOver}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-4 flex items-center gap-2 text-slate-400">
          <IconActivity width={16} height={16} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Quest Status</h3>
        </div>
        <div className="flex justify-center">
          <ProgressRing pct={pct} color="#34d399">
            <div className="text-center">
              <div className="font-display text-2xl font-extrabold text-slate-50">{pct}%</div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Done</div>
            </div>
          </ProgressRing>
        </div>
        <div className="mt-5 space-y-2.5 text-sm">
          <Stat label="Done today" value={`${done} / ${total}`} />
          <Stat label="Remaining today" value={`${total - done}`} />
          <Stat label="Planned ahead" value={`${futureTasks.filter((t) => t.date > today).length}`} />
          <Stat label="Total quests" value={`${total}`} />
        </div>
      </div>

      {showAdd && canAdd && (
        <QuestFormModal
          title={isFuture ? 'Add Future Quest' : 'Add Daily Quest'}
          onClose={() => setShowAdd(false)}
          onSubmit={(name, category, refs) => {
            addFutureTask(selectedDate, name, category, refs);
            pushToast(isFuture ? 'Task added' : 'Quest added');
          }}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
      <span className="text-slate-400">{label}</span>
      <span className="font-bold text-slate-100">{value}</span>
    </div>
  );
}
