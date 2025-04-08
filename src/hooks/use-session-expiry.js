
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSessionExpiry = () => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    // Add a response interceptor to detect 401 errors
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        // Check if the error is a 401 status code or a token expired message
        if (
          error.response?.status === 401 || 
          error.response?.data?.status?.message === 'Token expired'
        ) {
          setIsSessionExpired(true);
        }
        return Promise.reject(error);
      }
    );

    // Remove the interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const resetSessionExpiry = () => {
    setIsSessionExpired(false);
  };

  return { isSessionExpired, resetSessionExpiry };
};
