import { useState } from 'react';
import { Modal, Field, inputClass } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../store/AppStore';
import type { Category, QuestRef } from '../../types';
import { CATEGORY_META } from '../ui/Chip';

type RefMode = 'none' | 'subject-streak' | 'monthly';

interface QuestFormModalProps {
  title: string;
  includeCategory?: boolean;
  refMode?: RefMode;
  includeRefs?: boolean;
  onClose: () => void;
  onSubmit: (name: string, category: Category, refs: QuestRef[]) => void;
}

export function QuestFormModal({
  title,
  includeCategory = true,
  refMode,
  includeRefs = true,
  onClose,
  onSubmit,
}: QuestFormModalProps) {
  const { streaks, subjects, monthly } = useApp();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('important');
  const [refIds, setRefIds] = useState<Set<string>>(new Set());
  const resolvedRefMode: RefMode = refMode ?? (includeRefs ? 'subject-streak' : 'none');

  function toggleRef(key: string) {
    setRefIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function submit() {
    if (!name.trim()) return;
    const refs: QuestRef[] = [];
    for (const key of refIds) {
      const [type, id] = key.split('::');
      if (type === 'streak') {
        const s = streaks.find((x) => x.id === id);
        if (s) refs.push({ type: 'streak', id: s.id, name: s.name });
      } else if (type === 'subject') {
        const s = subjects.find((x) => x.id === id);
        if (s) refs.push({ type: 'subject', id: s.id, name: s.name });
      } else if (type === 'monthly') {
        const g = monthly.find((x) => x.id === id);
        if (g) refs.push({ type: 'monthly', id: g.id, name: g.name });
      }
    }
    onSubmit(name.trim(), category, refs);
    onClose();
  }

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit}>
            Create
          </Button>
        </>
      }
    >
      <Field label="Name">
        <input
          autoFocus
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="e.g. Finish reading assignment"
        />
      </Field>

      {includeCategory && (
        <Field label="Category">
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-lg border px-2 py-2 text-xs font-bold transition ${
                  category === c ? `${CATEGORY_META[c].className} ring-1 ring-white/20` : 'border-slate-700 text-slate-400 hover:bg-white/5'
                }`}
              >
                {CATEGORY_META[c].label}
              </button>
            ))}
          </div>
        </Field>
      )}

      {resolvedRefMode === 'subject-streak' && (
        <Field label="Link to (optional)">
          <div className="max-h-36 space-y-1 overflow-y-auto rounded-lg border border-slate-700 p-2">
            {streaks.length === 0 && subjects.length === 0 && (
              <p className="px-1.5 py-1 text-xs italic text-slate-500">No streaks or subjects yet.</p>
            )}
            {streaks.map((s) => (
              <label key={s.id} className="flex items-center gap-2 rounded px-1.5 py-1 text-xs hover:bg-white/5">
                <input type="checkbox" checked={refIds.has(`streak::${s.id}`)} onChange={() => toggleRef(`streak::${s.id}`)} />
                <span>🔥 {s.name}</span>
              </label>
            ))}
            {subjects.map((s) => (
              <label key={s.id} className="flex items-center gap-2 rounded px-1.5 py-1 text-xs hover:bg-white/5">
                <input type="checkbox" checked={refIds.has(`subject::${s.id}`)} onChange={() => toggleRef(`subject::${s.id}`)} />
                <span>
                  {s.symbol} {s.name}
                </span>
              </label>
            ))}
          </div>
        </Field>
      )}

      {resolvedRefMode === 'monthly' && (
        <Field label="Link to monthly goal (optional)">
          <div className="max-h-36 space-y-1 overflow-y-auto rounded-lg border border-slate-700 p-2">
            {monthly.length === 0 && <p className="px-1.5 py-1 text-xs italic text-slate-500">No monthly goals yet.</p>}
            {monthly.map((g) => (
              <label key={g.id} className="flex items-center gap-2 rounded px-1.5 py-1 text-xs hover:bg-white/5">
                <input type="checkbox" checked={refIds.has(`monthly::${g.id}`)} onChange={() => toggleRef(`monthly::${g.id}`)} />
                <span>📅 {g.name}</span>
              </label>
            ))}
          </div>
        </Field>
      )}
    </Modal>
  );
}
