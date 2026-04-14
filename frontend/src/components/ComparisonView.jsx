import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, ArrowRightLeft, Maximize, Bath, Bed, Clock, MapPin, Map, Building, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis, CartesianGrid, Legend } from 'recharts';
import CityDropdown from './CityDropdown';

const API_BASE_URL = 'http://localhost:8000/api';

const ComparisonView = ({ cities = [], nestedLocations = {}, propertyTypes = [] }) => {
  const [prop1, setProp1] = useState({ city: '', area: '', property_type: '', sqft: 1000, bhk: 2, bath: 2, age: 5 });
  const [prop2, setProp2] = useState({ city: '', area: '', property_type: '', sqft: 1200, bhk: 3, bath: 2, age: 2 });
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const payload1 = { ...prop1, state: 'Gujarat' };
      const payload2 = { ...prop2, state: 'Gujarat' };
      const [res1, res2] = await Promise.all([
        axios.post(`${API_BASE_URL}/predict`, payload1),
        axios.post(`${API_BASE_URL}/predict`, payload2)
      ]);
      setResults({ p1: res1.data, p2: res2.data });
    } catch (err) {
      console.error(err);
      alert("Error comparing properties.");
    } finally {
      setLoading(false);
    }
  };

  const PropertyForm = ({ title, data, setData, colorTheme }) => {
    const handleCityChange = (e) => setData({ ...data, city: e.target.value, area: '' });
    
    return (
      <div className={`glass rounded-3xl p-6 relative overflow-hidden border-2 border-transparent hover:border-${colorTheme}-200 transition-all dark:hover:border-${colorTheme}-700`}>
        <h3 className={`text-xl font-bold mb-4 text-${colorTheme}-600 dark:text-${colorTheme}-400`}>{title}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <CityDropdown 
               value={data.city} 
               cities={cities} 
               onChange={handleCityChange} 
            />
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block flex items-center"><MapPin size={12} className="mr-1"/> Area</label>
              <select 
                value={data.area} 
                onChange={e => setData({...data, area: e.target.value})}
                disabled={!data.city}
                className={`w-full px-3 py-2 rounded-lg glass-input text-sm text-slate-800 dark:text-white appearance-none ${!data.city ? 'opacity-50' : ''}`}
              >
                <option value="" disabled>Area</option>
                {data.city && [...(nestedLocations[data.city] || [])].sort((a, b) => a.localeCompare(b)).map(area => (
                  <option key={area} value={area} className="text-slate-800 bg-white dark:bg-slate-800 dark:text-white">{area.charAt(0).toUpperCase() + area.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block flex items-center"><Building size={12} className="mr-1"/> Property Type</label>
              <select 
                value={data.property_type} 
                onChange={e => setData({...data, property_type: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg glass-input text-sm text-slate-800 dark:text-white appearance-none`}
              >
                <option value="" disabled>Select property type</option>
                {propertyTypes.map(pt => <option key={pt} value={pt} className="text-slate-800 bg-white dark:bg-slate-800 dark:text-white">{pt}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block flex items-center"><Maximize size={12} className="mr-1"/> SqFt</label>
              <input type="number" value={data.sqft} onChange={e => setData({...data, sqft: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg glass-input text-sm text-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block flex items-center"><Bed size={12} className="mr-1"/> BHK</label>
              <input type="number" value={data.bhk} onChange={e => setData({...data, bhk: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg glass-input text-sm text-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block flex items-center"><Bath size={12} className="mr-1"/> Bath</label>
              <input type="number" value={data.bath} onChange={e => setData({...data, bath: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg glass-input text-sm text-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block flex items-center"><Clock size={12} className="mr-1"/> Age</label>
              <input type="number" value={data.age} onChange={e => setData({...data, age: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg glass-input text-sm text-slate-800 dark:text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const isFormValid = prop1.city && prop1.area && prop1.property_type && prop2.city && prop2.area && prop2.property_type;

  const comparisonData = results ? [
    {
      name: 'Estimated Value (Lakhs)',
      PropertyA: results.p1.prediction,
      PropertyB: results.p2.prediction,
    },
    {
      name: 'Max Range boundary',
      PropertyA: results.p1.price_range[1],
      PropertyB: results.p2.price_range[1],
    }
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative">
        <PropertyForm title="Property A" data={prop1} setData={setProp1} colorTheme="sky" />
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-slate-700">
          <ArrowRightLeft className="text-slate-400 dark:text-slate-500" size={20} />
        </div>
        
        <PropertyForm title="Property B" data={prop2} setData={setProp2} colorTheme="indigo" />
      </div>

      <div className="flex justify-center">
        <button 
          onClick={handleCompare}
          disabled={loading || !isFormValid}
          className={`px-8 py-3 rounded-full flex items-center text-lg font-bold transition-all duration-300 shadow-lg
            ${loading || !isFormValid ? 'bg-slate-300 text-slate-500 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed shadow-none' : 'bg-sky-600 dark:bg-sky-600 text-white hover:bg-sky-700 dark:hover:bg-sky-500 hover:shadow-sky-500/30'}`}
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : <ArrowRightLeft className="mr-2" size={20} />}
          {loading ? 'Analyzing...' : 'Compare Insights'}
        </button>
      </div>

      {results && (
        <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-dark rounded-3xl p-6 text-white border-t-4 border-sky-400 relative overflow-hidden">
               {results.p1.prediction > results.p2.prediction && (
                  <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/30">
                    Premium
                  </div>
               )}
               <p className="text-sky-300 font-medium text-sm mb-1">Property A Value</p>
               <h2 className="text-4xl font-bold flex items-center mb-4 text-glow">
                  ₹ {results.p1.prediction} <span className="text-lg ml-2 text-sky-200 font-normal">Lakhs</span>
               </h2>
               <div className="space-y-1 text-sm text-slate-300">
                  <p>Range: ₹{results.p1.price_range[0]} - {results.p1.price_range[1]} L</p>
                  <p>AI Confidence: {results.p1.confidence}%</p>
                  <p className="pt-2 text-xs text-slate-400 break-all"><MapPin className="inline mr-1" size={12}/>{prop1.city}, {prop1.area} ({prop1.property_type})</p>
               </div>
            </div>

            <div className="glass-dark rounded-3xl p-6 text-white border-t-4 border-indigo-400 relative overflow-hidden">
               {results.p2.prediction > results.p1.prediction && (
                  <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/30">
                    Premium
                  </div>
               )}
               <p className="text-indigo-300 font-medium text-sm mb-1">Property B Value</p>
               <h2 className="text-4xl font-bold flex items-center mb-4 text-glow">
                  ₹ {results.p2.prediction} <span className="text-lg ml-2 text-indigo-200 font-normal">Lakhs</span>
               </h2>
               <div className="space-y-1 text-sm text-slate-300">
                  <p>Range: ₹{results.p2.price_range[0]} - {results.p2.price_range[1]} L</p>
                  <p>AI Confidence: {results.p2.confidence}%</p>
                  <p className="pt-2 text-xs text-slate-400 break-all"><MapPin className="inline mr-1" size={12}/>{prop2.city}, {prop2.area} ({prop2.property_type})</p>
               </div>
            </div>
          </div>
          
          <div className="glass-dark rounded-3xl p-8 border border-slate-700/50">
             <h3 className="text-xl font-bold mb-6 text-slate-200 flex items-center"><BarChart2 className="mr-2 text-sky-400"/> Price Comparison Graph</h3>
             <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                   <XAxis dataKey="name" stroke="#94a3b8" />
                   <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${value}L`} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                      itemStyle={{ color: '#e2e8f0' }}
                   />
                   <Legend wrapperStyle={{ paddingTop: '20px' }} />
                   <Bar dataKey="PropertyA" name="Property A" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={40} />
                   <Bar dataKey="PropertyB" name="Property B" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={40} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;
