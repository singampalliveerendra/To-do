import { Modal } from '@/components/Modal'
import type { Task } from '@/types/task'
import { TaskForm } from './TaskForm'
import { useTasks } from './TasksContext'

interface EditTaskDialogProps {
  /** The task being edited, or null when the dialog is closed. */
  task: Task | null
  onClose: () => void
}

export function EditTaskDialog({ task, onClose }: EditTaskDialogProps) {
  const { updateTask } = useTasks()

  return (
    <Modal open={task !== null} title="Edit task" onClose={onClose}>
      {task && (
        <TaskForm
          // New key per task so the form always starts from that task's values.
          key={task.id}
          initialValues={{ title: task.title, description: task.description }}
          submitLabel="Save changes"
          onCancel={onClose}
          onSubmit={async (input) => {
            await updateTask(task.id, input)
            onClose()
          }}
        />
      )}
    </Modal>
  )
}
