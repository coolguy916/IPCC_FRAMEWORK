import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../layout/sidebar';
import DigitalClock from '../ui/DigitalClock';
import SearchBar from '../ui/SearchBar';
import { LineChart, BarChart } from '../charts/chartSetup';
import '../../styles/main.css';

// SVG Icon for Sidebar Toggle (Hamburger Menu) - Same as Overview 32x32
const HamburgerIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="hamburger-icon"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355ZM18.75 16C18.75 16.4142 18.4142 16.75 18 16.75H6C5.58579 16.75 5.25 16.4142 5.25 16C5.25 15.5858 5.58579 15.25 6 15.25H18C18.4142 15.25 18.75 15.5858 18.75 16ZM18 12.75C18.4142 12.75 18.75 12.4142 18.75 12C18.75 11.5858 18.4142 11.25 18 11.25H6C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75H18ZM18.75 8C18.75 8.41421 18.4142 8.75 18 8.75H6C5.58579 8.75 5.25 8.41421 5.25 8C5.25 7.58579 5.58579 7.25 6 7.25H18C18.4142 7.25 18.75 7.58579 18.75 8Z"
      fill="currentColor"
    />
  </svg>
);

// SVG Icon for Search Button - Same as Overview
const SearchIcon = () => (
  <svg
    width="20"
    height="45"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="search-icon"
  >
    <path
      d="M15.5 14H14.71L14.43 13.73C15.63 12.33 16.25 10.42 15.91 8.39C15.44 5.61 13.12 3.39 10.32 3.05C6.09 2.53 2.53 6.09 3.05 10.32C3.39 13.12 5.61 15.44 8.39 15.91C10.42 16.25 12.33 15.63 13.73 14.43L14 14.71V15.5L18.25 19.75C18.66 20.16 19.33 20.16 19.74 19.75C20.15 19.34 20.15 18.67 19.74 18.26L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
      fill="currentColor"
    />
  </svg>
);

// SVG Icon for Clock Button - Same as Overview
const ClockIcon = () => (
  <svg
    width="0"
    height="0"
    viewBox="0 0 0 0"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="clock-icon"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM15.07 11.25L14.17 12.17C13.45 12.89 13 13.5 13 15H11V14.5C11 13.39 11.45 12.39 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.89 13.1 7 12 7C10.9 7 10 7.89 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z"
      fill="currentColor"
    />
  </svg>
);

// Header component - UPDATE: Ganti FontAwesome dengan SVG dan tambah wrapper seperti Overview
const Header = ({ children, onToggleSidebar, sidebarOpen }) => {
  return (
    <header className={`header d-flex justify-content-between align-items-center ${sidebarOpen ? '' : 'expanded'}`}>
      <div className="d-flex align-items-center gap-3">
        <button className="desktop-toggle" onClick={onToggleSidebar}>
          <HamburgerIcon />
        </button>
        {children}
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="search-button">
          <SearchIcon />
          <SearchBar />
        </div>
        <div className="clock-button">
          <ClockIcon />
          <DigitalClock />
        </div>
      </div>
    </header>
  );
};

