
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      
      if (!isLoggedIn) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }
      
      if (adminOnly) {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            const isAdmin = user.role === 'admin';
            
            if (!isAdmin) {
              toast({
                title: "Access Denied",
                description: "You need administrator privileges to access this page.",
                variant: "destructive",
              });
            }
            
            setIsAuthorized(isAdmin);
          } catch (error) {
            console.error("Error parsing user data:", error);
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(true);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [adminOnly, toast]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
