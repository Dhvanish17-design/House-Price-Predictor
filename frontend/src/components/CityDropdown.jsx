import React from 'react';
import { Map } from 'lucide-react';

const CityDropdown = ({ value, onChange, cities = [], disabled = false }) => {
  return (
    <div className="relative group">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block flex items-center">
        <Map size={12} className="mr-1" />
        Gujarat City
      </label>
      
      <div className="relative">
        <select 
          name="city"
          value={value} 
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl appearance-none cursor-pointer
            bg-white/80 dark:bg-slate-800/80 backdrop-blur-md
            border border-slate-200 dark:border-slate-700
            text-sm text-slate-800 dark:text-white font-medium
            shadow-sm hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500
            hover:border-sky-400 dark:hover:border-sky-500
            transition-all duration-300
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <option value="" disabled className="text-slate-500">
            Select City
          </option>
          {[...cities].sort((a, b) => a.localeCompare(b)).map((loc) => (
            <option 
              key={loc} 
              value={loc} 
              className="text-slate-800 bg-white dark:bg-slate-800 dark:text-white py-2"
            >
              {loc.charAt(0).toUpperCase() + loc.slice(1)}
            </option>
          ))}
        </select>
        
        {/* Custom Dropdown Arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 group-hover:text-sky-500 transition-colors">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
             <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CityDropdown;
