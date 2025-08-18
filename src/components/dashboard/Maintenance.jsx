import { useEffect, useState } from 'react';
import Sidebar from '../layout/sidebar';
import DigitalClock from '../ui/DigitalClock';
import SearchBar from '../ui/SearchBar';
import NumericDisplay from '../ui/NumericDisplay';
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

// Calendar Component
const MaintenanceCalendar = ({ maintenanceData, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 11)); // August 2025

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    
    const currentDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return maintenanceData.filter(item => {
      const itemDate = new Date(item.date);
      const itemEndDate = item.endDate ? new Date(item.endDate) : itemDate;
      const checkDate = new Date(currentDateStr);
      
      return checkDate >= itemDate && checkDate <= itemEndDate;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date(2025, 7, 11)); // August 11, 2025
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%)',
      border: '1px solid rgba(0, 123, 255, 0.2)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px',
      height: '720px',
      overflow: 'auto',
      boxShadow: '0 8px 32px rgba(0, 123, 255, 0.1)'
    }}>
      {/* Calendar Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn"
            onClick={() => navigateMonth(-1)}
            style={{ 
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              borderColor: 'rgba(0, 123, 255, 0.3)',
              color: '#007bff',
              borderRadius: '8px',
              padding: '8px 12px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 123, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
            }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <h3 style={{ 
            color: '#212529', 
            fontWeight: '600',
            margin: '0',
            minWidth: '200px',
            textAlign: 'center',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button 
            className="btn"
            onClick={() => navigateMonth(1)}
            style={{ 
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              borderColor: 'rgba(0, 123, 255, 0.3)',
              color: '#007bff',
              borderRadius: '8px',
              padding: '8px 12px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 123, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
            }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <button 
          className="btn"
          onClick={goToToday}
          style={{ 
            backgroundColor: '#007bff',
            borderColor: '#007bff',
            color: '#ffffff',
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#0056b3';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#007bff';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          TODAY
        </button>
      </div>

      {/* Calendar Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '2px',
        backgroundColor: 'rgba(0, 123, 255, 0.05)',
        border: '1px solid rgba(0, 123, 255, 0.2)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {/* Day Headers */}
        {dayNames.map(day => (
          <div 
            key={day}
            style={{
              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
              color: '#ffffff',
              fontWeight: '600',
              textAlign: 'center',
              padding: '12px 8px',
              fontSize: '14px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
            }}
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          const events = getEventsForDay(day);
          const isToday = day === 11 && currentDate.getMonth() === 7 && currentDate.getFullYear() === 2025;
          
          return (
            <div 
              key={index}
              style={{
                backgroundColor: isToday ? 'rgba(0, 123, 255, 0.15)' : '#ffffff',
                minHeight: '80px',
                padding: '6px',
                position: 'relative',
                border: isToday ? '2px solid #007bff' : '1px solid rgba(0, 123, 255, 0.1)',
                transition: 'all 0.3s ease',
                cursor: day ? 'pointer' : 'default'
              }}
              onMouseOver={(e) => {
                if (day) {
                  e.target.style.backgroundColor = isToday ? 'rgba(0, 123, 255, 0.25)' : 'rgba(0, 123, 255, 0.05)';
                }
              }}
              onMouseOut={(e) => {
                if (day) {
                  e.target.style.backgroundColor = isToday ? 'rgba(0, 123, 255, 0.15)' : '#ffffff';
                }
              }}
            >
              {day && (
                <>
                  <div style={{
                    color: isToday ? '#007bff' : '#495057',
                    fontWeight: isToday ? '700' : '500',
                    fontSize: '14px',
                    marginBottom: '4px',
                    textShadow: isToday ? '0 1px 2px rgba(0, 123, 255, 0.2)' : 'none'
                  }}>
                    {day}
                  </div>
                  
                  {/* Events */}
                  {events.slice(0, 3).map((event, eventIndex) => {
                    // All events use blue color scheme
                    const blueShades = [
                      '#007bff', // Primary blue
                      '#0056b3', // Darker blue
                      '#17a2b8', // Info blue
                      '#6f42c1', // Blue-purple
                      '#004085', // Dark blue
                      '#0069d9'  // Medium blue
                    ];
                    
                    const eventColor = blueShades[eventIndex % blueShades.length];
                    
                    return (
                      <div
                        key={eventIndex}
                        onClick={() => onEventClick(event)}
                        style={{
                          backgroundColor: eventColor,
                          color: 'white',
                          borderRadius: '4px',
                          padding: '3px 6px',
                          fontSize: '0.75rem',
                          marginBottom: '2px',
                          cursor: 'pointer',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 1px 3px rgba(0, 123, 255, 0.3)',
                          fontWeight: '500'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'scale(1.02)';
                          e.target.style.boxShadow = '0 2px 6px rgba(0, 123, 255, 0.5)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 1px 3px rgba(0, 123, 255, 0.3)';
                        }}
                      >
                        {event.title}
                      </div>
                    );
                  })}
                  
                  {events.length > 3 && (
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#6c757d',
                      textAlign: 'center',
                      fontStyle: 'italic'
                    }}>
                      +{events.length - 3} more
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Maintenance Item Component
const MaintenanceItem = ({ item, onViewDetails }) => {
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    
    if (startDate === endDate) {
      return start.toLocaleDateString('en-US', options);
    }
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return { backgroundColor: '#dc3545', color: 'white' };
      case 'medium': return { backgroundColor: '#f7c948', color: 'black' };
      case 'low': return { backgroundColor: '#3498db', color: 'white' };
      default: return { backgroundColor: '#6c757d', color: 'white' };
    }
  };

  return (
    <div style={{
      padding: '16px',
      borderBottom: '1px solid var(--border-color)',
      transition: 'all 0.3s'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
    }}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h5 style={{ color: 'var(--text-light)', margin: '0' }}>{item.title}</h5>
        <span style={{
          display: 'inline-block',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          ...getPriorityColor(item.priority)
        }}>
          {item.priority.toUpperCase()}
        </span>
      </div>
      
      <div style={{
        fontSize: '0.9rem',
        color: '#a0a8b9',
        marginBottom: '8px'
      }}>
        {formatDateRange(item.date, item.endDate)} - {item.department}
      </div>
      
      <p style={{
        color: '#a0a8b9',
        marginBottom: '8px',
        lineHeight: '1.5'
      }}>
        {item.description}
      </p>
      
      <div className="d-flex justify-content-between align-items-center">
        <span style={{ color: '#a0a8b9' }}>
          <i className="fas fa-user me-2"></i>
          {item.technician}
        </span>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={() => onViewDetails(item)}
        >
          Details
        </button>
      </div>
    </div>
  );
};

const MaintenancePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  // Maintenance data
  const maintenanceData = [
    {
      id: 1,
      title: 'Angular System Update',
      date: '2025-08-08',
      endDate: '2025-08-09',
      description: 'Scheduled system update for Angular components. Will require downtime of approximately 2 hours.',
      priority: 'high',
      technician: 'John Smith',
      department: 'IT Infrastructure'
    },
    {
      id: 2,
      title: 'Angular Components Review',
      date: '2025-08-10',
      endDate: '2025-08-11',
      description: 'Review of Angular components for performance optimization and bug fixes.',
      priority: 'medium',
      technician: 'Maria Rodriguez',
      department: 'Development'
    },
    {
      id: 3,
      title: 'JS Framework Update',
      date: '2025-08-11',
      endDate: '2025-08-12',
      description: 'JavaScript framework updates and security patches. Critical for system security.',
      priority: 'high',
      technician: 'Alex Johnson',
      department: 'Security'
    },
    {
      id: 4,
      title: 'Vue Components Refactoring',
      date: '2025-08-11',
      endDate: '2025-08-13',
      description: 'Refactoring Vue.js components for better performance and code maintainability.',
      priority: 'medium',
      technician: 'Sarah Kim',
      department: 'Front-end'
    },
    {
      id: 5,
      title: 'Technical Meeting',
      date: '2025-08-13',
      endDate: '2025-08-13',
      description: 'Team meeting to discuss ongoing maintenance issues and future plans.',
      priority: 'low',
      technician: 'Team Lead',
      department: 'All Departments'
    },
    {
      id: 6,
      title: 'Client Call',
      date: '2025-08-14',
      endDate: '2025-08-15',
      description: 'Important call with clients to discuss maintenance window and potential impacts.',
      priority: 'medium',
      technician: 'Michael Brown',
      department: 'Customer Relations'
    },
    {
      id: 7,
      title: 'React Component Library Update',
      date: '2025-08-16',
      endDate: '2025-08-18',
      description: 'Major update to React component library with new features and improvements.',
      priority: 'high',
      technician: 'Jessica Williams',
      department: 'Development'
    },
    {
      id: 8,
      title: 'React Performance Optimization',
      date: '2025-08-17',
      endDate: '2025-08-19',
      description: 'Performance optimization for React components and state management.',
      priority: 'medium',
      technician: 'David Lee',
      department: 'Performance Team'
    }
  ];

  const handleEventClick = (event) => {
    const matchingItem = maintenanceData.find(item => 
      item.title.includes(event.title.split(' ')[0]) && 
      new Date(item.date).toDateString() === new Date(event.date).toDateString()
    );
    
    if (matchingItem) {
      handleViewDetails(matchingItem);
    }
  };

  const handleViewDetails = (item) => {
    alert(`
Maintenance Details:
Title: ${item.title}
Date: ${item.date === item.endDate ? new Date(item.date).toLocaleDateString() : `${new Date(item.date).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}`}
Priority: ${item.priority}
Technician: ${item.technician}
Department: ${item.department}
Description: ${item.description}
    `);
  };

  // Get upcoming maintenance items
  const getUpcomingMaintenance = () => {
    const today = new Date();
    const sortedMaintenance = [...maintenanceData].sort((a, b) => new Date(a.date) - new Date(b.date));
    const upcomingMaintenance = sortedMaintenance.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= today;
    });
    return upcomingMaintenance.slice(0, 5);
  };

  // Calculate maintenance statistics
  const totalMaintenance = maintenanceData.length;
  const highPriorityCount = maintenanceData.filter(item => item.priority === 'high').length;
  const completedToday = 3; // Mock data
  const upcomingThisWeek = maintenanceData.filter(item => {
    const itemDate = new Date(item.date);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return itemDate >= today && itemDate <= weekFromNow;
  }).length;

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
            <strong>Maintenance Schedule</strong>
          </h1>
        </Header>

        <div className="content p-4">
          {/* Statistics Row */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <NumericDisplay 
                id="totalMaintenance"
                value={totalMaintenance}
                label="Total Maintenance Tasks"
                iconClass="fas fa-wrench"
              />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <NumericDisplay 
                id="highPriority"
                value={highPriorityCount}
                label="High Priority Tasks"
                iconClass="fas fa-exclamation-triangle"
              />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <NumericDisplay 
                id="completedToday"
                value={completedToday}
                label="Completed Today"
                iconClass="fas fa-check-circle"
              />
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <NumericDisplay 
                id="upcomingWeek"
                value={upcomingThisWeek}
                label="Upcoming This Week"
                iconClass="fas fa-calendar-week"
              />
            </div>
          </div>

          {/* Calendar Section */}
          <div className="row mb-4">
            <div className="col-12">
              <MaintenanceCalendar 
                maintenanceData={maintenanceData}
                onEventClick={handleEventClick}
              />
            </div>
          </div>

          {/* Maintenance Description Section */}
          <div className="row">
            <div className="col-12">
              <div className="chart-container">
                <h4 style={{ color: 'var(--text-light)', marginBottom: '24px' }}>
                  Upcoming Maintenance Activities
                </h4>
                <div>
                  {getUpcomingMaintenance().map(item => (
                    <MaintenanceItem 
                      key={item.id}
                      item={item}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MaintenancePage;