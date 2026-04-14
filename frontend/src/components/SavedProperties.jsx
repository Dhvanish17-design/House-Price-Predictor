import React from 'react';
import { Bookmark, MapPin, Trash2, CalendarDays } from 'lucide-react';

const SavedProperties = ({ savedProperties, setSavedProperties }) => {
  const handleDelete = (indexToDelete) => {
    const updated = savedProperties.filter((_, index) => index !== indexToDelete);
    setSavedProperties(updated);
    localStorage.setItem('real_estate_saved', JSON.stringify(updated));
  };

  if (!savedProperties || savedProperties.length === 0) {
    return (
      <div className="h-[60vh] glass rounded-3xl p-8 flex flex-col items-center justify-center text-center animate-in fade-in">
        <div className="w-20 h-20 mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Bookmark size={32} className="text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Vault is Empty</h3>
        <p className="text-slate-500 max-w-sm">
          You haven't saved any property predictions yet. Use the bookmark icon on any prediction to save it here for future reference.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="glass rounded-3xl p-8 mb-8 relative overflow-hidden dark:glass-dark">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-emerald-500 opacity-20 blur-3xl pointer-events-none"></div>

        <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white flex items-center">
           <Bookmark className="mr-3 text-emerald-500" />
           Saved Properties Vault
        </h2>
        <p className="text-slate-500 mb-8 dark:text-slate-400">
          Your bookmarked estimates and historical marketplace properties.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {savedProperties.map((saved, index) => {
            const { query, prediction, date } = saved;
            const savedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            return (
              <div key={index} className="glass-dark border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 rounded-3xl overflow-hidden group flex flex-col shadow-lg hover:shadow-emerald-500/10">
                <div className="h-32 bg-slate-800 w-full relative overflow-hidden flex items-center justify-center border-b border-slate-700/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-900/40"></div>
                  <Bookmark className="text-slate-700 group-hover:text-emerald-500/50 transition-colors" size={48} />
                  
                  {/* Delete button positioned absolute */}
                  <button 
                     onClick={() => handleDelete(index)}
                     className="absolute top-3 right-3 p-2 bg-slate-900/50 hover:bg-red-500 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer backdrop-blur-md"
                     title="Remove from vault"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-2xl font-bold text-white tracking-tight">₹{prediction.prediction} <span className="text-sm text-emerald-400 font-normal ml-1">Lakhs</span></h3>
                    </div>
                    
                    <p className="text-emerald-300 text-sm font-medium mb-4 flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {query.city}, {query.area}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-400 mb-6">
                      <div><span className="text-slate-500">Type:</span> {query.property_type}</div>
                      <div><span className="text-slate-500">Size:</span> {query.sqft} sqft</div>
                      <div><span className="text-slate-500">Config:</span> {query.bhk} BHK</div>
                      <div><span className="text-slate-500">Age:</span> {query.age} yrs</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center mt-auto">
                    <span className="text-xs text-slate-500 flex items-center">
                       <CalendarDays size={12} className="mr-1" />
                       Saved {savedDate}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-slate-800 rounded-lg text-emerald-400 border border-emerald-500/20">
                       {prediction.confidence}% Confidence
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SavedProperties;
