// components/ui/Alerts.jsx
import React from 'react';

const Alerts = ({ 
  alerts = [],
  title = "Alerts",
  onViewAll,
  maxHeight = "400px"
}) => {
  // Default alerts if none provided
  const defaultAlerts = [
    {
      id: 1,
      title: "pH Level Too High",
      description: "Sensor #PH001 • Current: 8.2",
      severity: "critical",
      color: "red"
    },
    {
      id: 2,
      title: "Soil Moisture Low",
      description: "Garden Section A • Current: 45%",
      severity: "warning",
      color: "orange"
    },
    {
      id: 3,
      title: "Temperature Fluctuation",
      description: "Greenhouse B • Variance: ±5°C",
      severity: "info",
      color: "blue"
    },
    {
      id: 4,
      title: "High Humidity Detected",
      description: "Zone 3 • Current: 95%",
      severity: "caution",
      color: "yellow"
    },
    {
      id: 5,
      title: "Wind Speed Too High",
      description: "External Sensor • Current: 15m/s",
      severity: "critical",
      color: "red"
    }
  ];

  const alertsToShow = alerts.length > 0 ? alerts : defaultAlerts;
  const totalAlerts = alertsToShow.length;

  const getSeverityStyles = (color, severity) => {
    const colorMap = {
      red: {
        border: 'border-red-500',
        bg: 'bg-red-500',
        text: 'text-white'
      },
      orange: {
        border: 'border-orange-500',
        bg: 'bg-orange-500',
        text: 'text-white'
      },
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-500',
        text: 'text-white'
      },
      yellow: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-400',
        text: 'text-yellow-800'
      }
    };

    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-white text-xs bg-green-500 font-bold py-1 px-2.5 rounded-md">
          {totalAlerts}
        </span>
      </div>
      
      <div 
        className="flex-grow space-y-3 overflow-y-auto pr-2"
        style={{ maxHeight }}
      >
        {alertsToShow.map((alert) => {
          const styles = getSeverityStyles(alert.color, alert.severity);
          
          return (
            <div 
              key={alert.id} 
              className={`flex items-center justify-between p-3 rounded-lg border-l-4 bg-green-50 ${styles.border}`}
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm">{alert.title}</p>
                <p className="text-xs text-gray-500">{alert.description}</p>
              </div>
              <span className={`text-xs font-medium py-1 px-3 rounded-md ${styles.bg} ${styles.text}`}>
                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
              </span>
            </div>
          );
        })}
      </div>
      
      {onViewAll && (
        <div className="mt-auto pt-4 text-center">
          <button 
            onClick={onViewAll}
            className="text-sm text-blue-700 hover:text-blue-900 font-semibold transition-colors"
          >
            View all alerts
          </button>
        </div>
      )}
    </div>
  );
};

export default Alerts;