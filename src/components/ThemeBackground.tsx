import React from 'react';

interface ThemeBackgroundProps {
  worldId?: number; // 1..5
  isGameView?: boolean;
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({
  worldId = 1,
  isGameView = false
}) => {
  // Use authentic Sudoku game board background (stage 1 / world wallpaper)
  const bgStage = worldId === 1 ? 1 : (worldId - 1) * 10 + 1;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Authentic Korean Minhwa Painting from Sudoku Game Board */}
      <picture className="w-full h-full">
        <source srcSet={`/assets/wallpapers/stage_${bgStage}.webp`} type="image/webp" />
        <img
          src={`/assets/wallpapers/stage_${bgStage}.jpg`}
          alt="스도쿠 게임판 한국화 배경"
          aria-hidden="true"
          className={`w-full h-full object-cover object-center transition-all duration-700 ${
            isGameView
              ? 'opacity-20 dark:opacity-10 blur-sm scale-105'
              : 'opacity-85 dark:opacity-40'
          }`}
        />
      </picture>

      {/* Subtle Hanji paper tint for contrast and readability (matching game sheet) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
          isGameView
            ? 'bg-stone-100/70 dark:bg-slate-950/85 backdrop-blur-[1px]'
            : 'bg-[#faf8f1]/65 dark:bg-slate-950/80 backdrop-blur-[0.5px]'
        }`}
      />
    </div>
  );
};
