import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { NewTaskInput, Task } from '@/types/task'
import type { TaskRepository } from './taskRepository'
import { TasksContext, type TasksContextValue } from './TasksContext'

interface TasksProviderProps {
  repository: TaskRepository
  children: ReactNode
}

/** Loads tasks once and shares them (plus actions) with the whole app. */
export function TasksProvider({ repository, children }: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [status, setStatus] = useState<TasksContextValue['status']>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    repository
      .list()
      .then((loaded) => {
        if (cancelled) return
        setTasks(loaded)
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Could not load tasks.')
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [repository])

  const createTask = useCallback(
    async (input: NewTaskInput) => {
      const task = await repository.create(input)
      setTasks((prev) => [task, ...prev])
      return task
    },
    [repository],
  )

  const updateTask = useCallback(
    async (id: string, input: NewTaskInput) => {
      const task = await repository.update(id, input)
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)))
      return task
    },
    [repository],
  )

  const value = useMemo(
    () => ({ tasks, status, error, createTask, updateTask }),
    [tasks, status, error, createTask, updateTask],
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}
