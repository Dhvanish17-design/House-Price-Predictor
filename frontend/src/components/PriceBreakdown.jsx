import React, { useEffect, useState } from 'react';
import { Calculator } from 'lucide-react';

const PriceBreakdown = ({ breakdown }) => {
  const [widths, setWidths] = useState([0, 0]);

  useEffect(() => {
    if (breakdown) {
      setTimeout(() => setWidths([100, 100]), 100);
    }
  }, [breakdown]);

  if (!breakdown || breakdown.length === 0) return null;

  // Maximum value for scaling the bars relative to each other safely
  const maxValue = Math.abs(breakdown[0].value) + Math.abs(breakdown[1].value);

  return (
    <div className="mt-6 glass-dark rounded-3xl p-6 border border-slate-700 text-white animate-in slide-in-from-bottom-4 duration-500 delay-300">
      <h3 className="text-lg font-semibold flex items-center mb-6 text-slate-200">
        <Calculator size={18} className="mr-2 text-sky-400" />
        Price Construction Matrix
      </h3>
      
      <div className="space-y-5">
        {breakdown.map((item, index) => {
          const percentage = Math.max(10, (Math.abs(item.value) / maxValue) * 100);
          const isNegative = item.value < 0;
          
          return (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className={`font-bold ${isNegative ? 'text-red-400' : 'text-sky-300'}`}>
                  {isNegative ? '- ' : '+ '}₹{Math.abs(item.value).toFixed(2)} L
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 border border-slate-700/50 overflow-hidden relative">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${isNegative ? 'bg-gradient-to-r from-red-500 to-rose-400' : 'bg-gradient-to-r from-sky-500 to-indigo-500'}`}
                  style={{ width: `${widths[index] ? percentage : 0}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceBreakdown;
