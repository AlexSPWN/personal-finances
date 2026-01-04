import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/UserProfileDB";
import type { JSX } from "react";

type Props = {
  allowedRoles: UserRole[];
  children: JSX.Element;
};

export const RoleProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { user, profile/* , loading */ } = useAuth();
  const location = useLocation();

    // Wait until BOTH auth & profile are ready
  /* if (loading || !profile) return <p>Loading...</p>; */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }
  
  // not logged in
  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // role not allowed
  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};
