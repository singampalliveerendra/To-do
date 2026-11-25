import { Archive, CircleAlert, CircleCheckBig, Clock } from 'lucide-react'
import type { RouteObject } from 'react-router'
import { AppLayout, type RouteHandle } from '@/layouts/AppLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { TaskViewPage } from '@/pages/TaskViewPage'

const handle = (title: string): RouteHandle => ({ title })

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage />, handle: handle('Dashboard') },
      {
        path: 'pending',
        handle: handle('Pending'),
        element: (
          <TaskViewPage icon={Clock} emptyTitle="No pending tasks" emptyText="Tasks that are still on time will show here." />
        ),
      },
      {
        path: 'overdue',
        handle: handle('Overdue'),
        element: (
          <TaskViewPage
            icon={CircleAlert}
            emptyTitle="Nothing overdue"
            emptyText="Unfinished tasks whose deadline has passed will show here."
          />
        ),
      },
      {
        path: 'completed',
        handle: handle('Completed'),
        element: (
          <TaskViewPage
            icon={CircleCheckBig}
            emptyTitle="No completed tasks"
            emptyText="Finished tasks, including ones completed late, will show here."
          />
        ),
      },
      {
        path: 'archived',
        handle: handle('Archived'),
        element: (
          <TaskViewPage icon={Archive} emptyTitle="No archived tasks" emptyText="Tasks you archive can be restored from here." />
        ),
      },
      { path: '*', element: <NotFoundPage />, handle: handle('Page not found') },
    ],
  },
]
