import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to signin page with return url
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check if user is admin
  if (!user?.is_admin && user?.role !== 'admin') {
    // Redirect to home page if not admin
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is admin, render the protected component
  return children;
};

export default AdminRoute;
