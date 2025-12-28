import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element}) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate 
    to="/login" 
    replace 
    state={{from: location}} />;

  return children;
};
