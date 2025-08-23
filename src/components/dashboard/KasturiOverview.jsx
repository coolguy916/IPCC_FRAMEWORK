import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Leaf, Thermometer, Droplet, Wind, Sun, Activity, BarChart3, AlertTriangle, Wifi, WifiOff, CloudRain, Sunrise, Sunset, X, Cloud, Zap, RefreshCw, ServerCrash
} from 'lucide-react';

// Import existing UI and layout components
import Header from '../layout/header';
import Sidebar from '../layout/sidebar';
import PlantInfo from '../ui/PlantInfo';
import MetricCard from '../ui/MetricCard';
import SensorChart from '../charts/sensorChart';
import Alerts from '../ui/Alerts';
import DeviceStatus from '../ui/DeviceStatus';
import ProductionOverview from '../ui/ProductionOverview';
import FarmingSuggestions from '../ui/FarmingSuggestions';
import image_url from '../images/limaunipis.png';

// Import the LandPlotsMap component from its separate file
import LandPlotsMap from '../ui/LandPlotMaps';

// Import your custom API hooks
import { useApi, useSensorData, useSerialConnection } from '../../hooks/useApi';
import { useFirestoreSensorData, useFirestoreFinancialData, useFirestoreTasks } from '../../hooks/useFirestore';

const AgricultureDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedGarden, setSelectedGarden] = useState("Limau Nipis"); // Diperbaiki dari "Nipis Cytrus"
    const [activeMenuItem, setActiveMenuItem] = useState("Overview");

    // Daftar kebun untuk dropdown
    const gardens = ['Limau Katsuri', 'Limau Nipis'];

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
    // Firestore real-time data hooks
    const siteId = 'site_katsuri_orchard';
    const firestoreSensorData = useFirestoreSensorData(siteId, 30);
    const firestoreFinancialData = useFirestoreFinancialData(siteId, 10);
    const firestoreTasks = useFirestoreTasks(siteId, false); // Only incomplete tasks
    
    // Use Firestore data with fallbacks
    const sensorData = firestoreSensorData.data?.length > 0 ? firestoreSensorData.data : [];
    const sensorLoading = firestoreSensorData.loading;
    const sensorError = firestoreSensorData.error;
    const lastUpdated = sensorData[0]?.timestamp || new Date().toISOString();
    
    // Legacy sensor data hook (for fallback if needed)
    const {
        data: legacySensorData,
        loading: legacySensorLoading,
        error: legacySensorError,
        refetch: refetchSensorData
    } = useSensorData(30000);

    // Serial connection status
    const {
        status: serialStatus,
        reconnect: serialReconnect,
        sendData: sendSerialData
    } = useSerialConnection();

    // State for additional data
    const [alerts, setAlerts] = useState([]);
    const [devices, setDevices] = useState([]);
    const [plantData, setPlantData] = useState(null);
    const [productionData, setProductionData] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const fetchControllerRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedGarden, setSelectedGarden] = useState("Nipis Cytrus");
    const [showWeatherModal, setShowWeatherModal] = useState(false);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=3.50744&longitude=101.1077&hourly=temperature_2m,relative_humidity_2m,rain,is_day,weathercode&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setWeatherData(data);
            } catch (error) { console.error('Error fetching weather data:', error); }
        };
        fetchWeatherData();
        const interval = setInterval(fetchWeatherData, 300000);
        return () => clearInterval(interval);
    }, []);

    const fetchAdditionalData = async () => {
        if (!isConnected) return;
        if (fetchControllerRef.current) fetchControllerRef.current.abort();
        const controller = new AbortController();
        fetchControllerRef.current = controller;
        try {
             const [alertsResponse, devicesResponse, plantResponse, productionResponse] = await Promise.all([
                getDataByFilters('alerts', { status: 'active' }, { orderBy: { column: 'created_at', direction: 'DESC' }, limit: 5 }, { signal: controller.signal }),
                getDataByFilters('devices', {}, { orderBy: { column: 'last_seen', direction: 'DESC' } }, { signal: controller.signal }),
                getDataByFilters('plants', { garden_id: selectedGarden }, { limit: 1 }, { signal: controller.signal }),
                getDataByFilters('production', { month: new Date().getMonth() + 1, year: new Date().getFullYear() }, { limit: 1 }, { signal: controller.signal })
            ]);
            setAlerts(alertsResponse || []);
            setDevices(devicesResponse || []);
            setPlantData(plantResponse?.[0] || null);
            setProductionData(productionResponse?.[0] || null);
        } catch (error) { if (error.name !== 'AbortError') console.error('Error fetching additional data:', error); }
    };
    
    useEffect(() => {
        fetchAdditionalData();
        return () => { if(fetchControllerRef.current) fetchControllerRef.current.abort(); }
    }, [isConnected, selectedGarden]);

    const latestSensorData = useMemo(() => sensorData?.[0] || null, [sensorData]);

    // jiii masukin sini
    const calculatedYield = useMemo(() => {
        if (!latestSensorData) return 0;
        const { nitrogen, organic_matter, soil_health, temperature, soil_moisture } = latestSensorData;
        if (!nitrogen || !organic_matter || !soil_health || !temperature || !soil_moisture) return 0;
        const yieldKg = -113481.12 + (652168.99 * nitrogen) + (1228.76 * organic_matter) + (-20577.85 * karbon)+ (-1107.59 * temperature)+ (1349.29 * humidity);
        return Math.max(0, yieldKg.toFixed(2)); // Ensure yield is not negative
    }, [latestSensorData]);

    // Calculate revenue based on yield
    const calculatedRevenue = useMemo(() => {
        const revenue = calculatedYield * 3.03;
        return revenue.toFixed(2);
    }, [calculatedYield]);

    const chartData = useMemo(() => {
        if (!sensorData || sensorData.length === 0) { return { labels: [], datasets: {} }; }
        const groupedData = sensorData.reduce((acc, reading) => {
            const date = new Date(reading.timestamp || reading.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!acc[date]) acc[date] = [];
            acc[date].push(reading);
            return acc;
        }, {});
        const labels = Object.keys(groupedData).sort((a,b) => new Date(a) - new Date(b));
        const createDataset = (key, label, color) => ({
            label, data: labels.map(date => (groupedData[date].reduce((sum, r) => sum + (r[key] || 0), 0) / groupedData[date].length).toFixed(2)),
            borderColor: color, backgroundColor: `${color}1A`, borderWidth: 2, fill: true, tension: 0.4
        });
        return { labels, datasets: {
            soilMoisture: createDataset('soil_moisture', 'Soil Moisture (%)', '#3b82f6'),
            temperature: createDataset('temperature', 'Temperature (°C)', '#f97316'),
            phLevel: createDataset('ph_level', 'pH Level', '#10b981'),
            soilNitrogen: createDataset('nitrogen', 'Soil Nitrogen (ppm)', '#8b5cf6')
        }};
    }, [sensorData]);

    const metricsData = useMemo(() => {
        const latest = latestSensorData;
        return [
            { icon: Leaf, title: "Total Carbon", value: latest?.soil_health ? `${latest.soil_health}%` : "8", description: "Excellent growth.", gradient: true, gradientFrom: "from-green-500", gradientTo: "to-green-600" },
            { icon: Activity, title: "Soil Organic Carbon", value: latest?.temperature ? `${latest.temperature}°C` : "N/A", description: "Optimal temperature.", iconColor: "text-orange-500" },
            { icon: Droplet, title: "Cation Exchange", value: latest?.soil_moisture ? `${latest.soil_moisture}%` : "N/A", description: "Good ventilation needed.", iconColor: "text-blue-400" },
            { icon: Droplet, title: "Organic Matter", value: latest?.ph_level || "N/A", description: "Ideal for nutrients.", iconColor: "text-teal-500" },
            { icon: Thermometer, title: "Temperature", value: latest?.phosphorus ? `${latest.phosphorus}ppm` : "N/A", description: "Sufficient for roots.", iconColor: "text-purple-500" },
            { icon: Wind, title: "Soil Moisture", value: latest?.potassium ? `${latest.potassium}ppm` : "N/A", description: "Promotes vigor.", iconColor: "text-sky-500" },
            { icon: Sun, title: "Soil pH", value: latest?.nitrogen ? `${latest.nitrogen}ppm` : "N/A", description: "Key for growth.", iconColor: "text-yellow-500" },
            { icon: BarChart3, title: "NPK", value: latest?.organic_matter ? `${latest.organic_matter}%` : "N/A", description: "Within ideal range.", iconColor: "text-indigo-500" },
        ];
    }, [latestSensorData]);
    
    const connectionStatus = useMemo(() => {
        if (error || sensorError) {
            return {
                Icon: AlertTriangle,
                text: "Connection Issues",
                color: "bg-red-100 text-red-800",
                pulse: false
            };
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
                        created_at: `>= ${new Date(now.setDate(now.getDate() - 7)).toISOString()}`,
                        garden_id: selectedGarden
                    };
                    break;
                case 'month':
                    filters = { 
                        month: now.getMonth() + 1, 
                        year: now.getFullYear(),
                        garden_id: selectedGarden
                    };
                    break;
                case 'year':
                    filters = { 
                        year: now.getFullYear(),
                        garden_id: selectedGarden
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
        <div className="flex items-center gap-4 text-sm">
            {/* API Connection */}
            <div className="flex items-center gap-2">
                {isConnected ? (
                    <>
                        <Wifi className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">API Connected</span>
                    </>
                ) : (
                    <>
                        <WifiOff className="w-4 h-4 text-red-500" />
                        <span className="text-red-600">API Disconnected</span>
                    </>
                )}
            </div>
            
            {/* Firestore Connection */}
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                    !sensorLoading && !sensorError ? 'bg-green-500 animate-pulse' :
                    sensorLoading ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                }`} title="Firestore real-time status"></div>
                <span className="text-xs">
                    {!sensorLoading && !sensorError ? '🔥 Firestore Live' :
                     sensorLoading ? '⏳ Connecting...' : '❌ Offline'}
                </span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
            />

            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
            }`}>
                <Header 
                    onMenuClick={() => setSidebarOpen(true)} 
                    selectedGarden={selectedGarden} 
                    onGardenChange={(garden) => setSelectedGarden(garden)} 
                />

                {/* Connection Status Bar */}
                <div className="bg-white border-b px-4 py-2 flex justify-between items-center">
                    <ConnectionStatus />
                    {lastUpdated && (
                        <span className="text-xs text-gray-500">
                            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                        </span>
                    )}
                    {(error || sensorError) && (
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm">Connection issues detected</span>
                        </div>
                    )}
                </div>

                <main className="flex-1 px-4 py-6 overflow-auto">
                    {(loading || (sensorLoading && !sensorData)) && <div className="text-center py-12 font-medium text-gray-600">Loading dashboard data...</div>}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <PlantInfo plantName={plantData?.name || "Lime"} description={plantData?.description || "Loading plant information..."} backgroundImage={plantData?.image_url || image_url} detailsLink={`/plant-details/${plantData?.id || 'lime'}`} />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {metricsData.map((metric, index) => <MetricCard key={index} {...metric} loading={sensorLoading && !latestSensorData} />)}
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ProductionOverview 
                                    totalProduction={calculatedYield} 
                                    productionUnit="kg" 
                                    totalLandArea={productionData?.land_area || "0 acres"} 
                                    landUsagePercentage={productionData?.land_usage || 0} 
                                    revenue={`RM ${calculatedRevenue}`} 
                                    loading={loading || sensorLoading} 
                                />
                                <FarmingSuggestions sensorData={latestSensorData} loading={sensorLoading} />
                            </div>
                            <SensorChart data={chartData} availableMetrics={[{ key: 'soilMoisture', label: 'Soil Moisture' }, { key: 'temperature', label: 'Temperature' }, { key: 'phLevel', label: 'pH Level' }, { key: 'soilNitrogen', label: 'Soil Nitrogen' }]} defaultSelectedMetrics={['soilMoisture', 'temperature']} loading={sensorLoading} error={sensorError} onRefresh={refetchSensorData} />
                            
                            <LandPlotsMap />

                        </div>
                        <div className="flex flex-col gap-6">
                            <WeatherWidget data={weatherData} loading={!weatherData} onMoreDetailsClick={() => setShowWeatherModal(true)} />
                            <Alerts alerts={alerts} onViewAll={() => {}} loading={loading} />
                            <DeviceStatus devices={devices} serialStatus={serialStatus} onSerialReconnect={serialReconnect} loading={loading} />
                            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                                <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button 
                                        onClick={refetchSensorData} 
                                        disabled={sensorLoading} 
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${sensorLoading ? 'animate-spin' : ''}`} />
                                        {sensorLoading ? 'Refreshing...' : 'Refresh Sensor Data'}
                                    </button>
                                    <button 
                                        onClick={serialReconnect} 
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        Reconnect Serial
                                    </button>
                                    <button 
                                        onClick={fetchAdditionalData} 
                                        disabled={loading} 
                                        className="w-full bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                    >
                                        {loading ? 'Loading...' : 'Refresh All Data'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <WeatherForecastModal show={showWeatherModal} onClose={() => setShowWeatherModal(false)} data={weatherData} />
        </div>
    );
};

export default NipisOverview;