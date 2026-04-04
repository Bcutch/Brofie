import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Login } from './pages/login.page.tsx'
import { Home } from './pages/home.page.tsx';

const router = createHashRouter([
  {
    path: "*",
    element: <Login />,
  },
  {
    path: "/gallery",
    element: <Home />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
