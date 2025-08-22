import React, { useState, useMemo, useEffect } from 'react';
import {
    Leaf, Droplet, Activity, BarChart3, Wifi, WifiOff, DollarSign,
    Users, ShieldCheck, LandPlot, Globe, Handshake, Landmark, TrendingUp, CheckCircle, Scale, RefreshCw
} from 'lucide-react';

// Pastikan path ke komponen-komponen ini benar
import Header from '../layout/header';
import Sidebar from '../layout/sidebar';
import LineChart from '../charts/lineChart';

// --- ASET GAMBAR ---
// GANTI PATH INI dengan path ke gambar latar belakang Anda.
import backgroundImage from '../images/image.png';

// =================================================================================
// KOMPONEN-KOMPONEN VISUAL (DIRANCANG ULANG SESUAI GAMBAR)
// =================================================================================

// Komponen Metrik Kunci (Numeric Display) yang sudah bagus dari versi sebelumnya
const KeyMetricDisplay = ({ value, label, icon: Icon, isPercentage = false }) => {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
        const end = value; let start = 0; const duration = 2000; const startTime = performance.now();
        const animate = (currentTime) => { const elapsedTime = currentTime - startTime; const progress = Math.min(elapsedTime / duration, 1); start = progress * end; setCurrentValue(Math.round(start)); if (progress < 1) { requestAnimationFrame(animate); } };
        requestAnimationFrame(animate);
    }, [value]);

    return (
        <div className="text-center text-white">
            <Icon className="w-10 h-10 mx-auto mb-3 opacity-90" />
            <div className="text-5xl font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                {currentValue}{isPercentage ? '%' : ''}
            </div>
            <div className="text-sm font-medium uppercase tracking-widest opacity-80 mt-1">{label}</div>
        </div>
    );
};

