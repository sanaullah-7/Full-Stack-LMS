import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * PublicRoute Component
 * Redirects already logged-in students to /dashboard
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
