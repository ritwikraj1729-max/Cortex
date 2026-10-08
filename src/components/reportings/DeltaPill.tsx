export function DeltaPill({ delta, size = 'sm' }: { delta: number | null; size?: 'sm' | 'lg' }) {
  const flat = delta === null;
  const up = !flat && delta! >= 0;
  const cls = flat ? 'bg-slate-700/40 text-slate-400' : up ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold ${cls} ${size === 'lg' ? 'text-sm' : 'text-[11px]'}`}
    >
      {flat ? '—' : up ? '▲' : '▼'} {flat ? '' : `${up ? '+' : ''}${delta!.toFixed(1)}%`}
    </span>
  );
}
