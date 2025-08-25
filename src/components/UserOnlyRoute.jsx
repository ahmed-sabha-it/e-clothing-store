import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserOnlyRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  // If user is authenticated and is admin, redirect to admin dashboard
  if (isAuthenticated && (user?.is_admin || user?.role === 'admin')) {
    return <Navigate to="/admin" replace />;
  }

  // For regular users or unauthenticated users, allow access to normal pages
  return children;
};

export default UserOnlyRoute;
