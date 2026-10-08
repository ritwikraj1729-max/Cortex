import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { IconChevronDown } from './Icons';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function Select({ value, options, onChange, className, placeholder = 'Select' }: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full min-w-[160px] items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-xs font-semibold tracking-wide transition-all',
          'border-white/10 bg-white/[0.04] text-slate-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]',
          'hover:border-white/20 hover:bg-white/[0.06]',
          open && 'border-indigo-400/50 bg-white/[0.06] ring-4 ring-indigo-500/15'
        )}
      >
        <span className={cn('truncate', !selected && 'text-slate-500')}>{selected?.label ?? placeholder}</span>
        <IconChevronDown
          width={14}
          height={14}
          className={cn('shrink-0 text-slate-400 transition-transform duration-150', open && 'rotate-180 text-indigo-300')}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 min-w-full overflow-hidden rounded-xl border border-white/10 bg-[#161824] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)] animate-[pop_0.14s_cubic-bezier(0.34,1.56,0.64,1)]">
          <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
          <div className="max-h-64 overflow-y-auto p-1.5">
            {options.map((o) => {
              const active = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition',
                    active ? 'bg-indigo-500/20 text-indigo-200' : 'text-slate-300 hover:bg-white/5 hover:text-slate-50'
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {active && <span className="ml-3 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
