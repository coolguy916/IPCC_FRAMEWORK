import React, { useState, useEffect, useMemo } from 'react';
import {
    Leaf, Thermometer, Droplet, Wind, Sun, Activity, BarChart3, AlertTriangle, Wifi, WifiOff
} from 'lucide-react';
import Header from '../layout/header';
import Sidebar from '../layout/sidebar';
import LineChart from '../charts/lineChart';

// Data dummy untuk simulasi data sensor (per hari, maks 20 entri)
const generateDummyData = (count = 20) => {
    const data = [];
    const baseTime = new Date();
    const maxEntries = Math.min(count, 20); // Batasi maksimum 20 entri
    for (let i = 0; i < maxEntries; i++) {
        data.push({
            timestamp: new Date(baseTime.getTime() - i * 24 * 3600000).toISOString(), // 1 hari mundur per data
            temperature: (20 + Math.random() * 10).toFixed(1), // 20-30°C
            soil_moisture: (40 + Math.random() * 40).toFixed(1), // 40-80%
            ph_level: (6 + Math.random() * 1.5).toFixed(1), // 6-7.5
            nitrogen: (15 + Math.random() * 10).toFixed(1), // 15-25 ppm
            phosphorus: (10 + Math.random() * 10).toFixed(1), // 10-20 ppm
            potassium: (20 + Math.random() * 10).toFixed(1), // 20-30 ppm
            soil_health: (90 + Math.random() * 10).toFixed(1), // 90-100
            organic_matter: (2.5 + Math.random() * 2).toFixed(1), // 2.5-4.5%
        });
    }
    return data.reverse(); // Urutan waktu ascending
};

// Helper component for individual metric charts
const MetricLineChart = ({ title, data, loading, error, onRefresh, icon: Icon, iconColor, color }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border col-span-1 md:col-span-2">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                {Icon && <Icon className={`w-6 h-6 ${iconColor || 'text-gray-700'}`} />}
                <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <button
                onClick={onRefresh}
                disabled={loading}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded disabled:opacity-50"
            >
                {loading ? 'Refreshing...' : 'Refresh'}
            </button>
        </div>
        <div style={{ height: '300px' }}>
            <LineChart
                data={{
                    labels: data.labels,
                    datasets: [{
                        label: title,
                        data: data.datasets?.metric?.data || [],
                        borderColor: color,
                        backgroundColor: `${color}20`,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    }],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: { color: '#6b7280' },
                        },
                    },
                    scales: {
                        x: {
                            grid: { drawOnChartArea: false },
                            ticks: { color: '#6b7280', font: { size: 12, weight: '500' } },
                        },
                        y: {
                            grid: { color: 'rgba(229, 231, 235, 1)', lineWidth: 1 },
                            ticks: { color: '#6b7280', font: { size: 12, weight: '500' } },
                        },
                    },
                    interaction: { intersect: false, mode: 'index' },
                }}
                height={300}
            />
        </div>
    </div>
);

