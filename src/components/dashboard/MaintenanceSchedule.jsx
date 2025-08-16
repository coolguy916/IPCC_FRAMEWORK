// import React from 'react';
import React, { useEffect, useState } from 'react';
import Sidebar from '../layout/sidebar';
import Header from '../layout/header';
import DigitalClock from '../ui/DigitalClock';
import SearchBar from '../ui/SearchBar';
import '../../styles/main.css';


const MaintenanceSchedule = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNavClick = () => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  };
  return (
    <div>
      <button className="mobile-toggle" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <Sidebar isOpen={sidebarOpen} onNavClick={handleNavClick} />

      <main className="main-content">
        <Header>
          <h1 id="pageTitle" className="h3 text-light mb-0">
            <strong>Data Analytics</strong>
          </h1>
          <div className="d-flex align-items-center gap-3">
            <SearchBar />
            <DigitalClock />
          </div>
        </Header>

        <div className="maintenance-schedule-container">
          <h1>Maintenance Schedule</h1>
          {/* Add your maintenance calendar or schedule components here */}
        </div>
      </main>
    </div>
  );
};

export default MaintenanceSchedule;
