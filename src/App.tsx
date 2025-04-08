
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import StatePage from './pages/StatePage';
import CollegePage from './pages/CollegePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LandingPage from './pages/LandingPage';
import ComparePage from './pages/ComparePage';
import AIAdvancedPage from './pages/AIAdvancedPage';
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
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
          <Route path="/ai-advanced" element={
            <ProtectedRoute>
              <AIAdvancedPage />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
