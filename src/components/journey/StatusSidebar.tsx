import type { Subject } from '../../types';
import { ProgressRing } from '../ui/ProgressRing';
import { chapterProgress, sectionProgress, subjectProgress } from '../../utils/progress';

interface StatusSidebarProps {
  subject: Subject;
  mode: 'view' | 'edit' | 'table';
  activeSectionId: string | null;
}

export function StatusSidebar({ subject, mode, activeSectionId }: StatusSidebarProps) {
  const isEdit = mode === 'edit';
  const section = isEdit ? null : subject.sections.find((s) => s.id === activeSectionId) ?? subject.sections[0];

  const ring = isEdit ? subjectProgress(subject) : section ? sectionProgress(section) : { done: 0, total: 0, pct: 0 };
  const ringLabel = isEdit ? subject.name : section?.name ?? '';

  const chapters = isEdit
    ? subject.sections.flatMap((sec) => sec.chapters.map((c) => ({ ...c, sectionName: sec.name })))
    : (section?.chapters ?? []).map((c) => ({ ...c, sectionName: undefined as string | undefined }));

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col gap-5 overflow-y-auto border-l border-slate-800/80 bg-[#0d0f16] px-5 py-7">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-center">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">Progress</p>
        <div className="flex justify-center">
          <ProgressRing pct={ring.pct} color="#a78bfa" size={104}>
            <div>
              <div className="font-display text-xl font-extrabold text-slate-50">{ring.pct}%</div>
              <div className="text-[10px] text-slate-500">
                {ring.done}/{ring.total}
              </div>
            </div>
          </ProgressRing>
        </div>
        <p className="mt-3 truncate text-sm font-semibold text-slate-300">{ringLabel}</p>
      </div>

      <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">Chapters</p>
        <div className="space-y-3">
          {chapters.length === 0 && <p className="text-xs italic text-slate-600">No chapters yet.</p>}
          {chapters.map((c) => {
            const p = chapterProgress(c);
            return (
              <div key={c.id}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="truncate font-medium text-slate-300">{c.name}</span>
                  <span className="shrink-0 font-bold text-slate-400">{p.pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-violet-400" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
