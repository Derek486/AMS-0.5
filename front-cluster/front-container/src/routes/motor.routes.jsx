import api from "../api";
import { MotorsPage } from "../pages/MotorsPage";
import { redirect } from "react-router-dom";

const routes = [
  {
    path: '',
    loader: async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          await api.get('api/auth')
          return true
        } catch(err) {
          return redirect('/auth')
        }
      } else {
        return redirect('/auth')
      }
    },
    element: <MotorsPage />
  },
  {
    path: '*',
    loader: () => redirect('')
  }
]

export default routes