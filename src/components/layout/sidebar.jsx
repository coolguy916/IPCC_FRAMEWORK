// components/layout/sidebar.jsx
import React from 'react';
// 1. Impor NavLink dari react-router-dom
import { NavLink, Link } from 'react-router-dom'; 
import { 
  Leaf, X, Home, Calendar, Thermometer, 
  Settings, Users, HelpCircle 
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
    { icon: Home, label: 'Overview', key: 'overview' },
    { icon: Calendar, label: 'Data Analytics', key: 'analytics' },
    { icon: Thermometer, label: 'Economic Revenue', key: 'revenue' },
    { icon: Calendar, label: 'Forecasting', key: 'forecasting' },
    { icon: Settings, label: 'Maintenance Schedule', key: 'maintenance' },
    { icon: Users, label: 'Team Profile', key: 'team' },
    { icon: HelpCircle, label: 'Help & Support', key: 'help' },
  ];

  const items = menuItems.length > 0 ? menuItems : defaultMenuItems;

  const handleLinkClick = () => {
    // Fungsi ini untuk menutup sidebar di tampilan mobile setelah menu diklik
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // 3. Siapkan class untuk style link aktif dan tidak aktif
  const baseLinkClass = "w-full flex items-center px-6 py-3 text-sm font-medium transition-colors";
  const activeLinkClass = "bg-green-50 text-green-700 border-r-4 border-green-500 font-semibold";
  const inactiveLinkClass = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg-hidden" 
          onClick={onClose} 
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          {/* Logo juga bisa menjadi link ke halaman utama */}
          <Link to="/overview" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Farming</span>
          </Link>
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
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                activeItem === item.label 
                  ? 'bg-green-50 text-green-700 border-r-2 border-green-500' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
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

export default Sidebar;