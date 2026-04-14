import React, { useState } from 'react';
import { MapPin, Maximize, Bed, Bath, Clock, Loader2, Sparkles, Building, Map } from 'lucide-react';
import CityDropdown from './CityDropdown';

const PredictionForm = ({ cities = [], nestedLocations = {}, propertyTypes = [], onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    state: 'Gujarat',
    city: '',
    area: '',
    property_type: '',
    sqft: 1000,
    bhk: 2,
    bath: 2,
    age: 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: ['sqft', 'bhk', 'bath', 'age'].includes(name) ? Number(value) : value };
      if (name === 'city') {
        updated.area = ''; // Reset area when city changes
      }
      return updated;
    });
  };

  const isFormValid = formData.city && formData.area && formData.property_type;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass rounded-3xl p-8 relative overflow-hidden dark:glass-dark">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-sky-300 opacity-20 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-indigo-300 opacity-20 blur-2xl dark:bg-sky-700"></div>
      
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white relative z-10 flex items-center">
        Property Details
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-300 flex items-center">
              <Map size={16} className="mr-2 text-sky-500" />
              State
            </label>
            <input 
              type="text" 
              name="state" 
              value={formData.state} 
              disabled
              className="w-full px-4 py-3 rounded-xl glass-input text-slate-500 bg-slate-100 cursor-not-allowed dark:bg-slate-800 dark:text-slate-400"
            />
          </div>
          <CityDropdown 
            value={formData.city} 
            cities={cities} 
            onChange={handleChange} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-300 flex items-center">
              <MapPin size={16} className="mr-2 text-sky-500" />
              Area
            </label>
            <select 
              name="area" 
              value={formData.area} 
              onChange={handleChange}
              required
              disabled={!formData.city}
              className={`w-full px-4 py-3 rounded-xl glass-input text-slate-800 dark:text-white appearance-none cursor-pointer ${!formData.city ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="" disabled>Select an area</option>
              {formData.city && [...(nestedLocations[formData.city] || [])].sort((a, b) => a.localeCompare(b)).map(area => (
                <option key={area} value={area} className="text-slate-800 bg-white dark:bg-slate-800 dark:text-white">
                  {area.charAt(0).toUpperCase() + area.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-300 flex items-center">
              <Building size={16} className="mr-2 text-sky-500" />
              Property Type
            </label>
            <select 
              name="property_type" 
              value={formData.property_type} 
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl glass-input text-slate-800 dark:text-white appearance-none cursor-pointer"
            >
              <option value="" disabled>Select property type</option>
              {propertyTypes.map(pt => (
                <option key={pt} value={pt} className="text-slate-800 bg-white dark:bg-slate-800 dark:text-white">
                  {pt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-300 flex items-center">
              <Maximize size={16} className="mr-2 text-sky-500" />
              Total Area (SqFt)
            </label>
            <input 
              type="number" 
              name="sqft" 
              min="300" max="10000"
              value={formData.sqft} 
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl glass-input text-slate-800 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-300 flex items-center">
              <Bed size={16} className="mr-2 text-sky-500" />
              Bedrooms (BHK)
            </label>
            <input 
              type="number" 
              name="bhk" 
              min="1" max="10"
              value={formData.bhk} 
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl glass-input text-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-300 flex items-center">
              <Bath size={16} className="mr-2 text-sky-500" />
              Bathrooms
            </label>
            <input 
              type="number" 
              name="bath" 
              min="1" max="10"
              value={formData.bath} 
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl glass-input text-slate-800 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-300 flex items-center">
              <Clock size={16} className="mr-2 text-sky-500" />
              Property Age (Yrs)
            </label>
            <input 
              type="number" 
              name="age" 
              min="0" max="100"
              value={formData.age} 
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl glass-input text-slate-800 dark:text-white"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !isFormValid}
          className={`w-full py-4 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-lg mt-8
            ${loading || !isFormValid ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white hover:from-sky-500 hover:to-indigo-600 hover:shadow-sky-500/30'}`}
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" size={24} />
          ) : (
            <Sparkles className="mr-2" size={24} />
          )}
          {loading ? 'Analyzing Data...' : 'Predict Price'}
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;
