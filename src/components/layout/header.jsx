// components/layout/header.jsx
import React from 'react';
import { Bell, Menu } from 'lucide-react';

const Header = ({ 
  onMenuClick, 
  selectedGarden = "Spinach Garden 08", 
  onGardenChange,
  gardens = [],
  notifications = 15,
  user = { initials: "VG", name: "Vegetable Garden" }
}) => {
  return (
    <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick} 
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Good Morning</h1>
            <p className="hidden xs:block text-sm text-gray-600">
              Optimize Your Farm Operations with Real-Time Insights
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
          <select 
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm max-w-[150px] sm:max-w-none"
            value={selectedGarden}
            onChange={(e) => onGardenChange && onGardenChange(e.target.value)}
          >
            {gardens.length > 0 ? gardens.map((garden, index) => (
              <option key={index} value={garden}>{garden}</option>
            )) : (
              <>
                <option>Spinach Garden 08</option>
                <option>Tomato Greenhouse 02</option>
                <option>Hydroponic Lettuce 05</option>
              </>
            )}
          </select>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications > 99 ? '99+' : notifications}
                </span>
              )}
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{user.initials}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;