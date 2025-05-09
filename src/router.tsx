import { createBrowserRouter } from 'react-router-dom'
import { SignIn } from './pages/auth/sign-in'
import { Dashboard } from './pages/app/dashboard'
import { AppLayout } from './pages/layouts/app'
import { Finances } from './pages/app/finances'
import { Payments } from './pages/app/payments'
import Safe from './pages/app/safe'
import { LowByDue } from './pages/app/low'

export const router = createBrowserRouter([
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/',
    element: <AppLayout />, // AppLayout vai ser usado para as rotas filhas
    children: [
      {
        path: '/', // Agora o Dashboard está dentro do AppLayout
        element: <Dashboard />,
      },
      {
        path: 'finances',
        element: <Finances />,
      },
      {
        path: 'finances/low-by-due',
        element: <LowByDue />
      },
      {
        path: 'payments',
        element: <Payments />,
      },
      {
        path: 'safe',
        element: <Safe />,
      },
    ],
  },
])
