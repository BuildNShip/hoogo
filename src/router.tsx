import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import WinnerPage from "./pages/Admin/WinnerPage/WinnerPage";
const routes: RouteObject[] = [
  {
    path: "*",
    element: <div>404</div>,
  },
  {
    path: "/admin/leaderboard",
    element: <WinnerPage />,
  },
];

const router = createBrowserRouter(routes);

export const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};
