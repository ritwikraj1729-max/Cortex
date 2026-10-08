import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/Button';

interface LevelPopoverProps {
  anchor: DOMRect;
  chapterName: string;
  levelName: string;
  completed: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function LevelPopover({ anchor, chapterName, levelName, completed, onToggle, onClose }: LevelPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick, true);
    };
  }, [onClose]);

  const width = 220;
  let left = anchor.left + anchor.width / 2 - width / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
  const showAbove = anchor.top > 200;
  const top = showAbove ? anchor.top - 12 : anchor.bottom + 12;

  return createPortal(
    <div
      ref={ref}
      className="fixed z-50 animate-[pop_0.12s_ease] rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-[0_6px_0_0_rgba(0,0,0,0.35)]"
      style={{ left, width, top: showAbove ? undefined : top, bottom: showAbove ? window.innerHeight - top : undefined }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{chapterName}</p>
      <p className="mt-1 font-display text-base font-bold text-slate-50">{levelName}</p>
      <Button variant={completed ? 'secondary' : 'primary'} size="sm" className="mt-3 w-full" onClick={onToggle}>
        {completed ? 'Mark Incomplete' : 'Mark Complete'}
      </Button>
    </div>,
    document.body
  );
}
