import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal } from 'lucide-react';

const API_URL = "https://ipa-boss.onrender.com";

const App = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- PROTECTION LOGIC ---
  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e) => e.preventDefault();
    // Disable shortcuts
    const handleKeyDown = (e) => {
      if (
        e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 67 || e.keyCode === 74)) || 
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Anti-Debugger loop
    const interval = setInterval(() => {
      (function() { return false; }).constructor('debugger').call();
    }, 1000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch(`${API_URL}/apps`);
        const data = await response.json();
        setApps(data);
      } catch (error) {
        console.error("Error fetching apps:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="min-h-screen antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-3">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl overflow-hidden shadow-lg ring-2 ring-white/10 group-hover:ring-amber-500 transition-all duration-300">
                <img 
                  src="https://i.pinimg.com/736x/b6/36/3a/b6363a1970cfeb3cd725eee9aab9d146.jpg" 
                  alt="Logo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300" 
                />
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tight uppercase">
                Irra <span className="text-amber-500">Ipa</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 font-bold text-xs tracking-widest">
              {['HOME', 'GAMES', 'LIBRARY', 'ABOUT', 'CONTACT'].map((item) => (
                <a key={item} href={`#${item}`} className="hover:text-amber-500 transition">
                  {item}
                </a>
              ))}
              <a href="#admin" className="px-4 py-2 rounded-lg border border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-black transition duration-300">
                ADMIN
              </a>
            </nav>

            {/* Mobile Toggle */}
            <button className="md:hidden text-amber-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-6 flex flex-col gap-4 border-t border-white/5 pt-4">
              {['HOME', 'GAMES', 'LIBRARY', 'ABOUT', 'CONTACT'].map((item) => (
                <a key={item} href="#" className="text-sm font-bold tracking-widest hover:text-amber-500">
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 relative overflow-hidden rounded-3xl h-[400px] flex items-end p-8 md:p-12 shadow-2xl">
          <img 
            src="https://ipaomtk.com/wp-content/uploads/2023/03/esign-ipa.jpg" 
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="boss-gradient text-black text-xs font-extrabold px-3 py-1 rounded-full uppercase mb-4 inline-block tracking-widest">
              Featured App
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none tracking-tighter">
              Esign <br /><span className="text-amber-500">IPA</span>
            </h1>
            <p className="text-gray-200 mb-6 text-lg font-medium">Esign IPA Signer install For iOS.</p>
            <a href="https://t.me/irra_11" className="btn-install px-12 py-4 rounded-2xl font-black text-xl inline-block uppercase tracking-wide">
              Buy
            </a>
          </div>
        </section>

        {/* Content Section */}
        <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
          <span className="w-2 h-8 boss-gradient rounded-full"></span>
          Trending IPA Library
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500 mb-4"></div>
              <p className="text-gray-500 font-bold loading-pulse uppercase tracking-widest text-xs">
                Connecting to Boss Library...
              </p>
            </div>
          ) : apps.length > 0 ? (
            apps.map((app, index) => (
              <div 
                key={index} 
                className="glass-card p-5 rounded-3xl flex items-center gap-5 relative cursor-pointer"
                onClick={() => window.location.href = app.download_url}
              >
                <img src={app.image} alt={app.title} className="w-20 h-20 rounded-2xl shadow-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{app.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{app.description}</p>
                  <p className="text-xs text-amber-500 mt-1 font-bold uppercase tracking-wider">{app.tag}</p>
                </div>
                <button className="btn-install px-4 py-2 rounded-xl text-sm font-black uppercase">
                  INSTALL
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center py-10 text-gray-500">Library Empty or Server Offline.</p>
          )}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/10 text-center text-gray-500 mt-10">
        <p className="text-white font-black text-2xl mb-4 tracking-tighter uppercase">
          IRRA <span className="text-amber-500">IPA</span>
        </p>
        <p className="text-xs max-w-xl mx-auto leading-relaxed">© 2026 IRRAIPA. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
