import React, { useState } from 'react';
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
    TrendingUp,
    Calendar,
    Users,
    HelpCircle
} from 'lucide-react';

const AgricultureDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Farming</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="mt-8">
                    {sidebarItems.map((item, index) => (
                        <a
                            key={index}
                            href="#"
                            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${item.active
                                ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white shadow-sm border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Good Morning</h1>
                                <p className="text-sm text-gray-600">Optimize Your Farm Operations with Real-Time Insights</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                <option>Spinach Garden 08</option>
                            </select>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Bell className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">15</span>
                                </div>
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">VG</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {/* Plant Information - Full Width */}
                        <div className="lg:col-span-3 mb-6">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-sm p-8 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <Leaf className="w-10 h-10" />
                                    <span className="text-sm opacity-90">Plant Information</span>
                                </div>
                                <div className="text-4xl font-bold mb-3">Kangkung</div>
                                <p className="text-sm opacity-90 max-w-2xl">Your plants are thriving and showing excellent growth. The current conditions are optimal for Kangkung cultivation, with proper temperature and humidity levels maintained.</p>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-2">

                            {/* Weather metrics grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                                {/* Plant Health - Green Card */}
                                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-sm p-6 text-white h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <Leaf className="w-6 h-6" />
                                        <Settings className="w-5 h-5 opacity-70" />
                                    </div>
                                    <h3 className="text-sm font-medium mb-2 opacity-90">Plant Health</h3>
                                    <div className="text-3xl font-bold mb-2">96%</div>
                                    <p className="text-sm opacity-90">Your plants are thriving and showing excellent growth</p>
                                </div>

                                {/* Wind */}
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Wind className="w-6 h-6 text-blue-500" />
                                        <Settings className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Wind</h3>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">2<span className="text-lg">m/s</span></div>
                                    <p className="text-sm text-gray-600">Maintain consistent between 16°C and 28°C adequate airflow</p>
                                </div>

                                {/* Temperature */}
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Thermometer className="w-6 h-6 text-orange-500" />
                                        <Settings className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Temperature</h3>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">19°C</div>
                                    <p className="text-sm text-gray-600">Maintain consistent between 16°C and 28°C</p>
                                </div>

                                {/* pH Level */}
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Activity className="w-6 h-6 text-purple-500" />
                                        <Settings className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">pH Level</h3>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">7.6</div>
                                    <p className="text-sm text-gray-600">Add acidic compost to balance the soil pH</p>
                                </div>

                                {/* Humidity */}
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Droplet className="w-6 h-6 text-blue-400" />
                                        <Settings className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Humidity</h3>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">82%</div>
                                    <p className="text-sm text-gray-600">Ensure ventilation is sufficient to prevent mold growth</p>
                                </div>

                                {/* Soil Moisture */}
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Droplet className="w-6 h-6 text-green-500" />
                                        <Settings className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Soil Moisture</h3>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">65%</div>
                                    <p className="text-sm text-gray-600">Keep monitoring to ensure it doesn't get too wet</p>
                                </div>
                            </div>

                            {/* Production Overview */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Production Overview</h3>
                                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-1">
                                        <option>Yearly</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="text-center">
                                        <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                                            <svg className="w-32 h-32 transform -rotate-90">
                                                <circle cx="64" cy="64" r="56" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                                                <circle
                                                    cx="64" cy="64" r="56" fill="none"
                                                    stroke="url(#gradient)" strokeWidth="8"
                                                    strokeDasharray="351.86" strokeDashoffset="87.96"
                                                    className="transition-all duration-300"
                                                />
                                                <defs>
                                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#10b981" />
                                                        <stop offset="50%" stopColor="#3b82f6" />
                                                        <stop offset="100%" stopColor="#8b5cf6" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-gray-900">1,000</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">Tons</p>
                                    </div>

                                    <div>
                                        <div className="mb-4">
                                            <div className="text-sm font-medium text-gray-700 mb-1">Total Land Area</div>
                                            <div className="text-2xl font-bold text-gray-900">1200 acres</div>
                                            <div className="text-sm text-gray-500">56% used</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-700 mb-1">Revenue</div>
                                            <div className="text-2xl font-bold text-green-600">$500,000</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar - Alerts & Tasks */}
                        <div className="space-y-6 lg:mt-0 mt-6">
                            {/* Alerts Section */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
                                    <span className="bg-red-100 text-red-600 text-xs font-medium px-3 py-1.5 rounded-full">15</span>
                                </div>

                                <div className="space-y-4 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2">
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">pH Level Too High</p>
                                            <p className="text-xs text-gray-600">Sensor #PH001 • Current: 8.2</p>
                                        </div>
                                        <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">Critical</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Soil Moisture Low</p>
                                            <p className="text-xs text-gray-600">Garden Section A • Current: 45%</p>
                                        </div>
                                        <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded">Warning</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Temperature Fluctuation</p>
                                            <p className="text-xs text-gray-600">Greenhouse B • Variance: ±5°C</p>
                                        </div>
                                        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">Info</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">High Humidity Detected</p>
                                            <p className="text-xs text-gray-600">Zone 3 • Current: 95%</p>
                                        </div>
                                        <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1 rounded">Caution</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Wind Speed Too High</p>
                                            <p className="text-xs text-gray-600">External Sensor • Current: 15m/s</p>
                                        </div>
                                        <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">Critical</span>
                                    </div>
                                </div>

                                <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    View all alerts
                                </button>
                            </div>

                            {/* Tasks Section */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
                                    <span className="text-sm text-gray-500">2/5 completed</span>
                                </div>

                                <div className="space-y-4">
                                    {tasks.map((task) => (
                                        <div key={task.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    {task.completed ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-gray-400" />
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-gray-900">{task.name}</div>
                                                        <div className="text-sm text-gray-500">{task.time}</div>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-500">{task.progress}%</span>
                                            </div>
                                            <div className="ml-8">
                                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                                    <div
                                                        className={`h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-600">{task.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Device Status */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Status</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">Sensors</div>
                                            <div className="text-sm text-gray-500">4 active</div>
                                        </div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">H10 Soil Moisture</div>
                                            <div className="text-sm text-gray-500">#000001 • Sensor</div>
                                        </div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">Temperature & Humidity</div>
                                            <div className="text-sm text-gray-500">#114701 • Sensor</div>
                                        </div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">Wind Sensor</div>
                                            <div className="text-sm text-gray-500">#WR004 • Sensor</div>
                                        </div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
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