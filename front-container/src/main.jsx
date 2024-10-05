import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import authRoutes from './routes/auth.routes'
import motorRoutes from './routes/motor.routes'
import './index.css'
import './utilities.css'
import { ToastLayout } from './layouts/ToastLayout'
import { WebsocketsProvider } from './context/Websockets'

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
  <ToastLayout>
    <WebsocketsProvider>
      <RouterProvider router={rootRouter}></RouterProvider>
    </WebsocketsProvider>
  </ToastLayout>
)
