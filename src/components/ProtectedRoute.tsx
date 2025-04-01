import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth.tsx";
import React from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { initializing, session } = useAuth();

  // Allow the session check before forcing users to login
  if (initializing) return null;

  // If no session, redirect to login
  if (!session) return <Navigate replace to="/login" />;

  // If there is a valid session, render the app
  return children;
};
