import { useId, useRef, useState, type FormEvent } from 'react'
import { cn } from '@/lib/cn'
import type { NewTaskInput } from '@/types/task'
import {
  DESCRIPTION_MAX_LENGTH,
  hasErrors,
  normalizeTaskInput,
  TITLE_MAX_LENGTH,
  validateTaskInput,
  type TaskInputErrors,
} from './taskValidation'

interface TaskFormProps {
  initialValues?: NewTaskInput
  submitLabel: string
  onSubmit: (input: NewTaskInput) => Promise<unknown>
  onCancel: () => void
}

const inputClass =
  'block w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30'

export function TaskForm({ initialValues, submitLabel, onSubmit, onCancel }: TaskFormProps) {
  const id = useId()
  const [values, setValues] = useState<NewTaskInput>(initialValues ?? { title: '', description: '' })
  const [errors, setErrors] = useState<TaskInputErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  // Guards against double submit even before React re-renders the disabled button.
  const submittingRef = useRef(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return

    const validation = validateTaskInput(values)
    setErrors(validation)
    setFormError(null)
    if (hasErrors(validation)) return

    submittingRef.current = true
    setSubmitting(true)
    try {
      await onSubmit(normalizeTaskInput(values))
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const titleErrorId = `${id}-title-error`
  const descriptionErrorId = `${id}-description-error`

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor={`${id}-title`} className="mb-1 block text-sm font-medium text-slate-700">
          Title <span className="text-status-overdue">*</span>
        </label>
        <input
          id={`${id}-title`}
          name="title"
          type="text"
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          maxLength={TITLE_MAX_LENGTH}
          placeholder="e.g. Prepare project report"
          autoComplete="off"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? titleErrorId : undefined}
          className={cn(inputClass, errors.title ? 'border-status-overdue' : 'border-slate-300')}
        />
        {errors.title && (
          <p id={titleErrorId} className="mt-1 text-sm text-status-overdue">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-description`} className="mb-1 block text-sm font-medium text-slate-700">
          Description <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id={`${id}-description`}
          name="description"
          rows={4}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          maxLength={DESCRIPTION_MAX_LENGTH}
          placeholder="Add details, links or notes"
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? descriptionErrorId : undefined}
          className={cn(inputClass, 'resize-y', errors.description ? 'border-status-overdue' : 'border-slate-300')}
        />
        <div className="mt-1 flex justify-between gap-2 text-xs">
          <span id={descriptionErrorId} className="text-status-overdue">
            {errors.description}
          </span>
          <span className="text-slate-400">
            {values.description.length}/{DESCRIPTION_MAX_LENGTH}
          </span>
        </div>
      </div>

      {formError && (
        <p role="alert" className="rounded-lg bg-status-overdue/10 px-3 py-2 text-sm text-status-overdue">
          {formError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
