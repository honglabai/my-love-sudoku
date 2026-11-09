import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm ${
        hoverable ? 'hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
