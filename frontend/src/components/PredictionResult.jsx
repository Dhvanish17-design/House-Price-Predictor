import React, { useState } from 'react';
import { IndianRupee, TrendingUp, ShieldCheck, Info, History, BookmarkPlus, MapPin, Maximize, Activity } from 'lucide-react';
import MapComponent from './MapComponent';
import PriceBreakdown from './PriceBreakdown';
import AISuggestions from './AISuggestions';
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from 'recharts';

const PredictionResult = ({ prediction, loading, query, onSave }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // ... animation logic ...
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  if (!prediction && !loading) {
    return (
      <div className="h-full min-h-[300px] glass rounded-3xl p-8 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <IndianRupee size={32} className="text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-500 mb-2">Awaiting Details</h3>
        <p className="text-slate-400">Fill in the property specifics to get an AI-powered accurate estimate.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full min-h-[300px] glass rounded-3xl p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-sky-600 animate-pulse">Running Random Forest Model...</p>
      </div>
    );
  }

  // Calculate Ratios for Gauge
  const baseValue = prediction.breakdown.find(b => b.label.includes("Base"))?.value || 0;
  const locationValue = prediction.breakdown.find(b => b.label.includes("Location"))?.value || 0;
  const totalValue = baseValue + locationValue;
  const locationPercentage = Math.round((locationValue / (totalValue || 1)) * 100);

  const gaugeData = [
    { name: 'Base', value: 100, fill: '#1e293b' },
    { name: 'Location', value: locationPercentage, fill: '#38bdf8' }
  ];

  return (
    <div className="flex flex-col space-y-8 w-full">
      {/* Top Section: Main Card */}
      <div 
        className="perspective-1000 w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="glass-dark rounded-3xl p-8 transform-preserve-3d transition-transform duration-200 ease-out relative overflow-hidden text-white w-full border border-slate-700/50 shadow-2xl backdrop-blur-xl"
          style={{ transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
        >
          {/* Glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-500/20 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="relative z-10" style={{ transform: 'translateZ(30px)' }}>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sky-300 font-medium tracking-wider text-sm mb-1 uppercase">Predicted Value</p>
                <h2 className="text-4xl lg:text-5xl font-bold flex items-center text-glow">
                  ₹ {prediction.prediction} <span className="text-2xl ml-2 text-sky-200 font-normal">Lakhs</span>
                </h2>
              </div>
              <button 
                onClick={onSave}
                className="p-3 bg-slate-800/80 hover:bg-emerald-500/80 rounded-2xl border border-slate-700 hover:border-emerald-400 transition-colors cursor-pointer group"
                title="Bookmark this deal"
              >
                <BookmarkPlus size={24} className="text-slate-300 group-hover:text-white" />
              </button>
            </div>

            {/* Property Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center text-slate-400 mb-1">
                  <Maximize size={14} className="mr-2" />
                  <span className="text-xs uppercase tracking-wider">Area Size</span>
                </div>
                <p className="text-lg font-semibold text-slate-100">{query?.sqft} SqFt</p>
              </div>
              
              <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center text-slate-400 mb-1">
                  <Activity size={14} className="mr-2" />
                  <span className="text-xs uppercase tracking-wider">Type</span>
                </div>
                <p className="text-lg font-semibold text-slate-100 capitalize">{query?.property_type || "Apartment"}</p>
              </div>

              <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm sm:col-span-2">
                <div className="flex items-center text-slate-400 mb-1">
                  <MapPin size={14} className="mr-2" />
                  <span className="text-xs uppercase tracking-wider">Location</span>
                </div>
                <p className="text-lg font-semibold text-slate-100">{query?.area}, {query?.city}</p>
              </div>
            </div>

            {/* Small Visual Chart/Bar */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400 font-medium">Expected Range</span>
                <span className="text-sm font-semibold text-sky-300 flex items-center">
                  <TrendingUp size={14} className="mr-1" />
                  High Potential
                </span>
              </div>
              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-400">₹{prediction.price_range[0]} L</span>
                <span className="text-xs text-slate-400">₹{prediction.price_range[1]} L</span>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-700/50 pt-4 flex justify-between items-center">
              <div className="flex items-center text-emerald-400 text-sm font-medium">
                <ShieldCheck size={16} className="mr-2" />
                93.0% Accuracy
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">
                Random Forest
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Middle Section: Map & Why (Integrated) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 h-full">
           <div className="h-full mt-0!">
              <MapComponent city={query?.city} area={query?.area} />
           </div>
        </div>

        <div className="lg:col-span-7">
          <div className="glass-dark rounded-3xl p-8 border border-slate-700/50 text-slate-200 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-semibold flex items-center">
                  <Info size={20} className="mr-2 text-indigo-400" />
                  Why this price?
                </h3>
                <div className="flex items-center gap-3 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loc. Premium</span>
                  <span className="text-sm font-bold text-sky-400">{locationPercentage}%</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
                {/* Radial Gauge */}
                <div className="w-24 h-24 shrink-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={10} data={gaugeData} startAngle={90} endAngle={450}>
                      <RadialBar minAngle={15} background dataKey="value" cornerRadius={5} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xs font-bold leading-none">{locationPercentage}%</span>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                   <div className="flex items-start">
                      <div className="p-1.5 bg-sky-500/20 rounded shrink-0 mr-3 mt-1">
                        <MapPin size={14} className="text-sky-400" />
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed"><span className="text-slate-200 font-medium">Location Premium:</span> Strong demand context in {query?.city}.</p>
                   </div>
                   <div className="flex items-start">
                      <div className="p-1.5 bg-indigo-500/20 rounded shrink-0 mr-3 mt-1">
                        <Maximize size={14} className="text-indigo-400" />
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed"><span className="text-slate-200 font-medium">SF Factor:</span> Optimized {query?.sqft} SqFt distribution.</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 italic">
                Our model blends real-time Gujarat market indices with historical neighborhood volatility to arrive at this valuation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Breakdown (Price Construction Matrix) */}
      <PriceBreakdown breakdown={prediction.breakdown} />

      {/* Historical Market Board (Marketplace Comparables) */}
      {prediction.recent_comps && prediction.recent_comps.length > 0 && (
        <div className="glass-dark rounded-3xl p-6 lg:p-8 border border-slate-700/50 text-white shadow-xl">
          <h3 className="text-sm font-bold flex items-center mb-6 text-slate-400 uppercase tracking-[0.2em]">
            <History size={18} className="mr-2 text-sky-400" />
            Marketplace Comparables
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prediction.recent_comps.map((comp, i) => (
              <div key={i} className="flex flex-col bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-sky-500/50 transition-colors group cursor-pointer">
                <div className="h-24 bg-gradient-to-br from-slate-700 to-slate-800 w-full relative overflow-hidden flex items-center justify-center">
                  <History className="text-slate-600 group-hover:text-sky-400 transition-colors" size={24} />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-lg text-sky-300">₹{comp.price} L</p>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-slate-700 text-slate-300">Sold</span>
                  </div>
                  <p className="font-medium text-slate-200 line-clamp-1 text-sm">{comp.prop_type} in {query?.area}</p>
                  <p className="text-xs text-slate-400 mt-1">{comp.sqft} SqFt • Sold {comp.months_ago} {comp.months_ago === 1 ? 'm' : 'mos'} ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions (Full Width for Insights) */}
      <div className="w-full">
        <AISuggestions insights={prediction.insights} />
      </div>

    </div>
  );
}

export default PredictionResult;
