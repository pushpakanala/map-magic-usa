import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import StatePage from './pages/StatePage';
import CollegePage from './pages/CollegePage';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/state/:stateName" element={<StatePage />} />
          <Route path="/college/:collegeName" element={<CollegePage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;