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
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
      >
        <Plus className="size-4" aria-hidden="true" />
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
