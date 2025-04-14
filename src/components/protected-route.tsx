"use client"

import { Outlet } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  // For development, always consider the user authenticated
  // Remove this line when you have a real backend
  return <Outlet />

  // Original code - uncomment when you have a real backend
  /*
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
  */
}
