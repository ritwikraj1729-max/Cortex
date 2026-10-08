import { useEffect, useMemo, useRef, useState } from 'react';
import type { Streak } from '../../types';
import { Heatmap } from './Heatmap';
import { currentStreakLength, bestStreakLength } from '../../utils/streakStats';
import { useApp } from '../../store/AppStore';
import { IconPin, IconPencil, IconRefresh, IconTrash } from '../ui/Icons';
import { Badge } from '../ui/Chip';
import { StreakFormModal } from './StreakFormModal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { cn } from '../../utils/cn';
import { addDays, toISODate } from '../../utils/date';

function IconDots(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}

function IconFlame(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.9 2.2c.4 2.6-.9 4-2.4 5.4C8.8 9.2 7 10.8 7 14a5 5 0 0010 0c0-2.2-1-3.6-2-4.8-.2 1.2-.9 2-1.8 2.2.8-2.9.4-6.5-1.3-9.2z" />
      <path d="M12 21.5a2.8 2.8 0 002.8-2.8c0-2-2.2-2.7-2.2-4.6-1.4 1.1-2.3 2.4-2.3 3.9a2.6 2.6 0 001.7 3.5z" opacity=".75" />
    </svg>
  );
}

export function StreakCard({ streak }: { streak: Streak }) {
  const { pinStreak, updateStreak, deleteStreak, resetStreak, toggleStreakDate, pushToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const current = currentStreakLength(streak.dates);
  const best = bestStreakLength(streak.dates);
  const total = streak.dates.length;

  // 30-day consistency: active days out of the last 30 calendar days
  const consistency = useMemo(() => {
    const set = new Set(streak.dates);
    let active = 0;
    for (let i = 0; i < 30; i++) {
      if (set.has(toISODate(addDays(new Date(), -i)))) active += 1;
    }
    return Math.round((active / 30) * 100);
  }, [streak.dates]);

  return (
    <div className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900/50 p-5 shadow-[0_3px_0_0_rgba(0,0,0,0.25)] transition-all duration-200 hover:border-white/[0.14] hover:bg-slate-900/70 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)]">
      {/* colour wash tied to the streak theme */}
      <div
        className="pointer-events-none absolute -right-16 -top-24 h-48 w-48 rounded-full opacity-[0.10] blur-3xl transition-opacity group-hover:opacity-[0.18]"
        style={{ background: streak.color }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${streak.color}, transparent)` }}
      />

      {/* header */}
      <div className="relative flex items-center gap-3">
        <div
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] text-2xl"
          style={{
            background: `linear-gradient(150deg, ${streak.color}33, ${streak.color}14)`,
            border: `1px solid ${streak.color}4d`,
            boxShadow: `0 8px 22px -10px ${streak.color}`,
          }}
        >
          {streak.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-[17px] font-bold tracking-[-0.01em] text-slate-50">{streak.name}</h3>
            {streak.pinned && <Badge className="border-amber-400/40 bg-amber-400/12 text-amber-300">Pinned</Badge>}
          </div>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">
            Best {best} · Total {total} active
          </p>
        </div>

        {/* three-dot menu */}
        <div ref={menuRef} className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            title="More actions"
            aria-label="More actions"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl border transition',
              menuOpen
                ? 'border-white/15 bg-white/10 text-white'
                : 'border-transparent text-slate-500 hover:border-white/[0.08] hover:bg-white/[0.06] hover:text-slate-100'
            )}
          >
            <IconDots />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-30 flex animate-[pop_0.14s_ease] gap-1 rounded-xl border border-white/10 bg-[#171a28] p-1.5 shadow-[0_18px_44px_-8px_rgba(0,0,0,0.85)]">
              <MenuIcon
                label={streak.pinned ? 'Unpin' : 'Pin'}
                active={streak.pinned}
                onClick={() => {
                  pinStreak(streak.id);
                  pushToast(streak.pinned ? 'Unpinned' : 'Pinned');
                  setMenuOpen(false);
                }}
              >
                <IconPin width={16} height={16} />
              </MenuIcon>
              <MenuIcon
                label="Edit"
                onClick={() => {
                  setEditing(true);
                  setMenuOpen(false);
                }}
              >
                <IconPencil width={16} height={16} />
              </MenuIcon>
              <MenuIcon
                label="Reset"
                onClick={() => {
                  setConfirmReset(true);
                  setMenuOpen(false);
                }}
              >
                <IconRefresh width={16} height={16} />
              </MenuIcon>
              <MenuIcon
                label="Delete"
                danger
                onClick={() => {
                  setConfirmDelete(true);
                  setMenuOpen(false);
                }}
              >
                <IconTrash width={16} height={16} />
              </MenuIcon>
            </div>
          )}
        </div>
      </div>

      {/* current streak hero */}
      <div
        className="relative mt-4 flex items-end gap-4 rounded-2xl border px-4 py-3.5"
        style={{
          borderColor: `${streak.color}33`,
          background: `linear-gradient(120deg, ${streak.color}1f, ${streak.color}08 55%, transparent)`,
        }}
      >
        <div className="flex items-baseline gap-1.5">
          <IconFlame
            width={26}
            height={26}
            className="translate-y-0.5"
            style={{ color: streak.color, filter: `drop-shadow(0 4px 10px ${streak.color}66)` }}
          />
          <span className="font-display text-[42px] font-extrabold leading-none tracking-[-0.035em] tabular-nums text-white">
            {current}
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {current === 1 ? 'day' : 'days'}
          </span>
        </div>

        <div className="ml-auto flex items-stretch gap-4">
          <HeroStat label="Best" value={`${best}`} />
          <div className="w-px bg-white/10" />
          <HeroStat label="Active" value={`${total}`} />
          <div className="w-px bg-white/10" />
          <HeroStat label="30d" value={`${consistency}%`} tone={consistency >= 80 ? streak.color : undefined} />
        </div>
      </div>

      {/* heatmap */}
      <div className="relative mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.022] p-3">
        <Heatmap dates={streak.dates} color={streak.color} onToggle={(d) => toggleStreakDate(streak.id, d)} />

        {/* GitHub-style legend */}
        <div className="mt-2.5 flex items-center justify-end gap-1.5 pr-1">
          <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-600">Less</span>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="h-[9px] w-[9px] rounded-[2px]"
              style={{
                background: i === 0 ? 'rgba(255,255,255,0.055)' : `${streak.color}${['', '33', '66', '99', 'ff'][i]}`,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
              }}
            />
          ))}
          <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-600">More</span>
        </div>
      </div>

      {editing && (
        <StreakFormModal
          initial={streak}
          onClose={() => setEditing(false)}
          onSubmit={(name, emoji, color) => {
            updateStreak(streak.id, { name, emoji, color });
            pushToast('Streak updated');
          }}
        />
      )}

      {confirmReset && (
        <ConfirmModal
          title="Reset streak?"
          message={`This clears all history for "${streak.name}". This can't be undone.`}
          confirmLabel="Reset"
          onClose={() => setConfirmReset(false)}
          onConfirm={() => {
            resetStreak(streak.id);
            pushToast('Streak reset');
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete streak?"
          message={`"${streak.name}" will be permanently removed.`}
          onClose={() => setConfirmDelete(false)}
          onConfirm={() => {
            deleteStreak(streak.id);
            pushToast('Streak deleted');
          }}
        />
      )}
    </div>
  );
}

function HeroStat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="text-right">
      <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p
        className="mt-0.5 font-display text-lg font-extrabold leading-none tabular-nums"
        style={{ color: tone ?? 'rgb(226 232 240)' }}
      >
        {value}
      </p>
    </div>
  );
}

function MenuIcon({
  children,
  label,
  onClick,
  danger,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  active?: boolean;
}) {
  return (
    <button
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg transition',
        active
          ? 'bg-amber-400/15 text-amber-300'
          : danger
            ? 'text-slate-400 hover:bg-rose-500/15 hover:text-rose-400'
            : 'text-slate-400 hover:bg-white/[0.08] hover:text-slate-100'
      )}
    >
      {children}
    </button>
  );
}