// Kartu Dampak ESG (Impact Card) - Desain ini juga sudah bagus
const ImpactCard = ({ impactData }) => {
    const { title, summary, icon: Icon, points, theme } = impactData;
    const colorThemes = { green: { gradient: 'from-emerald-600 to-green-600', lightBg: 'bg-emerald-50' }, orange: { gradient: 'from-amber-600 to-orange-600', lightBg: 'bg-amber-50' }, indigo: { gradient: 'from-slate-700 to-gray-800', lightBg: 'bg-slate-50' }, };
    const currentTheme = colorThemes[theme];

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className={`p-6 bg-gradient-to-br ${currentTheme.gradient} text-white`}>
                <div className="flex items-center gap-4"><Icon className="w-8 h-8 flex-shrink-0" /><h3 className="text-xl font-bold">{title}</h3></div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <p className="text-slate-600 mb-5 text-sm">{summary}</p>
                <ul className="space-y-4 flex-grow">
                    {points.map((point) => (
                        <li key={point.title} className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${currentTheme.lightBg}`}><point.icon className={`w-5 h-5 ${theme === 'indigo' ? 'text-slate-600' : `text-${theme}-600`}`} /></div>
                            <div><h5 className="font-semibold text-slate-800">{point.title}</h5><p className="text-xs text-slate-500">{point.description}</p></div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


// [BARU] Komponen Chart untuk Perbandingan Finansial
const FinancialComparisonChart = ({ title, subtitle, data, loading, onRefresh }) => {
    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false }, ticks: { display: false } }, y: { grid: { color: '#f1f5f9' }, border: { dash: [4, 4] } } },
        interaction: { intersect: false, mode: 'index' },
        elements: { point: { radius: 2, hoverRadius: 5 } }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-slate-800">{title}</h3>
                    <p className="text-sm text-slate-500">{subtitle}</p>
                </div>
                <button onClick={onRefresh} disabled={loading} className="p-2 rounded-full text-slate-400 hover:bg-slate-100"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
            </div>
            <div className="h-64">
                <LineChart data={data} options={chartOptions} />
            </div>
        </div>
    );
};

// [BARU] Komponen Chart untuk Proyeksi Dampak ESG
const ImpactForecastChart = ({ title, subtitle, data, loading, onRefresh }) => {
    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', boxHeight: 8 } } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' }, border: { dash: [4, 4] } } },
        interaction: { intersect: false, mode: 'index' },
        elements: { point: { radius: 2, hoverRadius: 5 } }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-slate-800">{title}</h3>
                    <p className="text-sm text-slate-500">{subtitle}</p>
                </div>
                 <button onClick={onRefresh} disabled={loading} className="p-2 rounded-full text-slate-400 hover:bg-slate-100"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
            </div>
            <div className="h-64">
                <LineChart data={data} options={chartOptions} />
            </div>
        </div>
    );
};

// =================================================================================
// DATA & FUNGSI GENERATOR
// =================================================================================

const generateDummyFinancialData = (count = 30) => Array.from({ length: count }, (_, i) => ({ timestamp: new Date(new Date().getTime() - i * 24 * 3600000).toISOString(), pre_regenerative_profit: parseFloat((5000 + Math.random() * 800).toFixed(2)), regenerative_profit: parseFloat((6000 + Math.random() * 1500).toFixed(2)), pre_regenerative_cost: parseFloat((3000 + Math.random() * 500).toFixed(2)), regenerative_cost: parseFloat((2500 + Math.random() * 500).toFixed(2)) }));
const generateDummyImpactData = (count = 12, forecastCount = 6, startValue, growthFactor) => { let historical = []; let currentValue = startValue; for (let i = 0; i < count; i++) { historical.push({ timestamp: new Date(new Date().setMonth(new Date().getMonth() - (count - 1 - i))).toISOString(), value: parseFloat(currentValue.toFixed(2)) }); currentValue += (Math.random() * growthFactor); } let forecast = []; for (let i = 0; i < forecastCount; i++) { forecast.push({ timestamp: new Date(new Date().setMonth(new Date().getMonth() + (i + 1))).toISOString(), value: parseFloat(currentValue.toFixed(2)) }); currentValue += (Math.random() * growthFactor) * 1.1; } return { historical, forecast }; };

const environmentalImpactData = { title: 'Environmental Uplift', summary: 'Regenerative agriculture actively restores the planet by rebuilding soil health, sequestering carbon, and enhancing biodiversity.', icon: Globe, theme: 'green', points: [ { icon: Leaf, title: 'Carbon Sequestration', description: 'Draws CO2 from the atmosphere and stores it in the soil to combat climate change.' }, { icon: Droplet, title: 'Improved Water Cycles', description: 'Increases soil water retention, reducing runoff and drought impact.' }, { icon: LandPlot, title: 'Soil Resilience', description: 'Significantly reduces soil erosion, ensuring long-term fertility.' }]};
const socialImpactData = { title: 'Social Empowerment', summary: 'These practices strengthen rural communities by creating economic opportunities, improving food security, and empowering farmers.', icon: Users, theme: 'orange', points: [ { icon: Handshake, title: 'Farmer Empowerment', description: 'Gives farmers greater autonomy and reduces dependency on external inputs.' }, { icon: TrendingUp, title: 'Job Creation', description: 'Increases local labor needs for more diverse and intensive practices.' }, { icon: CheckCircle, title: 'Enhanced Nutrition & Health', description: 'Produces more nutrient-dense food, benefiting consumer health.' }]};
const governanceImpactData = { title: 'Economic Resilience', summary: 'Strong governance and proper incentives make regenerative agriculture a stable and profitable business model for the future.', icon: Landmark, theme: 'indigo', points: [ { icon: Scale, title: 'Risk Management', description: 'Reduces financial risks from extreme weather and soil degradation.' }, { icon: ShieldCheck, title: 'Premium Market Access', description: 'Regenerative certifications unlock access to conscious consumer markets.' }, { icon: DollarSign, title: 'Long-Term Economic Stability', description: 'Builds a healthy soil asset, the foundation of sustainable profit.' }]};

// =================================================================================
// KOMPONEN UTAMA HALAMAN
// =================================================================================

const FinancePage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedGarden, setSelectedGarden] = useState("Spinach Garden 08");
    const [activeMenuItem, setActiveMenuItem] = useState("Finance");
    
    const [financialData, setFinancialData] = useState(generateDummyFinancialData(30));
    const [carbonData, setCarbonData] = useState(generateDummyImpactData(12, 6, 0.4, 0.1));
    const [soilData, setSoilData] = useState(generateDummyImpactData(12, 6, 2.0, 0.08));
    const [loading, setLoading] = useState(false);

    const refetchAllData = () => {
        setLoading(true);
        setTimeout(() => {
            setFinancialData(generateDummyFinancialData(30));
            setCarbonData(generateDummyImpactData(12, 6, 0.4, 0.1));
            setSoilData(generateDummyImpactData(12, 6, 2.0, 0.08));
            setLoading(false);
        }, 1000);
    };

    // Mempersiapkan data untuk setiap chart
    const { profitData, costData, carbonChartData, soilChartData } = useMemo(() => {
        const financialLabels = financialData.map(r => new Date(r.timestamp).toLocaleDateString());
        const profitData = { labels: financialLabels, datasets: [ { label: 'Regenerative', data: financialData.map(r => r.regenerative_profit), borderColor: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.2)', fill: true, tension: 0.4 }, { label: 'Pre-Regenerative', data: financialData.map(r => r.pre_regenerative_profit), borderColor: '#f87171', backgroundColor: 'rgba(248, 113, 113, 0.2)', fill: true, tension: 0.4 } ]};
        const costData = { labels: financialLabels, datasets: [ { label: 'Regenerative', data: financialData.map(r => r.regenerative_cost), borderColor: '#60a5fa', backgroundColor: 'rgba(96, 165, 250, 0.2)', fill: true, tension: 0.4 }, { label: 'Pre-Regenerative', data: financialData.map(r => r.pre_regenerative_cost), borderColor: '#f87171', backgroundColor: 'rgba(248, 113, 113, 0.2)', fill: true, tension: 0.4 } ]};

        const impactLabels = [...carbonData.historical.map(d => new Date(d.timestamp).toLocaleDateString('default', { month: 'short', day: '2-digit' })), ...carbonData.forecast.map(d => new Date(d.timestamp).toLocaleDateString('default', { month: 'short', day: '2-digit' }))];
        const carbonChartData = { labels: impactLabels, datasets: [ { label: 'Historical', data: carbonData.historical.map(d => d.value), borderColor: '#2dd4bf', backgroundColor: 'rgba(45, 212, 191, 0.2)', fill: true, tension: 0.4 }, { label: 'Forecast', data: [...Array(carbonData.historical.length - 1).fill(null), carbonData.historical.slice(-1)[0].value, ...carbonData.forecast.map(d => d.value)], borderColor: '#2dd4bf', borderDash: [5, 5], fill: false, tension: 0.4 } ]};
        const soilChartData = { labels: impactLabels, datasets: [ { label: 'Historical', data: soilData.historical.map(d => d.value), borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.2)', fill: true, tension: 0.4 }, { label: 'Forecast', data: [...Array(soilData.historical.length - 1).fill(null), soilData.historical.slice(-1)[0].value, ...soilData.forecast.map(d => d.value)], borderColor: '#f59e0b', borderDash: [5, 5], fill: false, tension: 0.4 } ]};

        return { profitData, costData, carbonChartData, soilChartData };
    }, [financialData, carbonData, soilData]);

    const keyMetrics = [{ value: 20, label: 'ROI Improvement', icon: TrendingUp, isPercentage: true }, { value: 2, label: 'Carbon Saved (tCO2)', icon: Leaf }, { value: 3, label: 'Soil Organic Matter', icon: Activity, isPercentage: true }, { value: 30, label: 'Water Saved', icon: Droplet, isPercentage: true }];

    return (
        <div className="min-h-screen bg-slate-50 flex text-slate-700">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeItem={activeMenuItem} onItemClick={(key, label) => setActiveMenuItem(label)} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header onMenuClick={() => setSidebarOpen(true)} selectedGarden={selectedGarden} onGardenChange={(garden) => setSelectedGarden(garden)} />
                <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200 px-6 py-2 flex justify-between items-center text-xs"><div className="flex items-center gap-2"><Wifi className="w-3 h-3 text-emerald-500" /><span className="text-emerald-600 font-semibold">Connected</span></div><span className="text-slate-500">Data fresh as of {new Date().toLocaleTimeString()}</span></div>
                
                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-800">Financial & ESG Dashboard</h1>
                        <p className="text-slate-500 mt-1">Analyzing the profitability and sustainable impact of regenerative practices.</p>
                    </div>

                    <div className="relative mb-12 p-20 rounded-2xl shadow-xl overflow-hidden" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {keyMetrics.map(item => <KeyMetricDisplay key={item.label} {...item} />)}
                        </div>
                    </div>

                    <div className="mb-12">
                        {/* <div className="text-center mb-8"><span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">The Triple Bottom Line</span><h2 className="text-2xl font-bold text-slate-800 mt-1">Regenerative Impact Dimensions</h2></div> */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <ImpactCard impactData={environmentalImpactData} />
                            <ImpactCard impactData={socialImpactData} />
                            <ImpactCard impactData={governanceImpactData} />
                        </div>
                    </div>

                    <div>
                        {/* <div className="text-center mb-8"><span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Data-Driven Insights</span><h2 className="text-3xl font-bold text-slate-800 mt-1">Financial & Impact Forecasts</h2></div> */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <FinancialComparisonChart title="Profit Comparison" subtitle="Regenerative vs. Pre-Regenerative ($/ha)" data={profitData} loading={loading} onRefresh={refetchAllData} />
                            <FinancialComparisonChart title="Input Cost Comparison" subtitle="Regenerative vs. Pre-Regenerative ($/ha)" data={costData} loading={loading} onRefresh={refetchAllData} />
                            <ImpactForecastChart title="Carbon Sequestration" subtitle="Projected Impact (tCO2/ha)" data={carbonChartData} loading={loading} onRefresh={refetchAllData} />
                            <ImpactForecastChart title="Soil Organic Matter" subtitle="Projected Improvement (%)" data={soilChartData} loading={loading} onRefresh={refetchAllData} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FinancePage;