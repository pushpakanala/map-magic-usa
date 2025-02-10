
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import StatePage from './pages/StatePage';
import CollegePage from './pages/CollegePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  // Check if user is logged in
  const isLoggedIn = sessionStorage.getItem('user');

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Redirect root to login if not logged in, otherwise to map */}
          <Route
            path="/"
            element={isLoggedIn ? <Index /> : <Navigate to="/login" />}
          />
          <Route path="/state/:stateName" element={<StatePage />} />
          <Route path="/college/:collegeName" element={<CollegePage />} />
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} 
          />
          <Route 
            path="/signup" 
            element={isLoggedIn ? <Navigate to="/" /> : <SignupPage />} 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
