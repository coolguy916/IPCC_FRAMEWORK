import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, ChevronDown } from 'lucide-react';

// Fungsi bantuan untuk mendapatkan salam berdasarkan waktu
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const Header = ({ 
  onMenuClick, 
  selectedGarden = "Katsuri Lime", 
  gardens = [],
  notifications = 15,
  user = { initials: "VG", name: "Admin" }
}) => {
  const navigate = useNavigate();
  const greeting = getGreeting();

  const handleGardenChange = (garden) => {
    // Navigasi akan tetap sama, sesuaikan path jika perlu
    if (garden === 'Key Lime') {
      navigate('/overview'); // Atau path yang sesuai
    } else if (garden === 'Katsuri Lime') {
      navigate('/overview'); // Atau path yang sesuai
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Sisi Kiri: Tombol Menu dan Salam */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick} 
            className="lg:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {greeting}, <span className="font-semibold text-green-600">{user.name}</span>!
            </h1>
            <p className="hidden md:block text-sm text-slate-500">
              Welcome to your agricultural command center.
            </p>
          </div>
        </div>
        
        {/* Sisi Kanan: Pemilih Kebun dan Aksi Pengguna */}
        <div className="flex items-center gap-4">
          {/* [REDESIGNED] Garden Selector */}
          <div className="relative">
            <select 
              className="appearance-none bg-transparent border border-slate-300 rounded-lg pl-4 pr-10 py-2 text-slate-700 text-sm font-semibold hover:border-slate-400 focus:ring-2 focus:ring-green-200 focus:outline-none focus:border-green-500 transition-all cursor-pointer"
              value={selectedGarden}
              onChange={(e) => handleGardenChange(e.target.value)}
            >
              {gardens.length > 0 ? gardens.map((garden) => (
                <option key={garden} value={garden}>{garden}</option>
              )) : (
                <>
                  <option>Katsuri Lime</option>
                  <option>Key Lime</option>
                </>
              )}
            </select>
            <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Tombol Notifikasi */}
            <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Notifications">
              <Bell className="w-6 h-6 text-slate-500" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications > 99 ? '99+' : notifications}
                </span>
              )}
            </button>
            {/* Avatar Pengguna */}
            <button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-offset-white ring-transparent hover:ring-green-200 transition-all" aria-label="User profile">
              <span className="text-white text-sm font-bold">{user.initials}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;