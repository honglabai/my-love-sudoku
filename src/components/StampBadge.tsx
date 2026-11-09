import React from 'react';
import { StarRating } from './StarRating';

interface StampBadgeProps {
  stageId: number;
  stageNumberInWorld: number;
  title: string;
  isUnlocked: boolean;
  isCurrent: boolean;
  isBoss: boolean;
  stars?: number;
  onClick: () => void;
}

export const StampBadge: React.FC<StampBadgeProps> = ({
  stageId,
  stageNumberInWorld,
  title,
  isUnlocked,
  isCurrent,
  isBoss,
  stars = 0,
  onClick
}) => {
  // Pastel color themes matching Pin 2 Ridi gamification stamp aesthetic
  const colorThemes = [
    { bg: 'from-blue-100 via-sky-50 to-indigo-100 text-blue-800 border-blue-300 dark:from-blue-950 dark:to-indigo-950 dark:border-blue-700 dark:text-blue-300' },
    { bg: 'from-amber-100 via-yellow-50 to-orange-100 text-amber-800 border-amber-300 dark:from-amber-950 dark:to-yellow-950 dark:border-amber-700 dark:text-amber-300' },
    { bg: 'from-rose-100 via-pink-50 to-red-100 text-rose-800 border-rose-300 dark:from-rose-950 dark:to-pink-950 dark:border-rose-700 dark:text-rose-300' },
    { bg: 'from-emerald-100 via-teal-50 to-green-100 text-emerald-800 border-emerald-300 dark:from-emerald-950 dark:to-teal-950 dark:border-emerald-700 dark:text-emerald-300' },
    { bg: 'from-purple-100 via-violet-50 to-indigo-100 text-purple-800 border-purple-300 dark:from-purple-950 dark:to-violet-950 dark:border-purple-700 dark:text-purple-300' }
  ];

  const theme = colorThemes[(stageId - 1) % colorThemes.length];

  return (
    <div
      onClick={() => {
        if (isUnlocked) onClick();
      }}
      className={`group flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none ${
        !isUnlocked ? 'opacity-40 pointer-events-none' : 'active:scale-95'
      }`}
    >
      {/* Outer Scalloped Stamp Container */}
      <div className="relative flex items-center justify-center">
        {/* Active glowing indicator for current challenge */}
        {isCurrent && (
          <div className="absolute -inset-2 bg-blue-500/20 dark:bg-blue-400/20 rounded-full animate-ping pointer-events-none" />
        )}

        {/* Circular Stamp Body */}
        <div
          className={`relative flex flex-col items-center justify-center rounded-full border-2 transition-transform duration-200 shadow-md ${
            isBoss ? 'w-18 h-18 sm:w-20 sm:h-20 border-amber-400 dark:border-amber-500 bg-gradient-to-br from-amber-200 via-yellow-100 to-orange-200 text-amber-900 shadow-amber-500/20' : 'w-15 h-15 sm:w-16 sm:h-16 bg-gradient-to-br ' + theme.bg
          } ${isCurrent ? 'ring-4 ring-blue-500/30 dark:ring-blue-400/30' : ''}`}
        >
          {/* Inner Dashed Ring (Ridi Stamp Look) */}
          <div className="absolute inset-1 rounded-full border border-dashed border-white/80 dark:border-white/20 pointer-events-none" />

          {/* Stamp Center Content */}
          <div className="flex flex-col items-center justify-center z-10">
            {!isUnlocked ? (
              <span className="text-xl">🔒</span>
            ) : isBoss ? (
              <>
                <span className="text-lg -mb-0.5">👑</span>
                <span className="text-[11px] font-black tracking-tight">{stageId}</span>
              </>
            ) : (
              <>
                <span className="text-xs font-black tracking-tighter opacity-70">STAGE</span>
                <span className="text-base font-black leading-none">{stageNumberInWorld}</span>
              </>
            )}
          </div>

          {/* Star Rating Under Stage Number inside stamp */}
          {stars > 0 && (
            <div className="absolute -bottom-1 z-20 bg-white/95 dark:bg-slate-900/95 px-1.5 py-0.2 rounded-full shadow-sm border border-slate-200/80 dark:border-slate-800">
              <StarRating stars={stars} size="sm" />
            </div>
          )}

          {/* "도전" Badge for current uncompleted stage */}
          {isCurrent && stars === 0 && (
            <div className="absolute -top-1.5 z-20 bg-rose-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-sm animate-pulse">
              도전
            </div>
          )}
        </div>
      </div>

      {/* Stage Name / Label */}
      <div className="mt-1.5 text-center max-w-[85px]">
        <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
          {title}
        </div>
      </div>
    </div>
  );
};
