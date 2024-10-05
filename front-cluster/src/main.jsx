import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import authRoutes from './routes/auth.routes'
import motorRoutes from './routes/motor.routes'
import './index.css'
import './utilities.css'

const rootRouter = createBrowserRouter([
  {
    path: '/auth',
    children: authRoutes
  },
  {
    path: '/',
    children: motorRoutes
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={rootRouter}></RouterProvider>
)
