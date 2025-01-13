import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "./pages/auth/sign-in";
import { Dashboard } from "./pages/app/dashboard";
import { AppLayout } from "./pages/layouts/app";
import { Finances } from "./pages/app/finances";
import { Payments } from "./pages/app/payments";
import Safe from "./pages/app/safe";

export const router = createBrowserRouter([
  {
    path: '/sign-in',
    element: <SignIn />
  },
  {
    path: '/',
    element: <AppLayout />,  // AppLayout vai ser usado para as rotas filhas
    children: [
      {
        path: '/',  // Agora o Dashboard está dentro do AppLayout
        element: <Dashboard />
      },
      {
        path: 'finances',
        element: <Finances />
      },
      {
        path: 'payments',
        element: <Payments />
      },
      {
        path: 'safe',
        element: <Safe />
      }
    ]
  }
]);
