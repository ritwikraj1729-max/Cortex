import { useState } from 'react';
import { Modal, Field, inputClass } from '../ui/Modal';
import { Button } from '../ui/Button';
import { COLOR_SWATCHES } from '../../utils/colors';
import type { Streak } from '../../types';

const EMOJIS = ['🔥', '📖', '💪', '💻', '🧘', '🎯', '🎸', '🏃', '🖌️', '💤', '🥗', '🧩'];

interface StreakFormModalProps {
  initial?: Streak;
  onClose: () => void;
  onSubmit: (name: string, emoji: string, color: string) => void;
}

export function StreakFormModal({ initial, onClose, onSubmit }: StreakFormModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [emoji, setEmoji] = useState(initial?.emoji ?? EMOJIS[0]);
  const [color, setColor] = useState(initial?.color ?? COLOR_SWATCHES[0]);

  function submit() {
    if (!name.trim()) return;
    onSubmit(name.trim(), emoji, color);
    onClose();
  }

  return (
    <Modal
      title={initial ? 'Edit Streak' : 'New Streak'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit}>
            Save
          </Button>
        </>
      }
    >
      <Field label="Name">
        <input autoFocus className={inputClass} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
      </Field>
      <Field label="Emoji">
        <div className="flex flex-wrap gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-lg transition ${
                emoji === e ? 'border-indigo-500 bg-indigo-500/15' : 'border-slate-700 hover:bg-white/5'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Colour theme">
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="h-8 w-8 rounded-lg border-2 transition"
              style={{ background: c, borderColor: color === c ? 'white' : 'transparent' }}
            />
          ))}
        </div>
      </Field>
    </Modal>
  );
}
