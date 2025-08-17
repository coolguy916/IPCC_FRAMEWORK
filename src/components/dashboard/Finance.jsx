import { useEffect, useState } from 'react';
import Sidebar from '../layout/sidebar';
import DigitalClock from '../ui/DigitalClock';
import SearchBar from '../ui/SearchBar';
import NumericDisplay from '../ui/NumericDisplay';
import { LineChart, BarChart, PieChart, GaugeChart } from '../charts/chartSetup';
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

// SVG Icon for Clock Button
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

// Header component
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

const FinanceAnalytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Chart types and date states
  const [revenueChartType, setRevenueChartType] = useState('industry');
  const [sustainabilityChartType, setSustainabilityChartType] = useState('economic');
  const [sdgsChartType, setSdgsChartType] = useState('goals');
  const [environmentalChartType, setEnvironmentalChartType] = useState('emissions');
  const [investmentChartType, setInvestmentChartType] = useState('sectors');
  const [riskChartType, setRiskChartType] = useState('financial');
  
  const [revenueDates, setRevenueDates] = useState({ from: '', to: '' });
  const [sustainabilityDates, setSustainabilityDates] = useState({ from: '', to: '' });
  const [sdgsDates, setSdgsDates] = useState({ from: '', to: '' });
  const [environmentalDates, setEnvironmentalDates] = useState({ from: '', to: '' });
  const [investmentDates, setInvestmentDates] = useState({ from: '', to: '' });
  const [riskDates, setRiskDates] = useState({ from: '', to: '' });

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

  // Date change handlers
  const handleRevenueDateChange = (field, value) => {
    setRevenueDates(prev => ({ ...prev, [field]: value }));
  };

  const handleSustainabilityDateChange = (field, value) => {
    setSustainabilityDates(prev => ({ ...prev, [field]: value }));
  };

  const handleSdgsDateChange = (field, value) => {
    setSdgsDates(prev => ({ ...prev, [field]: value }));
  };

  const handleEnvironmentalDateChange = (field, value) => {
    setEnvironmentalDates(prev => ({ ...prev, [field]: value }));
  };

  const handleInvestmentDateChange = (field, value) => {
    setInvestmentDates(prev => ({ ...prev, [field]: value }));
  };

  const handleRiskDateChange = (field, value) => {
    setRiskDates(prev => ({ ...prev, [field]: value }));
  };

  // Dynamic data generators
  const getRevenueData = (chartType) => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    switch(chartType) {
      case 'industry':
        return {
          labels,
          datasets: [
            {
              label: 'Manufacturing Revenue ($ Billion)',
              data: [125, 132, 128, 145, 152, 148, 165, 158, 172, 168, 175, 182],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointHoverRadius: 6,
            },
            {
              label: 'Services Revenue ($ Billion)',
              data: [98, 105, 102, 115, 118, 112, 125, 122, 130, 128, 135, 142],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointHoverRadius: 6,
            }
          ]
        };
      case 'quarterly':
        return {
          labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
          datasets: [
            {
              label: 'Total Revenue ($ Billion)',
              data: [485, 512, 498, 545, 578, 562, 595, 618],
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            }
          ]
        };
      case 'sectors':
        return {
          labels: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Manufacturing', 'Agriculture'],
          datasets: [
            {
              label: 'Growth Rate (%)',
              data: [12.5, 8.3, 6.7, 4.2, 5.8, 3.1],
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
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
              label: 'Revenue',
              data: Array.from({length: 12}, () => Math.floor(Math.random() * 100 + 100)),
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

  const getSustainabilityData = (chartType) => {
    switch(chartType) {
      case 'economic':
        return {
          labels: ['GDP Growth', 'Employment Rate', 'Innovation Index', 'Export Value', 'Investment', 'Productivity'],
          datasets: [
            {
              label: 'Current Year (%)',
              data: [3.2, 94.5, 78, 85, 72, 88],
              backgroundColor: '#3b82f6',
              borderRadius: 6,
              borderSkipped: false,
            },
            {
              label: 'Target (%)',
              data: [4.0, 96.0, 80, 90, 75, 92],
              backgroundColor: '#10b981',
              borderRadius: 6,
              borderSkipped: false,
            }
          ]
        };
      case 'social':
        return {
          labels: ['Education Quality', 'Healthcare Access', 'Gender Equality', 'Poverty Reduction', 'Housing', 'Safety'],
          datasets: [
            {
              label: 'Achievement (%)',
              data: [82, 75, 68, 73, 79, 85],
              backgroundColor: '#f97316',
              borderRadius: 6,
              borderSkipped: false,
            },
            {
              label: 'Target (%)',
              data: [90, 85, 80, 85, 88, 92],
              backgroundColor: '#6b7280',
              borderRadius: 6,
              borderSkipped: false,
            }
          ]
        };
      case 'financial':
        return {
          labels: ['Debt-to-GDP', 'Fiscal Balance', 'Inflation Rate', 'Currency Stability', 'Market Cap', 'Credit Rating'],
          datasets: [
            {
              label: 'Current (%)',
              data: [58, -2.1, 3.8, 92, 78, 85],
              backgroundColor: '#ef4444',
              borderRadius: 6,
              borderSkipped: false,
            },
            {
              label: 'Optimal (%)',
              data: [60, 0, 2.0, 95, 85, 90],
              backgroundColor: '#10b981',
              borderRadius: 6,
              borderSkipped: false,
            }
          ]
        };
      default:
        return {
          labels: ['Metric 1', 'Metric 2', 'Metric 3', 'Metric 4', 'Metric 5'],
          datasets: [
            {
              label: 'Value',
              data: [75, 82, 68, 90, 77],
              backgroundColor: '#3b82f6',
              borderRadius: 6,
              borderSkipped: false,
            }
          ]
        };
    }
  };

  const getSdgsData = (chartType) => {
    switch(chartType) {
      case 'goals':
        return {
          labels: [
            'No Poverty', 'Zero Hunger', 'Good Health', 'Quality Education', 'Gender Equality',
            'Clean Water', 'Affordable Energy', 'Decent Work', 'Industry Innovation'
          ],
          datasets: [
            {
              data: [75, 68, 85, 78, 72, 82, 88, 76, 92],
              backgroundColor: [
                '#e01e37', '#dda63a', '#4c9f38', '#c5192d', '#ff3a21',
                '#26bde2', '#fcc30b', '#a21942', '#fd6925'
              ],
              borderRadius: 4,
              borderSkipped: false,
            }
          ]
        };
      case 'pillars':
        return {
          labels: ['People', 'Planet', 'Prosperity', 'Peace', 'Partnership'],
          datasets: [
            {
              data: [73, 65, 82, 78, 85],
              backgroundColor: ['#e01e37', '#4c9f38', '#fd6925', '#00689d', '#19486a'],
              borderRadius: 4,
              borderSkipped: false,
            }
          ]
        };
      case 'priority':
        return {
          labels: ['Climate Action', 'Life Below Water', 'Life on Land', 'Sustainable Cities', 'Responsible Consumption'],
          datasets: [
            {
              data: [58, 62, 67, 70, 73],
              backgroundColor: ['#3f7e44', '#0a97d9', '#56c02b', '#fd9d24', '#bf8b2e'],
              borderRadius: 4,
              borderSkipped: false,
            }
          ]
        };
      default:
        return {
          labels: ['Goal 1', 'Goal 2', 'Goal 3', 'Goal 4', 'Goal 5'],
          datasets: [
            {
              data: [75, 68, 82, 79, 73],
              backgroundColor: ['#e01e37', '#dda63a', '#4c9f38', '#c5192d', '#ff3a21'],
              borderRadius: 4,
              borderSkipped: false,
            }
          ]
        };
    }
  };

  const getEnvironmentalData = (chartType) => {
    const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
    
    switch(chartType) {
      case 'emissions':
        return {
          labels: quarters,
          datasets: [
            {
              label: 'Carbon Footprint (Mt CO2)',
              data: [245, 238, 232, 225],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Renewable Energy (%)',
              data: [32, 35, 38, 42],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            }
          ]
        };
      case 'resources':
        return {
          labels: quarters,
          datasets: [
            {
              label: 'Water Usage (Billion L)',
              data: [1250, 1180, 1145, 1098],
              borderColor: '#06b6d4',
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Waste Reduction (%)',
              data: [15, 18, 22, 25],
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            }
          ]
        };
      case 'biodiversity':
        return {
          labels: quarters,
          datasets: [
            {
              label: 'Forest Coverage (%)',
              data: [68.5, 68.2, 67.8, 67.5],
              borderColor: '#16a34a',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Species Protection (%)',
              data: [72, 74, 76, 78],
              borderColor: '#84cc16',
              backgroundColor: 'rgba(132, 204, 22, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            }
          ]
        };
      default:
        return {
          labels: quarters,
          datasets: [
            {
              label: 'Environmental Score',
              data: [70, 72, 75, 78],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            }
          ]
        };
    }
  };

  const getInvestmentData = (chartType) => {
    const labels = ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
    
    switch(chartType) {
      case 'sectors':
        return {
          labels,
          datasets: [
            {
              label: 'Technology Investment ($ Billion)',
              data: [85, 92, 88, 105, 118, 125, 132, 145],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Green Energy Investment ($ Billion)',
              data: [42, 48, 45, 58, 65, 72, 78, 85],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Infrastructure Investment ($ Billion)',
              data: [35, 38, 42, 45, 48, 52, 55, 62],
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            }
          ]
        };
      case 'foreign':
        return {
          labels,
          datasets: [
            {
              label: 'Foreign Direct Investment ($ Billion)',
              data: [125, 138, 142, 156, 168, 175, 182, 195],
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            }
          ]
        };
      case 'domestic':
        return {
          labels,
          datasets: [
            {
              label: 'Domestic Investment ($ Billion)',
              data: [85, 88, 92, 95, 98, 102, 105, 110],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
              label: 'Total Investment',
              data: [200, 215, 220, 235, 248, 255, 268, 285],
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

  const getRiskData = (chartType) => {
    switch(chartType) {
      case 'financial':
        return {
          labels: ['Credit Risk', 'Market Risk', 'Operational Risk', 'Liquidity Risk', 'Currency Risk', 'Interest Rate Risk'],
          datasets: [
            {
              label: 'Risk Level (%)',
              data: [25, 32, 18, 15, 28, 22],
              backgroundColor: ['#ef4444', '#f97316', '#eab308', '#10b981', '#06b6d4', '#8b5cf6'],
              borderRadius: 6,
              borderSkipped: false,
            }
          ]
        };
      case 'environmental':
        return {
          labels: ['Climate Change', 'Natural Disasters', 'Resource Scarcity', 'Pollution', 'Biodiversity Loss'],
          datasets: [
            {
              label: 'Risk Level (%)',
              data: [42, 35, 28, 25, 30],
              backgroundColor: ['#dc2626', '#ea580c', '#ca8a04', '#059669', '#0284c7'],
              borderRadius: 6,
              borderSkipped: false,
            }
          ]
        };
      case 'political':
        return {
          labels: ['Policy Changes', 'Regulatory Risk', 'Political Stability', 'Trade Relations', 'Governance'],
          datasets: [
            {
              label: 'Risk Level (%)',
              data: [20, 25, 15, 30, 18],
              backgroundColor: ['#7c2d12', '#9a3412', '#a16207', '#15803d', '#1e40af'],
              borderRadius: 6,
              borderSkipped: false,
            }
          ]
        };
      default:
        return {
          labels: ['Risk 1', 'Risk 2', 'Risk 3', 'Risk 4', 'Risk 5'],
          datasets: [
            {
              label: 'Risk Level',
              data: [25, 30, 20, 35, 22],
              backgroundColor: ['#ef4444', '#f97316', '#eab308', '#10b981', '#06b6d4'],
              borderRadius: 6,
              borderSkipped: false,
            }
          ]
        };
    }
  };

  // Industry Sectors Distribution for Pie Chart
  const industrySectorsData = {
    labels: ['Manufacturing', 'Services', 'Technology', 'Finance', 'Healthcare', 'Energy'],
    datasets: [
      {
        data: [28, 24, 18, 12, 10, 8],
        backgroundColor: ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444', '#f59e0b'],
        borderWidth: 0,
      }
    ]
  };

  // Economic Growth Indicators for Pie Chart
  const economicGrowthData = {
    labels: ['GDP Growth', 'Employment', 'Innovation', 'Exports', 'Investment'],
    datasets: [
      {
        data: [22, 28, 18, 16, 16],
        backgroundColor: ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af'],
        borderWidth: 0,
      }
    ]
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
            <strong>Finance Analytics</strong>
          </h1>
        </Header>

        <div className="content" style={{ padding: '1.5rem' }}>
          {/* KPI Cards Row */}
          <div className="row g-3 mb-4">
            <div className="col-lg-3 col-md-6">
              <NumericDisplay 
                id="totalRevenue"
                value={1847}
                label="Total Industry Revenue"
                iconClass="fas fa-dollar-sign"
                unit="B"
              />
            </div>
            <div className="col-lg-3 col-md-6">
              <NumericDisplay 
                id="gdpGrowth"
                value={3.2}
                label="GDP Growth Rate"
                iconClass="fas fa-chart-line"
                isPercentage={true}
              />
            </div>
            <div className="col-lg-3 col-md-6">
              <NumericDisplay 
                id="sdgsScore"
                value={74}
                label="SDGs Achievement"
                iconClass="fas fa-globe"
                isPercentage={true}
              />
            </div>
            <div className="col-lg-3 col-md-6">
              <NumericDisplay 
                id="sustainabilityScore"
                value={78}
                label="Sustainability Score"
                iconClass="fas fa-leaf"
                isPercentage={true}
              />
            </div>
          </div>

          {/* Revenue Analysis Row */}
          <div className="row g-3 mb-4">
            <div className="col-12">
              <div className="chart-container" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Revenue & Industry Analysis</h3>
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <label htmlFor="revenue_from" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>From:</label>
                      <input 
                        type="date" 
                        id="revenue_from" 
                        className="form-control"
                        value={revenueDates.from}
                        onChange={(e) => handleRevenueDateChange('from', e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      />
                      <label htmlFor="revenue_to" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>To:</label>
                      <input 
                        type="date" 
                        id="revenue_to" 
                        className="form-control"
                        value={revenueDates.to}
                        onChange={(e) => handleRevenueDateChange('to', e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      />
                    </div>
                    <select 
                      className="chart-selector form-select"
                      value={revenueChartType}
                      onChange={(e) => setRevenueChartType(e.target.value)}
                      style={{ width: 'auto', fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    >
                      <option value="industry">Industry Revenue</option>
                      <option value="quarterly">Quarterly Growth</option>
                      <option value="sectors">Sector Growth Rate</option>
                    </select>
                  </div>
                </div>
                <div style={{ height: '400px', padding: '1rem' }}>
                  <LineChart 
                    data={getRevenueData(revenueChartType)}
                    height={400}
                    colors={{
                      primary: '#3b82f6',
                      secondary: '#10b981',
                      tertiary: '#f97316',
                      text: '#000000',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Economic Sustainability + Industry Distribution Row */}
          <div className="row g-3 mb-4">
            <div className="col-lg-8">
              <div className="chart-container h-100" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Economic Sustainability Metrics</h3>
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <label htmlFor="sustainability_from" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>From:</label>
                      <input 
                        type="date" 
                        id="sustainability_from" 
                        className="form-control"
                        value={sustainabilityDates.from}
                        onChange={(e) => handleSustainabilityDateChange('from', e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      />
                      <label htmlFor="sustainability_to" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>To:</label>
                      <input 
                        type="date" 
                        id="sustainability_to" 
                        className="form-control"
                        value={sustainabilityDates.to}
                        onChange={(e) => handleSustainabilityDateChange('to', e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      />
                    </div>
                    <select 
                      className="chart-selector form-select"
                      value={sustainabilityChartType}
                      onChange={(e) => setSustainabilityChartType(e.target.value)}
                      style={{ width: 'auto', fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    >
                      <option value="economic">Economic Indicators</option>
                      <option value="social">Social Progress</option>
                      <option value="financial">Financial Stability</option>
                    </select>
                  </div>
                </div>
                <div style={{ height: '360px', padding: '1rem' }}>
                  <BarChart 
                    data={getSustainabilityData(sustainabilityChartType)}
                    height={360}
                    colors={{
                      primary: '#3b82f6',
                      secondary: '#10b981',
                      tertiary: '#6b7280',
                      text: '#000000',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="chart-container h-100" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Industry Sectors Distribution</h3>
                <div style={{ height: '360px', padding: '1rem' }}>
                  <PieChart 
                    data={industrySectorsData}
                    height={360}
                    colors={{
                      text: '#000000',
                    }}
                    showLegend={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SDGs Progress Row */}
          <div className="row g-3 mb-4">
            <div className="col-12">
              <div className="chart-container" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Sustainable Development Goals (SDGs) Progress</h3>
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <label htmlFor="sdgs_from" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>From:</label>
                      <input 
                        type="date" 
                        id="sdgs_from" 
                        className="form-control"
                        value={sdgsDates.from}
                        onChange={(e) => handleSdgsDateChange('from', e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      />
                      <label htmlFor="sdgs_to" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>To:</label>
                      <input 
                        type="date" 
                        id="sdgs_to" 
                        className="form-control"
                        value={sdgsDates.to}
                        onChange={(e) => handleSdgsDateChange('to', e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      />
                    </div>
                    <select 
                      className="chart-selector form-select"
                      value={sdgsChartType}
                      onChange={(e) => setSdgsChartType(e.target.value)}
                      style={{ width: 'auto', fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    >
                      <option value="goals">First 9 Goals</option>
                      <option value="pillars">5 Pillars Framework</option>
                      <option value="priority">Priority Areas</option>
                    </select>
                  </div>
                </div>
                <div style={{ height: '420px', padding: '1rem' }}>
                  <BarChart 
                    data={getSdgsData(sdgsChartType)}
                    height={420}
                    colors={{
                      primary: '#e01e37',
                      secondary: '#dda63a',
                      tertiary: '#4c9f38',
                      text: '#000000',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Impact + Sustainability Score Row */}
          <div className="row g-3 mb-4">
            <div className="col-lg-8">
              <div className="chart-container h-100" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Environmental Impact Monitoring</h3>
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <label htmlFor="environmental_from" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>From:</label>
                      <input 
                        type="date" 
                        id="environmental_from" 
                        className="form-control"
                        value={environmentalDates.from}
                        onChange={(e) => handleEnvironmentalDateChange('from', e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      />
                      <label htmlFor="environmental_to" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>To:</label>
                      <input 
                        type="date" 
                        id="environmental_to" 
                        className="form-control"
                        value={environmentalDates.to}
                        onChange={(e) => handleEnvironmentalDateChange('to', e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      />
                    </div>
                    <select 
                      className="chart-selector form-select"
                      value={environmentalChartType}
                      onChange={(e) => setEnvironmentalChartType(e.target.value)}
                      style={{ width: 'auto', fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    >
                      <option value="emissions">Carbon & Energy</option>
                      <option value="resources">Water & Waste</option>
                      <option value="biodiversity">Biodiversity & Forest</option>
                    </select>
                  </div>
                </div>
                <div style={{ height: '360px', padding: '1rem' }}>
                  <LineChart 
                    data={getEnvironmentalData(environmentalChartType)}
                    height={360}
                    colors={{
                      primary: '#ef4444',
                      secondary: '#10b981',
                      tertiary: '#f59e0b',
                      text: '#000000',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="chart-container h-100 d-flex flex-column" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Overall Sustainability Score</h3>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{ padding: '1rem' }}>
                  <GaugeChart 
                    value={78}
                    maxValue={100}
                    unit="%"
                    height={280}
                    colors={{
                      primary: '#10b981',
                      secondary: '#6b7280',
                      text: '#000000',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Investment Analysis + Economic Growth Row */}
          <div className="row g-3 mb-4">
            <div className="col-lg-8">
              <div className="chart-container h-100" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Investment Flow Analysis</h3>
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <label htmlFor="investment_from" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>From:</label>
                      <input 
                        type="date" 
                        id="investment_from" 
                        className="form-control"
                        value={investmentDates.from}
                        onChange={(e) => handleInvestmentDateChange('from', e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      />
                      <label htmlFor="investment_to" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>To:</label>
                      <input 
                        type="date" 
                        id="investment_to" 
                        className="form-control"
                        value={investmentDates.to}
                        onChange={(e) => handleInvestmentDateChange('to', e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      />
                    </div>
                    <select 
                      className="chart-selector form-select"
                      value={investmentChartType}
                      onChange={(e) => setInvestmentChartType(e.target.value)}
                      style={{ width: 'auto', fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    >
                      <option value="sectors">Sector Investment</option>
                      <option value="foreign">Foreign Investment</option>
                      <option value="domestic">Domestic Investment</option>
                    </select>
                  </div>
                </div>
                <div style={{ height: '360px', padding: '1rem' }}>
                  <LineChart 
                    data={getInvestmentData(investmentChartType)}
                    height={360}
                    colors={{
                      primary: '#3b82f6',
                      secondary: '#10b981',
                      tertiary: '#f97316',
                      text: '#000000',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="chart-container h-100" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Economic Growth Factors</h3>
                <div style={{ height: '360px', padding: '1rem' }}>
                  <PieChart 
                    data={economicGrowthData}
                    height={360}
                    colors={{
                      text: '#000000',
                    }}
                    showLegend={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment + Additional KPIs Row */}
          <div className="row g-3 mb-4">
            <div className="col-lg-8">
              <div className="chart-container h-100" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Risk Assessment & Monitoring</h3>
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <label htmlFor="risk_from" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>From:</label>
                      <input 
                        type="date" 
                        id="risk_from" 
                        className="form-control"
                        value={riskDates.from}
                        onChange={(e) => handleRiskDateChange('from', e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      />
                      <label htmlFor="risk_to" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>To:</label>
                      <input 
                        type="date" 
                        id="risk_to" 
                        className="form-control"
                        value={riskDates.to}
                        onChange={(e) => handleRiskDateChange('to', e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      />
                    </div>
                    <select 
                      className="chart-selector form-select"
                      value={riskChartType}
                      onChange={(e) => setRiskChartType(e.target.value)}
                      style={{ width: 'auto', fontSize: '0.875rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    >
                      <option value="financial">Financial Risks</option>
                      <option value="environmental">Environmental Risks</option>
                      <option value="political">Political Risks</option>
                    </select>
                  </div>
                </div>
                <div style={{ height: '360px', padding: '1rem' }}>
                  <BarChart 
                    data={getRiskData(riskChartType)}
                    height={360}
                    colors={{
                      primary: '#ef4444',
                      secondary: '#f97316',
                      tertiary: '#eab308',
                      text: '#000000',
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="row g-3 h-100">
                <div className="col-12">
                  <NumericDisplay 
                    id="inflationRate"
                    value={3.8}
                    label="Inflation Rate"
                    iconClass="fas fa-percentage"
                    isPercentage={true}
                  />
                </div>
                <div className="col-12">
                  <NumericDisplay 
                    id="unemploymentRate"
                    value={5.2}
                    label="Unemployment Rate"
                    iconClass="fas fa-users"
                    isPercentage={true}
                  />
                </div>
                <div className="col-12">
                  <NumericDisplay 
                    id="tradeBalance"
                    value={42.8}
                    label="Trade Balance"
                    iconClass="fas fa-balance-scale"
                    unit="B"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary & Actions Row */}
          <div className="row g-3">
            <div className="col-12">
              <div className="chart-container" style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                <div className="row g-4">
                  <div className="col-lg-8">
                    <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Financial Analytics Summary</h3>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <h5 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>Economic Performance</h5>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: '0' }}>
                          The economy shows strong resilience with GDP growth at 3.2% and industrial revenue 
                          reaching $1.847 trillion. Manufacturing and services sectors lead growth with 
                          sustained investment flows across technology and green energy initiatives.
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h5 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>Sustainability Progress</h5>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: '0' }}>
                          Sustainability metrics indicate positive trends with 78% overall score achievement. 
                          SDGs progress shows strong performance in industry innovation (92%) and renewable 
                          energy adoption (42% growth).
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h5 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>Risk Management</h5>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: '0' }}>
                          Financial risk assessment reveals manageable exposure levels across credit (25%) 
                          and market risks (32%). Environmental risks require continued monitoring, 
                          particularly climate change impacts (42%).
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h5 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>Investment Outlook</h5>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6', margin: '0' }}>
                          Investment flows show robust growth in technology ($145B) and green energy ($85B) 
                          sectors. Foreign direct investment increased to $195B, supporting economic 
                          diversification and innovation capacity.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="d-flex flex-column gap-3 h-100" style={{ padding: '0.5rem' }}>
                      <button className="btn btn-generate-report" style={{ 
                        padding: '0.75rem 1.5rem', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        borderRadius: '8px',
                        backgroundColor: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer'
                      }}>
                        Download Comprehensive Report
                      </button>
                      <button className="btn btn-secondary" style={{ 
                        padding: '0.75rem 1.5rem', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        borderRadius: '8px',
                        backgroundColor: '#6b7280',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer'
                      }}>
                        Export Data to Excel
                      </button>
                      <button className="btn btn-outline-primary" style={{ 
                        padding: '0.75rem 1.5rem', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        color: '#3b82f6',
                        border: '1px solid #3b82f6',
                        cursor: 'pointer'
                      }}>
                        Schedule Automated Reports
                      </button>
                      <div className="mt-auto" style={{ paddingTop: '1rem' }}>
                        <small className="text-muted" style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          Last updated: {new Date().toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinanceAnalytics;
