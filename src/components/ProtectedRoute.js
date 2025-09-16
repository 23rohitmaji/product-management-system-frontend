import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ user, requireAdmin = false }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
