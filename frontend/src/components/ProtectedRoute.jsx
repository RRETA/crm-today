import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="loading">Cargando…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function AdminRoute() {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div className="loading">Cargando…</div>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
