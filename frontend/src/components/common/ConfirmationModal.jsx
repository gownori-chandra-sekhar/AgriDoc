import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

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
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
              : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
          }`}
        >
          {isDanger ? <ShieldAlert className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-200 leading-relaxed">{message}</p>
          <p className="text-xs text-slate-400">
            Ensure field perimeter is clear before switching autonomous hardware state.
          </p>
        </div>
      </div>
    </Modal>
  );
}
