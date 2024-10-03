import { Outlet } from 'react-router-dom'

import { Header } from '@/components/header'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-primary-foreground antialiased">
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-8 pt-2">
        <Outlet />
      </div>
    </div>
  )
}
