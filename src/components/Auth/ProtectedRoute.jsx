import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Route protection wrapper to isolate internal pages from unauthorized or visitor access.
 * Allowed roles: 'user' | 'admin'
 */
const ProtectedRoute = ({ children, allowedRoles = ['user', 'admin'] }) => {
  const loggedRole = localStorage.getItem('smart_card_logged_role');

  if (!loggedRole || !allowedRoles.includes(loggedRole)) {
    // Redirect unauthenticated visitor to login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