const HistoricalData = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Chart states
  const [lineChartType, setLineChartType] = useState('performance');
  const [barChartType, setBarChartType] = useState('cache');
  const [lineChartDates, setLineChartDates] = useState({ from: '', to: '' });
  const [barChartDates, setBarChartDates] = useState({ from: '', to: '' });
  const [historyDates, setHistoryDates] = useState({ from: '', to: '' });
  
  // Performance data state
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Load initial performance data
    loadPerformanceData();

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNavClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  // Generate sample performance data
  const loadPerformanceData = (fromDate = null, toDate = null) => {
    const now = new Date();
    const numEntries = 10;
    const data = [];
    
    for (let i = 0; i < numEntries; i++) {
      const timestamp = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const browser = ['Chrome', 'Firefox', 'Safari', 'IE'][Math.floor(Math.random() * 4)];
      const loadTime = (Math.random() * 4 + 1).toFixed(2) + 's';
      const cacheHitRate = (Math.random() * 30 + 65).toFixed(0) + '%';
      let status = 'Good';
      
      const hitRate = parseInt(cacheHitRate);
      if (hitRate >= 90) status = 'Excellent';
      else if (hitRate < 70) status = 'Poor';
      else if (hitRate < 80) status = 'Average';

      data.push({
        date: timestamp.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }),
        browser,
        loadTime,
        cacheHitRate,
        status
      });
    }
    
    setPerformanceData(data);
  };

  // Generate line chart data based on type
  const getLineChartData = (chartType) => {
    const now = new Date();
    const labels = [];
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    switch(chartType) {
      case 'performance':
        return {
          labels,
          datasets: [
            {
              label: 'Load Time (s)',
              data: Array.from({length: 14}, () => (Math.random() * 4 + 1).toFixed(2)),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointHoverRadius: 6,
            },
            {
              label: 'Cache Hit Rate (%)',
              data: Array.from({length: 14}, () => Math.random() * 30 + 65),
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointHoverRadius: 6,
            }
          ]
        };
      case 'browser':
        return {
          labels,
          datasets: [
            {
              label: 'Chrome (ms)',
              data: Array.from({length: 14}, () => Math.floor(Math.random() * 300 + 700)),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              fill: true
            },
            {
              label: 'Firefox (ms)',
              data: Array.from({length: 14}, () => Math.floor(Math.random() * 400 + 800)),
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              fill: true
            },
            {
              label: 'Safari (ms)',
              data: Array.from({length: 14}, () => Math.floor(Math.random() * 350 + 750)),
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              fill: true
            }
          ]
        };
      case 'errors':
        return {
          labels,
          datasets: [
            {
              label: '404 Errors',
              data: Array.from({length: 14}, () => Math.floor(Math.random() * 10)),
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              fill: true
            },
            {
              label: '500 Errors',
              data: Array.from({length: 14}, () => Math.floor(Math.random() * 5)),
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              fill: true
            }
          ]
        };
      case 'bandwidth':
        return {
          labels,
          datasets: [
            {
              label: 'Bandwidth (MB)',
              data: Array.from({length: 14}, () => (Math.random() * 5 + 2).toFixed(2)),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              fill: true
            },
            {
              label: 'CDN Usage (MB)',
              data: Array.from({length: 14}, () => (Math.random() * 3 + 1).toFixed(2)),
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              fill: true
            }
          ]
        };
      default:
        return {
          labels,
          datasets: [
            {
              label: 'Load Time (s)',
              data: Array.from({length: 14}, () => (Math.random() * 4 + 1).toFixed(2)),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              fill: true
            }
          ]
        };
    }
  };

  // Generate bar chart data based on type
  const getBarChartData = (chartType) => {
    switch(chartType) {
      case 'cache':
        const categories = ['Images', 'Scripts', 'Stylesheets', 'HTML', 'API Responses'];
        const hitRates = categories.map(() => Math.floor(Math.random() * 30) + 65);
        const missRates = categories.map((_,i) => 100 - hitRates[i]);
        
        return {
          labels: categories,
          datasets: [
            {
              label: 'Cache Hits (%)',
              data: hitRates,
              backgroundColor: '#3b82f6',
              borderRadius: 6,
              borderSkipped: false,
            },
            {
              label: 'Cache Misses (%)',
              data: missRates,
              backgroundColor: '#f97316',
              borderRadius: 6,
              borderSkipped: false,
            }
          ]
        };
      case 'resources':
        return {
          labels: ['HTML', 'CSS', 'JavaScript', 'Images', 'Fonts', 'Videos'],
          datasets: [
            {
              label: 'Load Time (ms)',
              data: [150, 180, 320, 450, 120, 580],
              backgroundColor: '#3b82f6',
              borderRadius: 6,
              borderSkipped: false,
            },
            {
              label: 'Size (KB)',
              data: [45, 75, 320, 750, 80, 2200],
              backgroundColor: '#f59e0b',
              borderRadius: 6,
              borderSkipped: false,
            }
          ]
        };
      case 'devices':
        return {
          labels: ['Desktop', 'Mobile', 'Tablet', 'Smart TV', 'Other'],
          datasets: [
            {
              label: 'Visitors (%)',
              data: [42, 38, 12, 5, 3],
              backgroundColor: [
                '#3b82f6',
                '#f97316',
                '#10b981',
                '#f59e0b',
                '#8b5cf6'
              ],
              borderRadius: 6,
              borderSkipped: false,
            }
          ]
        };
      case 'locations':
        return {
          labels: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'],
          datasets: [
            {
              label: 'Traffic (%)',
              data: [35, 30, 20, 8, 5, 2],
              backgroundColor: [
                '#ef4444',
                '#3b82f6',
                '#f59e0b',
                '#10b981',
                '#8b5cf6',
                '#f97316'
              ],
              borderRadius: 6,
              borderSkipped: false,
            }
          ]
        };
      default:
        return {
          labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
          datasets: [
            {
              label: 'Sample Data',
              data: [65, 75, 80, 72, 83],
              backgroundColor: '#3b82f6',
              borderRadius: 6,
              borderSkipped: false,
            }
          ]
        };
    }
  };

  // Handle date changes
  const handleHistoryDateChange = (field, value) => {
    setHistoryDates(prev => ({ ...prev, [field]: value }));
    if (historyDates.from && historyDates.to) {
      loadPerformanceData(historyDates.from, historyDates.to);
    }
  };

  const handleLineChartDateChange = (field, value) => {
    setLineChartDates(prev => ({ ...prev, [field]: value }));
  };

  const handleBarChartDateChange = (field, value) => {
    setBarChartDates(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      {/* Mobile toggle button - UPDATE: Ganti dengan SVG */}
      {isMobile && (
        <button className="mobile-toggle" onClick={toggleSidebar}>
          <HamburgerIcon />
        </button>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay show" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onNavClick={handleNavClick} />

      {/* Main content */}
      <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen}>
          <h1 id="pageTitle" className="h3 text-dark mb-0">
            <strong>Data Analytics</strong>
          </h1>
        </Header>

        <div className="content p-4">
          {/* Historical Data Table */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="table-container">
                <div className="table-header">
                  <h3 className="table-title">Performance History</h3>
                  
                  {/* Date picker filters */}
                  <div className="date-picker-container">
                    <label htmlFor="history_from">From:</label>
                    <input 
                      type="date" 
                      id="history_from" 
                      className="form-control"
                      value={historyDates.from}
                      onChange={(e) => handleHistoryDateChange('from', e.target.value)}
                    />
                    <label htmlFor="history_to">To:</label>
                    <input 
                      type="date" 
                      id="history_to" 
                      className="form-control"
                      value={historyDates.to}
                      onChange={(e) => handleHistoryDateChange('to', e.target.value)}
                    />
                  </div>
                </div>

                {/* Data table */}
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Browser</th>
                      <th>Load Time</th>
                      <th>Cache Hit Rate</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.date}</td>
                        <td>{item.browser}</td>
                        <td>{item.loadTime}</td>
                        <td>{item.cacheHitRate}</td>
                        <td>
                          <span className={`status-${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="row mb-4">
            {/* Line Chart */}
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Performance Metrics Over Time</h3>
                  <div className="date-picker-container">
                    <label htmlFor="line_from">From:</label>
                    <input 
                      type="date" 
                      id="line_from" 
                      className="form-control"
                      value={lineChartDates.from}
                      onChange={(e) => handleLineChartDateChange('from', e.target.value)}
                    />
                    <label htmlFor="line_to">To:</label>
                    <input 
                      type="date" 
                      id="line_to" 
                      className="form-control"
                      value={lineChartDates.to}
                      onChange={(e) => handleLineChartDateChange('to', e.target.value)}
                    />
                  </div>
                </div>
                <LineChart 
                  data={getLineChartData(lineChartType)}
                  height={300}
                  colors={{
                    primary: '#3b82f6',
                    secondary: '#f97316',
                    text: '#000000'
                  }}
                />
              </div>
              <div className="below-chart-controls">
                <div className="chart-controls">
                  <select 
                    className="chart-selector form-select"
                    value={lineChartType}
                    onChange={(e) => setLineChartType(e.target.value)}
                  >
                    <option value="performance">Load Time & Cache Rate</option>
                    <option value="browser">Browser Performance</option>
                    <option value="errors">Error Rates</option>
                    <option value="bandwidth">Bandwidth Usage</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Performance by Category</h3>
                  <div className="date-picker-container">
                    <label htmlFor="bar_from">From:</label>
                    <input 
                      type="date" 
                      id="bar_from" 
                      className="form-control"
                      value={barChartDates.from}
                      onChange={(e) => handleBarChartDateChange('from', e.target.value)}
                    />
                    <label htmlFor="bar_to">To:</label>
                    <input 
                      type="date" 
                      id="bar_to" 
                      className="form-control"
                      value={barChartDates.to}
                      onChange={(e) => handleBarChartDateChange('to', e.target.value)}
                    />
                  </div>
                </div>
                <BarChart 
                  data={getBarChartData(barChartType)}
                  height={300}
                  colors={{
                    primary: '#3b82f6',
                    secondary: '#f97316',
                    tertiary: '#6b7280',
                    text: '#000000'
                  }}
                />
              </div>
              <div className="below-chart-controls">
                <div className="chart-controls">
                  <select 
                    className="chart-selector form-select"
                    value={barChartType}
                    onChange={(e) => setBarChartType(e.target.value)}
                  >
                    <option value="cache">Cache Performance</option>
                    <option value="resources">Resource Loading</option>
                    <option value="devices">Device Types</option>
                    <option value="locations">Geographic Distribution</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoricalData;