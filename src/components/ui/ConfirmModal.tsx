import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onClose }: ConfirmModalProps) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      width={380}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-300">{message}</p>
    </Modal>
  );
}
