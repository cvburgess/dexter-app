import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth.tsx";
import React from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
