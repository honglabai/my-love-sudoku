import React from 'react';

interface ProgressBarProps {
  value: number; // current value
  max: number; // max value
  label?: string;
  showPercent?: boolean;
  color?: 'blue' | 'amber' | 'emerald';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showPercent = false,
  color = 'blue',
  className = ''
}) => {
  const percent = Math.min(100, Math.max(0, Math.round((value / Math.max(1, max)) * 100)));

  const colorStyles = {
    blue: 'bg-blue-600 dark:bg-blue-500',
    amber: 'bg-amber-500 dark:bg-amber-400',
    emerald: 'bg-emerald-500 dark:bg-emerald-400'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
          {label && <span>{label}</span>}
          {showPercent && <span>{percent}%</span>}
        </div>
      )}
      <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
