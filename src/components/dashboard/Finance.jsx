import React, { useState, useMemo } from 'react';
import {
    Leaf, Droplet, Users, ShieldCheck, LandPlot, Globe, Handshake, Landmark, TrendingUp, CheckCircle, Scale, RefreshCw, BarChartHorizontal
} from 'lucide-react';

// Core Layout Components
import Header from '../layout/header';
import Sidebar from '../layout/sidebar';
import LineChart from '../charts/lineChart'; // Assuming a separate LineChart component

// Page Assets
import backgroundImage from '../images/sawah.jpg'; // Ensure this path is correct

// =================================================================================
// Professional UI Theme & Palette
// =================================================================================
const theme = {
    colors: {
        primary: '#16a34a', // green-600
        primary_light: 'rgba(22, 163, 74, 0.15)',
        secondary: '#475569', // slate-600
        secondary_light: 'rgba(71, 85, 105, 0.15)',
        border: '#e2e8f0', // slate-200
        text_header: '#1e293b', // slate-800
        text_body: '#475569', // slate-600
        background: '#f8fafc', // slate-50
    },
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
};

// =================================================================================
// Refined Components
// =================================================================================

const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-6">
        <h2 className={`text-2xl font-bold ${theme.colors.text_header}`}>{title}</h2>
        {subtitle && <p className={`mt-1 max-w-2xl text-base ${theme.colors.text_body}`}>{subtitle}</p>}
    </div>
);

const ProgramGoal = ({ value, label, description }) => (
    <div className="flex flex-col md:flex-row rounded-lg overflow-hidden backdrop-blur-md transition-all duration-300 hover:bg-white/20"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
        <div className="p-6 md:w-64 flex-shrink-0 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-white/20">
            <div className="text-center">
                <span className="text-5xl lg:text-6xl font-extrabold text-white">{value}</span>
                <span className="mt-1 block text-lg font-semibold tracking-wider text-green-300">{label}</span>
            </div>
        </div>
        <div className="p-6 flex items-center">
            <p className="text-base font-medium text-white/90">{description}</p>
        </div>
    </div>
);

