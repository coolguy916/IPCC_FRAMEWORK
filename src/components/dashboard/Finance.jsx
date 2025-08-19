import { useEffect, useState } from 'react';
import Sidebar from '../layout/sidebar';
import DigitalClock from '../ui/DigitalClock';
import SearchBar from '../ui/SearchBar';
import NumericDisplay from '../ui/NumericDisplay';
import { LineChart, BarChart, PieChart, GaugeChart } from '../charts/chartSetup';
import '../../styles/main.css';

// Aset Ikon (HamburgerIcon, SearchIcon, ClockIcon) tetap sama, tidak perlu diubah.
// ... (salin komponen ikon dari kode asli Anda di sini)

const HamburgerIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="hamburger-icon"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355ZM18.75 16C18.75 16.4142 18.4142 16.75 18 16.75H6C5.58579 16.75 5.25 16.4142 5.25 16C5.25 15.5858 5.58579 15.25 6 15.25H18C18.4142 15.25 18.75 15.5858 18.75 16ZM18 12.75C18.4142 12.75 18.75 12.4142 18.75 12C18.75 11.5858 18.4142 11.25 18 11.25H6C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75H18ZM18.75 8C18.75 8.41421 18.4142 8.75 18 8.75H6C5.58579 8.75 5.25 8.41421 5.25 8C5.25 7.58579 5.58579 7.25 6 7.25H18C18.4142 7.25 18.75 7.58579 18.75 8Z"
      fill="currentColor"
    />
  </svg>
);

const SearchIcon = () => (
    <svg width="20" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon"><path d="M15.5 14H14.71L14.43 13.73C15.63 12.33 16.25 10.42 15.91 8.39C15.44 5.61 13.12 3.39 10.32 3.05C6.09 2.53 2.53 6.09 3.05 10.32C3.39 13.12 5.61 15.44 8.39 15.91C10.42 16.25 12.33 15.63 13.73 14.43L14 14.71V15.5L18.25 19.75C18.66 20.16 19.33 20.16 19.74 19.75C20.15 19.34 20.15 18.67 19.74 18.26L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor" /></svg>
);

const ClockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="clock-icon"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM15.07 11.25L14.17 12.17C13.45 12.89 13 13.5 13 15H11V14.5C11 13.39 11.45 12.39 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.89 13.1 7 12 7C10.9 7 10 7.89 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z" fill="currentColor" /></svg>
);

// Header component
const Header = ({ children, onToggleSidebar, sidebarOpen }) => {
  return (
    <header className={`header d-flex justify-content-between align-items-center ${sidebarOpen ? '' : 'expanded'}`}>
      <div className="d-flex align-items-center gap-3">
        <button className="desktop-toggle" onClick={onToggleSidebar}>
          <HamburgerIcon />
        </button>
        {children}
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="search-button">
          <SearchIcon />
          <SearchBar />
        </div>
        <div className="clock-button">
          <ClockIcon />
          <DigitalClock />
        </div>
      </div>
    </header>
  );
};


const RegenerativeFarmingDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // State untuk pilihan chart
  const [soilYieldChartType, setSoilYieldChartType] = useState('soil_health');
  const [costChartType, setCostChartType] = useState('monthly_comparison');
  const [esgChartType, setEsgChartType] = useState('environmental');
  const [simulationChartType, setSimulationChartType] = useState('market_fluctuation');

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const handleNavClick = () => { if (isMobile) closeSidebar(); };

  // === FUNGSI PENGHASIL DATA DINAMIS SESUAI STUDI KASUS ===

  const getSoilAndYieldData = (chartType) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    switch(chartType) {
      case 'soil_health':
        return {
          labels: months,
          datasets: [
            {
              label: 'Nitrogen Tanah (%)',
              data: [0.09, 0.10, 0.11, 0.13, 0.15, 0.18, 0.22, 0.25, 0.28, 0.31, 0.34, 0.38],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4, fill: true,
            },
            {
              label: 'Bahan Organik (%)',
              data: [5.04, 5.08, 5.12, 5.18, 5.25, 5.35, 5.45, 5.55, 5.65, 5.75, 5.85, 5.95],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4, fill: true,
            },
             {
              label: 'Karbon Tanah (%)',
              data: [4.16, 4.20, 4.25, 4.30, 4.38, 4.45, 4.55, 4.65, 4.75, 4.85, 4.95, 5.05],
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              tension: 0.4, fill: true,
            }
          ]
        };
      case 'yield_trend':
        return {
          labels: months,
          datasets: [
            {
              label: 'Hasil Panen Kualitas A (Ton)',
              data: [8, 8.2, 8.5, 8.8, 9.2, 9.5, 10.1, 10.5, 11, 11.5, 12, 12.8],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4, fill: true,
            },
            {
              label: 'Hasil Panen Kualitas B (Ton)',
              data: [15, 14.8, 14.5, 14, 13.5, 13, 12.5, 12, 11.5, 11, 10.5, 10],
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              tension: 0.4, fill: true,
            }
          ]
        };
      default: return { labels: [], datasets: [] };
    }
  };

  const getCostData = (chartType) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    switch(chartType) {
      case 'monthly_comparison':
        return {
          labels: months,
          datasets: [
            {
              label: 'Biaya Konvensional (Juta Rp)',
              data: [25, 26, 25, 27, 26, 28],
              backgroundColor: '#ef4444',
              borderRadius: 6,
            },
            {
              label: 'Biaya Regeneratif (Juta Rp)',
              data: [30, 25, 22, 20, 19, 18],
              backgroundColor: '#10b981',
              borderRadius: 6,
            }
          ]
        };
      case 'input_breakdown':
        return {
          labels: ['Pupuk Kimia', 'Pestisida', 'Agen Regenerasi', 'Tenaga Kerja'],
          datasets: [
            {
              label: 'Biaya Konvensional (Juta Rp)',
              data: [15, 8, 0, 5],
              backgroundColor: '#ef4444',
            },
            {
              label: 'Biaya Regeneratif (Juta Rp)',
              data: [5, 2, 8, 4],
              backgroundColor: '#10b981',
            }
          ]
        };
      default: return { labels: [], datasets: [] };
    }
  };

  const getEsgData = (chartType) => {
    switch(chartType) {
      case 'environmental':
        return {
          labels: ['Kesehatan Tanah', 'Kualitas Air', 'Sekuestrasi Karbon', 'Keanekaragaman Hayati'],
          datasets: [{ label: 'Skor Saat Ini (%)', data: [85, 78, 82, 75], backgroundColor: '#10b981' }]
        };
      case 'social_governance':
        return {
          labels: ['Kesejahteraan Pekerja', 'Keterlibatan Komunitas', 'Transparansi Rantai Pasok'],
          datasets: [{ label: 'Skor Saat Ini (%)', data: [88, 80, 76], backgroundColor: '#3b82f6' }]
        };
      case 'esg_forecast':
        return {
          labels: ['Lingkungan (E)', 'Sosial (S)', 'Tata Kelola (G)'],
          datasets: [
            {
              label: 'Skor ESG Saat Ini',
              data: [81, 84, 78],
              backgroundColor: '#6b7280',
            },
            {
              label: 'Proyeksi Skor ESG (1 Tahun)',
              data: [88, 87, 82],
              backgroundColor: '#10b981',
            }
          ]
        };
      default: return { labels: [], datasets: [] };
    }
  };

  const getSimulationData = (chartType) => {
    switch(chartType) {
      case 'market_fluctuation':
        return {
          labels: ['Harga Jual -20%', 'Harga Jual -10%', 'Harga Jual +10%', 'Harga Jual +20%'],
          datasets: [
            { label: 'Dampak Profit Konvensional (%)', data: [-45, -22, 22, 45], backgroundColor: '#ef4444' },
            { label: 'Dampak Profit Regeneratif (%)', data: [-30, -15, 25, 50], backgroundColor: '#10b981' },
          ]
        };
      case 'climate_scenario':
        return {
          labels: ['Kekeringan Ekstrem', 'Curah Hujan Berlebih'],
          datasets: [
            { label: 'Dampak Hasil Panen Konvensional (%)', data: [-50, -35], backgroundColor: '#ef4444' },
            { label: 'Dampak Hasil Panen Regeneratif (%)', data: [-20, -15], backgroundColor: '#10b981' },
          ]
        };
      default: return { labels: [], datasets: [] };
    }
  };

  const harvestGradeData = {
    labels: ['Kualitas A', 'Kualitas B', 'Kualitas C'],
    datasets: [{
      data: [55, 35, 10],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0,
    }]
  };

  return (
    <div>
      {isMobile && <button className="mobile-toggle" onClick={toggleSidebar}><HamburgerIcon /></button>}
      {sidebarOpen && isMobile && <div className="sidebar-overlay show" onClick={closeSidebar}></div>}
      <Sidebar isOpen={sidebarOpen} onNavClick={handleNavClick} />

      <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen}>
          <h1 id="pageTitle" className="h3 text-dark mb-0"><strong>Dasbor Pertanian Regeneratif</strong></h1>
        </Header>

        <div className="content" style={{ padding: '1.5rem' }}>
          {/* Baris KPI Cards */}
          <div className="row g-3 mb-4">
            <div className="col-lg-3 col-md-6">
              <NumericDisplay id="soilNitrogen" value={0.38} label="Tingkat Nitrogen Tanah" iconClass="fas fa-flask" isPercentage={true} />
            </div>
            <div className="col-lg-3 col-md-6">
              <NumericDisplay id="costSaving" value={35} label="Penghematan Biaya Regeneratif" iconClass="fas fa-piggy-bank" isPercentage={true} />
            </div>
            <div className="col-lg-3 col-md-6">
              <NumericDisplay id="yieldIncrease" value={18} label="Peningkatan Hasil Panen (Kualitas A)" iconClass="fas fa-chart-line" isPercentage={true} />
            </div>
            <div className="col-lg-3 col-md-6">
              <NumericDisplay id="eutrophication" value={25} label="Reduksi Potensi Eutrofikasi" iconClass="fas fa-water" isPercentage={true} />
            </div>
          </div>

          {/* Baris Tren Kesehatan Tanah & Hasil Panen */}
          <div className="row g-3 mb-4">
            <div className="col-12">
              <div className="chart-container" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px' }}>
                <div className="chart-header">
                  <h3>Tren Kesehatan Tanah & Hasil Panen</h3>
                  <select className="chart-selector form-select" value={soilYieldChartType} onChange={(e) => setSoilYieldChartType(e.target.value)}>
                    <option value="soil_health">Metrik Kesehatan Tanah</option>
                    <option value="yield_trend">Tren Hasil Panen</option>
                  </select>
                </div>
                <div style={{ height: '400px', padding: '1rem', overflowX: 'auto' }}>
                  <LineChart data={getSoilAndYieldData(soilYieldChartType)} height={400} />
                </div>
              </div>
            </div>
          </div>

          {/* Baris Perbandingan Biaya & Kualitas Panen */}
          <div className="row g-3 mb-4">
            <div className="col-lg-8">
              <div className="chart-container h-100" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px' }}>
                <div className="chart-header">
                  <h3>Perbandingan Biaya Operasional</h3>
                  <select className="chart-selector form-select" value={costChartType} onChange={(e) => setCostChartType(e.target.value)}>
                    <option value="monthly_comparison">Perbandingan Bulanan</option>
                    <option value="input_breakdown">Rincian Biaya Input</option>
                  </select>
                </div>
                <div style={{ height: '360px', padding: '1rem' }}>
                  <BarChart data={getCostData(costChartType)} height={360} />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="chart-container h-100" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px' }}>
                <h3>Distribusi Kualitas Hasil Panen</h3>
                <div style={{ height: '360px', padding: '1rem' }}>
                  <PieChart data={harvestGradeData} height={360} showLegend={true} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Baris Kinerja & Proyeksi ESG */}
          <div className="row g-3 mb-4">
            <div className="col-12">
               <div className="chart-container" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px' }}>
                <div className="chart-header">
                  <h3>Kinerja & Proyeksi ESG</h3>
                  <select className="chart-selector form-select" value={esgChartType} onChange={(e) => setEsgChartType(e.target.value)}>
                    <option value="environmental">Metrik Lingkungan</option>
                    <option value="social_governance">Metrik Sosial & Tata Kelola</option>
                    <option value="esg_forecast">Proyeksi Skor ESG</option>
                  </select>
                </div>
                <div style={{ height: '420px', padding: '1rem' }}>
                  <BarChart data={getEsgData(esgChartType)} height={420} />
                </div>
              </div>
            </div>
          </div>

          {/* Baris Dampak Lingkungan & Skor Kesehatan Tanah */}
          <div className="row g-3 mb-4">
            <div className="col-lg-8">
              <div className="chart-container h-100" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px' }}>
                <div className="chart-header">
                  <h3>Monitoring Dampak Lingkungan</h3>
                </div>
                <div style={{ height: '360px', padding: '1rem' }}>
                   <LineChart 
                    data={{
                      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                      datasets: [
                        {
                          label: 'Potensi Eutrofikasi (Indeks Runoff N)',
                          data: [85, 72, 65, 58],
                          borderColor: '#ef4444',
                          tension: 0.4, fill: true,
                        },
                        {
                          label: 'Indeks Kualitas Air',
                          data: [70, 75, 82, 88],
                          borderColor: '#3b82f6',
                          tension: 0.4, fill: true,
                        }
                      ]
                    }}
                    height={360}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="chart-container h-100 d-flex flex-column" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px' }}>
                <h3 style={{ textAlign: 'center' }}>Skor Kesehatan Tanah Keseluruhan</h3>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                  <GaugeChart value={85} maxValue={100} unit="%" height={280} />
                </div>
              </div>
            </div>
          </div>
          
           {/* Baris Simulasi & Analisis Skenario */}
          <div className="row g-3 mb-4">
             <div className="col-12">
               <div className="chart-container" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px' }}>
                <div className="chart-header">
                  <h3>Simulasi & Analisis Skenario</h3>
                  <select className="chart-selector form-select" value={simulationChartType} onChange={(e) => setSimulationChartType(e.target.value)}>
                    <option value="market_fluctuation">Fluktuasi Harga Pasar</option>
                    <option value="climate_scenario">Skenario Iklim</option>
                  </select>
                </div>
                <div style={{ height: '420px', padding: '1rem' }}>
                  <BarChart data={getSimulationData(simulationChartType)} height={420} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Baris Ringkasan & Aksi */}
          <div className="row g-3">
            <div className="col-12">
              <div className="chart-container" style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '12px' }}>
                <div className="row g-4">
                  <div className="col-lg-8">
                    <h3>Ringkasan Analitik & Wawasan</h3>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <h5>Performa Lahan</h5>
                        <p>Praktik regeneratif berhasil meningkatkan nitrogen tanah dari kurang 0.10% menjadi 0.38%. Hal ini berkorelasi langsung dengan peningkatan hasil panen Kualitas A sebesar 18% dan penurunan biaya operasional jangka panjang.</p>
                      </div>
                      <div className="col-md-6">
                        <h5>Kemajuan ESG</h5>
                        <p>Skor ESG menunjukkan performa kuat, terutama pada metrik lingkungan dengan skor kesehatan tanah 85. Proyeksi menunjukkan potensi peningkatan lebih lanjut, yang dapat membuka akses ke pendanaan hijau dan pasar premium.</p>
                      </div>
                      <div className="col-md-6">
                        <h5>Kelayakan Ekonomi</h5>
                        <p>Meskipun biaya awal sedikit lebih tinggi, pertanian regeneratif menunjukkan penghematan biaya hingga 35% dalam 6 bulan. Simulasi menunjukkan model ini lebih tangguh terhadap fluktuasi harga pasar dan dampak iklim.</p>
                      </div>
                       <div className="col-md-6">
                        <h5>Rekomendasi Aksi</h5>
                        <p>
                          1. Pertahankan pemantauan metrik tanah setiap bulan. <br/>
                          2. Optimalkan dosis agen regenerasi berdasarkan data terbaru. <br/>
                          3. Gunakan data ESG untuk laporan keberlanjutan kepada pemangku kepentingan.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 d-flex flex-column gap-3">
                      <button className="btn btn-primary">Unduh Laporan Komprehensif</button>
                      <button className="btn btn-secondary">Ekspor Data ke CSV</button>
                      <button className="btn btn-outline-primary">Atur Laporan Otomatis</button>
                      <div className="mt-auto">
                        <small className="text-muted">
                          Data terakhir diperbarui: {new Date().toLocaleString('id-ID')}
                        </small>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default RegenerativeFarmingDashboard;