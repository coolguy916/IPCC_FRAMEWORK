import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Overview from './components/dashboard/AgricultureDashboard';  // Adjust path// Import other components as you create them
import HistoricalData from './components/dashboard/Data';
import FinanceAnalytics from './components/dashboard/Finance';
import Articles from './components/dashboard/Forecast';
import Maintenance from './components/dashboard/Maintenance';
import TeamProfile from './components/dashboard/TeamProfile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<Overview />} />
          {/* Add other routes as you create the components */}
          <Route path="/historical-data" element={<HistoricalData />} />
          <Route path="/finance-analytics" element={<FinanceAnalytics />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/team-profile" element={<TeamProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;