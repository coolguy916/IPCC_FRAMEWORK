// AgricultureDashboard.jsx - Main refactored component
import React, { useState, useEffect } from 'react';
import {
    Leaf, Thermometer, Droplet, Wind, Sun, Activity, BarChart3
} from 'lucide-react';

// Import all the new components
import Header from '../layout/header';
import Sidebar from '../layout/sidebar';
import PlantInfo from '../ui/PlantInfo';
import MetricCard from '../ui/MetricCard';
import SensorChart from '../charts/sensorChart';
import Alerts from '../ui/Alerts';
import Tasks from '../ui/Tasks';
import DeviceStatus from '../ui/DeviceStatus';
import ProductionOverview from '../ui/ProductionOverview';

const AgricultureDashboard = ({
    // Props for backend integration
    sensorData = null,
    plantData = null,
    alertsData = [],  // Changed from null to empty array
    tasksData = [],   // Changed from null to empty array
    devicesData = [],  // Changed from null to empty array
    productionData = null,
    onDataUpdate = null
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedGarden, setSelectedGarden] = useState("Spinach Garden 08");
    const [activeMenuItem, setActiveMenuItem] = useState("Overview");

    // Default sensor data - will be replaced by backend data
    const defaultSensorData = {
        labels: ['Aug 14', 'Aug 15', 'Aug 16', 'Aug 17', 'Aug 18', 'Aug 19', 'Aug 20'],
        datasets: {
            soilMoisture: {
                label: 'Soil Moisture (%)',
                data: [65, 62, 68, 72, 70, 66, 75],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
            temperature: {
                label: 'Temperature (°C)',
                data: [19, 21, 20, 22, 23, 22, 24],
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
            phLevel: {
                label: 'pH Level',
                data: [6.8, 6.7, 6.9, 6.8, 7.0, 7.1, 6.9],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
            soilNitrogen: {
                label: 'Soil Nitrogen (ppm)',
                data: [15, 16, 14, 17, 18, 16, 19],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
            soilOksigen: {
                label: 'Soil Nitrogen (ppm)',
                data: [15, 16, 14, 17, 18, 16, 19],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            }
        }
    };

    // Use provided data or fallback to defaults
    const currentSensorData = sensorData || defaultSensorData;

    // Default metric cards data
    const metricsData = [
        {
            icon: Leaf,
            title: "Soil Health",
            value: "96%",
            description: "Excellent growth and vitality observed",
            gradient: true,
            gradientFrom: "from-green-500",
            gradientTo: "to-green-600"
        },
        {
            icon: Thermometer,
            title: "Temperature",
            value: "19°C",
            description: "Maintain consistent between 16°C and 28°C",
            iconColor: "text-orange-500"
        },
        {
            icon: Droplet,
            title: "Soil Moisture",
            value: "82%",
            description: "Ensure good ventilation to prevent mold",
            iconColor: "text-blue-400"
        },
        {
            icon: Droplet,
            title: "pH level",
            value: "6.8",
            description: "Ideal level for nutrient uptake",
            iconColor: "text-teal-500"
        },
        {
            icon: Activity,
            title: "Phorus",
            value: "num",
            description: "Sufficient for root development",
            iconColor: "text-purple-500"
        },
        {
            icon: Wind,
            title: "Photasium",
            value: "num",
            description: "Promotes overall plant vigor",
            iconColor: "text-sky-500"
        },
        {
            icon: Sun,
            title: "Soil Nitrogen",
            value: "num",
            description: "Key for leaf and stem growth",
            iconColor: "text-yellow-500"
        },
        {
            icon: BarChart3,
            title: "Organic Matters",
            value: "num",
            description: "NPK values are within the ideal range",
            iconColor: "text-indigo-500"
        },
    ];

    // Event handlers
    const handleMenuItemClick = (key, label) => {
        setActiveMenuItem(label);
        // Call parent callback if provided
        if (onDataUpdate) {
            onDataUpdate('menuChange', { key, label });
        }
    };

    const handleGardenChange = (garden) => {
        setSelectedGarden(garden);
        // Call parent callback if provided
        if (onDataUpdate) {
            onDataUpdate('gardenChange', garden);
        }
    };

    const handleTaskToggle = (taskId, completed) => {
        // Call parent callback if provided
        if (onDataUpdate) {
            onDataUpdate('taskUpdate', { taskId, completed });
        }
    };

    const handleViewAllAlerts = () => {
        // Call parent callback if provided
        if (onDataUpdate) {
            onDataUpdate('viewAlerts');
        }
    };

    const handleProductionTimeframeChange = (timeframe) => {
        // Call parent callback if provided
        if (onDataUpdate) {
            onDataUpdate('productionTimeframe', timeframe);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activeItem={activeMenuItem}
                onItemClick={handleMenuItemClick}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    selectedGarden={selectedGarden}
                    onGardenChange={handleGardenChange}
                />

                {/* Main Dashboard Content */}
                <main className="flex-1 px-4 py-6 overflow-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 flex flex-col gap-6">

                            {/* Plant Information Card */}
                            <PlantInfo
                                plantName={plantData?.name || "Kangkung"}
                                description={plantData?.description || "Your plants are thriving and showing excellent growth. The current conditions are optimal for Kangkung cultivation."}
                                backgroundImage={plantData?.backgroundImage}
                                detailsLink={plantData?.detailsLink || "/plant-details/kangkung"}
                            />

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {metricsData.map((metric, index) => (
                                    <MetricCard
                                        key={index}
                                        icon={metric.icon}
                                        title={metric.title}
                                        value={metric.value}
                                        description={metric.description}
                                        iconColor={metric.iconColor}
                                        gradient={metric.gradient}
                                        gradientFrom={metric.gradientFrom}
                                        gradientTo={metric.gradientTo}
                                    />
                                ))}
                            </div>

                            {/* Production Overview */}
                            <ProductionOverview
                                totalProduction={productionData?.totalProduction || 1000}
                                productionUnit={productionData?.unit || "Tons"}
                                totalLandArea={productionData?.landArea || "1200 acres"}
                                landUsagePercentage={productionData?.landUsage || 56}
                                revenue={productionData?.revenue || "$500,000"}
                                onTimeframeChange={handleProductionTimeframeChange}
                            />

                            {/* Sensor Chart */}
                            <SensorChart
                                data={currentSensorData}
                                availableMetrics={[
                                    { key: 'temperature', label: 'Temperature' },
                                    { key: 'humidity', label: 'Humidity' }
                                ]}
                                defaultSelectedMetrics={['soilMoisture', 'temperature']}
                            />
                        </div>

                        {/* Right Column - Sidebar Widgets */}
                        <div className="flex flex-col gap-6">

                            {/* Alerts */}
                            <Alerts
                                alerts={alertsData || []}
                                onViewAll={handleViewAllAlerts}
                            />

                            {/* Tasks */}
                            <Tasks
                                tasks={tasksData || []}
                                onTaskToggle={handleTaskToggle}
                            />

                            {/* Device Status */}
                            <DeviceStatus
                                devices={devicesData}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AgricultureDashboard;