import { useEffect, useState, useRef } from 'react';
import Sidebar from '../layout/sidebar';
import DigitalClock from '../ui/DigitalClock';
import SearchBar from '../ui/SearchBar';
import NumericDisplay from '../ui/NumericDisplay';
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

// Header component - Same as Overview
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

const ForecastingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // States for forecasting
  const [uploadedFile, setUploadedFile] = useState(null);
  const [forecastType, setForecastType] = useState('temperature');
  const [classificationModel, setClassificationModel] = useState('linear');
  const [forecastDates, setForecastDates] = useState({ 
    from: new Date().toISOString().split('T')[0],
    to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [manualData, setManualData] = useState('');
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [lastPrediction, setLastPrediction] = useState(null);
  
  // Refs for file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

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

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      console.log('File uploaded:', file.name);
    }
  };

  // Handle manual data input
  const handleManualDataSubmit = () => {
    if (manualData.trim()) {
      console.log('Manual data submitted:', manualData);
      alert('Manual data has been processed successfully!');
    }
  };

  // Generate forecast simulation
  const runForecastSimulation = () => {
    const prediction = {
      accuracy: (Math.random() * 15 + 80).toFixed(1),
      confidence: (Math.random() * 20 + 75).toFixed(1),
      trend: Math.random() > 0.5 ? 'Increasing' : 'Decreasing',
      timestamp: new Date().toLocaleTimeString()
    };
    setLastPrediction(prediction);
    alert(`Forecast simulation completed! Accuracy: ${prediction.accuracy}%`);
  };

  // Toggle real-time forecasting
  const toggleRealTimeForecasting = () => {
    setIsRealTimeActive(!isRealTimeActive);
    if (!isRealTimeActive) {
      alert('Real-time forecasting activated!');
    } else {
      alert('Real-time forecasting deactivated!');
    }
  };

  // Date change handlers
  const handleForecastDateChange = (field, value) => {
    setForecastDates(prev => ({ ...prev, [field]: value }));
  };

  // Generate forecast chart data based on date range
  const getForecastData = (type) => {
    const fromDate = new Date(forecastDates.from || new Date());
    const toDate = new Date(forecastDates.to || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    const daysDiff = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) || 30;
    const numPoints = Math.min(Math.max(daysDiff, 7), 60); // Limit between 7 and 60 points
    
    const labels = [];
    for (let i = 0; i < numPoints; i++) {
      const date = new Date(fromDate);
      date.setDate(fromDate.getDate() + i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    switch(type) {
      case 'temperature':
        return {
          labels,
          datasets: [
            {
              label: 'Predicted Temperature (°C)',
              data: Array.from({length: numPoints}, (_, i) => {
                const base = 25 + Math.sin(i * 0.3) * 5;
                return (base + (Math.random() - 0.5) * 3).toFixed(1);
              }),
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 2,
              pointHoverRadius: 5,
            },
            {
              label: 'Historical Average (°C)',
              data: Array.from({length: numPoints}, (_, i) => {
                return (24 + Math.sin(i * 0.3) * 4).toFixed(1);
              }),
              borderColor: '#6b7280',
              backgroundColor: 'rgba(107, 114, 128, 0.1)',
              borderWidth: 2,
              fill: false,
              tension: 0.4,
              pointRadius: 1,
              borderDash: [5, 5],
            }
          ]
        };
      case 'humidity':
        return {
          labels,
          datasets: [
            {
              label: 'Predicted Humidity (%)',
              data: Array.from({length: numPoints}, () => 
                (Math.random() * 30 + 50).toFixed(1)
              ),
              borderColor: '#06b6d4',
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            }
          ]
        };
      case 'rainfall':
        return {
          labels,
          datasets: [
            {
              label: 'Predicted Rainfall (mm)',
              data: Array.from({length: numPoints}, () => 
                Math.random() * 50
              ),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            }
          ]
        };
      case 'emissions':
        return {
          labels,
          datasets: [
            {
              label: 'Predicted CO2 Emissions (ppm)',
              data: Array.from({length: numPoints}, (_, i) => 
                (400 + i * 0.1 + (Math.random() - 0.5) * 5).toFixed(2)
              ),
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            }
          ]
        };
      default:
        return {
          labels,
          datasets: [
            {
              label: 'Forecast Data',
              data: Array.from({length: numPoints}, () => Math.random() * 100),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            }
          ]
        };
    }
  };

  // Generate classification chart data
  const getClassificationData = (model) => {
    const categories = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    
    switch(model) {
      case 'linear':
        return {
          labels: categories,
          datasets: [
            {
              label: 'Linear Regression (%)',
              data: [15, 25, 35, 20, 5],
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
              borderRadius: 8,
              borderSkipped: false,
            }
          ]
        };
      case 'polynomial':
        return {
          labels: categories,
          datasets: [
            {
              label: 'Polynomial Regression (%)',
              data: [10, 30, 40, 15, 5],
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
              borderRadius: 8,
              borderSkipped: false,
            }
          ]
        };
      case 'neural':
        return {
          labels: categories,
          datasets: [
            {
              label: 'Neural Network (%)',
              data: [8, 22, 45, 20, 5],
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
              borderRadius: 8,
              borderSkipped: false,
            }
          ]
        };
      case 'ensemble':
        return {
          labels: categories,
          datasets: [
            {
              label: 'Ensemble Method (%)',
              data: [12, 28, 38, 18, 4],
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
              borderRadius: 8,
              borderSkipped: false,
            }
          ]
        };
      default:
        return {
          labels: categories,
          datasets: [
            {
              label: 'Classification (%)',
              data: [20, 25, 30, 20, 5],
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'],
              borderRadius: 8,
              borderSkipped: false,
            }
          ]
        };
    }
  };

  return (
    <div>
      {/* Mobile toggle button */}
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
            <strong>Forecasting & Prediction</strong>
          </h1>
        </Header>

        <div className="content p-4">
          {/* First row: Data Input and Forecast Controls */}
          <div className="row mb-4">
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container" style={{ height: 'auto', minHeight: '420px' }}>
                <h3>Manual Data Input</h3>
                
                {/* File Upload */}
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                    Upload Data File
                  </h5>
                  <div style={{ 
                    border: '2px dashed var(--border-color)', 
                    borderRadius: '12px', 
                    padding: '24px', 
                    textAlign: 'center',
                    backgroundColor: 'rgba(248, 250, 252, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      setUploadedFile(files[0]);
                    }
                  }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.json"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: '48px', color: '#6b7280', marginBottom: '12px' }}></i>
                    <p style={{ margin: '0', fontSize: '16px', color: '#6b7280' }}>
                      {uploadedFile ? `File: ${uploadedFile.name}` : 'Click to upload or drag and drop'}
                    </p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#9ca3af' }}>
                      Supports CSV, Excel, JSON files
                    </p>
                  </div>
                </div>

                {/* Manual Data Entry */}
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                    Manual Data Entry
                  </h5>
                  <textarea
                    className="form-control"
                    rows="6"
                    placeholder="Enter your data here (JSON format or comma-separated values)&#10;Example:&#10;25.5, 26.0, 24.8, 27.2, 26.5&#10;or&#10;{'temperature': [25.5, 26.0], 'humidity': [60, 65]}"
                    value={manualData}
                    onChange={(e) => setManualData(e.target.value)}
                    style={{ 
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      padding: '12px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      resize: 'vertical'
                    }}
                  />
                  <button 
                    className="btn btn-generate-report mt-3"
                    onClick={handleManualDataSubmit}
                    style={{ width: '100%' }}
                  >
                    Process Manual Data
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container" style={{ height: 'auto', minHeight: '420px' }}>
                <h3>Forecast Controls</h3>
                
                {/* Model Selection */}
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                    Forecasting Model
                  </h5>
                  <select 
                    className="form-select"
                    value={classificationModel}
                    onChange={(e) => setClassificationModel(e.target.value)}
                    style={{ 
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      padding: '12px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="linear">Linear Regression</option>
                    <option value="polynomial">Polynomial Regression</option>
                    <option value="neural">Neural Network</option>
                    <option value="ensemble">Ensemble Method</option>
                  </select>
                </div>

                {/* Date Range Selection */}
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                    Forecast Date Range
                  </h5>
                  <div className="row">
                    <div className="col-6">
                      <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                        From Date
                      </label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={forecastDates.from}
                        onChange={(e) => handleForecastDateChange('from', e.target.value)}
                        style={{ 
                          borderRadius: '8px',
                          border: '2px solid var(--border-color)',
                          padding: '12px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
                        To Date
                      </label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={forecastDates.to}
                        onChange={(e) => handleForecastDateChange('to', e.target.value)}
                        style={{ 
                          borderRadius: '8px',
                          border: '2px solid var(--border-color)',
                          padding: '12px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <button 
                    className="btn btn-generate-report"
                    onClick={runForecastSimulation}
                    style={{ 
                      backgroundColor: '#3b82f6',
                      padding: '14px 24px',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    <i className="fas fa-play me-2"></i>
                    Run Forecast Simulation
                  </button>
                  
                  <button 
                    className={`btn ${isRealTimeActive ? 'btn-secondary' : 'btn-generate-report'}`}
                    onClick={toggleRealTimeForecasting}
                    style={{ 
                      backgroundColor: isRealTimeActive ? '#ef4444' : '#10b981',
                      padding: '14px 24px',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    <i className={`fas ${isRealTimeActive ? 'fa-stop' : 'fa-broadcast-tower'} me-2`}></i>
                    {isRealTimeActive ? 'Stop Real-Time' : 'Start Real-Time Forecast'}
                  </button>
                </div>

                {/* Last Prediction Results */}
                {lastPrediction && (
                  <div style={{ 
                    marginTop: '24px',
                    padding: '16px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <h6 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                      Latest Prediction ({lastPrediction.timestamp})
                    </h6>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      <div>Accuracy: <strong>{lastPrediction.accuracy}%</strong></div>
                      <div>Confidence: <strong>{lastPrediction.confidence}%</strong></div>
                      <div>Trend: <strong>{lastPrediction.trend}</strong></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Second row: Charts Side by Side */}
          <div className="row mb-4">
            {/* Forecast Prediction Chart */}
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container" style={{ height: '500px' }}>
                <div className="chart-header d-flex flex-wrap justify-content-between align-items-center mb-3">
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>
                    Forecast Prediction Trends
                  </h3>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <select 
                      className="chart-selector form-select"
                      value={forecastType}
                      onChange={(e) => setForecastType(e.target.value)}
                      style={{ 
                        width: 'auto', 
                        fontSize: '0.875rem', 
                        padding: '0.5rem', 
                        borderRadius: '6px', 
                        border: '1px solid #d1d5db',
                        minWidth: '180px'
                      }}
                    >
                      <option value="temperature">Temperature Forecast</option>
                      <option value="humidity">Humidity Forecast</option>
                      <option value="rainfall">Rainfall Forecast</option>
                      <option value="emissions">CO2 Emissions Forecast</option>
                    </select>
                  </div>
                </div>
                <div style={{ height: 'calc(100% - 80px)', padding: '1rem' }}>
                  <LineChart 
                    data={getForecastData(forecastType)}
                    height={400}
                    colors={{
                      primary: '#ef4444',
                      secondary: '#6b7280',
                      tertiary: '#3b82f6',
                      text: '#000000',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Classification Chart */}
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container" style={{ height: '500px' }}>
                <div className="chart-header d-flex flex-wrap justify-content-between align-items-center mb-3">
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>
                    Risk Assessment Classification
                  </h3>
                  <select 
                    className="chart-selector form-select"
                    value={classificationModel}
                    onChange={(e) => setClassificationModel(e.target.value)}
                    style={{ 
                      width: 'auto', 
                      fontSize: '0.875rem', 
                      padding: '0.5rem', 
                      borderRadius: '6px', 
                      border: '1px solid #d1d5db',
                      minWidth: '160px'
                    }}
                  >
                    <option value="linear">Linear</option>
                    <option value="polynomial">Polynomial</option>
                    <option value="neural">Neural Network</option>
                    <option value="ensemble">Ensemble</option>
                  </select>
                </div>
                <div style={{ height: 'calc(100% - 80px)', padding: '1rem' }}>
                  <BarChart 
                    data={getClassificationData(classificationModel)}
                    height={400}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                        },
                        tooltip: {
                          mode: 'index',
                          intersect: false,
                        }
                      },
                      scales: {
                        x: {
                          display: true,
                          title: {
                            display: true,
                            text: 'Risk Categories'
                          }
                        },
                        y: {
                          display: true,
                          title: {
                            display: true,
                            text: 'Percentage (%)'
                          },
                          beginAtZero: true,
                          max: 50
                        }
                      }
                    }}
                    colors={{
                      primary: '#10b981',
                      secondary: '#3b82f6',
                      tertiary: '#f59e0b',
                      text: '#000000',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row: NumericDisplay components */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <NumericDisplay 
                id="accuracy"
                value={lastPrediction ? lastPrediction.accuracy : 87.5}
                label="Model Accuracy"
                iconClass="fas fa-bullseye"
                isPercentage={true}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <NumericDisplay 
                id="confidence"
                value={lastPrediction ? lastPrediction.confidence : 92.3}
                label="Confidence Level"
                iconClass="fas fa-chart-line"
                isPercentage={true}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <NumericDisplay 
                id="predictions"
                value={1247}
                label="Total Predictions"
                iconClass="fas fa-calculator"
              />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <div style={{ 
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '20px',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'var(--shadow-medium)',
              }}>
                <div className="stat-icon" style={{ fontSize: '28px', color: isRealTimeActive ? '#10b981' : '#6b7280', marginBottom: '12px' }}>
                  <i className="fas fa-broadcast-tower"></i>
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Real-Time Status
                </div>
                <div style={{ fontSize: '14px', color: isRealTimeActive ? '#10b981' : '#6b7280', fontWeight: '500' }}>
                  {isRealTimeActive ? 'ACTIVE' : 'INACTIVE'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForecastingPage;