const ImpactCard = ({ impactData }) => {
    const { title, summary, icon: Icon, points, borderColor } = impactData;
    return (
        <div className="bg-white rounded-xl flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            style={{ boxShadow: theme.shadow, borderTop: `4px solid ${borderColor}` }}>
            <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full" style={{ backgroundColor: `${borderColor}20` }}>
                         <Icon className="w-7 h-7" style={{ color: borderColor }}/>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                </div>
                 <p className="text-sm text-slate-600">{summary}</p>
            </div>
            <div className="p-6 border-t border-slate-100 flex-grow">
                <ul className="space-y-4">
                    {points.map((point) => (
                        <li key={point.title} className="flex items-start gap-4">
                            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: borderColor }} />
                            <div>
                                <h5 className="font-semibold text-slate-700">{point.title}</h5>
                                <p className="text-sm text-slate-500">{point.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// [UPDATED] Financial Chart with Increased Height and Better Styling
const FinancialComparisonChart = ({ title, data, loading, onRefresh }) => {
    const chartOptions = { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { 
            legend: { display: false },
            tooltip: {
                enabled: true,
                backgroundColor: '#1e293b', // slate-800
                titleColor: '#cbd5e1', // slate-300
                bodyColor: '#fff',
                borderColor: '#334155', // slate-700
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                boxPadding: 4,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            // Format number with commas
                            label += new Intl.NumberFormat('en-US').format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        }, 
        scales: { 
            x: { 
                grid: { display: false }, 
                ticks: { color: theme.colors.text_body } 
            }, 
            y: { 
                grid: { color: theme.colors.border, border: { dash: [4, 4] } }, 
                ticks: { color: theme.colors.text_body } 
            } 
        }, 
        interaction: { intersect: false, mode: 'index' }, 
        elements: { 
            point: { 
                radius: 3, 
                hoverRadius: 6, 
                borderWidth: 2, 
                hoverBorderWidth: 2
            } 
        } 
    };
    return (
        <div className="bg-white rounded-xl p-6 h-full flex flex-col" style={{ boxShadow: theme.shadow }}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                <button onClick={onRefresh} disabled={loading} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 disabled:opacity-50"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
            </div>
            {/* --- THIS IS THE KEY CHANGE --- */}
            <div className="flex-grow h-96">
                <LineChart data={data} options={chartOptions} />
            </div>
        </div>
    );
};

const DOSMDataWidget = () => {
    const dosmStats = { gdpGrowth: 2.9, agriEmployment: "1.4M", foodSecurityIndex: "81.3" };
    return (
        <div className="bg-white rounded-xl p-6 h-full" style={{ boxShadow: theme.shadow }}>
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">National Economic Context</h3>
                    <p className="text-sm text-slate-500">Source: Dept. of Statistics Malaysia (DOSM) - Simulated</p>
                </div>
                <Landmark className="w-7 h-7 text-slate-300"/>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                 <div>
                    <p className="text-4xl font-bold text-green-600">{dosmStats.gdpGrowth}%</p>
                    <p className="text-sm text-slate-500 mt-1">Q4 2024 Agri GDP Growth</p>
                </div>
                 <div>
                    <p className="text-4xl font-bold text-blue-600">{dosmStats.agriEmployment}</p>
                    <p className="text-sm text-slate-500 mt-1">Persons Employed in Agri</p>
                </div>
                 <div>
                    <p className="text-4xl font-bold text-orange-600">{dosmStats.foodSecurityIndex}</p>
                    <p className="text-sm text-slate-500 mt-1">Global Food Security Index</p>
                </div>
             </div>
        </div>
    );
}

// =================================================================================
// Data Objects
// =================================================================================
const programGoalsData = [{value: '10K',label: 'FARMERS',description: 'Support and collaborate with 10,000 farmers globally, equipping them with sustainable practices to transform agriculture into a regenerative, climate-positive industry.'},{value: '100K',label: 'HECTARES',description: 'Regenerate 100,000 hectares of farmland using zero-carbon techniques, creating fertile, carbon-rich soils that enhance productivity and sustainability.'},{value: '1M',label: 'TONS OF FOOD',description: 'Produce 1,000,000 tons of zero-carbon food, showcasing how sustainable agriculture can meet global food demands while minimizing environmental impact.'},{value: '10M',label: 'TONS OF CO2',description: 'Sequester 10,000,000 tons of CO2, contributing significantly to global climate action through advanced carbon farming and innovative methods.'},];
const environmentalImpactData = { title: 'Environmental', summary: 'Restoring the planet by rebuilding soil health, sequestering carbon, and enhancing biodiversity.', icon: Globe, borderColor: '#10b981', points: [{ title: 'Carbon Sequestration', description: 'Draws CO2 from the atmosphere and stores it in the soil.' }, { title: 'Improved Water Cycles', description: 'Increases soil water retention, reducing runoff and drought impact.' }]};
const socialImpactData = { title: 'Social', summary: 'Strengthening rural communities by creating economic opportunities and improving food security.', icon: Users, borderColor: '#f97316', points: [{ title: 'Farmer Empowerment', description: 'Gives farmers greater autonomy and reduces dependency on inputs.' }, { title: 'Enhanced Nutrition & Health', description: 'Produces more nutrient-dense food for healthier communities.' }]};
const governanceImpactData = { title: 'Economic & Governance', summary: 'Making regenerative farming a stable, transparent, and profitable model for the future.', icon: ShieldCheck, borderColor: '#3b82f6', points: [{ title: 'Financial Risk Management', description: 'Reduces risks from extreme weather and market volatility.' }, { title: 'Premium Market Access', description: 'Unlocks access to conscious consumer markets.' }]};

// =================================================================================
// Main Page Component
// =================================================================================
const FinancePage = () => {
    // State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [financialData, setFinancialData] = useState( () => Array.from({ length: 30 }, (_, i) => ({ timestamp: new Date(new Date().setDate(new Date().getDate() - (29 - i))), regenerative_profit: parseFloat((6700 + Math.random() * 800 - 400).toFixed(0)), regenerative_cost: parseFloat((2750 + Math.random() * 300 - 150).toFixed(0)) })));
    const [loading, setLoading] = useState(false);

    // Handlers
    const refetchAllData = () => { setLoading(true); setTimeout(() => { setFinancialData(Array.from({ length: 30 }, (_, i) => ({ timestamp: new Date(new Date().setDate(new Date().getDate() - (29 - i))), regenerative_profit: parseFloat((6700 + Math.random() * 800 - 400).toFixed(0)), regenerative_cost: parseFloat((2750 + Math.random() * 300 - 150).toFixed(0)) }))); setLoading(false); }, 1000); };

    // Memoized Chart Data
    const { profitData, costData } = useMemo(() => {
        const labels = financialData.map(r => r.timestamp.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
        return {
            profitData: { labels, datasets: [{ label: 'Profit', data: financialData.map(r => r.regenerative_profit), borderColor: theme.colors.primary, backgroundColor: theme.colors.primary_light, pointBackgroundColor: '#fff', pointBorderColor: theme.colors.primary, fill: true, tension: 0.4 }] },
            costData: { labels, datasets: [{ label: 'Cost', data: financialData.map(r => r.regenerative_cost), borderColor: theme.colors.secondary, backgroundColor: theme.colors.secondary_light, pointBackgroundColor: '#fff', pointBorderColor: theme.colors.secondary, fill: true, tension: 0.4 }] }
        };
    }, [financialData]);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
            />
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Header onMenuClick={() => setSidebarOpen(true)} selectedGarden={"Global Impact Program"} onGardenChange={() => {}} />
                
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                    {/* Hero Section */}
                    <div className="relative mb-12 rounded-xl shadow-lg overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
                        <div className="absolute inset-0 bg-black/50"></div>
                        <div className="relative p-6 md:p-8 space-y-4">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight" style={{textShadow: '0 2px 5px rgba(0,0,0,0.5)'}}>Program Goals</h1>
                            <div className="space-y-6 mt-4">
                              {programGoalsData.map((goal, index) => <ProgramGoal key={index} {...goal} />)}
                            </div>
                        </div>
                    </div>
                    
                    {/* ESG Section */}
                    <div className="mb-12">
                        <SectionHeader 
                            title="ESG Impact Dimensions" 
                            subtitle="Analyzing the triple bottom line of regenerative agriculture: Environmental, Social, and Governance." 
                        />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <ImpactCard impactData={environmentalImpactData} />
                            <ImpactCard impactData={socialImpactData} />
                            <ImpactCard impactData={governanceImpactData} />
                        </div>
                    </div>

                    {/* Financial & National Context Section */}
                    <div>
                         <SectionHeader 
                            title="Financial & Economic Insights"
                            subtitle="Tracking financial performance against the broader national economic landscape."
                         />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <FinancialComparisonChart title="Profitability Over Time" data={profitData} loading={loading} onRefresh={refetchAllData} />
                            <FinancialComparisonChart title="Operational Costs Over Time" data={costData} loading={loading} onRefresh={refetchAllData} />
                        </div>

                        <div className="mt-8">
                            <DOSMDataWidget />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FinancePage;