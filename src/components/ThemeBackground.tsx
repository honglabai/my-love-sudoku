import React from 'react';

interface ThemeBackgroundProps {
  worldId?: number; // 1..5
  isGameView?: boolean;
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({
  worldId = 1,
  isGameView = false
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Zen Ambient Watercolor Background Halo */}
      <picture>
        <source srcSet={`/assets/backgrounds/zen_sheet_level_${worldId}.webp`} type="image/webp" />
        <img
          src={`/assets/backgrounds/zen_sheet_level_${worldId}.jpg`}
          alt="스도쿠 배경"
          aria-hidden="true"
          className={`w-full h-full object-cover object-center transition-all duration-700 ${
            isGameView
              ? 'opacity-20 dark:opacity-10 blur-xl scale-110'
              : 'opacity-35 dark:opacity-20 blur-md scale-105'
          }`}
        />
      </picture>

      {/* Gentle ambient lighting overlay */}
      <div className="absolute inset-0 bg-stone-100/40 dark:bg-slate-950/80 pointer-events-none" />
    </div>
  );
};
