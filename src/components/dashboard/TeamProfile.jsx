import { useEffect, useState } from 'react';
import Sidebar from '../layout/sidebar';
import DigitalClock from '../ui/DigitalClock';
import SearchBar from '../ui/SearchBar';
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
    width="24"
    height="24"
    viewBox="0 0 24 24"
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

// Team Member Card Component
const TeamMemberCard = ({ member, isLeader = false }) => {
  const cardStyle = {
    padding: '2rem',
    background: isLeader 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      : 'var(--card-bg)',
    color: isLeader ? 'white' : 'var(--text-primary)',
    border: isLeader ? 'none' : '1px solid var(--border-color)',
    borderRadius: '20px',
    boxShadow: isLeader 
      ? '0 8px 32px rgba(102, 126, 234, 0.3)' 
      : 'var(--shadow-medium)',
    position: 'relative',
    overflow: 'hidden',
    height: '100%'
  };

  const avatarStyle = {
    width: '80px',
    height: '80px',
    background: isLeader ? 'rgba(255, 255, 255, 0.2)' : '#3b82f6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem auto',
    fontSize: '32px',
    color: 'white',
    border: isLeader ? '3px solid rgba(255, 255, 255, 0.3)' : 'none',
    boxShadow: isLeader 
      ? '0 4px 20px rgba(0, 0, 0, 0.2)' 
      : '0 4px 15px rgba(59, 130, 246, 0.3)'
  };

  const handleButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.background = isLeader ? 'rgba(255, 255, 255, 0.3)' : '#e5e7eb';
    } else {
      e.target.style.transform = 'translateY(0)';
      e.target.style.background = isLeader ? 'rgba(255, 255, 255, 0.2)' : '#f3f4f6';
    }
  };

  return (
    <div className="chart-container h-100" style={cardStyle}>
      {isLeader && (
        <div className="position-absolute" style={{
          top: '1rem',
          right: '1rem',
          background: 'rgba(255, 215, 0, 0.9)',
          color: '#1f2937',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Supervisor
        </div>
      )}
      
      <div className="text-center mb-4">
        <div style={avatarStyle}>
          <i className={member.icon}></i>
        </div>
        <h4 className="fw-bold mb-2" style={{ 
          fontSize: '1.25rem',
          color: isLeader ? 'white' : 'var(--text-primary)'
        }}>
          {member.name}
        </h4>
        <p className="fw-medium mb-2" style={{ 
          fontSize: '1rem',
          color: isLeader ? 'rgba(255, 255, 255, 0.9)' : '#6b7280'
        }}>
          {member.role}
        </p>
        {member.studentId && (
          <p className="mb-3" style={{ 
            fontSize: '0.875rem',
            color: isLeader ? 'rgba(255, 255, 255, 0.8)' : '#9ca3af'
          }}>
            {member.studentId}
          </p>
        )}
      </div>

      <div className="mb-4">
        <h6 className="fw-semibold mb-3" style={{ 
          fontSize: '1rem',
          color: isLeader ? 'rgba(255, 255, 255, 0.9)' : '#374151'
        }}>
          Specialization
        </h6>
        <p style={{ 
          fontSize: '0.875rem',
          lineHeight: '1.6',
          color: isLeader ? 'rgba(255, 255, 255, 0.8)' : '#6b7280'
        }}>
          {member.specialization}
        </p>
      </div>

      <div className="mb-4">
        <h6 className="fw-semibold mb-3" style={{ 
          fontSize: '1rem',
          color: isLeader ? 'rgba(255, 255, 255, 0.9)' : '#374151'
        }}>
          Responsibilities
        </h6>
        <ul className="list-unstyled" style={{ 
          fontSize: '0.875rem',
          color: isLeader ? 'rgba(255, 255, 255, 0.8)' : '#6b7280'
        }}>
          {member.responsibilities.map((resp, index) => (
            <li key={index} className="d-flex align-items-start mb-2">
              <i className="fas fa-check-circle me-2 mt-1" style={{ 
                color: isLeader ? '#10b981' : '#3b82f6',
                fontSize: '0.75rem'
              }}></i>
              {resp}
            </li>
          ))}
        </ul>
      </div>

      <div className="d-flex justify-content-center gap-3">
        {['fas fa-envelope', 'fab fa-linkedin', 'fab fa-github'].map((icon, index) => (
          <button
            key={index}
            className="btn d-flex align-items-center justify-content-center"
            style={{
              background: isLeader ? 'rgba(255, 255, 255, 0.2)' : '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              width: '40px',
              height: '40px',
              color: isLeader ? 'white' : '#6b7280',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            <i className={icon}></i>
          </button>
        ))}
      </div>
    </div>
  );
};

// Project Overview Section Component
const ProjectOverview = () => {
  const stats = [
    { value: '5', label: 'Team Members' },
    { value: '8+', label: 'Technologies Used' },
    { value: '6', label: 'Months Development' },
    { value: '100%', label: 'Commitment' }
  ];

  return (
    <div className="row mb-5">
      <div className="col-12">
        <div className="chart-container position-relative overflow-hidden" style={{ 
          padding: '2.5rem',
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
          color: 'white',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)'
        }}>
          <div className="position-absolute" style={{
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            zIndex: 0
          }}></div>
          
          <div className="position-relative" style={{ zIndex: 1 }}>
            <div className="text-center mb-4">
              <div className="mx-auto mb-4 d-flex align-items-center justify-content-center" style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                fontSize: '36px',
                color: 'white',
                border: '3px solid rgba(255, 255, 255, 0.3)'
              }}>
                <i className="fas fa-globe-americas"></i>
              </div>
              <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
                IPCC Climate Dashboard
              </h2>
              <p className="fs-5 opacity-75 mb-4 mx-auto" style={{ 
                maxWidth: '800px'
              }}>
                Advanced Climate Data Analytics & Forecasting System for Environmental Impact Assessment
              </p>
            </div>
            
            <div className="row text-center">
              {stats.map((stat, index) => (
                <div key={index} className="col-lg-3 col-md-6 mb-3">
                  <div className="p-3">
                    <div className="fs-1 fw-bold mb-2">{stat.value}</div>
                    <div className="small opacity-75">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Technologies Section Component
const TechnologiesSection = ({ tools }) => {
  const handleCardHover = (e, tool, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
      e.currentTarget.style.borderColor = tool.color;
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
      e.currentTarget.style.borderColor = 'var(--border-color)';
    }
  };

  return (
    <div className="row mb-5">
      <div className="col-12">
        <div className="chart-container">
          <h3 className="fw-bold mb-4 d-flex align-items-center" style={{ 
            fontSize: '1.75rem', 
            color: 'var(--text-primary)' 
          }}>
            <i className="fas fa-tools me-3 text-primary"></i>
            Technologies & Tools Used
          </h3>
          <div className="row">
            {tools.map((tool, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                <div 
                  className="h-100 text-center p-3"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => handleCardHover(e, tool, true)}
                  onMouseLeave={(e) => handleCardHover(e, tool, false)}
                >
                  <div className="mx-auto mb-3 d-flex align-items-center justify-content-center" style={{
                    width: '60px',
                    height: '60px',
                    background: `${tool.color}15`,
                    borderRadius: '50%',
                    fontSize: '24px',
                    color: tool.color
                  }}>
                    <i className={tool.icon}></i>
                  </div>
                  <h6 className="fw-semibold mb-2" style={{ 
                    fontSize: '1rem', 
                    color: 'var(--text-primary)' 
                  }}>
                    {tool.name}
                  </h6>
                  <span className="badge fw-medium" style={{
                    fontSize: '0.75rem',
                    color: tool.color,
                    background: `${tool.color}15`,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px'
                  }}>
                    {tool.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Workflow Section Component
const WorkflowSection = ({ workflow }) => {
  const handlePhaseHover = (e, phase, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = `0 15px 40px ${phase.color}25`;
      e.currentTarget.style.borderColor = phase.color;
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
      e.currentTarget.style.borderColor = 'var(--border-color)';
    }
  };

  return (
    <div className="row mb-5">
      <div className="col-12">
        <div className="chart-container">
          <h3 className="fw-bold mb-4 d-flex align-items-center" style={{ 
            fontSize: '1.75rem', 
            color: 'var(--text-primary)' 
          }}>
            <i className="fas fa-project-diagram me-3 text-primary"></i>
            Development Workflow
          </h3>
          <div className="row g-4">
            {workflow.map((phase, index) => (
              <div key={index} className="col-xl-2 col-lg-4 col-md-6 col-sm-12">
                <div 
                  className="h-100 text-center position-relative d-flex flex-column"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '20px',
                    padding: '2rem 1.5rem',
                    transition: 'all 0.3s ease',
                    minHeight: '350px'
                  }}
                  onMouseEnter={(e) => handlePhaseHover(e, phase, true)}
                  onMouseLeave={(e) => handlePhaseHover(e, phase, false)}
                >
                  <div className="mx-auto mb-3 d-flex align-items-center justify-content-center" style={{
                    width: '70px',
                    height: '70px',
                    background: `${phase.color}15`,
                    borderRadius: '50%',
                    fontSize: '28px',
                    color: phase.color,
                    border: `3px solid ${phase.color}30`
                  }}>
                    <i className={phase.icon}></i>
                  </div>
                  
                  <h6 className="fw-bold mb-3" style={{
                    fontSize: '1.125rem',
                    color: 'var(--text-primary)',
                    lineHeight: '1.3'
                  }}>
                    {phase.phase}
                  </h6>
                  
                  <div className="flex-grow-1 d-flex flex-column justify-content-start">
                    <ul className="list-unstyled text-start m-0" style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      {phase.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="d-flex align-items-start mb-2">
                          <i className="fas fa-check me-2 mt-1 flex-shrink-0" style={{
                            color: phase.color,
                            fontSize: '0.75rem'
                          }}></i>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Achievements Section Component
const AchievementsSection = () => {
  const achievements = [
    {
      title: 'Clean Code Standards',
      description: 'Implemented industry best practices with 95% code coverage, comprehensive documentation, and maintainable architecture.',
      icon: 'fas fa-code',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      title: 'Performance Optimization',
      description: 'Achieved 98% performance score with optimized loading times, efficient data processing, and scalable infrastructure.',
      icon: 'fas fa-chart-line',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    {
      title: 'Security & Reliability',
      description: 'Implemented robust security measures, data encryption, and 99.9% uptime with comprehensive monitoring systems.',
      icon: 'fas fa-shield-alt',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    }
  ];

  return (
    <div className="row">
      <div className="col-12">
        <div className="chart-container">
          <h3 className="fw-bold mb-4 d-flex align-items-center" style={{ 
            fontSize: '1.75rem', 
            color: 'var(--text-primary)' 
          }}>
            <i className="fas fa-handshake me-3 text-primary"></i>
            Team Contributions & Achievements
          </h3>
          <div className="row">
            {achievements.map((achievement, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div className="h-100 text-center text-white" style={{
                  background: achievement.gradient,
                  borderRadius: '20px',
                  padding: '2rem'
                }}>
                  <i className={`${achievement.icon} mb-3`} style={{ 
                    fontSize: '48px', 
                    opacity: '0.9' 
                  }}></i>
                  <h5 className="fw-bold mb-3" style={{ fontSize: '1.25rem' }}>
                    {achievement.title}
                  </h5>
                  <p className="small" style={{ 
                    opacity: '0.9', 
                    lineHeight: '1.6' 
                  }}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamProfile = () => {
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

  // Team data
  const supervisor = {
    name: 'lorem ipsum',
    role: 'Dosen Pembimbing',
    icon: 'fas fa-user-tie',
    specialization: 'Climate Data Analytics, Machine Learning, Environmental Informatics, & Sustainable Computing Systems',
    responsibilities: [
      'Project supervision and guidance',
      'Research methodology oversight',
      'Academic quality assurance',
      'Strategic planning and direction',
      'Industry collaboration coordination'
    ]
  };

  const students = [
    {
      name: 'lorem ipsum',
      role: 'Team Leader & Full-Stack Developer',
      studentId: 'NIM: 2021001',
      icon: 'fas fa-user-graduate',
      specialization: 'Frontend Development, UI/UX Design, React.js, Data Visualization, & Project Management',
      responsibilities: [
        'Lead frontend development and UI/UX design',
        'Coordinate team activities and timeline',
        'Implement data visualization components',
        'Ensure code quality and best practices',
        'Manage project documentation'
      ]
    },
    {
      name: 'lorem ipsum',
      role: 'Backend Developer & Data Analyst',
      studentId: 'NIM: 2021002',
      icon: 'fas fa-database',
      specialization: 'Backend Development, Database Management, Data Analysis, Python, & API Integration',
      responsibilities: [
        'Develop and maintain backend APIs',
        'Design and optimize database structures',
        'Implement data processing algorithms',
        'Integrate climate data sources',
        'Ensure system scalability and performance'
      ]
    },
    {
      name: 'lorem ipsum',
      role: 'DevOps Engineer & System Architect',
      studentId: 'NIM: 2021003',
      icon: 'fas fa-server',
      specialization: 'Cloud Infrastructure, DevOps, System Security, Docker, Kubernetes, & CI/CD Pipeline',
      responsibilities: [
        'Design and maintain cloud infrastructure',
        'Implement CI/CD pipelines and automation',
        'Ensure system security and monitoring',
        'Manage deployment and scalability',
        'Optimize system performance and reliability'
      ]
    },
    {
      name: 'lorem ipsum',
      role: 'Climate Data Scientist & Research Analyst',
      studentId: 'NIM: 2021004',
      icon: 'fas fa-chart-line',
      specialization: 'Climate Science, Machine Learning, Statistical Analysis, Python, R, & Environmental Modeling',
      responsibilities: [
        'Analyze climate patterns and trends',
        'Develop forecasting models and algorithms',
        'Validate data accuracy and reliability',
        'Research environmental impact indicators',
        'Create technical reports and documentation'
      ]
    }
  ];

  const tools = [
    { name: 'React.js', icon: 'fab fa-react', color: '#61dafb', category: 'Frontend' },
    { name: 'Node.js', icon: 'fab fa-node-js', color: '#68a063', category: 'Backend' },
    { name: 'Python', icon: 'fab fa-python', color: '#3776ab', category: 'Data Science' },
    { name: 'PostgreSQL', icon: 'fas fa-database', color: '#336791', category: 'Database' },
    { name: 'Docker', icon: 'fab fa-docker', color: '#2496ed', category: 'DevOps' },
    { name: 'AWS', icon: 'fab fa-aws', color: '#ff9900', category: 'Cloud' },
    { name: 'Git', icon: 'fab fa-git-alt', color: '#f05032', category: 'Version Control' },
    { name: 'TensorFlow', icon: 'fas fa-brain', color: '#ff6f00', category: 'Machine Learning' }
  ];

  const workflow = [
    {
      phase: 'Planning & Research',
      icon: 'fas fa-lightbulb',
      color: '#3b82f6',
      tasks: ['Literature review', 'Requirements analysis', 'Technology stack selection', 'Project timeline creation']
    },
    {
      phase: 'Design & Architecture',
      icon: 'fas fa-drafting-compass',
      color: '#10b981',
      tasks: ['System architecture design', 'Database schema planning', 'UI/UX wireframing', 'API documentation']
    },
    {
      phase: 'Development & Implementation',
      icon: 'fas fa-code',
      color: '#f59e0b',
      tasks: ['Frontend development', 'Backend API creation', 'Database implementation', 'Data processing algorithms']
    },
    {
      phase: 'Testing & Deployment',
      icon: 'fas fa-rocket',
      color: '#ef4444',
      tasks: ['Unit & integration testing', 'Performance optimization', 'Security auditing', 'Production deployment']
    },
    {
      phase: 'Monitoring & Maintenance',
      icon: 'fas fa-chart-bar',
      color: '#8b5cf6',
      tasks: ['System monitoring', 'Performance analysis', 'Bug fixes & updates', 'User feedback integration']
    }
  ];

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
            <strong>Team Profile</strong>
          </h1>
        </Header>

        <div className="content p-4">
          {/* Project Overview Section */}
          <ProjectOverview />

          {/* Supervisor Section */}
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="fw-bold mb-4 d-flex align-items-center" style={{ 
                fontSize: '2rem', 
                color: 'var(--text-primary)' 
              }}>
                <i className="fas fa-chalkboard-teacher me-3 text-primary"></i>
                Project Supervisor
              </h2>
            </div>
            <div className="col-12 d-flex justify-content-center">
              <div className="col-lg-8 col-md-10 col-xl-6">
                <TeamMemberCard member={supervisor} isLeader={true} />
              </div>
            </div>
          </div>

          {/* Students Section */}
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="fw-bold mb-4 d-flex align-items-center" style={{ 
                fontSize: '2rem', 
                color: 'var(--text-primary)' 
              }}>
                <i className="fas fa-users me-3 text-primary"></i>
                Student Team Members
              </h2>
            </div>
            {students.map((student, index) => (
              <div key={index} className="col-xl-6 col-lg-6 col-md-12 mb-4">
                <TeamMemberCard member={student} />
              </div>
            ))}
          </div>

          {/* Tools Used Section */}
          <TechnologiesSection tools={tools} />

          {/* Workflow Section */}
          <WorkflowSection workflow={workflow} />

          {/* Team Contributions Section */}
          <AchievementsSection />
        </div>
      </main>
    </div>
  );
};

export default TeamProfile;
