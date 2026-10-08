import { useMemo, useState } from 'react';
import { useApp } from '../store/AppStore';
import { getMonthGrid, toISODate, formatMonthYear, formatFullDate, isSameDay } from '../utils/date';
import { eventsOnDate } from '../utils/events';
import { Button, IconButton } from './ui/Button';
import { IconChevronLeft, IconChevronRight, IconPlus, IconPencil, IconX } from './ui/Icons';
import { Select } from './ui/Select';
import { EventFormModal } from './calendar/EventFormModal';
import { ConfirmModal } from './ui/ConfirmModal';
import { cn } from '../utils/cn';
import type { CalendarEvent } from '../types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarPage() {
  const { events, addEvent, updateEvent, deleteEvent, pushToast } = useApp();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => toISODate(new Date()));
  const [filterId, setFilterId] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);
  const today = new Date();

  const visibleEvents = filterId === 'all' ? events : events.filter((e) => e.id === filterId);

  const selectedOccurrences = eventsOnDate(visibleEvents, selected);

  return (
    <div className="h-full overflow-y-auto px-8 py-7">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Schedule</p>
          <h1 className="font-display text-3xl font-extrabold text-slate-50">Calendar</h1>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          <IconPlus width={16} height={16} /> New Event
        </Button>
      </header>

      <div className="grid grid-cols-[1fr_340px] gap-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconButton onClick={() => setCursor(new Date(year, month - 1, 1))}>
                <IconChevronLeft width={16} height={16} />
              </IconButton>
              <h2 className="w-44 text-center font-display text-lg font-bold text-slate-50">{formatMonthYear(cursor)}</h2>
              <IconButton onClick={() => setCursor(new Date(year, month + 1, 1))}>
                <IconChevronRight width={16} height={16} />
              </IconButton>
            </div>
            <Select
              value={filterId}
              onChange={setFilterId}
              options={[
                { value: 'all', label: 'All events' },
                ...events.map((e) => ({ value: e.id, label: e.name })),
              ]}
            />
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-1.5">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map((d, i) => {
              const iso = toISODate(d);
              const inMonth = d.getMonth() === month;
              const isToday = isSameDay(d, today);
              const isSelected = iso === selected;
              const occ = eventsOnDate(visibleEvents, iso).slice(0, 4);
              return (
                <button
                  key={i}
                  onClick={() => setSelected(iso)}
                  className={cn(
                    'flex h-20 flex-col items-start rounded-lg border p-1.5 text-left transition',
                    inMonth ? 'border-slate-800' : 'border-transparent opacity-30',
                    isSelected && 'border-indigo-500 bg-indigo-500/10',
                    !isSelected && 'hover:bg-white/5'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                      isToday ? 'bg-indigo-500 text-white' : 'text-slate-300'
                    )}
                  >
                    {d.getDate()}
                  </span>
                  <div className="mt-auto flex gap-1">
                    {occ.map((o, oi) => (
                      <span key={oi} className="h-1.5 w-1.5 rounded-full" style={{ background: o.event.color }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="font-display text-base font-bold text-slate-50">{formatFullDate(new Date(selected))}</h2>
          <div className="mt-4 space-y-2">
            {selectedOccurrences.length === 0 && <p className="py-6 text-center text-sm italic text-slate-600">No events on this date.</p>}
            {selectedOccurrences.map((o, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: o.event.color }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-100">{o.label}</p>
                  {o.label !== o.event.name && <p className="truncate text-[11px] text-slate-500">{o.event.name}</p>}
                </div>
                <button onClick={() => setEditing(o.event)} className="text-slate-500 hover:text-slate-200">
                  <IconPencil width={14} height={14} />
                </button>
                <button onClick={() => setDeletingId(o.event.id)} className="text-slate-500 hover:text-rose-400">
                  <IconX width={14} height={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdd && (
        <EventFormModal
          onClose={() => setShowAdd(false)}
          onSubmit={(ev) => {
            addEvent(ev);
            pushToast('Event created');
          }}
        />
      )}

      {editing && (
        <EventFormModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={(ev) => {
            updateEvent(ev);
            pushToast('Event updated');
          }}
          onDelete={() => {
            deleteEvent(editing.id);
            pushToast('Event deleted');
          }}
        />
      )}

      {deletingId && (
        <ConfirmModal
          title="Delete event?"
          message="This event will be permanently removed from the calendar."
          onClose={() => setDeletingId(null)}
          onConfirm={() => {
            deleteEvent(deletingId);
            pushToast('Event deleted');
          }}
        />
      )}
    </div>
  );
}
