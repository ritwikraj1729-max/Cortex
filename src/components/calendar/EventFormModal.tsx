import { useState } from 'react';
import { Modal, Field, inputClass } from '../ui/Modal';
import { Button, IconButton } from '../ui/Button';
import { COLOR_SWATCHES } from '../../utils/colors';
import { uid } from '../../utils/id';
import { todayISO } from '../../utils/date';
import { IconX, IconPlus } from '../ui/Icons';
import type { CalendarEvent } from '../../types';

interface EventFormModalProps {
  initial?: CalendarEvent;
  onClose: () => void;
  onSubmit: (ev: CalendarEvent) => void;
  onDelete?: () => void;
}

export function EventFormModal({ initial, onClose, onSubmit, onDelete }: EventFormModalProps) {
  const [mode, setMode] = useState<'simple' | 'complex'>(initial?.mode ?? 'simple');
  const [name, setName] = useState(initial?.name ?? '');
  const [color, setColor] = useState(initial?.color ?? COLOR_SWATCHES[0]);
  const [from, setFrom] = useState(initial && initial.mode === 'simple' ? initial.from : todayISO());
  const [to, setTo] = useState(initial && initial.mode === 'simple' ? initial.to : todayISO());
  const [dates, setDates] = useState<{ date: string; label: string }[]>(
    initial && initial.mode === 'complex' ? initial.dates : [{ date: todayISO(), label: '' }]
  );

  function submit() {
    if (!name.trim()) return;
    if (mode === 'simple') {
      onSubmit({ id: initial?.id ?? uid('ev'), mode: 'simple', name: name.trim(), color, from, to: to < from ? from : to });
    } else {
      onSubmit({ id: initial?.id ?? uid('ev'), mode: 'complex', name: name.trim(), color, dates: dates.filter((d) => d.date) });
    }
    onClose();
  }

  return (
    <Modal
      title={initial ? 'Edit Event' : 'New Event'}
      onClose={onClose}
      width={480}
      footer={
        <div className="flex w-full items-center justify-between">
          {onDelete ? (
            <Button
              variant="danger"
              onClick={() => {
                onDelete();
                onClose();
              }}
            >
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submit}>
              Save
            </Button>
          </div>
        </div>
      }
    >
      <Field label="Name">
        <input autoFocus className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>

      <Field label="Colour theme">
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="h-7 w-7 rounded-lg border-2"
              style={{ background: c, borderColor: color === c ? 'white' : 'transparent' }}
            />
          ))}
        </div>
      </Field>

      <Field label="Event type">
        <div className="flex gap-2">
          {(['simple', 'complex'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-bold capitalize ${
                mode === m ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300' : 'border-slate-700 text-slate-400 hover:bg-white/5'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </Field>

      {mode === 'simple' ? (
        <div className="grid grid-cols-2 gap-3">
          <Field label="From">
            <input type="date" className={inputClass} value={from} onChange={(e) => setFrom(e.target.value)} />
          </Field>
          <Field label="To">
            <input type="date" className={inputClass} value={to} onChange={(e) => setTo(e.target.value)} />
          </Field>
        </div>
      ) : (
        <Field label="Dates">
          <div className="max-h-56 space-y-2 overflow-y-auto">
            {dates.map((d, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="date"
                  className={inputClass}
                  value={d.date}
                  onChange={(e) => setDates((list) => list.map((x, idx) => (idx === i ? { ...x, date: e.target.value } : x)))}
                />
                <input
                  className={inputClass}
                  placeholder="Label"
                  value={d.label}
                  onChange={(e) => setDates((list) => list.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))}
                />
                <IconButton onClick={() => setDates((list) => list.filter((_, idx) => idx !== i))}>
                  <IconX width={14} height={14} />
                </IconButton>
              </div>
            ))}
          </div>
          <button
            onClick={() => setDates((list) => [...list, { date: todayISO(), label: '' }])}
            className="mt-2 flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
          >
            <IconPlus width={14} height={14} /> Add date
          </button>
        </Field>
      )}
    </Modal>
  );
}
