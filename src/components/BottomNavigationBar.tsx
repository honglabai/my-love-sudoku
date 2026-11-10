import React from 'react';
import { AppView } from '../app/App';

interface BottomNavigationBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onPlayGame: () => void;
  hasActiveGame: boolean;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  currentView,
  onNavigate,
  onPlayGame,
  hasActiveGame
}) => {
  // Navigation tabs (matching Pin 3 left phone elevated dock layout)
  // Left 2: [홈], [월드 여정]
  // Center: [게임하기] (Elevated Protruding Circular FAB)
  // Right 2: [일일 여정], [My Page]

  return (
    <nav
      aria-label="하단 네비게이션 메뉴"
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto pointer-events-auto select-none px-2 sm:px-3 pb-1"
    >
      {/* Outer Dock Bar Container with Sleek Compact Height & Reduced Padding */}
      <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.35)] px-1 py-1">
        <div className="flex items-center justify-between relative">
          
          {/* Tab 1: 홈 (Home) */}
          <button
            onClick={() => onNavigate('home')}
            className={`flex-1 flex flex-col items-center justify-center px-0.5 py-1 rounded-xl transition-all duration-150 ${
              currentView === 'home'
                ? 'text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50/60 dark:bg-blue-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
            aria-label="홈 화면으로 이동"
          >
            <span className="text-lg leading-none transition-transform active:scale-90">🏠</span>
            <span className="text-[11px] sm:text-xs mt-0.5 tracking-tight font-bold leading-none">홈</span>
            {currentView === 'home' && (
              <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
            )}
          </button>

          {/* Tab 2: 여정보기 (Stage Map) */}
          <button
            onClick={() => onNavigate('stage-map')}
            className={`flex-1 flex flex-col items-center justify-center px-0.5 py-1 rounded-xl transition-all duration-150 ${
              currentView === 'stage-map'
                ? 'text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50/60 dark:bg-blue-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
            aria-label="스테이지 여정보기 화면으로 이동"
          >
            <span className="text-lg leading-none transition-transform active:scale-90">🗺️</span>
            <span className="text-[11px] sm:text-xs mt-0.5 tracking-tight font-bold leading-none">여정보기</span>
            {currentView === 'stage-map' && (
              <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
            )}
          </button>

          {/* Tab 3 (Center): 게임하기 - Elevated Protruding Floating Action Button */}
          <div className="relative -top-3.5 flex-1 flex flex-col items-center justify-center">
            <button
              onClick={onPlayGame}
              aria-label={hasActiveGame ? '진행 중인 스도쿠 이어하기' : '스도쿠 게임하기'}
              className="group flex flex-col items-center justify-center active:scale-95 transition-transform"
            >
              <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-[0_6px_16px_rgba(37,99,235,0.4)] dark:shadow-[0_6px_16px_rgba(59,130,246,0.3)] ring-3 ring-slate-100 dark:ring-slate-950 transition-all duration-200">
                {/* Subtle inner ripple / glow */}
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-xl sm:text-2xl leading-none transition-transform group-hover:scale-110">
                  {hasActiveGame ? '▶️' : '🎮'}
                </span>
              </div>
              <span className="text-[10.5px] sm:text-[11px] font-black text-slate-800 dark:text-slate-200 mt-0.5 leading-none tracking-tight">
                {hasActiveGame ? '이어하기' : '게임하기'}
              </span>
            </button>
          </div>

          {/* Tab 4: 일일 여정 (Daily Challenge Quest) */}
          <button
            onClick={() => onNavigate('daily-quest')}
            className={`flex-1 flex flex-col items-center justify-center px-0.5 py-1 rounded-xl transition-all duration-150 ${
              currentView === 'daily-quest'
                ? 'text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50/60 dark:bg-blue-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
            aria-label="일일 여정 도전 화면으로 이동"
          >
            <span className="text-lg leading-none transition-transform active:scale-90">🗓️</span>
            <span className="text-[11px] sm:text-xs mt-0.5 tracking-tight font-bold leading-none">일일 여정</span>
            {currentView === 'daily-quest' && (
              <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
            )}
          </button>

          {/* Tab 5: My Page (프로필, 칭호, 보물함, 업적, 설정) */}
          <button
            onClick={() => onNavigate('profile')}
            className={`flex-1 flex flex-col items-center justify-center px-0.5 py-1 rounded-xl transition-all duration-150 ${
              currentView === 'profile' || currentView === 'settings'
                ? 'text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50/60 dark:bg-blue-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
            aria-label="마이페이지 화면으로 이동"
          >
            <span className="text-lg leading-none transition-transform active:scale-90">👤</span>
            <span className="text-[11px] sm:text-xs mt-0.5 tracking-tight font-bold leading-none">My Page</span>
            {(currentView === 'profile' || currentView === 'settings') && (
              <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
            )}
          </button>

        </div>
      </div>
    </nav>
  );
};
