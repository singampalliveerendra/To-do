import { useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  /** `danger` = red confirm button for destructive actions. */
  tone?: 'default' | 'danger'
  onConfirm: () => Promise<unknown>
  onCancel: () => void
}

/**
 * "Are you sure?" dialog. Cancel gets focus first, so pressing Enter by
 * accident never confirms. Shows an error and stays open if the action fails.
 */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const busyRef = useRef(false)

  function close() {
    if (busyRef.current) return
    setError(null)
    onCancel()
  }

  async function confirm() {
    if (busyRef.current) return
    busyRef.current = true
    setBusy(true)
    setError(null)
    try {
      await onConfirm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  return (
    <Modal open={open} title={title} onClose={close}>
      <div className="space-y-4 text-sm text-slate-600">{children}</div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-status-overdue/10 px-3 py-2 text-sm text-status-overdue">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          data-autofocus
          onClick={close}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={busy}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60',
            tone === 'danger' ? 'bg-status-overdue hover:bg-red-700' : 'bg-brand-600 hover:bg-brand-700',
          )}
        >
          {busy ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
