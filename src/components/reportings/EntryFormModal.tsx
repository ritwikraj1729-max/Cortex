import { useState } from 'react';
import { Modal, Field, inputClass } from '../ui/Modal';
import { Button } from '../ui/Button';
import { todayISO } from '../../utils/date';
import type { Entry } from '../../types';

interface EntryFormModalProps {
  initial?: Entry;
  onClose: () => void;
  onSubmit: (data: { value: number; label: string; date: string }) => void;
}

export function EntryFormModal({ initial, onClose, onSubmit }: EntryFormModalProps) {
  const [value, setValue] = useState(initial ? String(initial.value) : '');
  const [label, setLabel] = useState(initial?.label ?? '');
  const [date, setDate] = useState(initial?.date ?? todayISO());

  function submit() {
    const num = parseFloat(value);
    if (Number.isNaN(num) || !label.trim()) return;
    onSubmit({ value: num, label: label.trim(), date });
    onClose();
  }

  return (
    <Modal
      title={initial ? 'Edit Entry' : 'Add Entry'}
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
      <Field label="Value">
        <input autoFocus type="number" className={inputClass} value={value} onChange={(e) => setValue(e.target.value)} />
      </Field>
      <Field label="Label">
        <input className={inputClass} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Week 5" />
      </Field>
      <Field label="Date">
        <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>
    </Modal>
  );
}
