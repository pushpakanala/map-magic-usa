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
import { logEvent, logPageView, EVENT_TYPES } from './utils/logger';
import './App.css';

// Set up a flag to prevent axios interceptor loops
let isLoggingRequest = false;

// Setup axios interceptors for logging
axios.interceptors.request.use(
  (config) => {
    if (isLoggingRequest) return config;
    
    const url = config.url || '';
    
    // Don't log the actual logging requests to avoid infinite loops
    if (!url.includes('metrics-logging') && !url.includes('logs')) {
      isLoggingRequest = true;
      setTimeout(() => { isLoggingRequest = false; }, 100); // Reset flag after a short delay
      
      logEvent(EVENT_TYPES.BUTTON_CLICK, {
        action: "api_request",
        method: config.method?.toUpperCase(),
        url: url,
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// We don't need response interceptors for logging purposes as they can cause
// infinite loops. Removing them to prevent continuous requests.

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
  // Log application start only once
  useEffect(() => {
    const hasStarted = sessionStorage.getItem('app_started');
    
    if (!hasStarted) {
      logEvent(EVENT_TYPES.PAGE_VISIT, { action: 'app_started' });
      sessionStorage.setItem('app_started', 'true');
      
      return () => {
        logEvent(EVENT_TYPES.PAGE_VISIT, { action: 'app_closed' });
        sessionStorage.removeItem('app_started');
      };
    }
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
