import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Robot Command',
  message,
  confirmText = 'Confirm & Execute',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false,
}) {
  const isDanger = variant === 'danger';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4 py-2">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
            isDanger
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-amber-50 border-amber-200 text-amber-600'
          }`}
        >
          {isDanger ? <ShieldAlert className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">{message}</p>
          <p className="text-xs text-slate-500">
            Ensure field perimeter is clear before switching autonomous hardware state.
          </p>
        </div>
      </div>
    </Modal>
  );
}
