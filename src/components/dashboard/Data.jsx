import React, { useState, useMemo } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Radar, Bar } from 'react-chartjs-2';
import { Leaf, Thermometer, Droplet, Wind, Sun, Activity, BarChart3, SlidersHorizontal, Info } from 'lucide-react';

import Header from '../layout/header';
import Sidebar from '../layout/sidebar';

// [PENTING] Impor gambar latar Anda di sini
import keylimeBackground from '../images/image.png'; // <-- Ganti path ini sesuai lokasi gambar Anda

// Registrasi elemen Chart.js
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler );

// ... (Palet warna dan data dummy tetap sama)
const palette = {
    primary: '#16a34a', primary_light: '#dcfce7', primary_dark: '#15803d', primary_transparent: 'rgba(22, 163, 74, 0.15)',
    secondary: '#64748b', secondary_light: '#e2e8f0', secondary_transparent: 'rgba(100, 116, 139, 0.15)',
    text_primary: '#1e293b', text_secondary: '#475569', border: '#e2e8f0', bg_subtle: '#f8fafc',    
};
const generateDummyData = (count = 30) => {
    const data = []; const baseTime = new Date(); for (let i = 0; i < count; i++) {
        const progressFactor = (count - i) / count;
        data.push({
            timestamp: new Date(baseTime.getTime() - i * 24 * 3600000).toISOString(),
            temperature: (22 + Math.random() * 5).toFixed(1), soil_moisture: (65 + Math.random() * 10).toFixed(1),
            ph_level: (6.7 + Math.random() * 0.4).toFixed(1), nitrogen: (20 + Math.random() * 5 * progressFactor).toFixed(1),
            phosphorus: (15 + Math.random() * 5 * progressFactor).toFixed(1), potassium: (25 + Math.random() * 5 * progressFactor).toFixed(1),
            soil_health: (92 + (Math.random() * 8 * progressFactor)).toFixed(1), organic_matter: (3.8 + (Math.random() * 1 * progressFactor)).toFixed(1),
        });
    } return data.reverse();
};
const metricsConfig = [ { key: 'soil_health', label: 'Soil Health', icon: Leaf, unit: '%' }, { key: 'soil_moisture', label: 'Soil Moisture', icon: Droplet, unit: '%' }, { key: 'temperature', label: 'Temperature', icon: Thermometer, unit: '°C' }, { key: 'ph_level', label: 'pH Level', icon: Droplet, unit: '' }, { key: 'nitrogen', label: 'Nitrogen', icon: Sun, unit: 'ppm' }, { key: 'phosphorus', label: 'Phosphorus', icon: Activity, unit: 'ppm' }, { key: 'potassium', label: 'Potassium', icon: Wind, unit: 'ppm' }, { key: 'organic_matter', label: 'Organic Matter', icon: BarChart3, unit: '%' }, ];
const regenerativeBaseValues = { yield: 4500, costBenefit: 2.5 };
const conventionalBaseValues = { yield: 5000, costBenefit: 1.5 };

const MetricDisplayCard = ({ icon: Icon, title, value, unit }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="p-3 rounded-full bg-green-50"><Icon className="w-6 h-6 text-green-600" /></div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-xl font-bold text-slate-800">{value} <span className="text-base font-medium text-slate-500">{unit}</span></p>
        </div>
    </div>
);


const DataPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedGarden] = useState("Primary Key Lime Orchard");
    const [sensorData] = useState(generateDummyData());
    const [selectedMetric, setSelectedMetric] = useState('soil_health');
    const [comparisonRatio, setComparisonRatio] = useState(9); 
    const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', align: 'end', labels: { color: palette.text_secondary, boxWidth: 12 } } }, scales: { y: { grid: { color: palette.border }, ticks: { color: palette.text_secondary } }, x: { grid: { display: false }, ticks: { color: palette.text_secondary } } } };

    const processedData = useMemo(() => {
        const latestReading = sensorData[sensorData.length - 1];
        const labels = sensorData.map(d => new Date(d.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
        const selectedConfig = metricsConfig.find(m => m.key === selectedMetric);
        const mainLineChartData = {
            labels,
            datasets: [{ label: selectedConfig?.label || 'Selected Metric', data: sensorData.map(d => d[selectedMetric]), borderColor: palette.primary, backgroundColor: palette.primary_transparent, fill: true, tension: 0.4, pointRadius: 1, pointBackgroundColor: palette.primary,
            }, { label: '7-Day Moving Average', data: sensorData.map((_, i, arr) => (arr.slice(Math.max(0, i - 6), i + 1).reduce((acc, val) => acc + parseFloat(val[selectedMetric]), 0) / Math.min(i + 1, 7)).toFixed(1)), borderColor: palette.secondary, borderDash: [5, 5], fill: false, tension: 0.4, pointRadius: 0, }]
        };
        const radarData = {
            labels: ['Health', 'Moisture', 'Nitrogen', 'Phosphorus', 'Potassium', 'Organic Matter'],
            datasets: [{ label: 'Current Performance (7-Day Avg)', data: ['soil_health', 'soil_moisture', 'nitrogen', 'phosphorus', 'potassium', 'organic_matter'].map(metric => (sensorData.slice(-7).reduce((sum, d) => sum + parseFloat(d[metric]), 0) / 7).toFixed(1)), backgroundColor: palette.primary_transparent, borderColor: palette.primary, borderWidth: 2, }]
        };
        const nutrientData = {
            labels: ['Nitrogen', 'Phosphorus', 'Potassium'],
            datasets: [{ label: 'Average Level (ppm)', data: ['nitrogen', 'phosphorus', 'potassium'].map(nutrient => (sensorData.reduce((s, d) => s + parseFloat(d[nutrient]), 0) / sensorData.length).toFixed(1)), backgroundColor: [palette.primary, palette.primary_dark, '#65a30d'], }]
        };
        return { latestReading, mainLineChartData, radarData, nutrientData };
    }, [sensorData, selectedMetric]);
    
    const comparisonChartsData = useMemo(() => {
        return { yieldChartData: { labels: ['Conventional', 'Regenerative'], datasets: [{ label: 'Projected Yield (kg/ha)', data: [conventionalBaseValues.yield, regenerativeBaseValues.yield], backgroundColor: [palette.secondary_light, palette.primary_light], borderColor: [palette.secondary, palette.primary], borderWidth: 1, borderRadius: 4 }] }, costBenefitChartData: { labels: ['Conventional', 'Regenerative'], datasets: [{ label: 'Cost-Benefit Ratio', data: [conventionalBaseValues.costBenefit, regenerativeBaseValues.costBenefit], backgroundColor: [palette.secondary_light, palette.primary_light], borderColor: [palette.secondary, palette.primary], borderWidth: 1, borderRadius: 4 }] } };
    }, []);
    
    const blendedOutcomes = useMemo(() => {
        const totalParts = 9; const regenWeight = comparisonRatio / totalParts; const convWeight = (totalParts - comparisonRatio) / totalParts;
        return { yield: ((regenerativeBaseValues.yield * regenWeight) + (conventionalBaseValues.yield * convWeight)).toFixed(0), costBenefit: ((regenerativeBaseValues.costBenefit * regenWeight) + (conventionalBaseValues.costBenefit * convWeight)).toFixed(2), };
    }, [comparisonRatio]);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
            />
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Header onMenuClick={() => setSidebarOpen(true)} selectedGarden={selectedGarden} onGardenChange={() => {}} />
                
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    {/* [REDESIGNED] Page Header with Background Image and Rich Description */}
                    <div className="relative p-8 rounded-xl shadow-lg overflow-hidden mb-6 bg-cover bg-center" style={{ backgroundImage: `url(${keylimeBackground})` }}>
                        <div className="absolute inset-0 bg-black/60"></div>
                        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                            <div className="md:col-span-2">
                                <h2 className="text-3xl font-extrabold mb-3">Crop Profile: Key Lime</h2>
                                <p className="text-slate-200 text-base leading-relaxed">
                                    The Key Lime (*Citrus aurantiifolia*) is a small, highly aromatic citrus fruit prized for its distinctively tart and flavorful juice. Unlike other limes, it has a higher acidity, a stronger aroma, and a thinner rind. 
                                    <br/><br/>
                                    Thriving in well-drained soil and sunny conditions, this crop is sensitive to fluctuations in soil pH, moisture, and nutrient balance. This dashboard provides the real-time data crucial for managing these parameters, preventing disease, and ensuring a healthy, high-yield orchard.
                                </p>
                            </div>
                            <div className="p-6 bg-black/30 rounded-lg">
                                <h3 className="text-xl font-bold mb-4">Ideal Soil Set Points</h3>
                                <ul className="space-y-3 text-base">
                                    <li className="flex items-center gap-3"><Droplet className="w-5 h-5 text-green-400"/><span><strong>pH Level:</strong> 6.0 - 7.0</span></li>
                                    <li className="flex items-center gap-3"><Droplet className="w-5 h-5 text-green-400"/><span><strong>Moisture:</strong> 60% - 75%</span></li>
                                    <li className="flex items-center gap-3"><Sun className="w-5 h-5 text-green-400"/><span><strong>Nitrogen (N):</strong> 18 - 25 ppm</span></li>
                                    <li className="flex items-center gap-3"><Activity className="w-5 h-5 text-green-400"/><span><strong>Phosphorus (P):</strong> 15 - 20 ppm</span></li>
                                    <li className="flex items-center gap-3"><Wind className="w-5 h-5 text-green-400"/><span><strong>Potassium (K):</strong> 20 - 30 ppm</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
                        {metricsConfig.map(metric => <MetricDisplayCard key={metric.key} icon={metric.icon} title={metric.label} value={processedData.latestReading?.[metric.key] || 'N/A'} unit={metric.unit} />)}
                    </div>

                    {/* Main Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800 mb-2 sm:mb-0">Metric Statistics Over Time</h3>
                                <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)} className="text-sm border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-green-300 focus:border-green-300">
                                    {metricsConfig.map(metric => <option key={metric.key} value={metric.key}>{metric.label}</option>)}
                                </select>
                            </div>
                            <div className="h-80"><Line data={processedData.mainLineChartData} options={chartOptions} /></div>
                        </div>
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200">
                             <h3 className="text-lg font-bold text-slate-800 mb-4">Overall Performance</h3>
                             <div className="h-80"><Radar data={processedData.radarData} options={{...chartOptions, scales: {r: { pointLabels: { font: { size: 10 } }, grid: { color: palette.border } }} }}/></div>
                        </div>
                    </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                         <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Average Nutrient Levels (NPK)</h3>
                            <div className="h-64"><Bar data={processedData.nutrientData} options={{...chartOptions, plugins: { legend: { display: false }}}} /></div>
                        </div>
                         <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Soil Health (7-Day Trend)</h3>
                             <p className="text-xs text-slate-500 -mt-3 mb-4">A stable or upward trend indicates positive soil activity.</p>
                            <div className="h-52"><Line data={{...processedData.mainLineChartData, datasets: [processedData.mainLineChartData.datasets[0]]}} options={{...chartOptions, plugins: { legend: { display: false } }}}/></div>
                        </div>
                    </div>
                    
                    {/* Comparison Section */}
                    <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Farming Practice Comparison</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex flex-col justify-center">
                                <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-slate-800">Farm Practice Scenario</h3><SlidersHorizontal className="w-5 h-5 text-slate-500"/></div>
                                <p className="text-sm text-slate-500 mb-6">Adjust the ratio to model outcomes based on a blend of practices.</p>
                                <input type="range" min="0" max="9" value={comparisonRatio} onChange={(e) => setComparisonRatio(parseInt(e.target.value, 10))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"/>
                                <div className="flex justify-between text-sm font-medium text-slate-600 mt-2">
                                    <span>Conventional: <strong>{9 - comparisonRatio}</strong> parts</span>
                                    <span>Regenerative: <strong>{comparisonRatio}</strong> parts</span>
                                </div>
                                <div className="mt-6 pt-4 space-y-2 text-center border-t border-slate-200">
                                    <p className="text-sm text-slate-500">Blended Scenario Outcome:</p>
                                    <p className="text-lg font-bold text-green-700">{blendedOutcomes.yield} kg/ha Yield &amp; {blendedOutcomes.costBenefit} Cost-Benefit Ratio</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                <h3 className="font-bold text-center text-slate-800 mb-4">Yield Comparison (kg/ha)</h3>
                                <div className="h-64"><Bar data={comparisonChartsData.yieldChartData} options={{...chartOptions, plugins: { legend: { display: false }}}} /></div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                <h3 className="font-bold text-center text-slate-800 mb-4">Cost-Benefit Ratio</h3>
                                <div className="h-64"><Bar data={comparisonChartsData.costBenefitChartData} options={{...chartOptions, plugins: { legend: { display: false }}}} /></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DataPage;