import { createContext, useContext } from 'react'
import type { NewTaskInput, Task } from '@/types/task'

export interface TasksContextValue {
  tasks: Task[]
  status: 'loading' | 'ready' | 'error'
  /** Message when loading failed. */
  error: string | null
  createTask: (input: NewTaskInput) => Promise<Task>
  updateTask: (id: string, input: NewTaskInput) => Promise<Task>
}

export const TasksContext = createContext<TasksContextValue | null>(null)

export function useTasks(): TasksContextValue {
  const value = useContext(TasksContext)
  if (!value) throw new Error('useTasks must be used inside <TasksProvider>')
  return value
}
