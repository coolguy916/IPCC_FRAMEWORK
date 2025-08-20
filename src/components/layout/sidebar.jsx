// components/layout/sidebar.jsx
import React from 'react';
// 1. Impor NavLink dari react-router-dom
import { NavLink, Link } from 'react-router-dom'; 
import { 
  Leaf, X, Home, Calendar, Thermometer, 
  Settings, Users, HelpCircle, BarChart2, History, FileText, Wrench 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  activeItem = "Overview",
  onItemClick,
  menuItems = []
}) => {
  const defaultMenuItems = [
    { path: '/overview', icon: Home, label: 'Overview', key: 'overview' },
    { path: '/analytics', icon: BarChart2, label: 'Data Analytics', key: 'analytics' },
    { path: '/revenue', icon: Thermometer, label: 'Economic Revenue', key: 'revenue' },
    { path: '/forecasting', icon: Calendar, label: 'Forecasting', key: 'forecasting' },
    { path: '/maintenance', icon: Settings, label: 'Maintenance Schedule', key: 'maintenance' },
    { path: '/team', icon: Users, label: 'Team Profile', key: 'team' },
    { path: '/help', icon: HelpCircle, label: 'Help & Support', key: 'help' },
  ];

  const customMenuItems = [
    { path: '/overview', icon: Home, label: 'Overview', key: 'overview' },
    { path: '/historical-data', icon: History, label: 'Data Logging', key: 'historical-data' },
    { path: '/finance-analytics', icon: BarChart2, label: 'Economic Revenue', key: 'finance-analytics' },
    { path: '/articles', icon: FileText, label: 'Forecasting Test', key: 'articles' },
    { path: '/maintenance', icon: Wrench, label: 'Maintenance', key: 'maintenance' },
    { path: '/team-profile', icon: Users, label: 'Team Profile', key: 'team-profile' },
  ];

  const location = useLocation();

  // Use provided menuItems if any, else merge or choose custom/default. Here, prioritizing custom for specificity.
  const items = menuItems.length > 0 ? menuItems : customMenuItems;

  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item.key, item.label);
    }
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onClose} 
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Farming</span>
          </div>
          <button 
            onClick={onClose} 
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-8">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                location.pathname === item.path || activeItem === item.label 
                  ? 'bg-green-50 text-green-700 border-r-2 border-green-500' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </>
  );
};
// 

export default Sidebar;