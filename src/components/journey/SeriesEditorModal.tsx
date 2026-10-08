import { useState } from 'react';
import { Modal, inputClass } from '../ui/Modal';
import { Button, IconButton } from '../ui/Button';
import { IconPlus, IconX } from '../ui/Icons';

interface SeriesEditorModalProps {
  sectionName: string;
  series: string[];
  onClose: () => void;
  onSave: (series: string[]) => void;
}

export function SeriesEditorModal({ sectionName, series, onClose, onSave }: SeriesEditorModalProps) {
  const [items, setItems] = useState<string[]>(series.length ? series : ['Level 1']);

  return (
    <Modal
      title={`Level Series — ${sectionName}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onSave(items.filter((i) => i.trim()));
              onClose();
            }}
          >
            Save
          </Button>
        </>
      }
    >
      <p className="mb-3 text-xs text-slate-500">
        This series applies to every chapter in this section. Renaming, adding, or removing propagates everywhere.
      </p>
      <div className="max-h-72 space-y-2 overflow-y-auto">
        {items.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-xs font-bold text-slate-500">{i + 1}</span>
            <input
              className={inputClass}
              value={val}
              onChange={(e) => setItems((list) => list.map((x, idx) => (idx === i ? e.target.value : x)))}
            />
            <IconButton onClick={() => setItems((list) => list.filter((_, idx) => idx !== i))}>
              <IconX width={14} height={14} />
            </IconButton>
          </div>
        ))}
      </div>
      <button
        onClick={() => setItems((list) => [...list, `Level ${list.length + 1}`])}
        className="mt-3 flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
      >
        <IconPlus width={14} height={14} /> Add Level
      </button>
    </Modal>
  );
}
