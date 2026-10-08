import { useEffect, useState } from 'react';
import { useApp } from '../store/AppStore';
import type { SectionKey } from '../types';
import {
  IconDashboard,
  IconQuest,
  IconStreak,
  IconCalendar,
  IconJourney,
  IconReportings,
  IconDatabase,
} from './ui/Icons';
import { cn } from '../utils/cn';

const NAV: { key: SectionKey; label: string; icon: any }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: IconDashboard },
  { key: 'quest', label: 'Quest', icon: IconQuest },
  { key: 'streaks', label: 'Streaks', icon: IconStreak },
  { key: 'calendar', label: 'Calendar', icon: IconCalendar },
  { key: 'journey', label: 'Journey', icon: IconJourney },
  { key: 'reportings', label: 'Reportings', icon: IconReportings },
  { key: 'data', label: 'Data', icon: IconDatabase },
];

function LogoMark() {
  return (
    <div className="relative">
      <svg width={42} height={42} viewBox="0 0 48 48" className="drop-shadow-[0_3px_0_rgba(55,48,163,0.6)]">
        <defs>
          <linearGradient id="cortexMark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8e9aff" />
            <stop offset="55%" stopColor="#7c5cf0" />
            <stop offset="100%" stopColor="#d14ae0" />
          </linearGradient>
          <radialGradient id="cortexGlint" cx="0.3" cy="0.2" r="0.9">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#cortexMark)" />
        <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#cortexGlint)" />
        <path d="M32 16.5a10 10 0 100 15" stroke="#fff" strokeWidth="4.4" strokeLinecap="round" fill="none" />
        <circle cx="32" cy="16.5" r="2.7" fill="#fff" />
        <circle cx="32" cy="31.5" r="2.7" fill="#fff" />
        <circle cx="23.5" cy="24" r="3.2" fill="#fff" opacity="0.92" />
      </svg>
      <div className="absolute -inset-1.5 -z-10 rounded-2xl bg-violet-600/30 blur-lg" />
    </div>
  );
}

export function Sidebar() {
  const { activeSection, setActiveSection, closeSubject, closeReportingDetail, synced } = useApp();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  const date = now
    .toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
    .toUpperCase();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/[0.06] bg-[#0c0e15]/90 px-4 py-5 backdrop-blur">
      {/* Brand */}
      <div className="mb-7 flex items-center gap-3 px-1">
        <LogoMark />
        <div>
          <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text font-display text-[22px] font-extrabold leading-none tracking-tight text-transparent">
            Cortex
          </span>
          <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-[0.3em] text-slate-600">
            Academic OS
          </span>
        </div>
      </div>

      {/* Clock */}
      <div className="mb-7 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <div className="font-mono text-[26px] font-semibold tabular-nums leading-none text-slate-50">{time}</div>
        <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{date}</div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => {
                setActiveSection(item.key);
                if (item.key !== 'journey') closeSubject();
                if (item.key !== 'reportings') closeReportingDetail();
              }}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150',
                active
                  ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/5 text-indigo-200 ring-1 ring-indigo-400/30'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              )}
            >
              {active && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />}
              <Icon className={cn('transition-colors', active ? 'text-indigo-300' : 'text-slate-500 group-hover:text-slate-300')} />
              <span className={cn('font-mono text-[11px] font-semibold uppercase tracking-[0.14em]', active && 'text-indigo-200')}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Sync status */}
      <div className="flex items-center gap-2 px-2 pt-3">
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            synced ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]'
          )}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {synced ? 'Synced · :3007' : 'Offline mode'}
        </span>
      </div>
    </aside>
  );
}
