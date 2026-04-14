import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, 
  Home, 
  ArrowRightLeft, 
  Bookmark, 
  Moon, 
  Sun,
  LayoutDashboard,
  Search,
  Sparkles
} from 'lucide-react';
import Lenis from '@studio-freight/lenis';

// Components
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import ComparisonView from './components/ComparisonView';
import SavedProperties from './components/SavedProperties';
import Footer from './components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '/api');

function App() {
  // Navigation and Theme State
  // Navigation and Theme State
  const [activeTab, setActiveTab] = useState('predictor'); // 'predictor', 'comparison', 'saved'
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Data State
  const [cities, setCities] = useState([]);
  const [nestedLocations, setNestedLocations] = useState({});
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);

  // Prediction State
  const [prediction, setPrediction] = useState(null);
  const [currentQuery, setCurrentQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (showLanding) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/locations`);
        setCities(response.data.cities);
        setNestedLocations(response.data.nested_locations || {});
        setPropertyTypes(response.data.property_types || []);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError("Failed to connect to the prediction engine. Please check if the backend is running on port 8000.");
      }
    };

    fetchData();
  }, [showLanding]);

  useEffect(() => {
    // Automatic Splash Screen Timeout
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => setShowLanding(false), 1500); // 1.5s Ultra-smooth fade duration
    }, 2800); // Slightly longer for the pure black cinematic feel

    return () => clearTimeout(timer);
  }, []);

  // Sync theme with HTML class and localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    // Cinematic Smooth Scrolling with Lenis
    const lenis = new Lenis({
      duration: 1.8, // Slightly longer duration for that heavy, premium feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 0.8, // Scroller feels slightly heavier/slower
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    setCurrentQuery(formData);
    
    setTimeout(() => {
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData);
      setPrediction(response.data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError("Analysis failed. Please try again with different parameters.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProperty = () => {
    if (!prediction || !currentQuery) return;

    const newSaved = {
      query: currentQuery,
      prediction: prediction,
      date: new Date().toISOString()
    };

    const updated = [newSaved, ...savedProperties];
    setSavedProperties(updated);
    localStorage.setItem('real_estate_saved', JSON.stringify(updated));
    alert("Property estimate saved to your vault!");
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${isDark ? 'bg-[#020617] text-slate-50' : 'bg-slate-50 text-slate-900'} font-['Outfit',sans-serif]`}>
      
      {/* Landing Splash Screen Overlay */}
      {showLanding && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-opacity duration-[1500ms] bg-black ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className={`relative z-10 text-center px-8 w-full max-w-4xl space-y-8 transition-all duration-[1500ms] ${isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} animate-in fade-in zoom-in duration-1000`}>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-[0.5em] shadow-2xl">
              <Sparkles size={14} className="text-sky-400" /> Premium AI Valuation
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight">
              Discover the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500 drop-shadow-sm">True Value</span> of Any Home <br/> 
              — <span className="italic font-serif font-normal opacity-90 text-slate-300">Instantly.</span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-indigo-600 mx-auto rounded-full mt-4"></div>
          </div>
        </div>
      )}

      {/* Main Website Content (Only rendered/visible after splash) */}
      {(!showLanding || isExiting) && (
        <div className={`transition-opacity duration-1000 ${showLanding ? 'opacity-0' : 'opacity-100'}`}>
          {/* Navigation Header */}
          <header className="sticky top-0 z-50 w-full bg-white/40 backdrop-blur-lg dark:bg-slate-900/60 border-b border-white/20 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Building2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 leading-none">
                SmartProp
              </h1>
              <span className="text-[10px] font-bold tracking-[0.2em] text-sky-500 dark:text-sky-400 uppercase">
                AI Predictor
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl border border-white/20 dark:border-slate-700/50">
            <button 
              onClick={() => setActiveTab('predictor')}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'predictor' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <Search size={16} /> Predict
            </button>
            <button 
              onClick={() => setActiveTab('comparison')}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'comparison' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <ArrowRightLeft size={16} /> Comparison
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'saved' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <Bookmark size={16} /> Vault
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-3 rounded-2xl bg-white/40 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all border border-white/50 dark:border-slate-700/50"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12 pb-28 md:pb-12 w-full overflow-x-hidden">
        
        {activeTab === 'predictor' && (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h2 className={`text-4xl lg:text-6xl font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Estimate Property Value with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-600">Precision.</span>
              </h2>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Enter your property details below to receive a high-confidence market valuation based on historical sales data and regional growth indices in Gujarat.
              </p>
            </div>

            {error && (
              <div className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center">
                {error}
              </div>
            )}

            {/* Application Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 sticky top-28">
                <PredictionForm 
                  cities={cities} 
                  nestedLocations={nestedLocations} 
                  propertyTypes={propertyTypes} 
                  onSubmit={handlePredict}
                  loading={loading}
                />
              </div>
              
              <div id="results-section" className="lg:col-span-7 w-full h-full">
                <PredictionResult 
                  prediction={prediction} 
                  loading={loading}
                  query={currentQuery}
                  onSave={handleSaveProperty}
                />
              </div>
            </div>

          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-12">
             <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Side-by-Side Comparison</h2>
                <p className="text-slate-500 dark:text-slate-400">Evaluate two different property scenarios simultaneously to optimize your investment decision.</p>
             </div>
             <ComparisonView 
                cities={cities} 
                nestedLocations={nestedLocations} 
                propertyTypes={propertyTypes} 
             />
          </div>
        )}

        {activeTab === 'saved' && (
          <SavedProperties 
            savedProperties={savedProperties} 
            setSavedProperties={setSavedProperties}
          />
        )}

      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-around items-center p-2">
          <button 
            onClick={() => { setActiveTab('predictor'); window.scrollTo(0,0); }}
            className={`flex flex-col items-center justify-center w-full py-2 ${activeTab === 'predictor' ? 'text-sky-500 font-bold' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'predictor' ? 'bg-sky-500/10' : ''}`}>
              <Search size={22} className={activeTab === 'predictor' ? "scale-110" : ""} />
            </div>
            <span className="text-[10px] mt-1">Predict</span>
          </button>
          <button 
            onClick={() => { setActiveTab('comparison'); window.scrollTo(0,0); }}
            className={`flex flex-col items-center justify-center w-full py-2 ${activeTab === 'comparison' ? 'text-indigo-500 font-bold' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'comparison' ? 'bg-indigo-500/10' : ''}`}>
              <ArrowRightLeft size={22} className={activeTab === 'comparison' ? "scale-110" : ""} />
            </div>
            <span className="text-[10px] mt-1">Compare</span>
          </button>
          <button 
            onClick={() => { setActiveTab('saved'); window.scrollTo(0,0); }}
            className={`flex flex-col items-center justify-center w-full py-2 ${activeTab === 'saved' ? 'text-emerald-500 font-bold' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'saved' ? 'bg-emerald-500/10' : ''}`}>
              <Bookmark size={22} className={activeTab === 'saved' ? "scale-110" : ""} />
            </div>
            <span className="text-[10px] mt-1">Vault</span>
          </button>
        </div>
      </nav>

      <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
