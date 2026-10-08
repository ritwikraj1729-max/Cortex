import { useState } from 'react';
import { useApp } from '../../store/AppStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Chip';
import { IconPlus } from '../ui/Icons';
import { Sparkline } from './Sparkline';
import { DeltaPill } from './DeltaPill';
import { sortedEntries, deltaPct } from '../../utils/reportingStats';
import { ReportingFormModal } from './ReportingFormModal';

export function ReportingsGrid() {
  const app = useApp();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="h-full overflow-y-auto px-8 py-7">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Insights</p>
          <h1 className="font-display text-3xl font-extrabold text-slate-50">Reportings</h1>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          <IconPlus width={16} height={16} /> New Reporting
        </Button>
      </header>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
        {app.reportings.map((r) => {
          const sorted = sortedEntries(r.entries);
          const latest = sorted[sorted.length - 1];
          const delta = deltaPct(r.entries);
          return (
            <button
              key={r.id}
              onClick={() => app.openReportingDetail(r.id)}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-left transition hover:border-indigo-500/50 hover:bg-slate-900"
            >
              <div className="h-1.5 w-12 rounded-full" style={{ background: r.color }} />
              <div className="mt-3 flex items-center gap-2">
                <h3 className="truncate font-display text-base font-bold text-slate-50">{r.name}</h3>
                {r.pinned && <Badge className="border-amber-500/40 bg-amber-500/15 text-amber-300">Pinned</Badge>}
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{r.description}</p>
              <div className="mt-3">
                <Sparkline values={sorted.map((e) => e.value)} color={r.color} />
              </div>
              <div className="mt-3 flex items-end justify-between border-t border-slate-800 pt-3">
                <div>
                  <p className="font-display text-2xl font-extrabold text-slate-50">{latest ? latest.value : '—'}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{r.unit}</p>
                </div>
                <DeltaPill delta={delta} />
              </div>
            </button>
          );
        })}
      </div>

      {showAdd && (
        <ReportingFormModal
          onClose={() => setShowAdd(false)}
          onSubmit={(data) => {
            app.addReporting(data);
            app.pushToast('Reporting created');
          }}
        />
      )}
    </div>
  );
}
