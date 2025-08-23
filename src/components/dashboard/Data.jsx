import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Radar, Bar } from 'react-chartjs-2';
import { Leaf, Thermometer, Droplet, Wind, Sun, Activity, BarChart3, SlidersHorizontal, Info, UploadCloud, FileText, X, LoaderCircle, CheckCircle, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

import Header from '../layout/header';
import Sidebar from '../layout/sidebar';
import keylimeBackground from '../images/image.png';

// Real-time data hooks
import { useRealtimeSensorData, useRealtimeFinancialData } from '../../hooks/useRealtimeData';
import { useApi } from '../../hooks/useApi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler);

// =================================================================================
// Konfigurasi & Data Dummy (Akan diganti oleh data Backend)
// =================================================================================

const palette = { primary: '#16a34a', primary_light: '#dcfce7', primary_dark: '#15803d', primary_transparent: 'rgba(22, 163, 74, 0.15)', secondary: '#64748b', secondary_light: '#e2e8f0', secondary_transparent: 'rgba(100, 116, 139, 0.15)', text_primary: '#1e293b', text_secondary: '#475569', border: '#e2e8f0', bg_subtle: '#f8fafc' };

// TODO: Fungsi ini akan dihapus dan digantikan dengan panggilan API.
const generateDummyData = (count = 30) => { const data = []; const baseTime = new Date(); for (let i = 0; i < count; i++) { const p = (count - i) / count; data.push({ timestamp: new Date(baseTime.getTime() - i * 24 * 3600000).toISOString(), temperature: (22 + Math.random() * 5).toFixed(1), soil_moisture: (65 + Math.random() * 10).toFixed(1), ph_level: (6.7 + Math.random() * 0.4).toFixed(1), nitrogen: (20 + Math.random() * 5 * p).toFixed(1), phosphorus: (15 + Math.random() * 5 * p).toFixed(1), potassium: (25 + Math.random() * 5 * p).toFixed(1), soil_health: (92 + (Math.random() * 8 * p)).toFixed(1), organic_matter: (3.8 + (Math.random() * 1 * p)).toFixed(1), }); } return data.reverse(); };

const metricsConfig = [{ key: 'soil_health', label: 'Soil Health', icon: Leaf, unit: '%' }, { key: 'soil_moisture', label: 'Soil Moisture', icon: Droplet, unit: '%' }, { key: 'temperature', label: 'Temperature', icon: Thermometer, unit: '°C' }, { key: 'ph_level', label: 'pH Level', icon: Droplet, unit: '' }, { key: 'nitrogen', label: 'Nitrogen', icon: Sun, unit: 'ppm' }, { key: 'phosphorus', label: 'Phosphorus', icon: Activity, unit: 'ppm' }, { key: 'potassium', label: 'Potassium', icon: Wind, unit: 'ppm' }, { key: 'organic_matter', label: 'Organic Matter', icon: BarChart3, unit: '%' }];

// TODO: Nilai-nilai ini akan diambil dari backend, kemungkinan dari tabel model/simulasi.
const regenerativeBaseValues = { yield: 4500, costBenefit: 2.5 };
const conventionalBaseValues = { yield: 5000, costBenefit: 1.5 };


// =================================================================================
// Reusable UI Components (Tidak ada perubahan di sini)
// =================================================================================

const MetricDisplayCard = ({ icon: Icon, title, value, unit }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="p-3 rounded-full bg-green-50"><Icon className="w-6 h-6 text-green-600" /></div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-xl font-bold text-slate-800">{value} <span className="text-base font-medium text-slate-500">{unit}</span></p>
        </div>
    </div>
);

const ComparisonMetricCard = ({ title, value, icon: Icon, color, bgColor }) => {
    const colorClasses = { green: 'text-green-700', red: 'text-red-700', slate: 'text-slate-700' };
    const bgColorClasses = { green: 'bg-green-100', red: 'bg-red-100', slate: 'bg-slate-100' }; // Koreksi kecil untuk warna bg
    return (
        <div className={`${bgColorClasses[bgColor]} p-4 rounded-lg border border-slate-200`}> {/* Penyesuaian padding */}
            <div className="flex items-center gap-3">
                <Icon className={`w-7 h-7 ${colorClasses[color]}`} />
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className={`text-xl font-bold ${colorClasses[color]}`}>RM {value.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};


const FileUploader = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const handleFileProcess = (uploadedFile) => { if (!uploadedFile || !uploadedFile.type.startsWith('text/csv')) { alert('Please upload a valid CSV file.'); return; } setFile(uploadedFile); setStatus('uploading'); setProgress(0); const interval = setInterval(() => { setProgress(prev => { if (prev >= 100) { clearInterval(interval); setStatus('success'); return 100; } return prev + 10; }); }, 150); };
    const handleDragEvents = (e, type) => { e.preventDefault(); e.stopPropagation(); if (type === 'over') setStatus('dragging'); else if (type === 'leave') setStatus('idle'); };
    const handleDrop = (e) => { handleDragEvents(e, 'leave'); handleFileProcess(e.dataTransfer.files[0]); };
    const handleRemoveFile = () => { setFile(null); setStatus('idle'); };
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Upload New Dataset</h2>
            {status === 'idle' || status === 'dragging' ? (
                <label onDragOver={(e) => handleDragEvents(e, 'over')} onDragLeave={(e) => handleDragEvents(e, 'leave')} onDrop={handleDrop} className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${status === 'dragging' ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6"><UploadCloud className={`w-10 h-10 mb-3 ${status === 'dragging' ? 'text-green-600' : 'text-slate-400'}`} /> <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p> <p className="text-xs text-slate-400">CSV file up to 10MB</p></div> <input type="file" className="hidden" accept=".csv" onChange={(e) => handleFileProcess(e.target.files[0])} />
                </label>
            ) : (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200"><div className="flex items-center gap-4"><FileText className="w-8 h-8 text-green-600 flex-shrink-0" /> <div className="flex-grow"><p className="font-semibold text-slate-800 truncate">{file?.name}</p><p className="text-sm text-slate-500">{((file?.size || 0) / 1024).toFixed(1)} KB</p></div> <button onClick={handleRemoveFile} className="p-2 rounded-full hover:bg-slate-200"><X className="w-5 h-5 text-slate-500" /></button></div><div className="mt-3"><div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-green-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div></div><div className="flex justify-between items-center text-xs mt-1"><span className={status === 'success' ? 'text-green-600 font-semibold' : 'text-slate-500'}>{status === 'uploading' && `Uploading... ${progress}%`}{status === 'success' && 'Upload Complete!'}</span> {status === 'uploading' ? <LoaderCircle className="w-4 h-4 text-slate-500 animate-spin" /> : <CheckCircle className="w-4 h-4 text-green-600" />}</div></div></div>
            )}
        </div>
    );
};

const YieldGauge = ({ value = 0, maxValue = 25000 }) => (
    <div className="flex flex-col items-center justify-center h-full">
        <svg className="w-40 h-40 transform -rotate-90">
            <circle className="text-slate-200" strokeWidth="18" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
            <circle className="text-green-600" strokeWidth="18" strokeDasharray={2 * Math.PI * 70} strokeDashoffset={(2 * Math.PI * 70) - (Math.min(100, (value / maxValue) * 100) / 100) * (2 * Math.PI * 70)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }} />
        </svg>
        <div className="text-center -mt-28">
            <p className="text-slate-500 text-sm">Projected Harvest</p>
            <p className="text-4xl font-bold text-slate-800">{value.toLocaleString()}</p>
            <p className="text-slate-500 font-semibold">kg</p>
        </div>
    </div>
);


// =================================================================================
// Main Page Component
// =================================================================================
const DataPage = () => {

    // =================================================================================
    // DATA LAYER & STATE MANAGEMENT
    // =================================================================================

    // --- 1. Real-time Backend Data ---
    // Real-time sensor data with WebSocket updates
    const { getSensorData } = useApi();
    const { sensorData: realtimeSensorData, isConnected: sensorConnected } = useRealtimeSensorData('site_a_3_acres');
    const { financialData: realtimeFinancialData } = useRealtimeFinancialData('site_a_3_acres');

    // Fallback to API data if real-time not available, else use dummy data for demo
    const [fallbackSensorData, setFallbackSensorData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load fallback data if needed
    React.useEffect(() => {
        if (!sensorConnected && !fallbackSensorData && !loading) {
            setLoading(true);
            getSensorData({ limit: 30 })
                .then(data => {
                    setFallbackSensorData(data || generateDummyData());
                })
                .catch(() => {
                    setFallbackSensorData(generateDummyData()); // Demo data as final fallback
                })
                .finally(() => setLoading(false));
        }
    }, [sensorConnected, fallbackSensorData, loading, getSensorData]);

    // Use real-time data if available, fallback to API data, then demo data
    const sensorData = React.useMemo(() => {
        if (realtimeSensorData) {
            // Convert single sensor reading to array format for charts
            return [realtimeSensorData];
        }
        return fallbackSensorData || generateDummyData();
    }, [realtimeSensorData, fallbackSensorData]);

    // Site/garden profile (could be fetched from sites API)
    const [gardenProfile] = useState({
        name: "Key Lime",
        description: "The Key Lime (*Citrus aurantiifolia*) is a small, highly aromatic citrus fruit prized for its distinctively tart and flavorful juice. Unlike other limes, it has a higher acidity, a stronger aroma, and a thinner rind. <br/><br/> Thriving in well-drained soil and sunny conditions, this crop is sensitive to fluctuations in soil pH, moisture, and nutrient balance. This dashboard provides the real-time data crucial for managing these parameters, preventing disease, and ensuring a healthy, high-yield orchard.",
        imageUrl: keylimeBackground
    });

    // Financial metrics (use real-time data if available)
    const financialMetrics = React.useMemo(() => {
        if (realtimeFinancialData && realtimeFinancialData.length > 0) {
            const latest = realtimeFinancialData[0];
            return {
                convCost: latest.conventional_cost || 5330,
                regenCost: latest.regenerative_cost || 4260,
                revenue: latest.revenue || 15500
            };
        }
        return {
            convCost: 5330,
            regenCost: 4260,
            revenue: 15500
        };
    }, [realtimeFinancialData]);


    // --- 2. UI-Specific State ---
    // State ini mengontrol elemen UI dan input dari pengguna, tidak langsung terkait dengan data backend.

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedGarden] = useState("Primary Key Lime Orchard");
    const [selectedMetric, setSelectedMetric] = useState('soil_health');
    const [comparisonRatio, setComparisonRatio] = useState(9);
    const [microalgaeInput, setMicroalgaeInput] = useState(6000);
    const [landAreaInput, setLandAreaInput] = useState(3);


    // =================================================================================
    // DATA PROCESSING & CALCULATIONS (Memoized)
    // =================================================================================
    // Bagian ini memproses data mentah dari state menjadi format yang siap untuk ditampilkan.

    const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', align: 'end', labels: { color: palette.text_secondary, boxWidth: 12 } } }, scales: { y: { grid: { color: palette.border }, ticks: { color: palette.text_secondary } }, x: { grid: { display: false }, ticks: { color: palette.text_secondary } } } };

    const processedData = useMemo(() => {
        // Jika sensorData kosong atau loading, kembalikan struktur data default.
        if (!sensorData || sensorData.length === 0) {
            return { latestReading: {}, mainLineChartData: { labels: [], datasets: [] }, radarData: { labels: [], datasets: [] }, nutrientData: { labels: [], datasets: [] }, soilHealthTrendData: { labels: [], datasets: [] } };
        }

        const latestReading = sensorData[sensorData.length - 1];
        const labels = sensorData.map(d => new Date(d.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
        return {
            latestReading,
            mainLineChartData: { labels, datasets: [{ label: 'Selected Metric', data: sensorData.map(d => d[selectedMetric]), borderColor: palette.primary, backgroundColor: palette.primary_transparent, fill: true, tension: 0.4, pointRadius: 1 }, { label: '7-Day Moving Average', data: sensorData.map((_, i, arr) => (arr.slice(Math.max(0, i - 6), i + 1).reduce((acc, val) => acc + parseFloat(val[selectedMetric]), 0) / Math.min(i + 1, 7)).toFixed(1)), borderColor: palette.secondary, borderDash: [5, 5], fill: false, tension: 0.4, pointRadius: 0 }] },
            radarData: { labels: ['Health', 'Moisture', 'Nitrogen', 'Phosphorus', 'Potassium', 'Organic Matter'], datasets: [{ label: 'Current Performance (7-Day Avg)', data: ['soil_health', 'soil_moisture', 'nitrogen', 'phosphorus', 'potassium', 'organic_matter'].map(metric => (sensorData.slice(-7).reduce((sum, d) => sum + parseFloat(d[metric]), 0) / 7).toFixed(1)), backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: '#3b82f6', borderWidth: 2 }] },
            nutrientData: { labels: ['Nitrogen', 'Phosphorus', 'Potassium'], datasets: [{ label: 'Average Level (ppm)', data: ['nitrogen', 'phosphorus', 'potassium'].map(nutrient => (sensorData.reduce((s, d) => s + parseFloat(d[nutrient]), 0) / sensorData.length).toFixed(1)), backgroundColor: ['#22c55e', '#f59e0b', '#8b5cf6'] }] },
            soilHealthTrendData: { labels, datasets: [{ label: 'Soil Health', data: sensorData.map(d => d.soil_health), borderColor: palette.secondary, backgroundColor: palette.secondary_transparent, fill: true, tension: 0.3, pointRadius: 0 }] }
        };
    }, [sensorData, selectedMetric]);

    const comparisonChartsData = useMemo(() => {
        return {
            yieldChartData: { labels: ['Conventional', 'Regenerative'], datasets: [{ label: 'Projected Yield (kg/ha)', data: [conventionalBaseValues.yield, regenerativeBaseValues.yield], backgroundColor: [palette.secondary_light, palette.primary_light], borderColor: [palette.secondary, palette.primary], borderWidth: 1, borderRadius: 4 }] },
            costBenefitChartData: { labels: ['Conventional', 'Regenerative'], datasets: [{ label: 'Cost-Benefit Ratio', data: [conventionalBaseValues.costBenefit, regenerativeBaseValues.costBenefit], backgroundColor: [palette.secondary_light, palette.primary_light], borderColor: [palette.secondary, palette.primary], borderWidth: 1, borderRadius: 4 }] }
        };
    }, []); // Dependensi kosong karena base values bersifat konstan untuk saat ini.

    const blendedOutcomes = useMemo(() => {
        const totalParts = 9; const regenWeight = comparisonRatio / totalParts; const convWeight = (totalParts - comparisonRatio) / totalParts;
        return { yield: ((regenerativeBaseValues.yield * regenWeight) + (conventionalBaseValues.yield * convWeight)).toFixed(0), costBenefit: ((regenerativeBaseValues.costBenefit * regenWeight) + (conventionalBaseValues.costBenefit * convWeight)).toFixed(2) };
    }, [comparisonRatio]);

    const projectedHarvest = useMemo(() => {
        // TODO: Rumus dan nilai dasar (baseYieldPerHa, optimalAlgaePerHa) ini juga bisa diambil dari backend.
        const baseYieldPerHa = 4500;
        const optimalAlgaePerHa = 2000;
        if (landAreaInput <= 0 || microalgaeInput <= 0) return 0;
        const efficiencyFactor = Math.min(1.2, microalgaeInput / (landAreaInput * optimalAlgaePerHa));
        return Math.round(baseYieldPerHa * landAreaInput * efficiencyFactor);
    }, [microalgaeInput, landAreaInput]);


    // =================================================================================
    // COMPONENT RENDERING (JSX)
    // =================================================================================

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)} />
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Header onMenuClick={() => setSidebarOpen(true)} selectedGarden={selectedGarden} onGardenChange={() => { }} />

                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    {/* Real-time Connection Status */}
                    {sensorConnected && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-700 font-medium">🟢 Live Data Connected - Real-time updates active</span>
                        </div>
                    )}
                    {loading && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                            <LoaderCircle className="w-4 h-4 text-blue-600 animate-spin" />
                            <span className="text-blue-700 font-medium">Loading sensor data...</span>
                        </div>
                    )}
                    {/* Bagian Header / Profil Tanaman */}
                    <div className="relative p-8 rounded-xl shadow-lg overflow-hidden mb-6 bg-cover bg-center" style={{ backgroundImage: `url(${gardenProfile.imageUrl})` }}>
                        <div className="absolute inset-0 bg-black/60"></div>
                        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                            <div className="md:col-span-2">
                                <h2 className="text-3xl font-extrabold mb-3">Crop Profile: {gardenProfile.name}</h2>
                                <p className="text-slate-200 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: gardenProfile.description }}></p>
                            </div>
                            <div className="p-6 bg-black/30 rounded-lg">
                                <h3 className="text-xl font-bold mb-4">Ideal Soil Set Points</h3>
                                <ul className="space-y-3 text-base">
                                    <li className="flex items-center gap-3"><Droplet className="w-5 h-5 text-green-400" /><span><strong>pH Level:</strong> 6.0 - 7.0</span></li>
                                    <li className="flex items-center gap-3"><Droplet className="w-5 h-5 text-green-400" /><span><strong>Moisture:</strong> 60% - 75%</span></li>
                                    <li className="flex items-center gap-3"><Sun className="w-5 h-5 text-green-400" /><span><strong>Nitrogen (N):</strong> 18 - 25 ppm</span></li>
                                    <li className="flex items-center gap-3"><Activity className="w-5 h-5 text-green-400" /><span><strong>Phosphorus (P):</strong> 15 - 20 ppm</span></li>
                                    <li className="flex items-center gap-3"><Wind className="w-5 h-5 text-green-400" /><span><strong>Potassium (K):</strong> 20 - 30 ppm</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bagian Metrik Utama */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"> {metricsConfig.map(metric => <MetricDisplayCard key={metric.key} icon={metric.icon} title={metric.label} value={processedData.latestReading?.[metric.key] || 'N/A'} unit={metric.unit} />)} </div>

                    <div className="mb-6"><FileUploader /></div>

                    {/* Bagian Chart Data Sensor */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800 mb-2 sm:mb-0">Metric Statistics Over Time</h3>
                                <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)} className="text-sm border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-green-300 focus:border-green-300">
                                    {metricsConfig.map(metric => <option key={metric.key} value={metric.key}>{metric.label}</option>)}
                                </select>
                            </div>
                            <div className="h-80"><Line data={processedData.mainLineChartData} options={chartOptions} /></div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Overall Performance</h3>
                            <div className="h-80"><Radar data={processedData.radarData} options={{ ...chartOptions, scales: { r: { pointLabels: { font: { size: 10 } }, grid: { color: palette.border } } } }} /></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Average Nutrient Levels (NPK)</h3>
                            <div className="h-64"><Bar data={processedData.nutrientData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} /></div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Soil Health (7-Day Trend)</h3>
                            <p className="text-xs text-slate-500 -mt-3 mb-4">A stable or upward trend indicates positive soil activity.</p>
                            <div className="h-52"><Line data={processedData.soilHealthTrendData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} /></div>
                        </div>
                    </div>

                    {/* Bagian Simulasi & Perbandingan */}
                    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Farming Practice Comparison & Simulation</h2>

                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-bold text-slate-700 mb-4">Step 1: Adjust Simulation Parameters</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-slate-600">Manual Inputs</h4>
                                    <div>
                                        <label htmlFor="microalgae" className="block text-sm font-medium text-slate-700 mb-1">Microalgae Applied (Liters)</label>
                                        <input type="number" id="microalgae" value={microalgaeInput} onChange={(e) => setMicroalgaeInput(Number(e.target.value))} className="w-full border-slate-300 rounded-md focus:ring-green-500 focus:border-green-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="landarea" className="block text-sm font-medium text-slate-700 mb-1">Land Area (Hectares)</label>
                                        <input type="number" id="landarea" value={landAreaInput} onChange={(e) => setLandAreaInput(Number(e.target.value))} className="w-full border-slate-300 rounded-md focus:ring-green-500 focus:border-green-500" />
                                    </div>
                                </div>
                                <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-slate-200">
                                    <div className="flex justify-between items-center mb-2"><h4 className="font-semibold text-slate-600">Blend Practice Scenario</h4><SlidersHorizontal className="w-5 h-5 text-slate-400" /></div>
                                    <p className="text-xs text-slate-500 mb-4">Adjust the ratio to model outcomes.</p>
                                    <input type="range" min="0" max="9" value={comparisonRatio} onChange={(e) => setComparisonRatio(parseInt(e.target.value, 10))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
                                    <div className="flex justify-between text-sm font-medium text-slate-600 mt-2"><span>Conv: <strong>{9 - comparisonRatio}</strong></span><span>Regen: <strong>{comparisonRatio}</strong></span></div>
                                    <div className="mt-4 pt-4 text-center border-t border-slate-200"><p className="text-xs text-slate-500">Blended Outcome</p><p className="text-base font-bold text-green-700">{blendedOutcomes.yield} kg/ha &bull; {blendedOutcomes.costBenefit} Ratio</p></div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-700 mb-4">Step 2: Review Projected Outcomes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <ComparisonMetricCard title="Conventional Cost (6-mo)" value={financialMetrics.convCost} icon={TrendingDown} color="red" bgColor="red" />
                                <ComparisonMetricCard title="Regenerative Cost (6-mo)" value={financialMetrics.regenCost} icon={TrendingUp} color="green" bgColor="green" />
                                <ComparisonMetricCard title="Est. Net Revenue (1yr)" value={financialMetrics.revenue} icon={DollarSign} color="slate" bgColor="slate" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex justify-center items-center">
                                    <YieldGauge value={projectedHarvest} />
                                </div>
                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                    <h3 className="font-bold text-center text-slate-800 mb-4">Yield Comparison (kg/ha)</h3>
                                    <div className="h-64"><Bar data={comparisonChartsData.yieldChartData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} /></div>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                    <h3 className="font-bold text-center text-slate-800 mb-4">Cost-Benefit Ratio</h3>
                                    <div className="h-64"><Bar data={comparisonChartsData.costBenefitChartData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} /></div>
                                    d</div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DataPage;