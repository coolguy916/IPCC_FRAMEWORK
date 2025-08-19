import React, { useEffect, useState } from 'react';
import Sidebar from '../layout/sidebar';
import DigitalClock from '../ui/DigitalClock';
import SearchBar from '../ui/SearchBar';
import { LineChart, BarChart } from '../charts/chartSetup';
import NumericDisplay from '../ui/NumericDisplay';
import '../../styles/main.css';

// SVG Icon for Sidebar Toggle (Hamburger Menu)
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

// SVG Icon for Search Button
const SearchIcon = () => (
  <svg
    width="20"
    height= "20"
    viewBox="0 0 0 0 "
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

// Header Component
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
        <div className="">
          <DigitalClock />
        </div>
      </div>
    </header>
  );
};

const Data = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [lineChartType, setLineChartType] = useState('soil');
  const [barChartType, setBarChartType] = useState('costs');
  const [lineChartDates, setLineChartDates] = useState({ from: '', to: '' });
  const [barChartDates, setBarChartDates] = useState({ from: '', to: '' });
  const [historyDates, setHistoryDates] = useState({ from: '', to: '' });
  const [agriculturalData, setAgriculturalData] = useState([]);

  // Generate dummy agricultural data
  const loadAgriculturalData = (fromDate = null, toDate = null) => {
    const start = fromDate ? new Date(fromDate) : new Date('2024-01-01');
    const end = toDate ? new Date(toDate) : new Date('2025-12-01');
    const data = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const monthIndex = (currentDate.getFullYear() - 2024) * 12 + currentDate.getMonth();
      const organicMatter = parseFloat((4.8 + monthIndex * 0.05).toFixed(2)); // 4.8–6.0%
      const totalCarbon = parseFloat((4.0 + monthIndex * 0.05).toFixed(2)); // 4.0–5.2%
      const nitrogen = parseFloat((0.07 + monthIndex * 0.005).toFixed(3)); // 0.07–0.20%
      const pH = parseFloat((5.8 + monthIndex * 0.03).toFixed(1)); // 5.8–7.2
      const yieldKgHa = parseInt((2500 + monthIndex * 83).toFixed(0)); // 2500–4500 kg/ha
      const gradeA = parseInt((50 + monthIndex * 0.83).toFixed(0)); // 50–70%
      const gradeB = parseInt((40 - monthIndex * 0.83).toFixed(0)); // 40–20%
      const gradeC = parseInt((100 - gradeA - gradeB).toFixed(0)); // 15–5%
      
      // Improved status classification
      let status = 'Average';
      if (nitrogen < 0.10 || organicMatter < 5.0 || pH < 6.0) {
        status = 'Bad';
      } else if (nitrogen > 0.15 && organicMatter > 5.5 && pH > 6.5) {
        status = 'Good';
      }

      data.push({
        timestamp: currentDate.toISOString().split('T')[0],
        soil_metrics: {
          organic_matter: organicMatter,
          total_carbon: totalCarbon,
          nitrogen: nitrogen,
          pH: pH,
        },
        yield: {
          crop_type: 'Maize',
          monthly_yield_kg_ha: yieldKgHa,
          grade_distribution: { A: gradeA, B: gradeB, C: gradeC },
          harvest_date: currentDate.toISOString().split('T')[0],
        },
        costs: {
          conventional: {
            fertilizers: 120 + Math.random() * 60,
            pesticides: 60 + Math.random() * 40,
            labor: 150 + Math.random() * 100,
          },
          regenerative: {
            microalgae: 90 + Math.random() * 50,
            fertilizers: 20 + Math.random() * 30,
            labor: 120 + Math.random() * 80,
          },
        },
        eutrophication: {
          nitrogen_runoff_kg_ha: {
            conventional: 15 + Math.random() * 25, // 15–40 kg/ha
            regenerative: 5 + Math.random() * 15, // 5–20 kg/ha
          },
          phosphorus_runoff_kg_ha: {
            conventional: 3 + Math.random() * 5, // 3–8 kg/ha
            regenerative: 1 + Math.random() * 3, // 1–4 kg/ha
          },
        },
        status: status,
      });

      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Calculate totals and derived metrics
    data.forEach((item) => {
      item.costs.conventional.total = (
        item.costs.conventional.fertilizers +
        item.costs.conventional.pesticides +
        item.costs.conventional.labor
      ).toFixed(2);
      item.costs.regenerative.total = (
        item.costs.regenerative.microalgae +
        item.costs.regenerative.fertilizers +
        item.costs.regenerative.labor
      ).toFixed(2);
      item.costs.savings_percent = (
        ((item.costs.conventional.total - item.costs.regenerative.total) / item.costs.conventional.total) * 100
      ).toFixed(2);
      item.eutrophication.potential_kg_PO4_eq_ha = {
        conventional: (
          item.eutrophication.nitrogen_runoff_kg_ha.conventional * 0.42 +
          item.eutrophication.phosphorus_runoff_kg_ha.conventional * 3.06
        ).toFixed(2),
        regenerative: (
          item.eutrophication.nitrogen_runoff_kg_ha.regenerative * 0.42 +
          item.eutrophication.phosphorus_runoff_kg_ha.regenerative * 3.06
        ).toFixed(2),
      };
      item.eutrophication.reduction_percent = (
        ((item.eutrophication.potential_kg_PO4_eq_ha.conventional - item.eutrophication.potential_kg_PO4_eq_ha.regenerative) /
          item.eutrophication.potential_kg_PO4_eq_ha.conventional) * 100
              ).toFixed(2);
      item.status = status;
    });

    setAgriculturalData(data);
  };

  // Filter data based on date range
  const getFilteredData = (data, fromDate, toDate) => {
    if (!fromDate && !toDate) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item.timestamp);
      const start = fromDate ? new Date(fromDate) : new Date('2024-01-01');
      const end = toDate ? new Date(toDate) : new Date('2025-12-31');
      
      return itemDate >= start && itemDate <= end;
    });
  };

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    loadAgriculturalData();

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNavClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleHistoryDateChange = (field, value) => {
    setHistoryDates((prev) => ({ ...prev, [field]: value }));
  };

  const handleLineChartDateChange = (field, value) => {
    setLineChartDates((prev) => ({ ...prev, [field]: value }));
  };

  const handleBarChartDateChange = (field, value) => {
    setBarChartDates((prev) => ({ ...prev, [field]: value }));
  };

  // Generate line chart data
  const getLineChartData = (chartType) => {
    const filteredData = getFilteredData(agriculturalData, lineChartDates.from, lineChartDates.to);
    const labels = filteredData.map((item) =>
      new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    );

    switch (chartType) {
      case 'soil':
        return {
          labels,
          datasets: [
            {
              label: 'Organic Matter (%)',
              data: filteredData.map((item) => item.soil_metrics.organic_matter),
              borderColor: '#2ecc71',
              backgroundColor: 'rgba(46, 204, 113, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              fill: true,
            },
            {
              label: 'Soil Nitrogen (%)',
              data: filteredData.map((item) => item.soil_metrics.nitrogen),
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              fill: true,
            },
            {
              label: 'Total Carbon (%)',
              data: filteredData.map((item) => item.soil_metrics.total_carbon),
              borderColor: '#f1c40f',
              backgroundColor: 'rgba(241, 196, 15, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              fill: true,
            },
          ],
        };
      case 'yield':
        return {
          labels,
          datasets: [
            {
              label: 'Maize Yield (kg/ha)',
              data: filteredData.map((item) => item.yield.monthly_yield_kg_ha),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              fill: true,
            },
          ],
        };
      case 'costs':
        return {
          labels,
          datasets: [
            {
              label: 'Cost Savings (%)',
              data: filteredData.map((item) => item.costs.savings_percent),
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              fill: true,
            },
          ],
        };
      default:
        return { labels, datasets: [] };
    }
  };

  // Generate bar chart data
  const getBarChartData = (chartType) => {
    const filteredData = getFilteredData(agriculturalData, barChartDates.from, barChartDates.to);
    const labels = filteredData.map((item) =>
      new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    );

    switch (chartType) {
      case 'costs':
        return {
          labels,
          datasets: [
            {
              label: 'Conventional Costs (USD/ha)',
              data: filteredData.map((item) => item.costs.conventional.total),
              backgroundColor: '#3b82f6',
              borderRadius: 6,
            },
            {
              label: 'Regenerative Costs (USD/ha)',
              data: filteredData.map((item) => item.costs.regenerative.total),
              backgroundColor: '#f97316',
              borderRadius: 6,
            },
          ],
        };
      case 'eutrophication':
        return {
          labels,
          datasets: [
            {
              label: 'Conventional Eutrophication (kg PO₄-eq/ha)',
              data: filteredData.map((item) => item.eutrophication.potential_kg_PO4_eq_ha.conventional),
              backgroundColor: '#3b82f6',
              borderRadius: 6,
            },
            {
              label: 'Regenerative Eutrophication (kg PO₄-eq/ha)',
              data: filteredData.map((item) => item.eutrophication.potential_kg_PO4_eq_ha.regenerative),
              backgroundColor: '#f97316',
              borderRadius: 6,
            },
          ],
        };
      case 'yield_grades':
        return {
          labels,
          datasets: [
            {
              label: 'Grade A (%)',
              data: filteredData.map((item) => item.yield.grade_distribution.A),
              backgroundColor: '#3b82f6',
              borderRadius: 6,
            },
            {
              label: 'Grade B (%)',
              data: filteredData.map((item) => item.yield.grade_distribution.B),
              backgroundColor: '#f97316',
              borderRadius: 6,
            },
            {
              label: 'Grade C (%)',
              data: filteredData.map((item) => item.yield.grade_distribution.C),
              backgroundColor: '#10b981',
              borderRadius: 6,
            },
          ],
        };
      default:
        return { labels, datasets: [] };
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
            <strong>Regenerative Farming Dashboard</strong>
          </h1>
        </Header>

        <div className="content p-4">
          {/* Numeric Displays - Fixed Layout */}
          <div className="d-grid mb-4" style={{
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.75rem'
          }}>
            <NumericDisplay
              id="organic-matter"
              value={agriculturalData.length > 0 ? agriculturalData[agriculturalData.length - 1].soil_metrics.organic_matter : 4.8}
              label="Organic Matter"
              iconClass="fas fa-leaf"
              isPercentage={true}
            />
            <NumericDisplay
              id="nitrogen"
              value={agriculturalData.length > 0 ? agriculturalData[agriculturalData.length - 1].soil_metrics.nitrogen : 0.07}
              label="Soil Nitrogen"
              iconClass="fas fa-seedling"
              isPercentage={true}
            />
            <NumericDisplay
              id="carbon-content"
              value={agriculturalData.length > 0 ? agriculturalData[agriculturalData.length - 1].soil_metrics.total_carbon : 4.0}
              label="Total Carbon"
              iconClass="fas fa-cloud"
              isPercentage={true}
            />
            <NumericDisplay
              id="yield"
              value={agriculturalData.length > 0 ? agriculturalData[agriculturalData.length - 1].yield.monthly_yield_kg_ha : 2500}
              label="Monthly Yield (kg/ha)"
              iconClass="fas fa-tractor"
              isPercentage={false}
            />
            <NumericDisplay
              id="eutrophication-reduction"
              value={agriculturalData.length > 0 ? agriculturalData[agriculturalData.length - 1].eutrophication.reduction_percent : 20}
              label="Eutrophication Reduction"
              iconClass="fas fa-water"
              isPercentage={true}
            />
          </div>

          {/* Historical Data Table */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="table-container">
                <div className="table-header">
                  <h3 className="table-title">Agricultural Data History</h3>
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
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Crop Type</th>
                      <th>Organic Matter (%)</th>
                      <th>Nitrogen (%)</th>
                      <th>Carbon Content (%)</th>
                      <th>Monthly Yield (kg/ha)</th>
                      <th>Eutrophication (kg PO₄-eq/ha)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredData(agriculturalData, historyDates.from, historyDates.to).map((item, index) => (
                      <tr key={index}>
                        <td>{new Date(item.timestamp).toLocaleDateString('en-US')}</td>
                        <td>{item.yield.crop_type}</td>
                        <td>{item.soil_metrics.organic_matter}</td>
                        <td>{item.soil_metrics.nitrogen}</td>
                        <td>{item.soil_metrics.total_carbon}</td>
                        <td>{item.yield.monthly_yield_kg_ha}</td>
                        <td>{item.eutrophication.potential_kg_PO4_eq_ha.regenerative}</td>
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
                  <div className="d-flex align-items-center gap-3">
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
                    <select
                      className="form-select"
                      style={{ minWidth: '150px', maxWidth: '200px', marginBottom: '20px' }}
                      value={lineChartType}
                      onChange={(e) => setLineChartType(e.target.value)}
                    >
                      <option value="soil">Soil Health</option>
                      <option value="yield">Crop Yield</option>
                      <option value="costs">Cost Savings</option>
                    </select>
                  </div>
                </div>
                <LineChart
                  data={getLineChartData(lineChartType)}
                  height={300}
                  colors={{
                    primary: '#3b82f6',
                    secondary: '#f97316',
                    tertiary: '#10b981',
                    text: '#000000',
                  }}
                />
              </div>
            </div>

            {/* Bar Chart */}
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Performance by Category</h3>
                  <div className="d-flex align-items-center gap-3">
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
                    <select
                      className="form-select"
                      style={{ minWidth: '150px', maxWidth: '200px', marginBottom: '20px'}}
                      value={barChartType}
                      onChange={(e) => setBarChartType(e.target.value)}
                    >
                      <option value="costs">Cost Comparison</option>
                      <option value="eutrophication">Eutrophication Potential</option>
                      <option value="yield_grades">Yield Grades</option>
                    </select>
                  </div>
                </div>
                <BarChart
                  data={getBarChartData(barChartType)}
                  height={300}
                  colors={{
                    primary: '#3b82f6',
                    secondary: '#f97316',
                    tertiary: '#10b981',
                    text: '#000000',
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

export default Data;