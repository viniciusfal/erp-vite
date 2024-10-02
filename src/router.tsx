import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "./pages/auth/sign-in";
import { Dashboard } from "./pages/app/dashboard";
import { AppLayout } from "./pages/layouts/app";
import { Finances } from "./pages/app/finances";



export const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/finances',
        element: <Finances />
      }
    ]
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  }

])