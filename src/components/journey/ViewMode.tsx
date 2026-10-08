import { useState } from 'react';
import type { Subject } from '../../types';
import { useApp } from '../../store/AppStore';
import { levelIconFor } from '../ui/Icons';
import { LevelPopover } from './LevelPopover';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface ViewModeProps {
  subject: Subject;
  sectionIndex: number;
  setSectionIndex: (i: number) => void;
}

interface PopoverState {
  subjectId: string;
  sectionId: string;
  chapterId: string;
  levelId: string;
  anchor: DOMRect;
}

export function ViewMode({ subject, sectionIndex, setSectionIndex }: ViewModeProps) {
  const { toggleLevel } = useApp();
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const section = subject.sections[sectionIndex];

  if (!section) return null;

  const popChapter = popover ? section.chapters.find((c) => c.id === popover.chapterId) : null;
  const popLevel = popChapter?.levels.find((l) => l.id === popover?.levelId);

  return (
    <div className="pb-10">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700" />
        <h2 className="font-display text-xl font-extrabold text-slate-100">{section.name}</h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700" />
      </div>

      <div className="space-y-12">
        {section.chapters.length === 0 && <p className="text-center text-sm italic text-slate-600">No chapters yet.</p>}
        {section.chapters.map((chapter) => (
          <div key={chapter.id}>
            <div className="mx-auto mb-8 flex max-w-sm items-center gap-3">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-300">
                {chapter.name}
              </span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="flex flex-col items-center gap-7">
              {chapter.levels.map((level, i) => {
                const offset = Math.round(Math.sin(i * 0.9) * 70);
                const Icon = levelIconFor(level.id);
                return (
                  <button
                    key={level.id}
                    style={{ transform: `translateX(${offset}px)` }}
                    onClick={(e) => {
                      const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                      setPopover({ subjectId: subject.id, sectionId: section.id, chapterId: chapter.id, levelId: level.id, anchor: rect });
                    }}
                    className="group relative flex h-16 w-16 items-center justify-center rounded-full"
                  >
                    <svg width={64} height={64} className="absolute -rotate-90">
                      <circle cx={32} cy={32} r={28} stroke="#1c2030" strokeWidth={5} fill="none" />
                      <circle
                        cx={32}
                        cy={32}
                        r={28}
                        stroke={level.completed ? '#34d399' : '#3b3f52'}
                        strokeWidth={5}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={level.completed ? 0 : 2 * Math.PI * 28 * 0.25}
                      />
                    </svg>
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-[0_3px_0_0_rgba(0,0,0,0.4)] transition-transform group-hover:scale-105 group-active:translate-y-[2px] group-active:shadow-none',
                        level.completed
                          ? 'border-emerald-300 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'
                          : 'border-slate-600 bg-slate-800 text-slate-500'
                      )}
                    >
                      <Icon width={20} height={20} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {subject.sections.length > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <Button variant="secondary" disabled={sectionIndex === 0} onClick={() => setSectionIndex(sectionIndex - 1)}>
            ← Previous Section
          </Button>
          <Button variant="secondary" disabled={sectionIndex === subject.sections.length - 1} onClick={() => setSectionIndex(sectionIndex + 1)}>
            Next Section →
          </Button>
        </div>
      )}

      {popover && popLevel && popChapter && (
        <LevelPopover
          anchor={popover.anchor}
          chapterName={popChapter.name}
          levelName={popLevel.name}
          completed={popLevel.completed}
          onToggle={() => {
            toggleLevel(popover.subjectId, popover.sectionId, popover.chapterId, popover.levelId);
          }}
          onClose={() => setPopover(null)}
        />
      )}
    </div>
  );
}
