import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

/**
 * Accessible dialog: Escape and the backdrop close it; focus returns to the opener.
 * Rendered into <body> via a portal so parent styles can't trap `position: fixed`.
 * Bottom sheet on phones, centred card on larger screens.
 */
export function Modal({ open, title, onClose, children }: ModalProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null

    // Focus an element marked `data-autofocus`, else the first field, else the panel.
    const firstField = panelRef.current?.querySelector<HTMLElement>('[data-autofocus], input, textarea, select')
    ;(firstField ?? panelRef.current)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      opener?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" data-testid="modal-backdrop" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[90vh] w-full animate-fade-up overflow-y-auto rounded-t-2xl border-2 border-b-0 border-ink bg-white p-5 shadow-hard sm:max-w-lg sm:rounded-2xl sm:border-b-2 sm:p-6"
      >
        {/* Grab handle hint on phones */}
        <span className="mx-auto -mt-1 mb-3 block h-1.5 w-10 rounded-full bg-brand-200 sm:hidden" aria-hidden="true" />
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-xl font-extrabold tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mt-1 -mr-2 rounded-lg p-2 text-brand-500 transition-colors hover:bg-paper hover:text-ink"
            aria-label="Close dialog"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
