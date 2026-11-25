import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Modal } from '@/components/Modal'
import { TaskForm } from './TaskForm'
import { useTasks } from './TasksContext'

/** "New task" button + create-task dialog. */
export function NewTaskButton() {
  const { createTask } = useTasks()
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group btn-press inline-flex shrink-0 items-center gap-1.5 bg-accent px-3.5 py-2 text-sm font-bold text-ink sm:px-4"
      >
        <Plus className="size-4 transition-transform duration-200 group-hover:rotate-90" strokeWidth={2.5} aria-hidden="true" />
        New task
      </button>

      <Modal open={open} title="New task" onClose={close}>
        <TaskForm
          submitLabel="Create task"
          onCancel={close}
          onSubmit={async (input) => {
            await createTask(input)
            close()
          }}
        />
      </Modal>
    </>
  )
}
