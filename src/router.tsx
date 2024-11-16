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
import AuthCheck from "./components/AuthCheck";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import EventDashboard from "./pages/Admin/Dashboard/EventDashboard/EventDashboard";

const routes: RouteObject[] = [
  {
    path: "*",
    element: <PageNotFound />,
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
    path: "/:eventName",
    element: <StartGame />,
  },
  {
    path: "/:eventName/:ticketCode",
    element: <BingoGrid />,
  },
  {
    path: "/",
    element: <AuthCheck />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      // /dashboard/:eventName Yet to Develop
      {
        path: "/dashboard/:eventName/leaderboard",
        element: <WinnerPage />,
      },
      {
        path: "/dashboard/:eventName/leaderboard/:ticketCode",
        element: <BingoCard />,
      },
      {
        path: "/dashboard/:eventName/",
        element: <EventDashboard />,
      },
    ],
  },

  // {
  //   path: "/user/dashboard/create",
  //   element: <CreateEvent />,
  // },
  // {
  //   path: "/user/dashboard/edit/:eventName",
  //   element: <EditEvent />,
  // },
];

const router = createBrowserRouter(routes);

export const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};
