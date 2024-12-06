import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";
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
import EventQR from "./pages/User/EventQR/EventQR";
import BingoRules from "./pages/User/BingoRules/BingoRules";

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
        path: "/:eventName/preview/templates",
        element: <BingoCard />,
    },
    {
        path: "/:eventName/:ticketCode",
        element: <BingoGrid />,
    },
    {
        path: "/:eventName/:ticketCode/hoogocard/",
        element: <BingoCard />,
    },
    {
        path: "/:eventName/leaderboard",
        element: <WinnerPage />,
    },
    {
        path: "/:eventName/qr",
        element: <EventQR />,
    },
    {
        path: "/rules",
        element: <BingoRules />,
    },
    {
        path: "/",
        element: <AuthCheck />,
        children: [
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/dashboard/:eventName/",
                element: <EventDashboard />,
            },
        ],
    },
];

const router = createBrowserRouter(routes);

export const Routes: React.FC = () => {
    return <RouterProvider router={router} />;
};
