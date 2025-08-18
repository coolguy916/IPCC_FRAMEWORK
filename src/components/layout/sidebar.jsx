import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onNavClick }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/overview', icon: 'fas fa-tachometer-alt', label: 'Overview' },
    { path: '/historical-data', icon: 'fas fa-history', label: 'Data Logging' },
    { path: '/finance-analytics', icon: 'fas fa-chart-bar', label: 'Economic Revenue' },
    { path: '/articles', icon: 'fas fa-file-alt', label: 'Forecasting Test' },
    { path: '/maintenance', icon: 'fas fa-wrench', label: 'Maintenance' },
    { path: '/team-profile', icon: 'fas fa-users', label: 'Team Profile' },
  ];

  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <aside className={`sidebar ${isOpen ? 'show' : 'collapsed'}`}>
      <div className="logo mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="logo-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="logo-text">
            <h2>Verenigen</h2>
            <p>Performance Dashboard</p>
          </div>
        </div>
      </div>

      <nav>
        <div className="nav-section">
          <div className="nav-section-title">Main Menu</div>
          <ul className="nav-menu"> {/* Ubah dari "nav flex-column" */}
            {menuItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                  onClick={onNavClick}
                >
                  <i className={item.icon}></i> {/* Hapus "me-2" */}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;