import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  glass = true
}) => {
  const bgStyle = glass
    ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-md'
    : 'bg-white dark:bg-slate-900';

  return (
    <div
      onClick={onClick}
      className={`${bgStyle} border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] ${
        hoverable
          ? 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-blue-400/80 dark:hover:border-blue-500/80 transition-all duration-200 cursor-pointer active:scale-[0.99]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
