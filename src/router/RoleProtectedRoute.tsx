import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/UserProfileDB";
import type { JSX } from "react";

type Props = {
  allowedRoles: UserRole[];
  children: JSX.Element;
};

export const RoleProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { user, profile, loading } = useAuth();

    // Wait until BOTH auth & profile are ready
  if (loading || !profile) return <p>Loading...</p>;

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // role not allowed
  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
