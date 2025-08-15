import React, { useEffect, useState } from 'react';
import Sidebar from '../layout/sidebar';
import Header from '../layout/header';
import NumericDisplay from '../ui/NumericDisplay';
import DigitalClock from '../ui/DigitalClock';
import SearchBar from '../ui/SearchBar';
import { initBarChart, initLineChart, initPieChart, initPentagonalChart, initGaugeChart } from '../charts/chartInitializers';
import '../../styles/main.css';

const Overview = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Initialize charts when component mounts
    const initCharts = () => {
      initBarChart('barChart');
      initLineChart('lineChart');
      initPieChart('pieChart');
      initPentagonalChart('pentagonalChart');
      initGaugeChart('gaugeChart');
    };

    // Wait for the DOM to be fully rendered
    setTimeout(initCharts, 100);
  }, []);

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
            <strong>Overview</strong>
          </h1>
          <div className="d-flex align-items-center gap-3">
            <SearchBar />
            <DigitalClock />
          </div>
        </Header>

        <div className="content p-4">
          {/* First row: Report Summary and System Health Gauge */}
          <div className="row mb-4">
            <div className="col-lg-8 col-md-12 mb-4">
              <div className="report-summary h-100 position-relative">
                <h3>Report Summary</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute 
                  irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <a href="Report.html" className="btn btn-generate-report mt-3">
                  Generate Report
                </a>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 mb-4">
              <div className="chart-container">
                <h3>System Health</h3>
                <canvas id="gaugeChart"></canvas>
              </div>
            </div>
          </div>

          {/* Second row: Numeric Displays */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <NumericDisplay 
                id="stat1"
                value={85}
                label="Lorem Ipsum"
                iconClass="fas fa-chart-line"
                isPercentage={true}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <NumericDisplay 
                id="stat2"
                value={120}
                label="Dolor Sit"
                iconClass="fas fa-dollar-sign"
              />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <NumericDisplay 
                id="stat3"
                value={95}
                label="Amet Consectetur"
                iconClass="fas fa-smile"
                isPercentage={true}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <NumericDisplay 
                id="stat4"
                value={45}
                label="Adipiscing Elit"
                iconClass="fas fa-users"
              />
            </div>
          </div>

          {/* Charts */}
          <div className="row mb-4">
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container">
                <h3>Cache Performance</h3>
                <canvas id="barChart"></canvas>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container">
                <h3>Performance Metrics</h3>
                <canvas id="lineChart"></canvas>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container">
                <h3>Daily Visits</h3>
                <canvas id="pieChart"></canvas>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container">
                <h3>Browser Performance</h3>
                <canvas id="pentagonalChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Overview;