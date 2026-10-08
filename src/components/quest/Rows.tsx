import type { DailyQuest, FutureTask, Goal } from '../../types';
import { CategoryChip, RefChip } from '../ui/Chip';
import { IconGrip, IconX } from '../ui/Icons';
import { cn } from '../../utils/cn';

interface RowShellProps {
  isOver: boolean;
  completed: boolean;
  grip: any;
  row: any;
  children: React.ReactNode;
}

function RowShell({ isOver, completed, grip, row, children }: RowShellProps) {
  return (
    <div
      {...row}
      className={cn(
        'flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors',
        completed ? 'border-slate-800/60 bg-slate-900/30 opacity-60' : 'border-slate-800 bg-slate-900/60',
        isOver && 'border-indigo-500 bg-indigo-500/5'
      )}
    >
      <span {...grip} className="cursor-grab text-slate-600 hover:text-slate-400 active:cursor-grabbing">
        <IconGrip />
      </span>
      {children}
    </div>
  );
}

export function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
        checked ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600 hover:border-slate-400'
      )}
    >
      {checked && (
        <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="white" strokeWidth={3}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
    </button>
  );
}

export function DailyQuestRow({
  quest,
  onToggle,
  onDelete,
  grip,
  row,
  isOver,
}: {
  quest: DailyQuest;
  onToggle: () => void;
  onDelete: () => void;
  grip: any;
  row: any;
  isOver: boolean;
}) {
  return (
    <RowShell isOver={isOver} completed={quest.completed} grip={grip} row={row}>
      <Checkbox checked={quest.completed} onChange={onToggle} />
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-sm font-semibold text-slate-100', quest.completed && 'line-through text-slate-500')}>
          {quest.name}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <CategoryChip category={quest.category} />
          {quest.refs.map((r) => (
            <RefChip key={r.type + r.id} ref={r} />
          ))}
        </div>
      </div>
      <button onClick={onDelete} className="shrink-0 text-slate-600 hover:text-rose-400">
        <IconX width={16} height={16} />
      </button>
    </RowShell>
  );
}

export function GoalRow({
  goal,
  onToggle,
  onDelete,
  grip,
  row,
  isOver,
}: {
  goal: Goal;
  onToggle: () => void;
  onDelete: () => void;
  grip: any;
  row: any;
  isOver: boolean;
}) {
  const refs = goal.refs ?? [];
  return (
    <RowShell isOver={isOver} completed={goal.completed} grip={grip} row={row}>
      <Checkbox checked={goal.completed} onChange={onToggle} />
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-sm font-semibold text-slate-100', goal.completed && 'line-through text-slate-500')}>
          {goal.name}
        </p>
        {(goal.category || refs.length > 0) && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {goal.category && <CategoryChip category={goal.category} />}
            {refs.map((r) => (
              <RefChip key={r.type + r.id} ref={r} />
            ))}
          </div>
        )}
      </div>
      <button onClick={onDelete} className="shrink-0 text-slate-600 hover:text-rose-400">
        <IconX width={16} height={16} />
      </button>
    </RowShell>
  );
}

export function TaskRow({
  task,
  onToggle,
  onDelete,
  grip,
  row,
  isOver,
}: {
  task: FutureTask;
  onToggle: () => void;
  onDelete: () => void;
  grip: any;
  row: any;
  isOver: boolean;
}) {
  return (
    <RowShell isOver={isOver} completed={task.completed} grip={grip} row={row}>
      <Checkbox checked={task.completed} onChange={onToggle} />
      <div className="min-w-0 flex-1">
        <p className={cn('truncate text-sm font-semibold text-slate-100', task.completed && 'line-through text-slate-500')}>
          {task.name}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <CategoryChip category={task.category} />
          {task.refs.map((r) => (
            <RefChip key={r.type + r.id} ref={r} />
          ))}
        </div>
      </div>
      <button onClick={onDelete} className="shrink-0 text-slate-600 hover:text-rose-400">
        <IconX width={16} height={16} />
      </button>
    </RowShell>
  );
}

export function Divider({ count }: { count: number }) {
  return (
    <div className="my-3 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-800" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Completed · {count}</span>
      <div className="h-px flex-1 bg-slate-800" />
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-sm italic text-slate-600">{children}</p>;
}
