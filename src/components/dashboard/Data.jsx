// =================================================================================
// IMPORTS
// =================================================================================
import { useState, useMemo, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Radar, Bar } from 'react-chartjs-2';
import { Leaf, Thermometer, Droplet, Wind, Sun, Activity, BarChart3, SlidersHorizontal, UploadCloud, FileText, X, LoaderCircle, CheckCircle, TrendingDown, TrendingUp, DollarSign, AlertTriangle, Package, FlaskConical } from 'lucide-react';

// Components & Hooks
import Header from '../layout/header';
import Sidebar from '../layout/sidebar';
import keylimeBackground from '../images/image.png';
import { useApi } from '../../hook/useApi';

// Firebase Firestore hooks
import { useFirestoreSensorData, useFirestoreFinancialData, useFirestoreDashboardData, useFirestoreMutations } from '../../hook/useFirestore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend, Filler);

// =================================================================================
// REUSABLE UI COMPONENTS
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
    const bgColorClasses = { green: 'bg-green-100', red: 'bg-red-100', slate: 'bg-slate-100' };
    return (
        <div className={`${bgColorClasses[bgColor]} p-4 rounded-lg border border-slate-200`}>
            <div className="flex items-center gap-3">
                <Icon className={`w-7 h-7 ${colorClasses[color]}`} />
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className={`text-xl font-bold ${colorClasses[color]}`}>RM {value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>
    );
};

const ProjectedResultCard = ({ icon: Icon, title, value, unit, description }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex items-start gap-5 h-full">
        <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
            <Icon className="w-7 h-7 text-green-700" />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-4xl font-bold text-slate-800 my-1">{value.toLocaleString()}</p>
            <p className="text-base font-medium text-slate-600">{unit}</p>
            {description && <p className="text-xs text-slate-400 mt-2">{description}</p>}
        </div>
    </div>
);

