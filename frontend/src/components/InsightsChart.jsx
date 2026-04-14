import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';

const InsightsChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || Object.keys(data).length === 0) return [];
    
    // Convert object to array and sort by importance
    const arr = Object.entries(data).map(([key, value]) => ({
      name: key.replace('total_', '').toUpperCase(),
      importance: Number((value * 100).toFixed(1)),
    })).sort((a, b) => b.importance - a.importance);
    
    return arr;
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        Waiting for model data...
      </div>
    );
  }

  // Predefined colors for aesthetic chart
  const colors = ['#0ea5e9', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass px-4 py-3 rounded-xl border border-sky-200">
          <p className="font-semibold text-slate-700">{payload[0].payload.name}</p>
          <p className="text-sky-600">Influence: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Radar name="Importance" dataKey="importance" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.5} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InsightsChart;
