import type { Subject } from '../../types';
import { useApp } from '../../store/AppStore';
import { Button } from '../ui/Button';

interface TableModeProps {
  subject: Subject;
  sectionIndex: number;
  setSectionIndex: (i: number) => void;
}

export function TableMode({ subject, sectionIndex, setSectionIndex }: TableModeProps) {
  const { toggleLevel } = useApp();
  const section = subject.sections[sectionIndex];
  if (!section) return null;
  const series = section.levelSeries ?? [];

  return (
    <div className="pb-10">
      <h2 className="mb-5 font-display text-xl font-extrabold text-slate-100">{section.name}</h2>
      {section.chapters.length === 0 ? (
        <p className="text-sm italic text-slate-600">No chapters yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/70">
                <th className="sticky left-0 bg-slate-900/70 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                  Chapter
                </th>
                {series.map((name) => (
                  <th key={name} className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-400">
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.chapters.map((chapter, ci) => (
                <tr key={chapter.id} className={ci % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/10'}>
                  <td className="sticky left-0 border-t border-slate-800 bg-inherit px-4 py-3 font-semibold text-slate-200">{chapter.name}</td>
                  {series.map((_, li) => {
                    const level = chapter.levels[li];
                    if (!level) return <td key={li} className="border-t border-slate-800 px-4 py-3 text-center" />;
                    return (
                      <td key={li} className="border-t border-slate-800 px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={level.completed}
                          onChange={() => toggleLevel(subject.id, section.id, chapter.id, level.id)}
                          className="h-4 w-4 cursor-pointer accent-indigo-500"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {subject.sections.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="secondary" disabled={sectionIndex === 0} onClick={() => setSectionIndex(sectionIndex - 1)}>
            ← Previous Section
          </Button>
          <Button variant="secondary" disabled={sectionIndex === subject.sections.length - 1} onClick={() => setSectionIndex(sectionIndex + 1)}>
            Next Section →
          </Button>
        </div>
      )}
    </div>
  );
}
