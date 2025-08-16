import { useState } from 'react';
import Sidebar from '../layout/sidebar';
import Header from '../layout/header';
import NumericDisplay from '../ui/NumericDisplay';
import DigitalClock from '../ui/DigitalClock';
import SearchBar from '../ui/SearchBar';
import { BarChart, LineChart, PieChart, PentagonalChart, GaugeChart } from '../charts/chartSetup';
import '../../styles/main.css';

const Overview = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample data for charts (you can replace with your actual data)
  const cachePerformanceData = {
    labels: ['HTML', 'CSS', 'JavaScript', 'Images', 'Fonts', 'API'],
    datasets: [{
      label: 'Cache Hit',
      data: [85, 92, 78, 95, 88, 72],
      backgroundColor: '#3b82f6',
      borderRadius: 6,
      borderSkipped: false,
    }, {
      label: 'Cache Miss',
      data: [10, 6, 15, 3, 8, 20],
      backgroundColor: '#f97316',
      borderRadius: 6,
      borderSkipped: false,
    }, {
      label: 'No Cache',
      data: [5, 2, 7, 2, 4, 8],
      backgroundColor: '#6b7280',
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  const performanceMetricsData = {
    labels: ['Aug 01', 'Aug 02', 'Aug 03', 'Aug 04', 'Aug 05', 'Aug 06'],
    datasets: [{
      label: 'CPU Usage',
      data: [65, 70, 68, 72, 75, 73],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
    }, {
      label: 'Memory Usage',
      data: [55, 60, 58, 62, 65, 63],
      borderColor: '#f97316',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
    },
  ]
  };

  const dailyVisitsData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    datasets: [{
      data: [1234, 2234, 3234, 4234],
      backgroundColor: [
        "rgba(117,169,255,0.6)", 
        "rgba(148,223,215,0.6)", 
        "rgba(208,129,222,0.6)", 
        "rgba(247,127,167,0.6)"
      ]
    }]
  };

  const browserPerformanceData = {
    labels: ['Load Time', 'First Paint', 'DOM Loaded', 'Cache Efficiency', 'JS Execution'],
    datasets: [
      {
        label: 'Chrome',
        data: [75, 80, 85, 85, 78],
        borderColor: '#ffffff',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#3b82f6'
      },
      {
        label: 'Firefox',
        data: [68, 75, 80, 78, 72],
        borderColor: '#ffffff',
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#f97316'
      },
      {
        label: 'Safari',
        data: [82, 85, 78, 92, 76],
        borderColor: '#ffffff',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#10b981'
      },
      {
        label: 'IE',
        data: [55, 60, 52, 65, 58],
        borderColor: '#ffffff',
        backgroundColor: 'rgba(107, 114, 128, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#6b7280'
      }
    ]
  };

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
          <h1 id="pageTitle" className="h3 text-dark mb-0">
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
            <div className="col-lg-6 col-md-12 mb-4">
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
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container h-100">
                <h3>System Health</h3>
                <GaugeChart 
                  value={75}
                  maxValue={100}
                  unit="%"
                  height={250}
                  colors={{
                    primary: '#3b82f6',
                    secondary: '#6b7280',
                    text: '#000000'
                  }}
                />
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
                <BarChart 
                  data={cachePerformanceData}
                  height={300}
                  colors={{
                    primary: '#3b82f6',
                    secondary: '#f97316',
                    tertiary: '#6b7280',
                    text: '#000000'
                  }}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container">
                <h3>Performance Metrics</h3>
                <LineChart 
                  data={performanceMetricsData}
                  height={300}
                  colors={{
                    primary: '#3b82f6',
                    secondary: '#f97316',
                    text: '#000000'
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container">
                <h3>Daily Visits</h3>
                <PieChart 
                  data={dailyVisitsData}
                  height={300}
                  colors={{
                    text: '#000000'
                  }}
                  showLegend={true}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container">
                <h3>Browser Performance</h3>
                <PentagonalChart 
                  data={browserPerformanceData}
                  height={300}
                  colors={{
                    primary: '#3b82f6',
                    secondary: '#f97316',
                    tertiary: '#10b981',
                    quaternary: '#6b7280',
                    text: '#000000'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Overview;