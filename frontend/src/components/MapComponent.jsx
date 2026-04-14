import React from 'react';
import { Map as MapIcon, Navigation } from 'lucide-react';

const MapComponent = ({ city, area }) => {
  if (!city || !area) return null;
  
  const query = `${area}, ${city}, Gujarat, India`;
  const encodedQuery = encodeURIComponent(query);
  const mapUrl = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="mt-6 glass-dark rounded-3xl p-6 border border-slate-700 text-white animate-in slide-in-from-bottom-4 duration-500 delay-200">
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-lg font-semibold flex items-center text-slate-200">
           <MapIcon size={18} className="mr-2 text-sky-400" />
           Neighborhood Map
         </h3>
         <div className="text-xs text-slate-400 flex items-center">
            <Navigation size={12} className="mr-1" />
            Showing {area}, {city}
         </div>
      </div>
      
      <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-700/50 relative shadow-inner">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={mapUrl}
          title="Google Map Configuration"
          className="transition-all duration-700"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MapComponent;
