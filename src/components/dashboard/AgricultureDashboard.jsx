import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import KangkungImage from '../images/image.png'; // Pastikan path gambar ini benar
import LineChart from '../charts/lineChart'; // Pastikan path ke komponen LineChart benar
import {
    Leaf,
    Thermometer,
    Droplet,
    Wind,
    Sun,
    Activity,
    CheckCircle,
    Circle,
    BarChart3,
    Settings,
    Bell,
    Menu,
    X,
    Home,
    Calendar,
    Users,
    HelpCircle,
} from 'lucide-react';

// ... (Data seperti allSensorData dan metricOptions tidak berubah)
const allSensorData = {
    labels: ['Aug 14', 'Aug 15', 'Aug 16', 'Aug 17', 'Aug 18', 'Aug 19', 'Aug 20'],
    datasets: {
        soilMoisture: {
            label: 'Soil Moisture (%)',
            data: [65, 62, 68, 72, 70, 66, 75],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2, fill: true, tension: 0.4,
        },
        temperature: {
            label: 'Temperature (°C)',
            data: [19, 21, 20, 22, 23, 22, 24],
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            borderWidth: 2, fill: true, tension: 0.4,
        },
        phLevel: {
            label: 'pH Level',
            data: [6.8, 6.7, 6.9, 6.8, 7.0, 7.1, 6.9],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2, fill: true, tension: 0.4,
        },
        soilNitrogen: {
            label: 'Soil Nitrogen (ppm)',
            data: [15, 16, 14, 17, 18, 16, 19],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 2, fill: true, tension: 0.4,
        },
    }
};

const metricOptions = [
    { key: 'soilMoisture', label: 'Soil Moisture' },
    { key: 'temperature', label: 'Temperature' },
    { key: 'phLevel', label: 'pH Level' },
    { key: 'soilNitrogen', label: 'Soil Nitrogen' }
];


const AgricultureDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedMetrics, setSelectedMetrics] = useState(['soilMoisture', 'temperature']);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
    const formattedDate = currentTime.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    const handleMetricChange = (metricKey) => {
        setSelectedMetrics(prevMetrics => {
            if (prevMetrics.includes(metricKey)) {
                return prevMetrics.filter(m => m !== metricKey);
            } else {
                return [...prevMetrics, metricKey];
            }
        });
    };
    
    const chartData = {
        labels: allSensorData.labels,
        datasets: selectedMetrics.map(key => allSensorData.datasets[key]),
    };

    const sidebarItems = [
        { icon: Home, label: 'Dashboard', active: true },
        { icon: Leaf, label: 'Soil & Water', active: false },
        { icon: Thermometer, label: 'Weather', active: false },
        { icon: Calendar, label: 'Task Management', active: false },
        { icon: BarChart3, label: 'Reports & Analytics', active: false },
        { icon: Settings, label: 'Settings', active: false },
        { icon: Users, label: 'My Account', active: false },
        { icon: HelpCircle, label: 'Help & Support', active: false },
    ];

    const tasks = [
        { id: 1, name: 'Watering', time: '08:00 AM', progress: 40, completed: false, description: 'Water plants with 1 inch of water in the morning' },
        { id: 2, name: 'Fertilizing', time: '06:00 AM', progress: 100, completed: true, description: 'Apply organic fertilizer at base of plants. Quantity: 50g per plant' },
        { id: 3, name: 'Pest Inspection', time: '11:00 AM', progress: 0, completed: false, description: 'Look for leaves for any signs of aphids or other pests' },
        { id: 4, name: 'Soil Aeration', time: '02:00 PM', progress: 0, completed: false, description: 'Loosen soil around the plants stem without damaging roots' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
            <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
                {/* ... Konten Sidebar tidak berubah ... */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Farming</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="w-6 h-6" /></button>
                </div>
                <nav className="mt-8">
                    {sidebarItems.map((item, index) => (
                        <a key={index} href="#" className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${item.active ? 'bg-green-50 text-green-700 border-r-2 border-green-500' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </a>
                    ))}
                </nav>
                <div className="absolute bottom-4 left-4 right-4"><button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Logout</button></div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-gray-100"><Menu className="w-6 h-6" /></button>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Good Morning</h1>
                                <p className="hidden xs:block text-sm text-gray-600">Optimize Your Farm Operations with Real-Time Insights</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm max-w-[150px] sm:max-w-none">
                                <option>Spinach Garden 08</option>
                                <option>Tomato Greenhouse 02</option>
                                <option>Hydroponic Lettuce 05</option>
                            </select>
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <div className="relative"><Bell className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" /><span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">15</span></div>
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><span className="text-white text-sm font-medium">VG</span></div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-4 py-6 overflow-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            
                            {/* ======================================================= */}
                            {/* --- PLANT INFORMATION CONTAINER DENGAN JAM BARU --- */}
                            {/* ======================================================= */}
                            <div
                                className="relative rounded-2xl shadow-sm p-12 text-white overflow-hidden bg-cover bg-center"
                                style={{ backgroundImage: `url(${KangkungImage})` }}
                            >
                                <div className="absolute inset-0 bg-black/50 z-10"></div>
                                <Link 
                                    to="/plant-details/kangkung"
                                    className="absolute z-20 top-8 right-8 bg-yellow-400 text-gray-900 text-sm font-semibold py-3 px-5 rounded-full 
                                            transform transition-all duration-300 ease-in-out 
                                            shadow-md hover:bg-yellow-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
                                >
                                    Plant Information
                                </Link>

                                {/* Konten Utama */}
                                <div className="relative z-20">
                                    <Leaf className="w-10 h-10 mb-16" />
                                    <div className="text-5xl font-bold mb-3">Kangkung</div>
                                    <p className="text-base opacity-90 max-w-lg">
                                        Your plants are thriving and showing excellent growth. The current conditions are optimal for Kangkung cultivation.
                                    </p>
                                </div>
                                
                                {/* Jam Real-time (Absolutely Positioned) */}
                                <div className="absolute z-20 bottom-8 right-8 text-right filter drop-shadow-lg">
                                    <p className="text-4xl font-bold tracking-wider">{formattedTime}</p>
                                    <p className="text-sm text-white/90 uppercase">{formattedDate}</p>
                                </div>
                            </div>

                            {/* ... Sisa konten tidak ada yang berubah ... */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                               <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-sm p-6 text-white h-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"><div className="flex items-center justify-between mb-4"><Leaf className="w-6 h-6" /><Settings className="w-5 h-5 opacity-70" /></div><h3 className="text-sm font-medium mb-2 opacity-90">Soil Health</h3><div className="text-3xl font-bold mb-2">96%</div><p className="text-sm opacity-90">Excellent growth and vitality observed</p></div>
                                <div className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"><div className="flex items-center justify-between mb-4"><Thermometer className="w-6 h-6 text-orange-500" /><Settings className="w-5 h-5 text-gray-400" /></div><h3 className="text-sm font-medium text-gray-700 mb-2">Temperature</h3><div className="text-3xl font-bold text-gray-900 mb-2">19°C</div><p className="text-sm text-gray-600">Maintain consistent between 16°C and 28°C</p></div>
                                <div className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"><div className="flex items-center justify-between mb-4"><Droplet className="w-6 h-6 text-blue-400" /><Settings className="w-5 h-5 text-gray-400" /></div><h3 className="text-sm font-medium text-gray-700 mb-2">Soil Moisture</h3><div className="text-3xl font-bold text-gray-900 mb-2">82%</div><p className="text-sm text-gray-600">Ensure good ventilation to prevent mold</p></div>
                                <div className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"><div className="flex items-center justify-between mb-4"><Droplet className="w-6 h-6 text-teal-500" /><Settings className="w-5 h-5 text-gray-400" /></div><h3 className="text-sm font-medium text-gray-700 mb-2">pH level</h3><div className="text-3xl font-bold text-gray-900 mb-2">6.8</div><p className="text-sm text-gray-600">Ideal level for nutrient uptake</p></div>
                                <div className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"><div className="flex items-center justify-between mb-4"><Activity className="w-6 h-6 text-purple-500" /><Settings className="w-5 h-5 text-gray-400" /></div><h3 className="text-sm font-medium text-gray-700 mb-2">Phorus</h3><div className="text-3xl font-bold text-gray-900 mb-2">num</div><p className="text-sm text-gray-600">Sufficient for root development</p></div>
                                <div className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"><div className="flex items-center justify-between mb-4"><Wind className="w-6 h-6 text-sky-500" /><Settings className="w-5 h-5 text-gray-400" /></div><h3 className="text-sm font-medium text-gray-700 mb-2">Photasium</h3><div className="text-3xl font-bold text-gray-900 mb-2">num</div><p className="text-sm text-gray-600">Promotes overall plant vigor</p></div>
                                <div className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"><div className="flex items-center justify-between mb-4"><Sun className="w-6 h-6 text-yellow-500" /><Settings className="w-5 h-5 text-gray-400" /></div><h3 className="text-sm font-medium text-gray-700 mb-2">Soil Nitrogen</h3><div className="text-3xl font-bold text-gray-900 mb-2">num</div><p className="text-sm text-gray-600">Key for leaf and stem growth</p></div>
                                <div className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"><div className="flex items-center justify-between mb-4"><BarChart3 className="w-6 h-6 text-indigo-500" /><Settings className="w-5 h-5 text-gray-400" /></div><h3 className="text-sm font-medium text-gray-700 mb-2">Organic Matters</h3><div className="text-3xl font-bold text-gray-900 mb-2">num</div><p className="text-sm text-gray-600">NPK values are within the ideal range</p></div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Production Overview</h3>
                                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-1"><option>Yearly</option></select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="text-center">
                                        <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                                            <svg className="w-32 h-32 transform -rotate-90"><circle cx="64" cy="64" r="56" fill="none" stroke="#f3f4f6" strokeWidth="8" /><circle cx="64" cy="64" r="56" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeDasharray="351.86" strokeDashoffset="87.96" /><defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#10b981" /><stop offset="50%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs></svg>
                                            <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-bold text-gray-900">1,000</span></div>
                                        </div>
                                        <p className="text-sm text-gray-600">Tons</p>
                                    </div>
                                    <div>
                                        <div className="mb-4"><div className="text-sm font-medium text-gray-700 mb-1">Total Land Area</div><div className="text-2xl font-bold text-gray-900">1200 acres</div><div className="text-sm text-gray-500">56% used</div></div>
                                        <div><div className="text-sm font-medium text-gray-700 mb-1">Revenue</div><div className="text-2xl font-bold text-green-600">$500,000</div></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Sensor History (Last 7 Days)</h3>
                                    <div className="flex items-center flex-wrap gap-2">
                                        {metricOptions.map(metric => (<button key={metric.key} onClick={() => handleMetricChange(metric.key)} className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${selectedMetrics.includes(metric.key) ? 'bg-blue-500 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{metric.label}</button>))}
                                    </div>
                                </div>
                                <LineChart data={chartData} height={300} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-900">Alerts</h3><span className="text-white text-xs bg-green-500 font-bold py-1 px-2.5 rounded-md">15</span></div>
                                <div className="flex-grow space-y-3 overflow-y-auto pr-2">
                                    <div className="flex items-center justify-between p-3 rounded-lg border-l-4 bg-gray-100 border-red-500"><div><p className="font-semibold text-gray-800 text-sm">pH Level Too High</p><p className="text-xs text-gray-500">Sensor #PH001 • Current: 8.2</p></div><span className="text-xs font-medium text-white bg-red-500 py-1 px-3 rounded-md">Critical</span></div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border-l-4 bg-gray-100 border-orange-500"><div><p className="font-semibold text-gray-800 text-sm">Soil Moisture Low</p><p className="text-xs text-gray-500">Garden Section A • Current: 45%</p></div><span className="text-xs font-medium text-white bg-orange-500 py-1 px-3 rounded-md">Warning</span></div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border-l-4 bg-gray-100 border-blue-500"><div><p className="font-semibold text-gray-800 text-sm">Temperature Fluctuation</p><p className="text-xs text-gray-500">Greenhouse B • Variance: ±5°C</p></div><span className="text-xs font-medium text-white bg-blue-500 py-1 px-3 rounded-md">Info</span></div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border-l-4 bg-gray-100 border-yellow-500"><div><p className="font-semibold text-gray-800 text-sm">High Humidity Detected</p><p className="text-xs text-gray-500">Zone 3 • Current: 95%</p></div><span className="text-xs font-medium text-yellow-800 bg-yellow-400 py-1 px-3 rounded-md">Caution</span></div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border-l-4 bg-gray-100 border-red-500"><div><p className="font-semibold text-gray-800 text-sm">Wind Speed Too High</p><p className="text-sm text-gray-500">External Sensor • Current: 15m/s</p></div><span className="text-xs font-medium text-white bg-red-500 py-1 px-3 rounded-md">Critical</span></div>
                                </div>
                                <div className="mt-auto pt-4 text-center"><button className="text-sm text-blue-700 hover:text-blue-900 font-semibold transition-colors">View all alerts</button></div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-900">Tasks</h3><span className="text-sm text-gray-500">2/5 completed</span></div>
                                <div className="space-y-4">
                                    {tasks.map((task) => (<div key={task.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"><div className="flex items-center justify-between mb-2"><div className="flex items-center space-x-3">{task.completed ? (<CheckCircle className="w-5 h-5 text-green-500" />) : (<Circle className="w-5 h-5 text-gray-400" />)}<div><div className="font-medium text-gray-900">{task.name}</div><div className="text-sm text-gray-500">{task.time}</div></div></div><span className="text-sm text-gray-500">{task.progress}%</span></div><div className="ml-8"><div className="w-full bg-gray-200 rounded-full h-2 mb-2"><div className={`h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${task.progress}%` }} /></div><p className="text-xs text-gray-600">{task.description}</p></div></div>))}
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Status</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between"><div><div className="font-medium text-gray-900">pH Sensor</div><div className="text-sm text-gray-500">4 active</div></div><div className="w-3 h-3 bg-green-500 rounded-full"></div></div>
                                    <div className="flex items-center justify-between"><div><div className="font-medium text-gray-900">Soil Moisture Sensor</div><div className="text-sm text-gray-500">#000001 • Sensor</div></div><div className="w-3 h-3 bg-green-500 rounded-full"></div></div>
                                    <div className="flex items-center justify-between"><div><div className="font-medium text-gray-900">Temperature</div><div className="text-sm text-gray-500">#114701 • Sensor</div></div><div className="w-3 h-3 bg-green-500 rounded-full"></div></div>
                                    <div className="flex items-center justify-between"><div><div className="font-medium text-gray-900">NPK Sensor</div><div className="text-sm text-gray-500">#WR004 • Sensor</div></div><div className="w-3 h-3 bg-green-500 rounded-full"></div></div>
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