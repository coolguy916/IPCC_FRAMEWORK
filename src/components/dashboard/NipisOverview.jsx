import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Leaf, Thermometer, Droplet, Wind, Sun, Activity, BarChart3, AlertTriangle, Wifi, WifiOff, CloudRain, Sunrise, Sunset, X, Cloud
} from 'lucide-react';
// Import your existing components
import Header from '../layout/header';
import Sidebar from '../layout/sidebar'; // <-- Using your new Sidebar
import PlantInfo from '../ui/PlantInfo';
import MetricCard from '../ui/MetricCard';
import SensorChart from '../charts/sensorChart';
import Alerts from '../ui/Alerts';
import Tasks from '../ui/Tasks';
import DeviceStatus from '../ui/DeviceStatus';
import ProductionOverview from '../ui/ProductionOverview';
import image_url from '../images/limaunipis.png';

// Import our enhanced API hook
import { useApi, useSensorData, useSerialConnection } from '../../hook/useApi';

// *** CORRECTED & ENHANCED WEATHER FORECAST MODAL ***
const WeatherForecastModal = ({ show, onClose, data }) => {
    // The main container now handles visibility and transitions
    return (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
                show ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            {/* The modal dialog itself has its own entrance animation */}
            <div 
                className={`bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl transform transition-all duration-300 ${
                    show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">5-Day Weather Forecast</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Show spinner if data is not yet available */}
                {!data || !data.daily ? (
                    <div className="text-center py-10">
                        <p>Loading forecast data...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data.daily.time.slice(0, 5).map((day, index) => {
                            const getWeatherIcon = (code, size = "w-8 h-8") => {
                                if ([0, 1].includes(code)) return <Sun className={`${size} text-yellow-500`} />;
                                if ([2, 3].includes(code)) return <Cloud className={`${size} text-gray-500`} />;
                                if (code >= 51 && code <= 67) return <CloudRain className={`${size} text-blue-500`} />;
                                if (code >= 71 && code <= 86) return <CloudRain className={`${size} text-gray-400`} />;
                                if (code >= 95) return <CloudRain className={`${size} text-yellow-600`} />;
                                return <Cloud className={`${size} text-gray-500`} />;
                            };

                            return (
                                <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center bg-gray-50 p-3 rounded-lg border">
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="font-semibold text-gray-800">{new Date(day).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                        <p className="text-sm text-gray-500">{new Date(day).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <div className="flex items-center justify-start md:justify-center">
                                        {getWeatherIcon(data.daily.weather_code[index])}
                                    </div>
                                    <div className="flex items-center justify-start md:justify-center space-x-2">
                                        <CloudRain className="w-5 h-5 text-blue-500" />
                                        <span className="font-medium text-gray-700">{data.daily.precipitation_sum[index]} mm</span>
                                    </div>
                                    <div className="flex items-center justify-start md:justify-center space-x-2">
                                        <Thermometer className="w-5 h-5 text-red-500" />
                                        <span className="font-medium text-gray-700">{Math.round(data.daily.temperature_2m_max[index])}° / {Math.round(data.daily.temperature_2m_min[index])}°C</span>
                                    </div>
                                    <div className="col-span-2 md:col-span-1 text-sm md:text-right space-y-1">
                                        <div className="flex items-center justify-start md:justify-end space-x-2">
                                            <Sunrise className="w-5 h-5 text-orange-400" />
                                            <span>{new Date(data.daily.sunrise[index]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center justify-start md:justify-end space-x-2">
                                            <Sunset className="w-5 h-5 text-indigo-500" />
                                            <span>{new Date(data.daily.sunset[index]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Weather Widget for the sidebar
const WeatherWidget = ({ data, loading, onMoreDetailsClick }) => {
    if (loading || !data || !data.hourly || !data.daily) {
        return (
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center h-full flex items-center justify-center">
                <p className="text-gray-500">Loading weather data...</p>
            </div>
        );
    }

    const currentHourIndex = new Date().getHours();
    const currentTemp = data.hourly.temperature_2m[currentHourIndex];
    const currentHumidity = data.hourly.relative_humidity_2m[currentHourIndex];
    const currentRain = data.hourly.rain[currentHourIndex];

    return (
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Selangor</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{Math.round(currentTemp)}°C</p>
                    </div>
                     <Sun className="w-12 h-12 text-yellow-500" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                        <Droplet className="w-5 h-5 text-blue-500 mr-2" />
                        <span>Humidity: {currentHumidity}%</span>
                    </div>
                    <div className="flex items-center">
                        <CloudRain className="w-5 h-5 text-gray-500 mr-2" />
                        <span>Rain: {currentRain} mm</span>
                    </div>
                    <div className="flex items-center">
                        <Sunrise className="w-5 h-5 text-orange-500 mr-2" />
                        <span>{new Date(data.daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center">
                        <Sunset className="w-5 h-5 text-indigo-500 mr-2" />
                        <span>{new Date(data.daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
            <button
                onClick={onMoreDetailsClick}
                disabled={loading}
                className="w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
            >
                More Details
            </button>
        </div>
    );
};

const NipisOverview = () => {
    // State for the sidebar overlay on mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // **NEW**: State for the collapsible sidebar on desktop
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [selectedGarden, setSelectedGarden] = useState("Nipis Cytrus");

    // API connection
    const { 
        isConnected, 
        wsConnected, 
        error, 
        loading,
        getDataByFilters,
        updateData
    } = useApi();

    // Sensor data with auto-refresh
    const {
        data: sensorData,
        loading: sensorLoading,
        error: sensorError,
        lastUpdated,
        refetch: refetchSensorData
    } = useSensorData(30000);

    // Serial connection status
    const {
        status: serialStatus,
        reconnect: serialReconnect,
    } = useSerialConnection();

    // State for additional data
    const [alerts, setAlerts] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [devices, setDevices] = useState([]);
    const [plantData, setPlantData] = useState(null);
    const [productionData, setProductionData] = useState(null);
    const fetchControllerRef = useRef(null);

    // State for weather data and modal
    const [weatherData, setWeatherData] = useState(null);
    const [showWeatherModal, setShowWeatherModal] = useState(false);

    // Fetch weather data
    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=3.50744&longitude=101.1077&hourly=temperature_2m,relative_humidity_2m,rain,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto'
                );
                const data = await response.json();
                setWeatherData(data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchWeatherData();
        const interval = setInterval(fetchWeatherData, 300000);
        return () => clearInterval(interval);
    }, []);

    // Fetch other data
    const fetchAdditionalData = async () => {
        if (!isConnected) return;
        if (fetchControllerRef.current) fetchControllerRef.current.abort();
        
        const controller = new AbortController();
        fetchControllerRef.current = controller;

        try {
             const [alertsResponse, tasksResponse, devicesResponse, plantResponse, productionResponse] = await Promise.all([
                getDataByFilters('alerts', { status: 'active' }, { orderBy: { column: 'created_at', direction: 'DESC' }, limit: 5 }, { signal: controller.signal }),
                getDataByFilters('tasks', { status: ['pending', 'in_progress'] }, { orderBy: { column: 'priority', direction: 'DESC' }, limit: 10 }, { signal: controller.signal }),
                getDataByFilters('devices', {}, { orderBy: { column: 'last_seen', direction: 'DESC' } }, { signal: controller.signal }),
                getDataByFilters('plants', { garden_id: selectedGarden }, { limit: 1 }, { signal: controller.signal }),
                getDataByFilters('production', { month: new Date().getMonth() + 1, year: new Date().getFullYear() }, { limit: 1 }, { signal: controller.signal })
            ]);

            const uniqueTasks = Array.from(new Set((tasksResponse || []).map(task => task.id))).map(id => tasksResponse.find(task => task.id === id));
            
            setAlerts(alertsResponse || []);
            setTasks(uniqueTasks);
            setDevices(devicesResponse || []);
            setPlantData(plantResponse?.[0] || null);
            setProductionData(productionResponse?.[0] || null);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error fetching additional data:', error);
            }
        }
    };

    useEffect(() => {
        fetchAdditionalData();
        return () => {
            if(fetchControllerRef.current) fetchControllerRef.current.abort();
        }
    }, [isConnected, selectedGarden]);


    const chartData = useMemo(() => {
        if (!sensorData || sensorData.length === 0) {
            return {
                labels: ['Aug 14', 'Aug 15', 'Aug 16', 'Aug 17', 'Aug 18', 'Aug 19', 'Aug 20'],
                datasets: {
                    soilMoisture: { label: 'Soil Moisture (%)', data: [65, 62, 68, 72, 70, 66, 75], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 2, fill: true, tension: 0.4 },
                    temperature: { label: 'Temperature (°C)', data: [19, 21, 20, 22, 23, 22, 24], borderColor: '#f97316', backgroundColor: 'rgba(249, 115, 22, 0.1)', borderWidth: 2, fill: true, tension: 0.4 }
                }
            };
        }
        const groupedData = sensorData.reduce((acc, reading) => {
            const date = new Date(reading.timestamp || reading.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!acc[date]) acc[date] = [];
            acc[date].push(reading);
            return acc;
        }, {});
        const labels = Object.keys(groupedData).sort((a,b) => new Date(a) - new Date(b));
        const createDataset = (key, label, color) => ({
            label,
            data: labels.map(date => {
                const avg = groupedData[date].reduce((sum, r) => sum + (r[key] || 0), 0) / groupedData[date].length;
                return Math.round(avg * 100) / 100;
            }),
            borderColor: color, backgroundColor: `${color}1A`, borderWidth: 2, fill: true, tension: 0.4
        });
        return { labels, datasets: {
            soilMoisture: createDataset('soil_moisture', 'Soil Moisture (%)', '#3b82f6'),
            temperature: createDataset('temperature', 'Temperature (°C)', '#f97316'),
            phLevel: createDataset('ph_level', 'pH Level', '#10b981'),
            soilNitrogen: createDataset('nitrogen', 'Soil Nitrogen (ppm)', '#8b5cf6')
        }};
    }, [sensorData]);

    const latestSensorData = useMemo(() => sensorData?.[0] || null, [sensorData]);

    const metricsData = useMemo(() => {
        const latest = latestSensorData;
        return [
            { icon: Leaf, title: "Total Carbon", value: latest?.soil_health ? `${latest.soil_health}%` : "96%", description: "Excellent growth and vitality observed.", gradient: true, gradientFrom: "from-green-500", gradientTo: "to-green-600" },
            { icon: Activity, title: "Soil Organic Carbon", value: latest?.temperature ? `${latest.temperature}°C` : "19%", description: "Maintain between 16°C and 28°C.", iconColor: "text-orange-500" },
            { icon: Droplet, title: "Cation Exchange Capacity", value: latest?.soil_moisture ? `${latest.soil_moisture}%` : "82%", description: "Ensure good ventilation to prevent mold.", iconColor: "text-blue-400" },
            { icon: Droplet, title: "Organic Matter", value: latest?.ph_level || "6.8%", description: "Ideal level for nutrient uptake.", iconColor: "text-teal-500" },
            { icon: Thermometer, title: "Temperature", value: latest?.phosphorus ? `${latest.phosphorus}ppm` : "12°C", description: "Sufficient for root development.", iconColor: "text-purple-500" },
            { icon: Wind, title: "Soil Moisture", value: latest?.potassium ? `${latest.potassium}ppm` : "25%", description: "Promotes overall plant vigor.", iconColor: "text-sky-500" },
            { icon: Sun, title: "Soil pH", value: latest?.nitrogen ? `${latest.nitrogen}ppm` : "7", description: "Key for leaf and stem growth.", iconColor: "text-yellow-500" },
            { icon: BarChart3, title: "NPK", value: latest?.organic_matter ? `${latest.organic_matter}%` : "3.2%", description: "NPK values are within the ideal range.", iconColor: "text-indigo-500" },
        ];
    }, [latestSensorData]);
    
    const handleTaskToggle = async (taskId, completed) => {
        try {
            await updateData('tasks', { status: completed ? 'completed' : 'pending' }, 'id = ?', [taskId]);
            fetchAdditionalData();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Using the new Sidebar component and passing the correct props */}
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* 
              Main content container
              - 'transition-all' added for smooth margin animation
              - 'lg:ml-64' or 'lg:ml-20' is set based on the sidebar state
            */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
            }`}>
                <Header 
                    onMenuClick={() => setSidebarOpen(true)} 
                    selectedGarden={selectedGarden} 
                    onGardenChange={(garden) => setSelectedGarden(garden)} 
                />
                
                <div className="bg-white border-b px-4 py-2 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        {isConnected ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
                        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                        {wsConnected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live data active"></div>}
                    </div>
                    {lastUpdated && <span className="text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</span>}
                    {(error || sensorError) && <div className="flex items-center gap-2 text-red-600"><AlertTriangle className="w-4 h-4" /><span>Connection issues</span></div>}
                </div>

                <main className="flex-1 px-4 py-6 overflow-auto">
                    {(loading || sensorLoading) && !sensorData && <div className="text-center py-12">Loading dashboard data...</div>}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <PlantInfo plantName={plantData?.name || "Limau Nipis"} description={plantData?.description || "Your plants are thriving and showing excellent growth. The current conditions are optimal."} backgroundImage={plantData?.image_url || image_url} detailsLink={`/plant-details/${plantData?.id || 'spinach'}`} />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {metricsData.map((metric, index) => <MetricCard key={index} {...metric} loading={sensorLoading && !latestSensorData} />)}
                            </div>
                            <ProductionOverview totalProduction={productionData?.total_production || 1250} productionUnit={productionData?.unit || "kg"} totalLandArea={productionData?.land_area || "50 acres"} landUsagePercentage={productionData?.land_usage || 75} revenue={productionData?.revenue || "$25,000"} loading={loading} />
                            <SensorChart data={chartData} availableMetrics={[{ key: 'soilMoisture', label: 'Soil Moisture' }, { key: 'temperature', label: 'Temperature' }, { key: 'phLevel', label: 'pH Level' }, { key: 'soilNitrogen', label: 'Soil Nitrogen' }]} defaultSelectedMetrics={['soilMoisture', 'temperature']} loading={sensorLoading} error={sensorError} onRefresh={refetchSensorData} />
                        </div>
                        <div className="flex flex-col gap-6">
                            <WeatherWidget data={weatherData} loading={!weatherData} onMoreDetailsClick={() => setShowWeatherModal(true)} />
                            <Alerts alerts={alerts} onViewAll={() => { /* Navigation logic will be handled by links within the Alerts component */ }} loading={loading} />
                            <Tasks tasks={tasks} onTaskToggle={handleTaskToggle} loading={loading} />
                            <DeviceStatus devices={devices} serialStatus={serialStatus} onSerialReconnect={serialReconnect} loading={loading} />
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <h3 className="font-semibold text-gray-900 mb-4">Real-time Data</h3>
                                {latestSensorData ? (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span>Temperature:</span><span className="font-medium">{latestSensorData.temperature}°C</span></div>
                                        <div className="flex justify-between"><span>Soil Moisture:</span><span className="font-medium">{latestSensorData.soil_moisture}%</span></div>
                                        <div className="flex justify-between"><span>pH Level:</span><span className="font-medium">{latestSensorData.ph_level}</span></div>
                                        <div className="text-xs text-gray-500 mt-2">Last reading: {new Date(latestSensorData.timestamp || latestSensorData.created_at).toLocaleString()}</div>
                                    </div>
                                ) : <div className="text-sm text-gray-500">{sensorLoading ? 'Loading sensor data...' : 'No sensor data available'}</div>}
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <button onClick={refetchSensorData} disabled={sensorLoading} className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm font-medium disabled:opacity-50">{sensorLoading ? 'Refreshing...' : 'Refresh Sensor Data'}</button>
                                    <button onClick={serialReconnect} className="w-full bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded text-sm font-medium">Reconnect Serial</button>
                                    <button onClick={fetchAdditionalData} disabled={loading} className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium disabled:opacity-50">{loading ? 'Loading...' : 'Refresh All Data'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {/* The modal will now render correctly here */}
            <WeatherForecastModal show={showWeatherModal} onClose={() => setShowWeatherModal(false)} data={weatherData} />
        </div>
    );
};

export default NipisOverview;