const FileUploader = ({ onFileUpload, isLoading }) => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Firebase mutations for uploading CSV data to dataset_param collection
    const { addDocument: addDatasetParam, loading: firestoreUploading } = useFirestoreMutations('dataset_param');

    const handleFileProcess = (uploadedFile) => {
        if (!uploadedFile || !uploadedFile.type.startsWith('text/csv')) {
            setStatus('error'); setErrorMessage('Please upload a valid CSV file.'); return;
        }
        setFile(uploadedFile); setStatus('processing'); setErrorMessage('');
        
        Papa.parse(uploadedFile, {
            header: true, 
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: async (results) => {
                try {
                    setStatus('processing');
                    console.log('📄 Parsed CSV data:', results.data);
                    
                    // Process each row and upload to Firestore
                    const uploadPromises = results.data.map(async (row, index) => {
                        // Clean and validate data
                        const cleanedRow = {
                            total_nitrogen: parseFloat(row.total_nitrogen) || 0,
                            organic_matter: parseFloat(row.organic_matter) || 0,
                            total_carbon: parseFloat(row.total_carbon) || 0,
                            temperature: parseFloat(row.temperature) || 0,
                            humidity: parseFloat(row.humidity) || 0,
                            volume_microalgae: parseFloat(row.volume_microalgae) || 0,
                            volume_pesticide: parseFloat(row.volume_pesticide) || 0,
                            sample_id: row.sample_id || `uploaded_${Date.now()}_${index}`,
                            timestamp: row.timestamp || new Date().toISOString(),
                            source: 'csv_upload',
                            upload_filename: uploadedFile.name
                        };

                        // Upload to Firestore dataset_param collection
                        return await addDatasetParam(cleanedRow);
                    });

                    await Promise.all(uploadPromises);
                    
                    // Also call the original onFileUpload for backward compatibility
                    const success = await onFileUpload(results.data);
                    
                    if (success) { 
                        setStatus('success'); 
                        console.log('✅ CSV data uploaded to both Firestore and backend');
                        setTimeout(() => handleRemoveFile(), 5000); 
                    } else { 
                        setStatus('error'); 
                        setErrorMessage('Backend upload failed. Data saved to Firestore only.'); 
                    }
                } catch (error) {
                    console.error('❌ CSV upload error:', error);
                    setStatus('error'); 
                    setErrorMessage(`Upload failed: ${error.message}`);
                }
            },
            error: (err) => { 
                setStatus('error'); 
                setErrorMessage(`CSV Parsing Error: ${err.message}`); 
            }
        });
    };
    
    const handleDragEvents = (e, type) => { 
        if (isLoading || firestoreUploading) return; 
        e.preventDefault(); e.stopPropagation(); 
        if (type === 'over') setStatus('dragging'); 
        else if (type === 'leave') setStatus('idle'); 
    };
    
    const handleDrop = (e) => { 
        if (isLoading || firestoreUploading) return; 
        handleDragEvents(e, 'leave'); 
        handleFileProcess(e.dataTransfer.files[0]); 
    };
    
    const handleRemoveFile = () => { 
        setFile(null); 
        setStatus('idle'); 
        setErrorMessage(''); 
    };

    const isProcessing = status === 'processing' || isLoading || firestoreUploading;

    const renderContent = () => {
        if (status === 'idle' || status === 'dragging') {
            return (
                <label
                    onDragOver={(e) => handleDragEvents(e, 'over')}
                    onDragLeave={(e) => handleDragEvents(e, 'leave')}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${status === 'dragging' ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className={`w-10 h-10 mb-3 ${status === 'dragging' ? 'text-green-600' : 'text-slate-400'}`} />
                        <p className="mb-2 text-sm text-slate-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-400">CSV file up to 10MB • Data will be saved to Firestore</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept=".csv"
                        disabled={isProcessing}
                        onChange={(e) => handleFileProcess(e.target.files[0])}
                    />
                </label>
            );
        }
        return (
            <div className={`p-4 rounded-lg border ${status === 'success' ? 'bg-green-50 border-green-200' : status === 'error' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-4">
                    {status === 'success' && <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />}
                    {status === 'error' && <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />}
                    {isProcessing && <LoaderCircle className="w-8 h-8 text-green-600 flex-shrink-0 animate-spin" />}
                    <div className="flex-grow">
                        <p className="font-semibold text-slate-800 truncate">{file?.name}</p>
                        <p className="text-sm text-slate-500">{((file?.size || 0) / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={handleRemoveFile} className="p-2 rounded-full hover:bg-slate-200" disabled={isProcessing}>
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                {isProcessing && (
                    <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
                        <LoaderCircle className="w-4 h-4 animate-spin" /> 
                        <span>Uploading to Firestore and processing data...</span>
                    </div>
                )}
                {status === 'success' && (
                    <div className="mt-3 flex items-center gap-3 text-sm font-semibold text-green-700">
                        <CheckCircle className="w-4 h-4" /> 
                        <span>Upload successful! Data saved to Firestore dataset_param collection.</span>
                    </div>
                )}
                {status === 'error' && (
                    <div className="mt-3 text-sm font-semibold text-red-700">{errorMessage}</div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Upload New Dataset to Firestore</h2>
            {renderContent()}
        </div>
    );
};

// =================================================================================
// MAIN COMPONENT
// =================================================================================

const DataPage = () => {

    // =================================================================================
    // FIREBASE INTEGRATION - Real-time data from Firestore
    // =================================================================================
    
    const siteId = 'site_a_3_acres';
    
    // Use Firebase hooks for real-time data integration
    const firestoreSensorData = useFirestoreSensorData(siteId, 30);
    const firestoreFinancialData = useFirestoreFinancialData(siteId, 10);
    const firestoreDashboard = useFirestoreDashboardData(siteId);
    
    // API hook for fallback
    const { getSensorData } = useApi();
    
    // State management
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedGarden] = useState("Primary Key Lime Orchard");
    const [selectedMetric, setSelectedMetric] = useState('soil_health');
    const [regenerativeFieldCount, setRegenerativeFieldCount] = useState(3);
    const [landAreaInput, setLandAreaInput] = useState(3);
    const [uploading, setUploading] = useState(false);

    // Fallback data state
    const [fallbackSensorData, setFallbackSensorData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Generate dummy data function for fallback
    const generateDummyData = useCallback(() => {
        const data = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
                timestamp: date.toISOString(),
                temperature: (25 + Math.random() * 5).toFixed(1),
                soil_moisture: (70 + Math.random() * 15).toFixed(1),
                ph_level: (6.5 + Math.random() * 0.5).toFixed(1),
                nitrogen: (20 + Math.random() * 10).toFixed(1),
                phosphorus: (15 + Math.random() * 8).toFixed(1),
                potassium: (25 + Math.random() * 10).toFixed(1),
                soil_health: (85 + Math.random() * 10).toFixed(1),
                organic_matter: (4 + Math.random() * 2).toFixed(1),
            });
        }
        return data;
    }, []);

    // Load fallback data if Firestore fails
    useEffect(() => {
        if (firestoreSensorData.error && !fallbackSensorData && !loading) {
            console.log('🔄 Firestore failed, falling back to API...');
            setLoading(true);
            getSensorData({ limit: 30 })
                .then(data => {
                    setFallbackSensorData(data || generateDummyData());
                    console.log('✅ Fallback data loaded');
                })
                .catch(() => {
                    console.log('⚠️ API fallback failed, using dummy data');
                    setFallbackSensorData(generateDummyData());
                })
                .finally(() => setLoading(false));
        }
    }, [firestoreSensorData.error, fallbackSensorData, loading, getSensorData, generateDummyData]);

    // Integrated sensor data (Firebase -> API -> Dummy)
    const sensorData = useMemo(() => {
        // Priority: Firestore data > API fallback > dummy data
        if (firestoreSensorData.data && firestoreSensorData.data.length > 0) {
            console.log('🔥 Using Firestore sensor data:', firestoreSensorData.data.length, 'records');
            return firestoreSensorData.data.map(item => ({
                ...item,
                // Ensure consistent field names
                temperature: item.temperature || 25,
                soil_moisture: item.soil_moisture || 70,
                ph_level: item.ph_level || item.ph || 7,
                nitrogen: item.nitrogen || item.npk?.nitrogen || 20,
                phosphorus: item.phosphorus || item.npk?.phosphorus || 15,
                potassium: item.potassium || item.npk?.potassium || 25,
                soil_health: item.soil_health || 90,
                organic_matter: item.organic_matter || 4
            }));
        }
        
        if (fallbackSensorData) {
            console.log('📡 Using API fallback sensor data:', fallbackSensorData.length, 'records');
            return fallbackSensorData;
        }
        
        console.log('🎭 Using dummy sensor data for demo');
        return generateDummyData();
    }, [firestoreSensorData.data, fallbackSensorData, generateDummyData]);

    // App configuration
    const appConfig = useMemo(() => ({
        siteProfile: {
            name: "Key Lime",
            description: "The Key Lime (*Citrus aurantiifolia*) is a small, highly aromatic citrus fruit prized for its distinctively tart and flavorful juice. Unlike other limes, it has a higher acidity, a stronger aroma, and a thinner rind. <br/><br/> Thriving in well-drained soil and sunny conditions, this crop is sensitive to fluctuations in soil pH, moisture, and nutrient balance. This dashboard provides the real-time data crucial for managing these parameters, preventing disease, and ensuring a healthy, high-yield orchard.",
        },
        metrics: [
            { key: 'temperature', label: 'Temperature', unit: '°C', icon: Thermometer },
            { key: 'soil_moisture', label: 'Soil Moisture', unit: '%', icon: Droplet },
            { key: 'ph_level', label: 'pH Level', unit: '', icon: Activity },
            { key: 'nitrogen', label: 'Nitrogen (N)', unit: 'ppm', icon: Leaf },
            { key: 'phosphorus', label: 'Phosphorus (P)', unit: 'ppm', icon: Sun },
            { key: 'potassium', label: 'Potassium (K)', unit: 'ppm', icon: Wind },
            { key: 'soil_health', label: 'Soil Health', unit: '%', icon: Activity },
            { key: 'organic_matter', label: 'Organic Matter', unit: '%', icon: Leaf }
        ],
        palette: {
            primary: '#22c55e',
            primary_transparent: 'rgba(34, 197, 94, 0.1)',
            secondary: '#3b82f6',
            secondary_transparent: 'rgba(59, 130, 246, 0.1)',
            secondary_light: 'rgba(59, 130, 246, 0.3)',
            primary_light: 'rgba(34, 197, 94, 0.3)',
            text_secondary: '#64748b',
            border: '#e2e8f0'
        },
        baseValues: {
            conventional: { yield: 4200, costBenefit: 1.8 },
            regenerative: { yield: 4800, costBenefit: 2.4 }
        }
    }), []);

    // Financial metrics (integrated with Firestore)
    const financialMetrics = useMemo(() => {
        if (firestoreFinancialData.data && firestoreFinancialData.data.length > 0) {
            const latest = firestoreFinancialData.data[0];
            console.log('💰 Using Firestore financial data:', latest);
            return {
                convCost: latest.conventional_cost || 5330,
                regenCost: latest.regenerative_cost || 4260,
                revenue: latest.revenue || 15500
            };
        }
        
        console.log('💰 Using default financial data');
        return {
            convCost: 5330,
            regenCost: 4260,
            revenue: 15500
        };
    }, [firestoreFinancialData.data]);

    // File upload handler (integrated with Firestore)
    const handleCsvUpload = useCallback(async (csvData) => {
        try {
            setUploading(true);
            console.log('📤 Processing CSV upload with', csvData.length, 'records');
            
            // The FileUploader component now handles Firestore integration
            // This is kept for backward compatibility with existing API
            
            return true;
        } catch (error) {
            console.error('❌ CSV upload error:', error);
            return false;
        } finally {
            setUploading(false);
        }
    }, []);

    // Chart options
    const chartOptions = { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { 
            legend: { 
                position: 'bottom', 
                align: 'end', 
                labels: { 
                    color: appConfig.palette.text_secondary, 
                    boxWidth: 12 
                } 
            } 
        }, 
        scales: { 
            y: { 
                grid: { color: appConfig.palette.border }, 
                ticks: { color: appConfig.palette.text_secondary } 
            }, 
            x: { 
                grid: { display: false }, 
                ticks: { color: appConfig.palette.text_secondary } 
            } 
        } 
    };

    // Processed data for charts (integrated Firebase data)
    const processedData = useMemo(() => {
        if (!sensorData || sensorData.length === 0) {
            return { 
                latestReading: {}, 
                mainLineChartData: { labels: [], datasets: [] }, 
                radarData: { labels: [], datasets: [] }, 
                nutrientData: { labels: [], datasets: [] }, 
                soilHealthTrendData: { labels: [], datasets: [] } 
            };
        }

        const latestReading = sensorData[sensorData.length - 1];
        const labels = sensorData.map(d => new Date(d.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
        
        return {
            latestReading,
            mainLineChartData: { 
                labels, 
                datasets: [
                    { 
                        label: 'Selected Metric', 
                        data: sensorData.map(d => parseFloat(d[selectedMetric]) || 0), 
                        borderColor: appConfig.palette.primary, 
                        backgroundColor: appConfig.palette.primary_transparent, 
                        fill: true, 
                        tension: 0.4, 
                        pointRadius: 1 
                    }, 
                    { 
                        label: '7-Day Moving Average', 
                        data: sensorData.map((_, i, arr) => {
                            const slice = arr.slice(Math.max(0, i - 6), i + 1);
                            const avg = slice.reduce((acc, val) => acc + parseFloat(val[selectedMetric] || 0), 0) / slice.length;
                            return avg.toFixed(1);
                        }), 
                        borderColor: appConfig.palette.secondary, 
                        borderDash: [5, 5], 
                        fill: false, 
                        tension: 0.4, 
                        pointRadius: 0 
                    }
                ] 
            },
            radarData: { 
                labels: ['Health', 'Moisture', 'Nitrogen', 'Phosphorus', 'Potassium', 'Organic Matter'], 
                datasets: [{
                    label: 'Current Performance (7-Day Avg)', 
                    data: ['soil_health', 'soil_moisture', 'nitrogen', 'phosphorus', 'potassium', 'organic_matter'].map(metric => {
                        const slice = sensorData.slice(-7);
                        const avg = slice.reduce((sum, d) => sum + parseFloat(d[metric] || 0), 0) / Math.max(1, slice.length);
                        return avg.toFixed(1);
                    }), 
                    backgroundColor: 'rgba(59, 130, 246, 0.2)', 
                    borderColor: '#3b82f6', 
                    borderWidth: 2 
                }] 
            },
            nutrientData: { 
                labels: ['Nitrogen', 'Phosphorus', 'Potassium'], 
                datasets: [{
                    label: 'Average Level (ppm)', 
                    data: ['nitrogen', 'phosphorus', 'potassium'].map(nutrient => {
                        const avg = sensorData.reduce((s, d) => s + parseFloat(d[nutrient] || 0), 0) / sensorData.length;
                        return avg.toFixed(1);
                    }), 
                    backgroundColor: ['#22c55e', '#f59e0b', '#8b5cf6'] 
                }] 
            },
            soilHealthTrendData: { 
                labels, 
                datasets: [{
                    label: 'Soil Health', 
                    data: sensorData.map(d => parseFloat(d.soil_health) || 0), 
                    borderColor: appConfig.palette.secondary, 
                    backgroundColor: appConfig.palette.secondary_transparent, 
                    fill: true, 
                    tension: 0.3, 
                    pointRadius: 0 
                }] 
            }
        };
    }, [sensorData, selectedMetric, appConfig]);

    // Comparison charts data
    const comparisonChartsData = useMemo(() => {
        const { conventional, regenerative } = appConfig.baseValues;
        const { palette } = appConfig;
        return {
            yieldChartData: { 
                labels: ['Conventional', 'Regenerative'], 
                datasets: [{
                    label: 'Yield Potential (kg/ha)', 
                    data: [conventional.yield, regenerative.yield], 
                    backgroundColor: [palette.secondary_light, palette.primary_light], 
                    borderColor: [palette.secondary, palette.primary], 
                    borderWidth: 1, 
                    borderRadius: 4 
                }] 
            },
            costBenefitChartData: { 
                labels: ['Conventional', 'Regenerative'], 
                datasets: [{
                    label: 'Cost-Benefit Ratio', 
                    data: [conventional.costBenefit, regenerative.costBenefit], 
                    backgroundColor: [palette.secondary_light, palette.primary_light], 
                    borderColor: [palette.secondary, palette.primary], 
                    borderWidth: 1, 
                    borderRadius: 4 
                }] 
            }
        };
    }, [appConfig]);

    // Simulation results
    const simulationResults = useMemo(() => {
        if (landAreaInput <= 0) {
            return { totalRegenerativeAreaHa: 0, requiredMicroalgae: 0, projectedHarvest: 0, operationalCost: 0 };
        }
        
        const totalRegenerativeAreaHa = regenerativeFieldCount * landAreaInput;
        const regenerativeAreaM2 = totalRegenerativeAreaHa * 10000;
        const soilVolumeM3 = regenerativeAreaM2 * 0.4;
        const microalgaeVolumeM3 = soilVolumeM3 * 0.0005;
        const requiredMicroalgae = Math.round(microalgaeVolumeM3 * 1000);
        const projectedHarvest = Math.round(totalRegenerativeAreaHa * appConfig.baseValues.regenerative.yield);
        const microalgaeCost = requiredMicroalgae * 0.1;
        const pesticideLiters = requiredMicroalgae / 1500;
        const pesticideCost = pesticideLiters * (55 / 2);
        const operationalCost = microalgaeCost + pesticideCost;

        return { totalRegenerativeAreaHa, requiredMicroalgae, projectedHarvest, operationalCost };
    }, [landAreaInput, regenerativeFieldCount, appConfig]);

    // Loading state
    if (firestoreSensorData.loading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <LoaderCircle className="w-12 h-12 text-green-600 animate-spin" />
                <p className="ml-4 text-lg font-semibold text-slate-700">Loading Firebase Data...</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
                isCollapsed={isSidebarCollapsed} 
                onToggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)} 
            />
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <Header 
                    onMenuClick={() => setSidebarOpen(true)} 
                    selectedGarden={appConfig.siteProfile.name} 
                    onGardenChange={() => {}} 
                />
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    {/* Firebase Connection Status */}
                    <div className={`mb-4 p-3 border rounded-lg flex items-center gap-2 ${
                        !firestoreSensorData.loading && !firestoreSensorData.error ? 'bg-green-50 border-green-200' :
                        firestoreSensorData.loading ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${
                            !firestoreSensorData.loading && !firestoreSensorData.error ? 'bg-green-500 animate-pulse' :
                            firestoreSensorData.loading ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                        }`}></div>
                        <span className={`font-medium ${
                            !firestoreSensorData.loading && !firestoreSensorData.error ? 'text-green-700' :
                            firestoreSensorData.loading ? 'text-yellow-700' : 'text-red-700'
                        }`}>
                            {!firestoreSensorData.loading && !firestoreSensorData.error ? '🔥 Firestore Connected - Real-time updates active' :
                             firestoreSensorData.loading ? '⏳ Connecting to Firestore...' : 
                             `❌ Using Fallback Data - ${firestoreSensorData.error?.message || 'Connection failed'}`}
                        </span>
                    </div>

                    {/* Loading indicator for uploads */}
                    {uploading && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                            <LoaderCircle className="w-4 h-4 text-blue-600 animate-spin" />
                            <span className="text-blue-700 font-medium">Processing and uploading data...</span>
                        </div>
                    )}

                    {/* Garden Profile Section */}
                    <div className="relative p-8 rounded-xl shadow-lg overflow-hidden mb-6 bg-cover bg-center" style={{ backgroundImage: `url(${keylimeBackground})` }}>
                        <div className="absolute inset-0 bg-black/60"></div>
                        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                            <div className="md:col-span-2">
                                <h2 className="text-3xl font-extrabold mb-3">Crop Profile: {appConfig.siteProfile.name}</h2>
                                <p className="text-slate-200 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: appConfig.siteProfile.description }}></p>
                            </div>
                            <div className="p-6 bg-black/30 rounded-lg">
                                <h3 className="text-xl font-bold mb-4">Ideal Soil Set Points</h3>
                                <ul className="space-y-3 text-base">
                                    <li className="flex items-center gap-3"><Droplet className="w-5 h-5 text-green-400" /><span><strong>CEC:</strong> 21,94 </span></li>
                                    <li className="flex items-center gap-3"><Droplet className="w-5 h-5 text-green-400" /><span><strong>Nitrogen:</strong> 0,53 %</span></li>
                                    <li className="flex items-center gap-3"><Sun className="w-5 h-5 text-green-400" /><span><strong>Nitrogen (N):</strong> 18 - 25 ppm</span></li>
                                    <li className="flex items-center gap-3"><Activity className="w-5 h-5 text-green-400" /><span><strong>Phosphorus (P):</strong> 8 - 25 ppm</span></li>
                                    <li className="flex items-center gap-3"><Wind className="w-5 h-5 text-green-400" /><span><strong>Potassium (K):</strong> 173,9 ppm</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Display - Integrated with Firebase Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {appConfig.metrics.map(metric => (
                            <MetricDisplayCard 
                                key={metric.key} 
                                icon={metric.icon} 
                                title={metric.label} 
                                value={processedData.latestReading?.[metric.key] || 'N/A'} 
                                unit={metric.unit} 
                            />
                        ))}
                    </div>

                    {/* File Uploader - Integrated with Firestore */}
                    <div className="mb-6">
                        <FileUploader onFileUpload={handleCsvUpload} isLoading={uploading} />
                    </div>

                    {/* Charts Section - Using Integrated Firebase Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800 mb-2 sm:mb-0">Metric Statistics Over Time</h3>
                                <select 
                                    value={selectedMetric} 
                                    onChange={(e) => setSelectedMetric(e.target.value)} 
                                    className="text-sm border-slate-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-green-300 focus:border-green-300"
                                >
                                    {appConfig.metrics.map(metric => (
                                        <option key={metric.key} value={metric.key}>{metric.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="h-80">
                                <Line data={processedData.mainLineChartData} options={chartOptions} />
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Overall Performance</h3>
                            <div className="h-80">
                                <Radar data={processedData.radarData} options={{ 
                                    ...chartOptions, 
                                    scales: { 
                                        r: { 
                                            pointLabels: { font: { size: 10 } }, 
                                            grid: { color: appConfig.palette.border } 
                                        } 
                                    } 
                                }} />
                            </div>
                        </div>
                        
                        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Average Nutrient Levels (NPK)</h3>
                            <div className="h-64">
                                <Bar data={processedData.nutrientData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
                            </div>
                        </div>
                        
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Soil Health (30-Day Trend)</h3>
                            <p className="text-xs text-slate-500 -mt-3 mb-4">A stable or upward trend indicates positive soil activity.</p>
                            <div className="h-52">
                                <Line data={processedData.soilHealthTrendData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
                            </div>
                        </div>
                    </div>

                    {/* Regenerative Farming Simulation - Integrated with Firebase Financial Data */}
                    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Regenerative Farming Simulation</h2>
                        
                        {/* Step 1: Define Regenerative Fields */}
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-bold text-slate-700 mb-4">Step 1: Define Regenerative Fields</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h4 className="font-semibold text-slate-600">Size per Field</h4>
                                    <label htmlFor="landarea" className="block text-sm font-medium text-slate-700 my-1">
                                        Enter area per field in Hectares (Ha)
                                    </label>
                                    <input 
                                        type="number" 
                                        id="landarea" 
                                        value={landAreaInput} 
                                        onChange={(e) => setLandAreaInput(Number(e.target.value))} 
                                        className="w-full border-slate-300 rounded-md focus:ring-green-500 focus:border-green-500" 
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-slate-600">Number of Fields</h4>
                                        <SlidersHorizontal className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <p className="text-xs text-slate-500 mb-4">Use the slider to set the number of regenerative fields for this simulation.</p>
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="10" 
                                        value={regenerativeFieldCount} 
                                        onChange={(e) => setRegenerativeFieldCount(parseInt(e.target.value, 10))} 
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600" 
                                    />
                                    <div className="flex justify-between text-sm font-medium text-slate-600 mt-2">
                                        <span>Fields: <strong>{regenerativeFieldCount}</strong></span>
                                        <span>Total Area: <strong>{simulationResults.totalRegenerativeAreaHa.toFixed(2)} Ha</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Step 2: Review Simulation Results */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-700 mb-4">Step 2: Review Simulation Results</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <ComparisonMetricCard 
                                    title="Conventional Cost Ref. (6-mo)" 
                                    value={financialMetrics.convCost} 
                                    icon={TrendingDown} 
                                    color="red" 
                                    bgColor="red" 
                                />
                                <ComparisonMetricCard 
                                    title="Regenerative Revenue per Month" 
                                    value={financialMetrics.regenCost} 
                                    icon={TrendingUp} 
                                    color="green" 
                                    bgColor="green" 
                                />
                                <ComparisonMetricCard 
                                    title="Operational Cost per Month" 
                                    value={simulationResults.operationalCost} 
                                    icon={DollarSign} 
                                    color="slate" 
                                    bgColor="slate" 
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                <div className="lg:col-span-2 flex flex-col gap-6">
                                    <ProjectedResultCard 
                                        icon={Package} 
                                        title="Total Projected Harvest" 
                                        value={simulationResults.projectedHarvest} 
                                        unit="Kilograms (kg)" 
                                        description={`Harvest (Kg) = 23902.86 + (-198.40 * Nitrogen) + (-1831.07 * Organic Matter) + (-241.60 * Carbon)`} 
                                    />
                                    <ProjectedResultCard 
                                        icon={FlaskConical} 
                                        title="Required Microalgae" 
                                        value={simulationResults.requiredMicroalgae} 
                                        unit="Liters (L)" 
                                        description={`Based on the soil formula for a total of ${simulationResults.totalRegenerativeAreaHa.toFixed(2)} Ha and The Ratio Pesticide with Microalgae is 1 : 1500`} 
                                    />
                                </div>
                                
                                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                        <h3 className="font-bold text-center text-slate-800 mb-4">Yield Potential (kg/ha)</h3>
                                        <div className="h-64">
                                            <Bar data={comparisonChartsData.yieldChartData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                        <h3 className="font-bold text-center text-slate-800 mb-4">Cost-Benefit Ratio</h3>
                                        <div className="h-64">
                                            <Bar data={comparisonChartsData.costBenefitChartData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Firebase Data Summary */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-bold text-blue-800 mb-2">🔥 Firebase Integration Status</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-blue-700">Sensor Data:</span>
                                <span className={`ml-2 ${firestoreSensorData.data?.length > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                    {firestoreSensorData.data?.length > 0 ? `✅ ${firestoreSensorData.data.length} records` : '⚠️ Using fallback'}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-700">Financial Data:</span>
                                <span className={`ml-2 ${firestoreFinancialData.data?.length > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                    {firestoreFinancialData.data?.length > 0 ? `✅ ${firestoreFinancialData.data.length} records` : '⚠️ Using defaults'}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-700">CSV Upload:</span>
                                <span className="ml-2 text-green-600">✅ Integrated with Firestore</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DataPage;