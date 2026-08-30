import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const roleName = user.role?.name?.toUpperCase();
  if (allowedRoles && !allowedRoles.includes(roleName)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
