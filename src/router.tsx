import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import WinnerPage from "./pages/Admin/BingoLeaderboard/BingoLeaderboard";
import BingoCard from "./pages/Admin/BingoCard/BingoCard";
import BingoGrid from "./pages/User/BingoGrid/BingoGrid";
import HoogoLanding from "./pages/Landing/Landing";
import StartGame from "./pages/User/StartGame/StartGame";
import Authentication from "./pages/Authentication/Authentication";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import CreateEvent from "./pages/Admin/Dashboard/CreateEvent/CreateEvent";

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
    path: "/",
    element: <HoogoLanding />,
  },
  {
    path: "/login",
    element: <Authentication />,
  },
  {
    path: "/user/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/user/dashboard/create",
    element: <CreateEvent />,
  },
  {
    path: "/:eventName",
    element: <StartGame />,
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
