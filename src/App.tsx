import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import StatePage from './pages/StatePage';
import CollegePage from './pages/CollegePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/state/:stateName" element={<StatePage />} />
        <Route path="/college/:collegeName" element={<CollegePage />} />
      </Routes>
    </Router>
  );
}

export default App;