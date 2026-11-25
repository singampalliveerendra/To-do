function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-brand-700 sm:text-5xl">To-Do</h1>
      <p className="text-slate-600">Collaborative task management — setup in progress.</p>
      <ul className="flex flex-wrap justify-center gap-2 text-sm font-medium" aria-label="Task statuses">
        <li className="rounded-full bg-status-pending/10 px-3 py-1 text-status-pending">Pending</li>
        <li className="rounded-full bg-status-overdue/10 px-3 py-1 text-status-overdue">Overdue</li>
        <li className="rounded-full bg-status-completed/10 px-3 py-1 text-status-completed">Completed</li>
        <li className="rounded-full bg-status-late/10 px-3 py-1 text-status-late">Completed Late</li>
      </ul>
    </main>
  )
}

export default App
