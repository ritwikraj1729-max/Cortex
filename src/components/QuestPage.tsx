import { useState } from 'react';
import { DailyTab } from './quest/DailyTab';
import { WeeklyTab } from './quest/WeeklyTab';
import { MonthlyTab } from './quest/MonthlyTab';
import { cn } from '../utils/cn';

type Tab = 'daily' | 'weekly' | 'monthly';

const TABS: { key: Tab; label: string }[] = [
  { key: 'daily', label: 'Daily Quests' },
  { key: 'weekly', label: 'Weekly Quests' },
  { key: 'monthly', label: 'Monthly Quests' },
];

export function QuestPage() {
  const [tab, setTab] = useState<Tab>('daily');

  return (
    <div className="h-full overflow-y-auto px-8 py-7">
      <header className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Tasks</p>
        <h1 className="font-display text-3xl font-extrabold text-slate-50">Quest</h1>
      </header>

      <div className="mb-6 inline-flex rounded-xl border border-slate-800 bg-slate-900/60 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all',
              tab === t.key ? 'bg-indigo-500 text-white shadow-[0_2px_0_0_#3730a3]' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'daily' && <DailyTab />}
      {tab === 'weekly' && <WeeklyTab />}
      {tab === 'monthly' && <MonthlyTab />}
    </div>
  );
}
