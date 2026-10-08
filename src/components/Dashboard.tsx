import { useApp } from '../store/AppStore';
import { ProgressRing } from './ui/ProgressRing';
import { subjectProgress, overallJourneyProgress } from '../utils/progress';
import { todayISO } from '../utils/date';

function pct(done: number, total: number) {
  return total ? Math.round((done / total) * 100) : 0;
}

export function Dashboard() {
  const { subjects, futureTasks, streaks, reportings } = useApp();
  const todaysQuests = futureTasks.filter((t) => t.date === todayISO());

  const overall = overallJourneyProgress(subjects);
  const todayDone = todaysQuests.filter((q) => q.completed).length;
  const todayTotal = todaysQuests.length;
  const urgent = todaysQuests.filter((q) => q.category === 'urgent-important');
  const urgentDone = urgent.filter((q) => q.completed).length;

  const pinnedStreak = streaks.find((s) => s.pinned);
  const pinnedReporting = reportings.find((r) => r.pinned);

  let delta: number | null = null;
  if (pinnedReporting && pinnedReporting.entries.length >= 1) {
    const sorted = [...pinnedReporting.entries].sort((a, b) => a.date.localeCompare(b.date));
    const last = sorted[sorted.length - 1];
    const prev = sorted[sorted.length - 2];
    if (prev && prev.value !== 0) delta = ((last.value - prev.value) / prev.value) * 100;
  }

  return (
    <div className="h-full overflow-y-auto px-8 py-7">
      <header className="mb-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-400">Overview</p>
        <h1 className="font-display text-3xl font-extrabold text-slate-50">Dashboard</h1>
      </header>

      <div className="grid grid-cols-3 gap-5">
        {/* Overall Progress */}
        <Card>
          <CardLabel>Overall Progress</CardLabel>
          <div className="mt-3 flex items-center gap-5">
            <ProgressRing pct={overall.pct} color="#818cf8">
              <span className="font-display text-xl font-extrabold text-slate-50">{overall.pct}%</span>
            </ProgressRing>
            <div>
              <p className="font-display text-3xl font-extrabold text-slate-50">
                {overall.done}
                <span className="text-lg text-slate-500"> / {overall.total}</span>
              </p>
              <p className="text-xs text-slate-500">levels completed</p>
            </div>
          </div>
        </Card>

        {/* Today's quests */}
        <Card>
          <CardLabel>Today's Quests</CardLabel>
          <p className="mt-3 font-display text-4xl font-extrabold text-slate-50">
            {todayDone}
            <span className="text-xl text-slate-500">/{todayTotal}</span>
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {todayTotal - todayDone === 0 ? 'All done! 🎉' : `${todayTotal - todayDone} remaining today`}
          </p>
          <Bar pct={pct(todayDone, todayTotal)} color="#818cf8" />
        </Card>

        {/* Urgent & Important */}
        <Card>
          <CardLabel>Urgent &amp; Important</CardLabel>
          <p className="mt-3 font-display text-4xl font-extrabold text-slate-50">
            {urgentDone}
            <span className="text-xl text-slate-500">/{urgent.length}</span>
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {urgent.length - urgentDone === 0 ? 'All done! 🎉' : `${urgent.length - urgentDone} remaining today`}
          </p>
          <Bar pct={pct(urgentDone, urgent.length)} color="#fb7185" />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-12 gap-5">
        {/* Subject progress bar chart */}
        <Card className="col-span-8">
          <CardLabel>Subject Progress</CardLabel>
          <div className="mt-5 flex h-48 items-end gap-6 px-2">
            {subjects.map((s) => {
              const p = subjectProgress(s);
              return (
                <div key={s.id} className="flex h-full flex-1 flex-col items-center justify-end">
                  <span className="mb-1 text-xs font-bold text-slate-300">{p.pct}%</span>
                  <div className="relative flex w-full flex-1 items-end justify-center">
                    <div
                      className="w-10 rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-400 shadow-[0_3px_0_0_#3730a3]"
                      style={{ height: `${Math.max(4, p.pct)}%` }}
                    />
                  </div>
                  <span className="mt-2 max-w-[80px] truncate text-center text-xs font-semibold text-slate-300">
                    {s.symbol} {s.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {p.done}/{p.total}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Pinned */}
        <Card className="col-span-4">
          <CardLabel>Pinned</CardLabel>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-5 text-center">
              {pinnedStreak ? (
                <>
                  <span className="text-2xl">{pinnedStreak.emoji}</span>
                  <span className="mt-2 font-display text-3xl font-extrabold text-slate-50">
                    {pinnedStreak.dates.length}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    {pinnedStreak.dates.length === 1 ? 'Day' : 'Days'}
                  </span>
                  <span className="mt-1 truncate text-[11px] text-slate-400">{pinnedStreak.name}</span>
                </>
              ) : (
                <span className="text-xs italic text-slate-500">Not pinned</span>
              )}
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-5 text-center">
              {pinnedReporting ? (
                <>
                  <span className={`text-2xl ${delta === null ? 'text-slate-500' : delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {delta === null ? '—' : delta >= 0 ? '▲' : '▼'}
                  </span>
                  <span className="mt-2 font-display text-2xl font-extrabold text-slate-50">
                    {delta === null ? '—' : `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`}
                  </span>
                  <span className="mt-1 truncate text-[11px] text-slate-400">{pinnedReporting.name}</span>
                </>
              ) : (
                <span className="text-xs italic text-slate-500">Not pinned</span>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/50 p-5 shadow-[0_3px_0_0_rgba(0,0,0,0.25)] ${className}`}>
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{children}</p>;
}

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}
