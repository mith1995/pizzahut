import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const location = useLocation();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