// DataLogTable component for displaying historical data
const DataLogTable = ({ data, loading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const paginatedData = useMemo(() => {
        if (!data) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    }, [data, currentPage]);

    const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 1;

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-4">Data Log</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature (°C)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Soil Moisture (%)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">pH Level</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nitrogen (ppm)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phosphorus (ppm)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potassium (ppm)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading && !paginatedData.length ? (
                            <tr><td colSpan="7" className="text-center py-4">Loading data...</td></tr>
                        ) : paginatedData.map((log, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.temperature ?? 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.soil_moisture ?? 'N/A'}</td>
                                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">pH Level</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.ph_level ?? 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.nitrogen ?? 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.phosphorus ?? 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.potassium ?? 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

const DataPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedGarden, setSelectedGarden] = useState("Spinach Garden 08");
    const [activeMenuItem, setActiveMenuItem] = useState("Data");

    // State untuk data dummy
    const [sensorData, setSensorData] = useState(generateDummyData(20));
    const [sensorLoading, setSensorLoading] = useState(false);
    const [sensorError, setSensorError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Simulasi status koneksi
    const isConnected = true;

    // Fungsi untuk simulasi refresh data
    const refetchSensorData = ({ garden_id, limit = 20 }) => {
        setSensorLoading(true);
        setTimeout(() => {
            setSensorData(generateDummyData(limit));
            setLastUpdated(new Date());
            setSensorLoading(false);
        }, 1000);
    };

    // Memoized processing for chart data
    const processChartData = (data, metricKey, color, defaultValue = 0) => {
        return useMemo(() => {
            if (!data || data.length === 0) {
                return { labels: [], datasets: { metric: {} } };
            }
            const labels = data.map(r => new Date(r.timestamp).toLocaleDateString()).reverse();
            const dataset = {
                label: metricKey,
                data: data.map(r => r[metricKey] || defaultValue).reverse(),
                borderColor: color,
                backgroundColor: `${color}20`,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
            };
            return { labels, datasets: { metric: dataset } };
        }, [data, metricKey, color]);
    };

    const metrics = [
        { key: 'temperature', label: 'Temperature', icon: Thermometer, color: '#f97316', iconColor: 'text-orange-500' },
        { key: 'soil_moisture', label: 'Soil Moisture', icon: Droplet, color: '#3b82f6', iconColor: 'text-blue-400' },
        { key: 'ph_level', label: 'pH Level', icon: Droplet, color: '#10b981', iconColor: 'text-teal-500', defaultValue: 6.8 },
        { key: 'nitrogen', label: 'Soil Nitrogen', icon: Sun, color: '#8b5cf6', iconColor: 'text-yellow-500', defaultValue: 18 },
        { key: 'phosphorus', label: 'Phosphorus', icon: Activity, color: '#d946ef', iconColor: 'text-purple-500', defaultValue: 12 },
        { key: 'potassium', label: 'Potassium', icon: Wind, color: '#0ea5e9', iconColor: 'text-sky-500', defaultValue: 25 },
        { key: 'soil_health', label: 'Soil Health', icon: Leaf, color: '#22c55e', iconColor: 'text-green-500', defaultValue: 96 },
        { key: 'organic_matter', label: 'Organic Matter', icon: BarChart3, color: '#6366f1', iconColor: 'text-indigo-500', defaultValue: 3.2 },
    ];

    const chartDataHooks = metrics.map(metric => 
        processChartData(sensorData, metric.key, metric.color, metric.defaultValue)
    );

    const handleMenuItemClick = (key, label) => {
        setActiveMenuItem(label);
    };

    const handleGardenChange = (garden) => {
        setSelectedGarden(garden);
        refetchSensorData({ garden_id: garden, limit: 20 });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activeItem={activeMenuItem}
                onItemClick={handleMenuItemClick}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    selectedGarden={selectedGarden}
                    onGardenChange={handleGardenChange}
                />
                <div className="bg-white border-b px-4 py-2 flex justify-between items-center">
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
                    </div>
                    {lastUpdated && (
                        <span className="text-xs text-gray-500">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    {sensorError && (
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm">Connection issues detected</span>
                        </div>
                    )}
                </div>
                <main className="flex-1 px-4 py-6 overflow-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Data Analytics</h1>
                        <button 
                            onClick={() => refetchSensorData({ garden_id: selectedGarden, limit: 20 })}
                            disabled={sensorLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                            {sensorLoading ? 'Refreshing...' : 'Refresh All Data'}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        {metrics.map((metric, index) => (
                            <MetricLineChart
                                key={metric.key}
                                title={metric.label}
                                icon={metric.icon}
                                iconColor={metric.iconColor}
                                color={metric.color}
                                data={chartDataHooks[index]}
                                loading={sensorLoading}
                                error={sensorError}
                                onRefresh={() => refetchSensorData({ garden_id: selectedGarden, limit: 20 })}
                            />
                        ))}
                    </div>
                    <DataLogTable data={sensorData} loading={sensorLoading} />
                </main>
            </div>
        </div>
    );
};

export default DataPage;