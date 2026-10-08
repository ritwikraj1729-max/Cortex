import { useState } from 'react';
import { Modal, Field, inputClass } from '../ui/Modal';
import { Button } from '../ui/Button';

interface SubjectFormModalProps {
  onClose: () => void;
  onSubmit: (data: { name: string; symbol: string; sectionMode: 'single' | 'multi'; levelMode: 'simple' | 'complex' }) => void;
}

const SYMBOLS = ['📐', '⚛️', '🧪', '📚', '🧬', '💻', '🎨', '🌍', '📊', '🎵', '⚖️', '🏛️'];

export function SubjectFormModal({ onClose, onSubmit }: SubjectFormModalProps) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [sectionMode, setSectionMode] = useState<'single' | 'multi'>('multi');
  const [levelMode, setLevelMode] = useState<'simple' | 'complex'>('simple');

  function submit() {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), symbol, sectionMode, levelMode });
    onClose();
  }

  return (
    <Modal
      title="New Subject"
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
        <input autoFocus className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Biology" />
      </Field>
      <Field label="Symbol">
        <div className="flex flex-wrap gap-2">
          {SYMBOLS.map((s) => (
            <button
              key={s}
              onClick={() => setSymbol(s)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-lg ${
                symbol === s ? 'border-indigo-500 bg-indigo-500/15' : 'border-slate-700 hover:bg-white/5'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Sections">
        <div className="flex gap-2">
          {(['single', 'multi'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setSectionMode(m)}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold ${
                sectionMode === m ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300' : 'border-slate-700 text-slate-400 hover:bg-white/5'
              }`}
            >
              {m === 'single' ? 'Single Section' : 'Multiple Sections'}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Level Structure">
        <div className="flex gap-2">
          {(['simple', 'complex'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setLevelMode(m)}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold capitalize ${
                levelMode === m ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300' : 'border-slate-700 text-slate-400 hover:bg-white/5'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          {levelMode === 'simple'
            ? 'Fixed level series shared across chapters in a section (table view available).'
            : 'Custom levels per chapter (roadmap view only).'}
        </p>
      </Field>
    </Modal>
  );
}
