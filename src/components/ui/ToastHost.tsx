import { useApp } from '../../store/AppStore';

export function ToastHost() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-[slideUp_0.2s_ease] rounded-full border border-slate-700 bg-slate-800/95 px-4 py-2 text-xs font-semibold text-slate-100 shadow-[0_4px_0_0_rgba(0,0,0,0.3)]"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
