import { useState } from 'react';
import { useApp } from '../../store/AppStore';
import { Button, IconButton } from '../ui/Button';
import { IconChevronLeft, IconPencil, IconPin, IconTrash, IconPlus, IconX } from '../ui/Icons';
import { ConfirmModal } from '../ui/ConfirmModal';
import { LineChart } from './LineChart';
import { DeltaPill } from './DeltaPill';
import { ReportingFormModal } from './ReportingFormModal';
import { EntryFormModal } from './EntryFormModal';
import { sortedEntries, deltaForIndex } from '../../utils/reportingStats';
import { formatFullDate } from '../../utils/date';
import type { Entry } from '../../types';

export function ReportingDetail({ reportingId }: { reportingId: string }) {
  const { reportings, closeReportingDetail, pinReporting, updateReporting, deleteReporting, addEntry, updateEntry, deleteEntry, pushToast } = useApp();
  const reporting = reportings.find((r) => r.id === reportingId);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addEntryOpen, setAddEntryOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);

  if (!reporting) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        Reporting not found.
        <Button variant="secondary" onClick={closeReportingDetail} className="ml-3">
          Back
        </Button>
      </div>
    );
  }

  const sorted = sortedEntries(reporting.entries);
  const latest = sorted[sorted.length - 1];
  const latestDelta = sorted.length >= 2 ? deltaForIndex(sorted, sorted.length - 1) : null;

  return (
    <div className="h-full overflow-y-auto px-8 py-7">
      <button
        onClick={closeReportingDetail}
        className="mb-5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400 hover:text-slate-100"
      >
        <IconChevronLeft width={14} height={14} /> Back to All Reportings
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-50">{reporting.name}</h1>
          <p className="text-xs text-slate-500">
            {reporting.description} · {reporting.entries.length} entries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => { pinReporting(reporting.id); pushToast(reporting.pinned ? 'Unpinned' : 'Pinned'); }}>
            <IconPin width={14} height={14} /> {reporting.pinned ? 'Unpin' : 'Pin'}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
            <IconPencil width={14} height={14} /> Edit
          </Button>
          <IconButton variant="danger" onClick={() => setConfirmDelete(true)}>
            <IconTrash width={15} height={15} />
          </IconButton>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="h-1.5 w-16 rounded-full" style={{ background: reporting.color }} />
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div>
            <span className="font-display text-5xl font-extrabold" style={{ color: reporting.color }}>
              {latest ? latest.value : '—'}
            </span>
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{reporting.unit}</p>
          </div>
          <DeltaPill delta={latestDelta} size="lg" />
        </div>
        {latest && (
          <p className="mt-2 text-sm text-slate-400">
            {latest.label} · {formatFullDate(new Date(latest.date))}
          </p>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <LineChart entries={reporting.entries} color={reporting.color} unit={reporting.unit} />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-slate-50">Entries</h2>
        </div>
        <div className="space-y-2">
          {[...sorted].reverse().map((e, idxFromEnd) => {
            const idx = sorted.length - 1 - idxFromEnd;
            const delta = deltaForIndex(sorted, idx);
            return (
              <div key={e.id} className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                <div className="w-20 shrink-0">
                  <span className="font-display text-lg font-extrabold text-slate-50">{e.value}</span>
                  <span className="ml-1 text-[10px] uppercase text-slate-500">{reporting.unit}</span>
                </div>
                <p className="flex-1 truncate text-sm text-slate-300">{e.label}</p>
                <p className="w-24 shrink-0 text-xs text-slate-500">{formatFullDate(new Date(e.date))}</p>
                {idx > 0 && <DeltaPill delta={delta} />}
                <button onClick={() => setEditEntry(e)} className="text-slate-500 hover:text-slate-200">
                  <IconPencil width={14} height={14} />
                </button>
                <button onClick={() => setDeleteEntryId(e.id)} className="text-slate-500 hover:text-rose-400">
                  <IconX width={14} height={14} />
                </button>
              </div>
            );
          })}
          {sorted.length === 0 && <p className="py-6 text-center text-sm italic text-slate-600">No entries yet.</p>}
        </div>
        <Button variant="secondary" className="mt-4" onClick={() => setAddEntryOpen(true)}>
          <IconPlus width={14} height={14} /> Add Entry
        </Button>
      </div>

      {editing && (
        <ReportingFormModal
          initial={reporting}
          onClose={() => setEditing(false)}
          onSubmit={(data) => {
            updateReporting(reporting.id, data);
            pushToast('Reporting updated');
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete reporting?"
          message={`"${reporting.name}" and all of its entries will be permanently removed.`}
          onClose={() => setConfirmDelete(false)}
          onConfirm={() => {
            deleteReporting(reporting.id);
            closeReportingDetail();
            pushToast('Reporting deleted');
          }}
        />
      )}

      {addEntryOpen && (
        <EntryFormModal
          onClose={() => setAddEntryOpen(false)}
          onSubmit={(data) => {
            addEntry(reporting.id, data);
            pushToast('Entry added');
          }}
        />
      )}

      {editEntry && (
        <EntryFormModal
          initial={editEntry}
          onClose={() => setEditEntry(null)}
          onSubmit={(data) => {
            updateEntry(reporting.id, editEntry.id, data);
            pushToast('Entry updated');
          }}
        />
      )}

      {deleteEntryId && (
        <ConfirmModal
          title="Delete entry?"
          message="This entry will be permanently removed."
          onClose={() => setDeleteEntryId(null)}
          onConfirm={() => {
            deleteEntry(reporting.id, deleteEntryId);
            pushToast('Entry deleted');
          }}
        />
      )}
    </div>
  );
}
