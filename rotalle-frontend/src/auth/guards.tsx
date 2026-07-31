import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { UserRole } from "@/types/enums";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null; // or a branded splash/loader
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RoleRoute({ allow }: { allow: UserRole[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
