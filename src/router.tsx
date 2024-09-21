import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
const routes: RouteObject[] = [
  {
    path: "*",
    element: <div>404</div>,
  },
];

const router = createBrowserRouter(routes);

export const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};
