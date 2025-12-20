import type { JSX } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return children;
};
