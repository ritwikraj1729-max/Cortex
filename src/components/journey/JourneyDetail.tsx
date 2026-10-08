import { useState } from 'react';
import { useApp } from '../../store/AppStore';
import { subjectProgress } from '../../utils/progress';
import { Button, IconButton } from '../ui/Button';
import { IconChevronLeft, IconTrash } from '../ui/Icons';
import { ConfirmModal } from '../ui/ConfirmModal';
import { StatusSidebar } from './StatusSidebar';
import { ViewMode } from './ViewMode';
import { EditMode } from './EditMode';
import { TableMode } from './TableMode';
import { cn } from '../../utils/cn';

type Mode = 'view' | 'edit' | 'table';

export function JourneyDetail({ subjectId }: { subjectId: string }) {
  const { subjects, closeSubject, deleteSubject, pushToast } = useApp();
  const subject = subjects.find((s) => s.id === subjectId);
  const [mode, setMode] = useState<Mode>('view');
  const [sectionIndex, setSectionIndex] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!subject) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        Subject not found.
        <Button variant="secondary" onClick={closeSubject} className="ml-3">
          Back
        </Button>
      </div>
    );
  }

  const p = subjectProgress(subject);
  const clampedIndex = Math.min(sectionIndex, subject.sections.length - 1);
  const activeSectionId = mode === 'edit' ? null : subject.sections[clampedIndex]?.id ?? null;

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-8 py-7">
        <button onClick={closeSubject} className="mb-5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400 hover:text-slate-100">
          <IconChevronLeft width={14} height={14} /> Back to All Subjects
        </button>

        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl">{subject.symbol}</div>
            <div>
              <h1 className="font-display text-2xl font-extrabold text-slate-50">{subject.name}</h1>
              <p className="text-xs text-slate-500">
                {p.done}/{p.total} levels · {p.pct}% complete
              </p>
            </div>
          </div>
          <IconButton variant="danger" onClick={() => setConfirmDelete(true)}>
            <IconTrash width={15} height={15} />
          </IconButton>
        </div>

        <div className="mb-6 inline-flex rounded-xl border border-slate-800 bg-slate-900/60 p-1">
          {(['view', 'edit', ...(subject.levelMode === 'simple' ? (['table'] as const) : [])] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wide capitalize transition-all',
                mode === m ? 'bg-indigo-500 text-white shadow-[0_2px_0_0_#3730a3]' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {m}
            </button>
          ))}
        </div>

        {mode === 'view' && <ViewMode subject={subject} sectionIndex={clampedIndex} setSectionIndex={setSectionIndex} />}
        {mode === 'edit' && <EditMode subject={subject} />}
        {mode === 'table' && subject.levelMode === 'simple' && <TableMode subject={subject} sectionIndex={clampedIndex} setSectionIndex={setSectionIndex} />}
      </div>

      <StatusSidebar subject={subject} mode={mode} activeSectionId={activeSectionId} />

      {confirmDelete && (
        <ConfirmModal
          title="Delete subject?"
          message={`"${subject.name}" and all of its sections, chapters, and levels will be permanently removed.`}
          onClose={() => setConfirmDelete(false)}
          onConfirm={() => {
            deleteSubject(subject.id);
            closeSubject();
            pushToast('Subject deleted');
          }}
        />
      )}
    </div>
  );
}
