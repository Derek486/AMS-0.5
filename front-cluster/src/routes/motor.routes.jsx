import { MotorsPage } from "../pages/MotorsPage";
import { MotorPage } from "../pages/MotorPage";

const routes = [
  {
    path: '',
    element: <MotorsPage />
  },
  {
    path: ':id',
    element: <MotorPage />
  }
]

export default routes