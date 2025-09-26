import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface AdvancedLineChartProps {
  data: DataPoint[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  height?: number;
  className?: string;
}

/** Composant de graphique linéaire avancé */
export function AdvancedLineChart({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  color = '#8884d8',
  height = 300,
  className = ''
}: AdvancedLineChartProps) {
  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-medium mb-4 text-center">
          {title}
        </h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  ;
}

// Exports pour compatibilité
export default AdvancedLineChart;
export { AdvancedLineChart };
export type { DataPoint, AdvancedLineChartProps };