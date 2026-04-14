import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const AISuggestions = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="mt-6 glass-dark rounded-3xl p-6 border border-slate-700 text-white animate-in slide-in-from-bottom-4 duration-500 delay-400">
      <h3 className="text-lg font-semibold flex items-center mb-4 text-slate-200">
        <Sparkles size={18} className="mr-2 text-yellow-400" />
        Smart AI Insights
      </h3>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start bg-slate-800/80 rounded-xl p-4 border-l-4 border-yellow-500 hover:bg-slate-800 transition-colors">
            <ArrowRight size={16} className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-300 leading-relaxed">
              {insight}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISuggestions;
