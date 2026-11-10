import React from 'react';
import { sound } from '../audio/sound';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  pill?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  pill = false,
  className = '',
  onClick,
  disabled,
  children,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      sound.playTap();
      onClick?.(e);
    }
  };

  const rounding = pill ? 'rounded-full' : 'rounded-xl';

  const baseStyle =
    `inline-flex items-center justify-center font-bold ${rounding} select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:translate-y-0 disabled:shadow-none`;

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs min-h-[30px]',
    md: 'px-3.5 py-1.5 text-sm min-h-[36px]',
    lg: 'px-5 py-2 text-sm sm:text-base min-h-[42px]'
  };

  const variantStyles = {
    primary: 'btn-3d-primary focus:ring-blue-500',
    secondary: 'btn-3d-secondary focus:ring-slate-400',
    accent: 'btn-3d-accent focus:ring-amber-400',
    danger: 'btn-3d-rose focus:ring-rose-500',
    ghost:
      'bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-none active:scale-95 transition-all'
  };

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
