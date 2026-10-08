import { useState } from 'react';
import { useApp } from '../store/AppStore';
import { StreakCard } from './streaks/StreakCard';
import { StreakFormModal } from './streaks/StreakFormModal';
import { Button } from './ui/Button';
import { IconPlus } from './ui/Icons';

export function StreaksPage() {
  const { streaks, addStreak, pushToast } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-hidden px-8 py-6">
      <header className="mb-5 flex shrink-0 items-center justify-between">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-400">Habits</p>
          <h1 className="font-display text-3xl font-extrabold text-slate-50">Streaks</h1>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          <IconPlus width={16} height={16} /> New Streak
        </Button>
      </header>

      <div
        className="grid min-h-0 flex-1 auto-rows-min grid-cols-2 content-start items-start gap-5 overflow-y-auto pb-2"
        style={{ gridAutoRows: 'min-content' }}
      >
        {streaks.map((s) => (
          <StreakCard key={s.id} streak={s} />
        ))}
        {streaks.length === 0 && (
          <p className="col-span-2 py-10 text-center text-sm italic text-slate-600">
            No streaks yet — create one to start tracking a habit.
          </p>
        )}
      </div>

      {showAdd && (
        <StreakFormModal
          onClose={() => setShowAdd(false)}
          onSubmit={(name, emoji, color) => {
            addStreak(name, emoji, color);
            pushToast('Streak created');
          }}
        />
      )}
    </div>
  );
}
