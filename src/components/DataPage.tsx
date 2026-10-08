import { useRef, useState } from 'react';
import { useApp } from '../store/AppStore';
import { Button } from './ui/Button';
import { IconDownload, IconUpload, IconRefresh, IconDatabase } from './ui/Icons';
import { ConfirmModal } from './ui/ConfirmModal';
import { overallJourneyProgress } from '../utils/progress';
import { todayISO } from '../utils/date';
import { cn } from '../utils/cn';

export function DataPage() {
  const app = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const levelTotals = overallJourneyProgress(app.subjects);

  const stats: { label: string; value: number }[] = [
    { label: 'Daily quests', value: app.futureTasks.filter((t) => t.date === todayISO()).length },
    { label: 'Weekly goals', value: app.weekly.length },
    { label: 'Monthly goals', value: app.monthly.length },

    { label: 'Planner tasks', value: app.futureTasks.length },
    { label: 'Streaks', value: app.streaks.length },
    { label: 'Events', value: app.events.length },
    { label: 'Subjects', value: app.subjects.length },
    { label: 'Levels', value: levelTotals.total },
    { label: 'Reportings', value: app.reportings.length },
  ];

  function handleExport() {
    const blob = new Blob([JSON.stringify(app.exportData(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cortex-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    app.pushToast('Backup exported');
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const ok = app.importData(parsed);
      app.pushToast(ok ? 'Data imported' : 'Invalid backup file');
    } catch {
      app.pushToast('Could not read file');
    }
  }

  return (
    <div className="h-full overflow-y-auto px-8 py-7">
      <header className="mb-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-400">Storage</p>
        <h1 className="font-display text-3xl font-extrabold text-slate-50">Data</h1>
      </header>

      <div className="grid max-w-4xl grid-cols-3 gap-5">
        <DataCard
          title="Export"
          desc="Download everything as a portable JSON backup file."
          action={
            <Button variant="primary" size="sm" onClick={handleExport}>
              <IconDownload width={14} height={14} /> Export JSON
            </Button>
          }
        />
        <DataCard
          title="Import"
          desc="Restore a previous backup. This replaces all current data."
          action={
            <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
              <IconUpload width={14} height={14} /> Import JSON
            </Button>
          }
        />
        <DataCard
          title="Reset"
          desc="Restore the original sample data. All changes are lost."
          danger
          action={
            <Button variant="danger" size="sm" onClick={() => setConfirmReset(true)}>
              <IconRefresh width={14} height={14} /> Reset Data
            </Button>
          }
        />
      </div>

      <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleFile} />

      <div className="mt-6 max-w-4xl rounded-2xl border border-white/[0.06] bg-slate-900/50 p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <IconDatabase className="text-slate-400" width={16} height={16} />
          <h2 className="font-display text-base font-bold text-slate-50">Storage Overview</h2>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-slate-400">
          When running via <span className="font-mono text-indigo-300">start.bat</span> on{' '}
          <span className="font-mono text-indigo-300">localhost:3007</span>, every change auto-saves to{' '}
          <span className="font-mono text-indigo-300">cortex-data.json</span> next to the app. Use Export to create
          portable backups and Import to move data between machines.
        </p>

        <div className="grid grid-cols-5 gap-2.5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
              <p className="font-display text-xl font-extrabold tabular-nums text-slate-100">{s.value}</p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {confirmReset && (
        <ConfirmModal
          title="Reset all data?"
          message="Everything will be replaced with the original sample data. This can't be undone."
          confirmLabel="Reset"
          onClose={() => setConfirmReset(false)}
          onConfirm={() => {
            app.resetData();
            app.pushToast('Data reset to samples');
          }}
        />
      )}
    </div>
  );
}

function DataCard({
  title,
  desc,
  action,
  danger,
}: {
  title: string;
  desc: string;
  action: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border bg-slate-900/50 p-5 transition-colors',
        danger ? 'border-rose-500/20 hover:border-rose-500/40' : 'border-white/[0.06] hover:border-indigo-500/30'
      )}
    >
      <h3 className="font-display text-base font-bold text-slate-50">{title}</h3>
      <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-400">{desc}</p>
      <div className="mt-4">{action}</div>
    </div>
  );
}
