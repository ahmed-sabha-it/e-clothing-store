import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthRequiredRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to sign in page with return URL
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthRequiredRoute;
