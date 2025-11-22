import React from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * Props definition for the StatCard component.
 * Using explicit interfaces improves type safety and readability.
 */
interface StatCardProps {
  title: string;                // Label for the statistic
  value: string | number;       // The main value to display
  icon: LucideIcon;            // The icon component from lucide-react
  subtext?: React.ReactNode;   // Changed from string to React.ReactNode to allow JSX (spans, bold tags, etc.)
  colorClass?: string;         // Tailwind class for icon coloring
}

/**
 * StatCard Component
 * 
 * A reusable, presentational component responsible for displaying a single metric.
 * It follows the atomic design principle, being a "molecule" composed of basic atoms (text, icon).
 */
export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, subtext, colorClass = "text-blue-600" }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          {/* Metric Label */}
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider" title={title}>{title}</h3>
          
          {/* Icon Wrapper with dynamic background color derived from text color */}
          <div className={`p-2 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
              <Icon className={`w-5 h-5 ${colorClass}`} />
          </div>
        </div>
        
        {/* Metric Value */}
        <span className="text-2xl font-bold text-gray-900 block mb-1" title={String(value)}>
          {value}
        </span>
      </div>
      
      {/* Subtext / Secondary Value */}
      {subtext && (
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-50">
          {subtext}
        </div>
      )}
    </div>
  );
};