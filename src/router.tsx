import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import WinnerPage from "./pages/Admin/BingoLeaderboard/BingoLeaderboard";
import BingoCard from "./pages/Admin/BingoCard/BingoCard";
import Login from "./pages/User/Login/Login";
import BingoGrid from "./pages/User/BingoGrid/BingoGrid";

const routes: RouteObject[] = [
  {
    path: "*",
    element: (
      <div>
        <h1>404 Not Found</h1>
      </div>
    ),
  },
  {
    path: "/:eventName",
    element: <Login />,
  },
  {
    path: "/:eventName/:ticketCode",
    element: <BingoGrid />,
  },
  {
    path: "/:eventName/admin/leaderboard",
    element: <WinnerPage />,
  },
  {
    path: "/:eventName/admin/leaderboard/:playerName",
    element: <BingoCard />,
  },
];

const router = createBrowserRouter(routes);

export const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};
