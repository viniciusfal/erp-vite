import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from './lib/query-client'
import { router } from './router'
import { Toaster } from 'sonner'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { DateRangeProvider } from './hooks/date-ranger-context'

export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | ERP" />
      <Toaster richColors />
      <DateRangeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </DateRangeProvider>
    </HelmetProvider>
  )
}
