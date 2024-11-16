import { Navigate, Outlet, useParams } from "react-router-dom";

const AuthCheck: React.FC = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const redirection = window.location.pathname.slice(1);

  const { eventName } = useParams<{ eventName: string }>();

  if (!refreshToken) {
    return <Navigate to={`/login?ruri=${redirection}`} />;
  }

  if (window.location.pathname === `/${eventName}`) {
    return <Navigate to={`/dashboard/${eventName}/`} />;
  }

  return <Outlet />;
};

export default AuthCheck;
