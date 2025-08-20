// src/components/dashboard/AgricultureDashboard.jsx - Enhanced with backend integration
import React, { useState, useEffect, useMemo } from 'react';
import {
    Leaf, Thermometer, Droplet, Wind, Sun, Activity, BarChart3, AlertTriangle, Wifi, WifiOff
} from 'lucide-react';
// Import your existing components
import Header from '../layout/header';
import Sidebar from '../layout/sidebar';
import PlantInfo from '../ui/PlantInfo';
import MetricCard from '../ui/MetricCard';
import SensorChart from '../charts/sensorChart';
import Alerts from '../ui/Alerts';
import Tasks from '../ui/Tasks';
import DeviceStatus from '../ui/DeviceStatus';
import ProductionOverview from '../ui/ProductionOverview';
// import image_url from '../images/image.png';

// Import our enhanced API hook
import { useApi, useSensorData, useSerialConnection } from '../../hook/useApi';

const AgricultureDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedGarden, setSelectedGarden] = useState("Spinach Garden 08");
    const [activeMenuItem, setActiveMenuItem] = useState("Overview");

    // API connection
    const { 
        isConnected, 
        wsConnected, 
        error, 
        loading,
        getDataByFilters,
        insertData,
        updateData
    } = useApi();

    // Sensor data with auto-refresh
    const {
        data: sensorData,
        loading: sensorLoading,
        error: sensorError,
        lastUpdated,
        refetch: refetchSensorData
    } = useSensorData(30000); // Refresh every 30 seconds

    // Serial connection status
    const {
        status: serialStatus,
        reconnect: serialReconnect,
        sendData: sendSerialData
    } = useSerialConnection();

    // State for additional data
    const [alerts, setAlerts] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [devices, setDevices] = useState([]);
    const [plantData, setPlantData] = useState(null);
    const [productionData, setProductionData] = useState(null);

    // Fetch additional data
    useEffect(() => {
        if (isConnected) {
            fetchAdditionalData();
        }
    }, [isConnected]);

    const fetchAdditionalData = async () => {
        try {
            // Fetch alerts
            const alertsResponse = await getDataByFilters('alerts', 
                { status: 'active' }, 
                { orderBy: { column: 'created_at', direction: 'DESC' }, limit: 5 }
            );
            setAlerts(alertsResponse || []);

            // Fetch tasks
            const tasksResponse = await getDataByFilters('tasks',
                { status: ['pending', 'in_progress'] },
                { orderBy: { column: 'priority', direction: 'DESC' }, limit: 10 }
            );
            setTasks(tasksResponse || []);

            // Fetch device status
            const devicesResponse = await getDataByFilters('devices',
                {},
                { orderBy: { column: 'last_seen', direction: 'DESC' } }
            );
            setDevices(devicesResponse || []);

            // Fetch plant information
            const plantResponse = await getDataByFilters('plants',
                { garden_id: selectedGarden },
                { limit: 1 }
            );
            setPlantData(plantResponse?.[0] || null);

            // Fetch production data
            const productionResponse = await getDataByFilters('production',
                { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
                { limit: 1 }
            );
            setProductionData(productionResponse?.[0] || null);

        } catch (error) {
            console.error('Error fetching additional data:', error);
        }
    };

    // Process sensor data for chart
    const chartData = useMemo(() => {
        if (!sensorData || sensorData.length === 0) {
            // Return default data structure
            return {
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
                    }
                }
            };
        }

        // Group sensor data by date and create chart-ready format
        const groupedData = sensorData.reduce((acc, reading) => {
            const date = new Date(reading.timestamp || reading.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
            
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(reading);
            return acc;
        }, {});

        const labels = Object.keys(groupedData).sort();
        
        // Calculate averages for each date
        const datasets = {
            soilMoisture: {
                label: 'Soil Moisture (%)',
                data: labels.map(date => {
                    const readings = groupedData[date];
                    const avg = readings.reduce((sum, r) => sum + (r.soil_moisture || 0), 0) / readings.length;
                    return Math.round(avg * 100) / 100;
                }),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
            temperature: {
                label: 'Temperature (°C)',
                data: labels.map(date => {
                    const readings = groupedData[date];
                    const avg = readings.reduce((sum, r) => sum + (r.temperature || 0), 0) / readings.length;
                    return Math.round(avg * 100) / 100;
                }),
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
            phLevel: {
                label: 'pH Level',
                data: labels.map(date => {
                    const readings = groupedData[date];
                    const avg = readings.reduce((sum, r) => sum + (r.ph_level || 6.8), 0) / readings.length;
                    return Math.round(avg * 100) / 100;
                }),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
            soilNitrogen: {
                label: 'Soil Nitrogen (ppm)',
                data: labels.map(date => {
                    const readings = groupedData[date];
                    const avg = readings.reduce((sum, r) => sum + (r.nitrogen || 15), 0) / readings.length;
                    return Math.round(avg * 100) / 100;
                }),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            }
        };

        return { labels, datasets };
    }, [sensorData]);

    // Get latest sensor readings for metric cards
    const latestSensorData = useMemo(() => {
        if (!sensorData || sensorData.length === 0) return null;
        return sensorData[0]; // Assuming data is ordered by timestamp DESC
    }, [sensorData]);

    // Dynamic metric cards based on actual data
    const metricsData = useMemo(() => {
        const latest = latestSensorData;
        
        return [
            {
                icon: Leaf,
                title: "Soil Health",
                value: latest?.soil_health ? `${latest.soil_health}%` : "96%",
                description: "Excellent growth and vitality observed",
                gradient: true,
                gradientFrom: "from-green-500",
                gradientTo: "to-green-600"
            },
            {
                icon: Thermometer,
                title: "Temperature",
                value: latest?.temperature ? `${latest.temperature}°C` : "19°C",
                description: "Maintain consistent between 16°C and 28°C",
                iconColor: "text-orange-500"
            },
            {
                icon: Droplet,
                title: "Soil Moisture",
                value: latest?.soil_moisture ? `${latest.soil_moisture}%` : "82%",
                description: "Ensure good ventilation to prevent mold",
                iconColor: "text-blue-400"
            },
            {
                icon: Droplet,
                title: "pH level",
                value: latest?.ph_level || "6.8",
                description: "Ideal level for nutrient uptake",
                iconColor: "text-teal-500"
            },
            {
                icon: Activity,
                title: "Phosphorus",
                value: latest?.phosphorus ? `${latest.phosphorus}ppm` : "12ppm",
                description: "Sufficient for root development",
                iconColor: "text-purple-500"
            },
            {
                icon: Wind,
                title: "Potassium",
                value: latest?.potassium ? `${latest.potassium}ppm` : "25ppm",
                description: "Promotes overall plant vigor",
                iconColor: "text-sky-500"
            },
            {
                icon: Sun,
                title: "Soil Nitrogen",
                value: latest?.nitrogen ? `${latest.nitrogen}ppm` : "18ppm",
                description: "Key for leaf and stem growth",
                iconColor: "text-yellow-500"
            },
            {
                icon: BarChart3,
                title: "Organic Matter",
                value: latest?.organic_matter ? `${latest.organic_matter}%` : "3.2%",
                description: "NPK values are within the ideal range",
                iconColor: "text-indigo-500"
            },
        ];
    }, [latestSensorData]);

    // Event handlers
    const handleMenuItemClick = (key, label) => {
        setActiveMenuItem(label);
    };

    const handleGardenChange = (garden) => {
        setSelectedGarden(garden);
        // Refetch data for the new garden
        fetchAdditionalData();
        refetchSensorData({ garden_id: garden });
    };

    const handleTaskToggle = async (taskId, completed) => {
        try {
            await updateData('tasks', 
                { status: completed ? 'completed' : 'pending', updated_at: new Date().toISOString() },
                'id = ?',
                [taskId]
            );
            // Refresh tasks
            fetchAdditionalData();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleViewAllAlerts = () => {
        setActiveMenuItem("Alerts");
    };

    const handleProductionTimeframeChange = async (timeframe) => {
        // Fetch production data for the selected timeframe
        try {
            let filters = {};
            const now = new Date();
            
            switch (timeframe) {
                case 'week':
                    filters = { 
                        created_at: `>= ${new Date(now.setDate(now.getDate() - 7)).toISOString()}` 
                    };
                    break;
                case 'month':
                    filters = { 
                        month: now.getMonth() + 1, 
                        year: now.getFullYear() 
                    };
                    break;
                case 'year':
                    filters = { 
                        year: now.getFullYear() 
                    };
                    break;
            }

            const productionResponse = await getDataByFilters('production', filters);
            setProductionData(productionResponse?.[0] || null);
        } catch (error) {
            console.error('Error fetching production data:', error);
        }
    };

    // Connection status indicator
    const ConnectionStatus = () => (
        <div className="flex items-center gap-2 text-sm">
            {isConnected ? (
                <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Connected</span>
                </>
            ) : (
                <>
                    <WifiOff className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">Disconnected</span>
                </>
            )}
            {wsConnected && (
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                </div>
            )}
        </div>
    );

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

                {/* Connection Status Bar */}
                <div className="bg-white border-b px-4 py-2 flex justify-between items-center">
                    <ConnectionStatus />
                    {lastUpdated && (
                        <span className="text-xs text-gray-500">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    {(error || sensorError) && (
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm">Connection issues detected</span>
                        </div>
                    )}
                </div>

                {/* Main Dashboard Content */}
                <main className="flex-1 px-4 py-6 overflow-auto">
                    {loading && !sensorData && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2">Loading dashboard data...</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Plant Information Card */}
                            <PlantInfo
                                plantName={plantData?.name || "Kangkung"}
                                description={plantData?.description || "Your plants are thriving and showing excellent growth. The current conditions are optimal for cultivation."}
                                backgroundImage={plantData?.image_url}
                                detailsLink={`/plant-details/${plantData?.id || 'kangkung'}`}
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
                                        loading={sensorLoading && !latestSensorData}
                                    />
                                ))}
                            </div>

                            {/* Production Overview */}
                            <ProductionOverview
                                totalProduction={productionData?.total_production || 1000}
                                productionUnit={productionData?.unit || "Tons"}
                                totalLandArea={productionData?.land_area || "1200 acres"}
                                landUsagePercentage={productionData?.land_usage || 56}
                                revenue={productionData?.revenue || "$500,000"}
                                onTimeframeChange={handleProductionTimeframeChange}
                                loading={loading}
                            />

                            {/* Sensor Chart */}
                            <SensorChart
                                data={chartData}
                                availableMetrics={[
                                    { key: 'soilMoisture', label: 'Soil Moisture' },
                                    { key: 'temperature', label: 'Temperature' },
                                    { key: 'phLevel', label: 'pH Level' },
                                    { key: 'soilNitrogen', label: 'Soil Nitrogen' }
                                ]}
                                defaultSelectedMetrics={['soilMoisture', 'temperature']}
                                loading={sensorLoading}
                                error={sensorError}
                                onRefresh={() => refetchSensorData()}
                            />
                        </div>

                        {/* Right Column - Sidebar Widgets */}
                        <div className="flex flex-col gap-6">
                            {/* Alerts */}
                            <Alerts
                                alerts={alerts}
                                onViewAll={handleViewAllAlerts}
                                loading={loading}
                            />

                            {/* Tasks */}
                            <Tasks
                                tasks={tasks}
                                onTaskToggle={handleTaskToggle}
                                loading={loading}
                            />

                            {/* Device Status */}
                            <DeviceStatus
                                devices={devices}
                                serialStatus={serialStatus}
                                onSerialReconnect={serialReconnect}
                                loading={loading}
                            />

                            {/* Real-time Data Panel */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">Real-time Data</h3>
                                    <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                                </div>
                                
                                {latestSensorData ? (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Temperature:</span>
                                            <span className="font-medium">{latestSensorData.temperature}°C</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Soil Moisture:</span>
                                            <span className="font-medium">{latestSensorData.soil_moisture}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">pH Level:</span>
                                            <span className="font-medium">{latestSensorData.ph_level}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">
                                            Last reading: {new Date(latestSensorData.timestamp || latestSensorData.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        {sensorLoading ? 'Loading sensor data...' : 'No sensor data available'}
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions Panel */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <button 
                                        onClick={() => refetchSensorData()}
                                        disabled={sensorLoading}
                                        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm font-medium disabled:opacity-50"
                                    >
                                        {sensorLoading ? 'Refreshing...' : 'Refresh Sensor Data'}
                                    </button>
                                    
                                    {serialStatus && (
                                        <button 
                                            onClick={serialReconnect}
                                            className="w-full bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded text-sm font-medium"
                                        >
                                            Reconnect Serial
                                        </button>
                                    )}
                                    
                                    <button 
                                        onClick={fetchAdditionalData}
                                        disabled={loading}
                                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium disabled:opacity-50"
                                    >
                                        {loading ? 'Loading...' : 'Refresh All Data'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AgricultureDashboard;