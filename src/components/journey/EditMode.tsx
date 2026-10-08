import { useEffect, useRef, useState } from 'react';
import type { Subject } from '../../types';
import { useApp } from '../../store/AppStore';
import { IconButton } from '../ui/Button';
import { IconPlus, IconX, IconChevronRight } from '../ui/Icons';
import { ConfirmModal } from '../ui/ConfirmModal';
import { SeriesEditorModal } from './SeriesEditorModal';
import { chapterProgress } from '../../utils/progress';
import { cn } from '../../utils/cn';

interface EditModeProps {
  subject: Subject;
}

function Editable({
  value,
  onCommit,
  className,
  focusId,
  id,
  placeholder,
}: {
  value: string;
  onCommit: (v: string) => void;
  className?: string;
  focusId?: string | null;
  id: string;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusId === id && ref.current) {
      ref.current.focus();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [focusId, id]);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-editable-id={id}
      onBlur={(e) => onCommit(e.currentTarget.textContent?.trim() || placeholder || 'Untitled')}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      className={cn(
        'rounded-md px-1.5 py-0.5 outline-none hover:bg-white/5 focus:bg-indigo-500/10 focus:ring-1 focus:ring-indigo-500',
        className
      )}
    >
      {value}
    </div>
  );
}

export function EditMode({ subject }: EditModeProps) {
  const {
    renameSection,
    addSection,
    deleteSection,
    addChapter,
    renameChapter,
    deleteChapter,
    toggleChapterCollapsed,
    addLevel,
    renameLevel,
    deleteLevel,
    updateSeries,
    pushToast,
  } = useApp();

  const [focusId, setFocusId] = useState<string | null>(null);
  const [confirmDeleteSection, setConfirmDeleteSection] = useState<string | null>(null);
  const [confirmDeleteChapter, setConfirmDeleteChapter] = useState<{ sectionId: string; chapterId: string } | null>(null);
  const [seriesEditor, setSeriesEditor] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-10">
      {subject.sections.map((section) => (
        <div key={section.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Editable
              id={`sec-${section.id}`}
              value={section.name}
              focusId={focusId}
              onCommit={(v) => renameSection(subject.id, section.id, v)}
              className="font-display text-lg font-bold text-slate-50"
            />
            <div className="ml-auto flex items-center gap-2">
              {subject.levelMode === 'simple' && (
                <button
                  onClick={() => setSeriesEditor(section.id)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/5"
                >
                  Series ({section.levelSeries?.length ?? 0})
                </button>
              )}
              <button
                onClick={() => {
                  const id = addChapter(subject.id, section.id);
                  setFocusId(`chap-${id}`);
                }}
                className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/5"
              >
                <IconPlus width={13} height={13} /> Add Chapter
              </button>
              <IconButton variant="danger" onClick={() => setConfirmDeleteSection(section.id)}>
                <IconX width={14} height={14} />
              </IconButton>
            </div>
          </div>

          <div className="space-y-2 border-l-2 border-slate-800 pl-4">
            {section.chapters.length === 0 && <p className="text-xs italic text-slate-600">No chapters yet — add one above.</p>}
            {section.chapters.map((chapter) => {
              const p = chapterProgress(chapter);
              return (
                <div key={chapter.id} className="relative rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleChapterCollapsed(subject.id, section.id, chapter.id)}
                      className="text-slate-500 hover:text-slate-200"
                    >
                      <IconChevronRight
                        width={14}
                        height={14}
                        className={cn('transition-transform', !chapter.collapsed && 'rotate-90')}
                      />
                    </button>
                    <Editable
                      id={`chap-${chapter.id}`}
                      value={chapter.name}
                      focusId={focusId}
                      onCommit={(v) => renameChapter(subject.id, section.id, chapter.id, v)}
                      className="font-semibold text-slate-200"
                    />
                    <span className="text-[11px] text-slate-500">
                      {p.done}/{p.total} levels
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => addLevel(subject.id, section.id, chapter.id)}
                        className="flex items-center gap-1 rounded-lg border border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:bg-white/5"
                      >
                        <IconPlus width={12} height={12} /> Add Level
                      </button>
                      <IconButton variant="danger" onClick={() => setConfirmDeleteChapter({ sectionId: section.id, chapterId: chapter.id })}>
                        <IconX width={13} height={13} />
                      </IconButton>
                    </div>
                  </div>

                  {!chapter.collapsed && (
                    <div className="mt-2 space-y-1 border-l-2 border-slate-800 pl-5">
                      {chapter.levels.length === 0 && <p className="text-[11px] italic text-slate-600">No levels yet.</p>}
                      {chapter.levels.map((level) => (
                        <div key={level.id} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/5">
                          <span className={cn('h-1.5 w-1.5 rounded-full', level.completed ? 'bg-emerald-400' : 'bg-slate-600')} />
                          <Editable
                            id={`lvl-${level.id}`}
                            value={level.name}
                            focusId={focusId}
                            onCommit={(v) => renameLevel(subject.id, section.id, chapter.id, level.id, v)}
                            className="flex-1 text-sm text-slate-300"
                          />
                          <button
                            onClick={() => deleteLevel(subject.id, section.id, chapter.id, level.id)}
                            className="text-slate-600 hover:text-rose-400"
                          >
                            <IconX width={13} height={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button
        onClick={() => {
          const id = addSection(subject.id);
          setFocusId(`sec-${id}`);
        }}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-700 py-4 text-sm font-bold text-slate-400 hover:border-indigo-500 hover:text-indigo-300"
      >
        <IconPlus width={16} height={16} /> Add Section
      </button>

      {confirmDeleteSection && (
        <ConfirmModal
          title="Delete section?"
          message="All chapters and levels within this section will be removed."
          onClose={() => setConfirmDeleteSection(null)}
          onConfirm={() => {
            deleteSection(subject.id, confirmDeleteSection);
            pushToast('Section deleted');
          }}
        />
      )}

      {confirmDeleteChapter && (
        <ConfirmModal
          title="Delete chapter?"
          message="All levels within this chapter will be removed."
          onClose={() => setConfirmDeleteChapter(null)}
          onConfirm={() => {
            deleteChapter(subject.id, confirmDeleteChapter.sectionId, confirmDeleteChapter.chapterId);
            pushToast('Chapter deleted');
          }}
        />
      )}

      {seriesEditor && (
        <SeriesEditorModal
          sectionName={subject.sections.find((s) => s.id === seriesEditor)?.name ?? ''}
          series={subject.sections.find((s) => s.id === seriesEditor)?.levelSeries ?? []}
          onClose={() => setSeriesEditor(null)}
          onSave={(series) => {
            updateSeries(subject.id, seriesEditor, series);
            pushToast('Level series updated');
          }}
        />
      )}
    </div>
  );
}
