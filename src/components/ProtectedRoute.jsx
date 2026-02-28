import { Navigate, Outlet } from "react-router-dom";
import { useGlobal } from "../state/GlobalContext.jsx";

export function ProtectedRoute({ role }) {
  const { currentUser } = useGlobal();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
