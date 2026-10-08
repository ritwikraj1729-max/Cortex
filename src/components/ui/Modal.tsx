import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconX } from './Icons';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}

export function Modal({ title, onClose, children, footer, width = 440 }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-[fadeIn_0.15s_ease]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#141622] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.02)] animate-[pop_0.18s_cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ maxWidth: width }}
      >
        {/* gradient accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

        <div className="flex items-center justify-between px-6 pb-4 pt-5">
          <div>
            <h3 className="font-display text-lg font-extrabold leading-tight text-slate-50">{title}</h3>
            <div className="mt-1.5 h-[3px] w-8 rounded-full bg-indigo-500/60" />
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 text-slate-500 transition hover:border-white/15 hover:bg-white/5 hover:text-slate-200"
          >
            <IconX width={15} height={15} />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-6 pb-5 pt-1">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] bg-white/[0.015] px-6 py-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-white/15 focus:border-indigo-400/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-500/15';
