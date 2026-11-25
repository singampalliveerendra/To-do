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
        className="group bg-gradient-button-animated shadow-glow inline-flex shrink-0 items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pop-fuchsia/40 active:translate-y-0 active:scale-95"
      >
        <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90" aria-hidden="true" />
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
