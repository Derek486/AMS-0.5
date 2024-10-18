import { redirect } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'

const routes = [
  {
    path: '',
    loader: () => {
      return redirect('login')
    }
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
  {
    path: '*',
    loader: () => {
      return redirect('login')
    }
  }
]

export default routes