import { useState } from 'react';
import { useApp } from '../../store/AppStore';
import { subjectProgress } from '../../utils/progress';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Chip';
import { IconPlus } from '../ui/Icons';
import { SubjectFormModal } from './SubjectFormModal';

export function JourneyGrid() {
  const { subjects, addSubject, openSubject, pushToast } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="h-full overflow-y-auto px-8 py-7">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Academics</p>
          <h1 className="font-display text-3xl font-extrabold text-slate-50">Journey</h1>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          <IconPlus width={16} height={16} /> New Subject
        </Button>
      </header>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
        {subjects.map((s) => {
          const p = subjectProgress(s);
          return (
            <button
              key={s.id}
              onClick={() => openSubject(s.id)}
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-left transition hover:border-indigo-500/50 hover:bg-slate-900"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-3xl">{s.symbol}</div>
              <h3 className="mt-3 truncate font-display text-lg font-bold text-slate-50">{s.name}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge className="border-slate-700 bg-slate-800 text-slate-300">
                  {s.sectionMode === 'single' ? 'Single Section' : 'Multi Section'}
                </Badge>
                <Badge className="border-slate-700 bg-slate-800 text-slate-300">
                  {s.levelMode === 'simple' ? 'Simple' : 'Complex'}
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                <span>Progress</span>
                <span className="font-semibold text-slate-300">
                  {p.done}/{p.total} · {p.pct}%
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400" style={{ width: `${p.pct}%` }} />
              </div>
            </button>
          );
        })}
      </div>

      {showAdd && (
        <SubjectFormModal
          onClose={() => setShowAdd(false)}
          onSubmit={(data) => {
            addSubject(data);
            pushToast('Subject created');
          }}
        />
      )}
    </div>
  );
}
