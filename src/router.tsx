import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "./pages/auth/sign-in";
import { Dashboard } from "./pages/app/dashboard";
import { AppLayout } from "./pages/layouts/app";
import { Finances } from "./pages/app/finances";

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
      }
    ]
  }
]);
