import React from 'react';

interface StarRatingProps {
  stars: number; // 0..3
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  stars,
  maxStars = 3,
  size = 'md',
  animated = false
}) => {
  const sizeMap = {
    sm: 'text-sm gap-0.5',
    md: 'text-xl gap-1',
    lg: 'text-3xl gap-2'
  };

  return (
    <div className={`inline-flex items-center ${sizeMap[size]}`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const isFilled = i < stars;
        return (
          <span
            key={i}
            className={`transition-all duration-300 ${
              isFilled
                ? 'text-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]'
                : 'text-slate-300 dark:text-slate-700'
            } ${animated && isFilled ? 'animate-pop' : ''}`}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};
