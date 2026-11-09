import React from 'react';

interface ThemeBackgroundProps {
  worldId?: number; // 1..5, or undefined for home
  dimmed?: boolean;
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({
  worldId = 1,
  dimmed = false
}) => {
  const bgName = worldId >= 1 && worldId <= 5 ? `world_${worldId}` : 'home_bg';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700">
      {/* Background Image Layer */}
      <picture>
        <source srcSet={`/assets/backgrounds/${bgName}.webp`} type="image/webp" />
        <img
          src={`/assets/backgrounds/${bgName}.jpg`}
          alt=""
          aria-hidden="true"
          className={`w-full h-full object-cover object-center transition-all duration-700 ${
            dimmed
              ? 'opacity-35 dark:opacity-15 blur-[1px]'
              : 'opacity-85 dark:opacity-20'
          }`}
        />
      </picture>

      {/* Subtle Warm Hanji & Ambient Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/70 dark:from-slate-950/70 dark:via-slate-950/50 dark:to-slate-950/90" />
    </div>
  );
};
