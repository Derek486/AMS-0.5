import { MotorsPage } from "../pages/MotorsPage";
import { redirect } from "react-router-dom";

const routes = [
  {
    path: '',
    element: <MotorsPage />
  },
  {
    path: '*',
    loader: () => {
      return redirect('')
    }
  }
]

export default routes