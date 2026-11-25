import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/app/routes'
import { createLocalStorageTaskRepository } from '@/features/tasks/localStorageTaskRepository'
import type { TaskRepository } from '@/features/tasks/taskRepository'
import { TasksProvider } from '@/features/tasks/TasksProvider'

interface RenderAppOptions {
  repository?: TaskRepository
}

/** Renders the full app (providers + routes) at `path`, using an in-memory router. */
export function renderApp(path = '/', { repository }: RenderAppOptions = {}) {
  const repo = repository ?? createLocalStorageTaskRepository({ storage: window.localStorage })
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const result = render(
    <TasksProvider repository={repo}>
      <RouterProvider router={router} />
    </TasksProvider>,
  )
  return { ...result, router, repository: repo }
}
