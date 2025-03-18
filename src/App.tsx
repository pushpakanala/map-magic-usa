
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import axios from 'axios';
import Index from './pages/Index';
import StatePage from './pages/StatePage';
import CollegePage from './pages/CollegePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LandingPage from './pages/LandingPage';
import ComparePage from './pages/ComparePage';
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from './components/ProtectedRoute';
import { logEvent, logPageView } from './utils/logger';
import './App.css';

// Setup axios interceptors for logging
axios.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    
    // Don't log the actual logging requests to avoid infinite loops
    if (!url.includes('logs')) {
      logEvent('api_request', {
        method: config.method?.toUpperCase(),
        url: url,
        params: config.params,
      });
    }
    return config;
  },
  (error) => {
    logEvent('api_request_error', { error: error.message });
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    const url = response.config.url || '';
    
    // Don't log the actual logging responses to avoid infinite loops
    if (!url.includes('logs')) {
      logEvent('api_response', {
        method: response.config.method?.toUpperCase(),
        url: url,
        status: response.status,
      });
    }
    return response;
  },
  (error) => {
    const url = error.config?.url || '';
    
    // Don't log the actual logging errors to avoid infinite loops
    if (!url.includes('logs')) {
      logEvent('api_response_error', {
        method: error.config?.method?.toUpperCase(),
        url: url,
        status: error.response?.status,
        message: error.message,
      });
    }
    return Promise.reject(error);
  }
);

// Route-change tracking component
const RouteTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname;
    logPageView(path);
  }, [location]);
  
  return null;
};

const queryClient = new QueryClient();

function App() {
  // Log application start
  useEffect(() => {
    logEvent('app_started', { timestamp: new Date().toISOString() });
    
    return () => {
      logEvent('app_closed', { timestamp: new Date().toISOString() });
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <RouteTracker />
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/index" element={<Navigate to="/explore" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/state/:stateName" element={
            <ProtectedRoute>
              <StatePage />
            </ProtectedRoute>
          } />
          <Route path="/college/:collegeName" element={
            <ProtectedRoute>
              <CollegePage />
            </ProtectedRoute>
          } />
          <Route path="/compare" element={
            <ProtectedRoute>
              <ComparePage />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
