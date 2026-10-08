import { useState } from 'react';
import { Modal, Field, inputClass } from '../ui/Modal';
import { Button } from '../ui/Button';
import { COLOR_SWATCHES } from '../../utils/colors';
import type { Reporting } from '../../types';

interface ReportingFormModalProps {
  initial?: Reporting;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; unit: string; color: string }) => void;
}

export function ReportingFormModal({ initial, onClose, onSubmit }: ReportingFormModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [unit, setUnit] = useState(initial?.unit ?? '');
  const [color, setColor] = useState(initial?.color ?? COLOR_SWATCHES[0]);

  function submit() {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), unit: unit.trim() || 'units', color });
    onClose();
  }

  return (
    <Modal
      title={initial ? 'Edit Reporting' : 'New Reporting'}
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
        <input autoFocus className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Study Hours / Week" />
      </Field>
      <Field label="Description">
        <input className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
      </Field>
      <Field label="Unit">
        <input className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="hours, marks, etc." />
      </Field>
      <Field label="Colour theme">
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="h-8 w-8 rounded-lg border-2"
              style={{ background: c, borderColor: color === c ? 'white' : 'transparent' }}
            />
          ))}
        </div>
      </Field>
    </Modal>
  );
}
