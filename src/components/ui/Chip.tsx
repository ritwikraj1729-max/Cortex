import type { Category, QuestRef } from '../../types';
import { cn } from '../../utils/cn';

export const CATEGORY_META: Record<Category, { label: string; className: string }> = {
  'urgent-important': { label: 'Urgent & Imp', className: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
  urgent: { label: 'Urgent', className: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  important: { label: 'Important', className: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  casual: { label: 'Casual', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
};

export function CategoryChip({ category }: { category: Category }) {
  const meta = CATEGORY_META[category];
  return (
    <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', meta.className)}>
      {meta.label}
    </span>
  );
}

const REF_ICON: Record<QuestRef['type'], string> = {
  streak: '🔥',
  subject: '📘',
  weekly: '🗓️',
  monthly: '📅',
};

export function RefChip({ ref }: { ref: QuestRef }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/70 px-2 py-0.5 text-[10px] font-medium text-slate-300">
      <span>{REF_ICON[ref.type]}</span>
      {ref.name}
    </span>
  );
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', className)}>
      {children}
    </span>
  );
}
