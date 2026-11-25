import { createBrowserRouter, RouterProvider } from 'react-router'
import { createLocalStorageTaskRepository } from '@/features/tasks/localStorageTaskRepository'
import { TasksProvider } from '@/features/tasks/TasksProvider'
import { routes } from './routes'

const router = createBrowserRouter(routes)
const taskRepository = createLocalStorageTaskRepository()

function App() {
  return (
    <TasksProvider repository={taskRepository}>
      <RouterProvider router={router} />
    </TasksProvider>
  )
}

export default App
