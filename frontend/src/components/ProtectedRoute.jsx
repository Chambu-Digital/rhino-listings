// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getCurrentUser, getToken } from "../services/authService";

export default function ProtectedRoute({ allowedRoles, children }) {
  const token = getToken();
  const user = getCurrentUser();

  // If not logged in, redirect to appropriate login page
  if (!token || !user) {
    // Determine which login page based on allowed roles
    if (allowedRoles?.includes("admin")) {
      return <Navigate to="/admin/login" replace />;
    } else if (allowedRoles?.includes("employee")) {
      return <Navigate to="/employee/login" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // If role is not allowed, redirect to appropriate dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to user's appropriate dashboard
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "employee":
        return <Navigate to="/employee" replace />;
      case "user":
        return <Navigate to="/user" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}