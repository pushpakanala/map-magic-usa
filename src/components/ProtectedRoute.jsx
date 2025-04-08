
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();
  
  // If we're on the landing page and the user is logged in, redirect to explore
  if (location.pathname === '/' && isLoggedIn) {
    return <Navigate to="/explore" replace />;
  }
  
  // If the user is not logged in and trying to access protected pages, redirect to login
  if (!isLoggedIn && location.pathname !== '/' && location.pathname !== '/login' && 
      location.pathname !== '/signup' && location.pathname !== '/forgot-password') {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
