
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import StatePage from './StatePage';
import CollegePage from './CollegePage';
import PricingPage from './PricingPage';
import ProtectedRoute from '../components/ProtectedRoute';
import USAMap from '../components/USAMap';

const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/explore" element={<ProtectedRoute><USAMap /></ProtectedRoute>} />
      <Route path="/state/:stateCode" element={<ProtectedRoute><StatePage /></ProtectedRoute>} />
      <Route path="/university/:universityId" element={<ProtectedRoute><CollegePage /></ProtectedRoute>} />
    </Routes>
  );
};

export default Index;
