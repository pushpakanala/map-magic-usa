
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import UserProfileMenu from './UserProfileMenu';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  
  useEffect(() => {
    // Only show profile menu on protected routes when logged in
    setShowMenu(isLoggedIn && location.pathname !== '/' && 
               location.pathname !== '/login' && 
               location.pathname !== '/signup' && 
               location.pathname !== '/forgot-password');
  }, [isLoggedIn, location]);
  
  // If we're on the landing page and the user is logged in, redirect to explore
  if (location.pathname === '/' && isLoggedIn) {
    return <Navigate to="/explore" replace />;
  }
  
  // If the user is not logged in and trying to access protected pages, redirect to login
  if (!isLoggedIn && location.pathname !== '/' && location.pathname !== '/login' && 
      location.pathname !== '/signup' && location.pathname !== '/forgot-password') {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      {showMenu && (
        <div className="absolute top-4 right-4 z-50">
          <UserProfileMenu />
        </div>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;
