import { X } from 'lucide-react'
import { useId, useRef, useState, type FormEvent } from 'react'
import { cn } from '@/lib/cn'
import {
  dateInputToDueAt,
  dueAtToDateInput,
  MAX_DATE_INPUT,
  MAX_DUE_YEAR,
  MIN_DATE_INPUT,
  MIN_DUE_YEAR,
  parseDateInput,
  todayDateInput,
} from '@/lib/deadline'
import type { NewTaskInput } from '@/types/task'
import {
  DESCRIPTION_MAX_LENGTH,
  hasErrors,
  normalizeTaskInput,
  TITLE_MAX_LENGTH,
  validateTaskInput,
  type TaskInputErrors,
} from './taskValidation'

/** What the form edits: like `NewTaskInput`, but the deadline is a `YYYY-MM-DD` date field. */
interface FormValues {
  title: string
  description: string
  /** '' = no target date. */
  dueDate: string
}

interface TaskFormProps {
  initialValues?: NewTaskInput
  submitLabel: string
  onSubmit: (input: NewTaskInput) => Promise<unknown>
  onCancel: () => void
}

/** Outlined field; yellow focus glow; red outline + soft red glow when invalid. */
const fieldClass = (invalid: boolean) =>
  cn(
    'block w-full rounded-xl border-2 bg-white px-3.5 py-2.5 text-sm text-ink transition-shadow placeholder:text-brand-400',
    'focus:outline-none focus:ring-4',
    invalid ? 'border-status-overdue focus:ring-status-overdue-soft' : 'border-ink focus:ring-accent/60',
  )

export function TaskForm({ initialValues, submitLabel, onSubmit, onCancel }: TaskFormProps) {
  const id = useId()
  const initialDueDate = initialValues?.dueAt ? dueAtToDateInput(initialValues.dueAt) : ''
  const [values, setValues] = useState<FormValues>({
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    dueDate: initialDueDate,
  })
  const [errors, setErrors] = useState<TaskInputErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  // Guards against double submit even before React re-renders the disabled button.
  const submittingRef = useRef(false)
  const dueDateRef = useRef<HTMLInputElement>(null)

  /** The stored deadline for the picked date (null = none, undefined = invalid date). */
  function resolveDueAt(): string | null | undefined {
    if (values.dueDate === '') return null
    // Unchanged date → keep the exact saved deadline (even if the user has since changed timezone).
    if (values.dueDate === initialDueDate && initialValues?.dueAt) return initialValues.dueAt
    return dateInputToDueAt(values.dueDate) ?? undefined
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return

    const dueAt = resolveDueAt()
    const input: NewTaskInput = { title: values.title, description: values.description, dueAt: dueAt ?? null }
    const validation = validateTaskInput(input)
    if (dueAt === undefined) {
      validation.dueAt = `Enter a valid date between ${MIN_DUE_YEAR} and ${MAX_DUE_YEAR}.`
    }
    setErrors(validation)
    setFormError(null)
    if (hasErrors(validation)) return

    submittingRef.current = true
    setSubmitting(true)
    try {
      await onSubmit(normalizeTaskInput(input))
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const titleErrorId = `${id}-title-error`
  const descriptionErrorId = `${id}-description-error`
  const dueDateErrorId = `${id}-due-date-error`
  const dueDateHintId = `${id}-due-date-hint`
  const dueDateInPast =
    values.dueDate !== '' && parseDateInput(values.dueDate) !== null && values.dueDate < todayDateInput()

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor={`${id}-title`} className="mb-1.5 block text-sm font-semibold text-ink">
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
          className={fieldClass(Boolean(errors.title))}
        />
        {errors.title && (
          <p id={titleErrorId} className="mt-1.5 text-sm font-medium text-status-overdue">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-description`} className="mb-1.5 block text-sm font-semibold text-ink">
          Description <span className="font-normal text-brand-500">(optional)</span>
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
          className={cn(fieldClass(Boolean(errors.description)), 'resize-y')}
        />
        <div className="mt-1.5 flex justify-between gap-2 text-xs">
          <span id={descriptionErrorId} className="font-medium text-status-overdue">
            {errors.description}
          </span>
          <span className="text-brand-500 tabular-nums">
            {values.description.length}/{DESCRIPTION_MAX_LENGTH}
          </span>
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-due-date`} className="mb-1.5 block text-sm font-semibold text-ink">
          Target date <span className="font-normal text-brand-500">(optional)</span>
        </label>
        <div className="flex items-center gap-2">
          <div className="w-full sm:w-60">
            <input
              ref={dueDateRef}
              id={`${id}-due-date`}
              name="dueDate"
              type="date"
              value={values.dueDate}
              onChange={(e) => setValues((v) => ({ ...v, dueDate: e.target.value }))}
              min={MIN_DATE_INPUT}
              max={MAX_DATE_INPUT}
              aria-invalid={errors.dueAt ? true : undefined}
              aria-describedby={errors.dueAt ? dueDateErrorId : dueDateHintId}
              className={fieldClass(Boolean(errors.dueAt))}
            />
          </div>
          {values.dueDate !== '' && (
            <button
              type="button"
              onClick={() => {
                setValues((v) => ({ ...v, dueDate: '' }))
                setErrors(({ dueAt: _cleared, ...rest }) => rest)
                dueDateRef.current?.focus()
              }}
              aria-label="Clear target date"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-brand-600 hover:bg-paper hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
        {errors.dueAt ? (
          <p id={dueDateErrorId} className="mt-1.5 text-sm font-medium text-status-overdue">
            {errors.dueAt}
          </p>
        ) : (
          <p id={dueDateHintId} className="mt-1.5 text-xs text-brand-500">
            {dueDateInPast ? 'This date has already passed.' : 'Due by the end of that day (11:59 pm).'}
          </p>
        )}
      </div>

      {formError && (
        <p
          role="alert"
          className="rounded-xl border-2 border-status-overdue bg-status-overdue-soft px-3 py-2 text-sm font-medium text-status-overdue"
        >
          {formError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-press bg-white px-4 py-2.5 text-sm font-semibold text-ink">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="btn-press bg-accent px-5 py-2.5 text-sm font-bold text-ink">
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
