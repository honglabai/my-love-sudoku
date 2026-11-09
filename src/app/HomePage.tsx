import React from 'react';
import { PlayerProgression, getRequiredXPForLevel } from '../features/progression/progression';
import { ActiveGameSave } from '../storage/storage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { getStageById } from '../features/stages/stageData';

interface HomePageProps {
  progression: PlayerProgression;
  activeGame: ActiveGameSave | null;
  onNavigate: (view: 'home' | 'stage-map' | 'game' | 'profile' | 'settings', stageId?: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ progression, activeGame, onNavigate }) => {
  const reqXP = getRequiredXPForLevel(progression.level);
  const activeStage = activeGame ? getStageById(activeGame.stageId) : null;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const percent = Math.min(100, Math.max(0, Math.round((progression.currentXP / Math.max(1, reqXP)) * 100)));

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-screen max-w-md mx-auto p-4 sm:p-6 pb-8">
      {/* Top Header: Branding with Zen Korean Calligraphic Title Logo Image */}
      <header className="w-full flex flex-col items-center justify-center mt-2 mb-2 select-none">
        <img
          src="/assets/logo/title_logo.webp"
          alt="내사랑 스도쿠"
          className="dark:hidden w-full max-w-[320px] sm:max-w-[350px] h-auto object-contain drop-shadow-sm transition-transform duration-200 hover:scale-[1.02]"
        />
        <img
          src="/assets/logo/title_logo_dark.webp"
          alt="내사랑 스도쿠"
          className="hidden dark:block w-full max-w-[320px] sm:max-w-[350px] h-auto object-contain drop-shadow-[0_2px_12px_rgba(255,255,255,0.12)] transition-transform duration-200 hover:scale-[1.02]"
        />
      </header>

      {/* Main Profile & Gamification Card (Inspired by Ridi Pin 2) */}
      <main className="w-full space-y-3.5 my-auto">
        <Card className="relative overflow-hidden border-blue-200/80 dark:border-blue-900/40 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          {/* Top user title announcement */}
          <div className="text-center pt-1 pb-3">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              플레이어님의 현재 등급
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
              {progression.equippedTitle}
            </div>
          </div>

          {/* Gamification Tier Progression Bar with Tooltip (Ridi Style) */}
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-600 dark:text-slate-400">다음 등급까지</span>
              <span className="text-blue-600 dark:text-blue-400">
                {progression.currentXP} / {reqXP} XP ({percent}%)
              </span>
            </div>

            {/* Progress Track */}
            <div className="relative w-full h-4 bg-slate-200/80 dark:bg-slate-700/80 rounded-full p-0.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Checkpoint Tier Markers */}
            <div className="grid grid-cols-4 gap-1 text-[10px] text-center mt-2.5 font-bold text-slate-500 dark:text-slate-400">
              <div className={progression.level >= 1 ? 'text-blue-600 dark:text-blue-400' : ''}>
                <div>입문자</div>
                <div className="text-[9px] opacity-75">Lv.1</div>
              </div>
              <div className={progression.level >= 5 ? 'text-blue-600 dark:text-blue-400' : ''}>
                <div>탐험가</div>
                <div className="text-[9px] opacity-75">Lv.5</div>
              </div>
              <div className={progression.level >= 15 ? 'text-blue-600 dark:text-blue-400' : ''}>
                <div>수집가</div>
                <div className="text-[9px] opacity-75">Lv.15</div>
              </div>
              <div className={progression.level >= 30 ? 'text-blue-600 dark:text-blue-400' : ''}>
                <div>마스터</div>
                <div className="text-[9px] opacity-75">Lv.30+</div>
              </div>
            </div>
          </div>

          {/* Cumulative Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-800/80 dark:to-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 rounded-2xl">
              <div className="text-xs font-bold text-amber-700 dark:text-amber-400">누적 수집 별점</div>
              <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
                ⭐ {progression.totalStars} <span className="text-xs font-semibold text-slate-400">/ 150</span>
              </div>
            </div>

            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-800/80 dark:to-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 rounded-2xl">
              <div className="text-xs font-bold text-blue-700 dark:text-blue-400">클리어 스테이지</div>
              <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
                🧩 {Object.keys(progression.stageRecords).length}{' '}
                <span className="text-xs font-semibold text-slate-400">/ 50</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Continue in-progress game card if active game exists */}
        {activeGame && activeStage && (
          <Card
            hoverable
            onClick={() => onNavigate('game', activeGame.stageId)}
            className="border-amber-300 dark:border-amber-700/80 bg-amber-50/90 dark:bg-amber-950/40 animate-pulse shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-md">
                  ⏳
                </div>
                <div>
                  <div className="text-[11px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    플레이 중인 게임 이어하기
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                    스테이지 {activeStage.id}. {activeStage.title}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    진행 시간: {formatTime(activeGame.elapsedSeconds)} · 실수: {activeGame.mistakes}
                  </div>
                </div>
              </div>
              <Button size="sm" variant="accent" pill>
                이어하기
              </Button>
            </div>
          </Card>
        )}

        {/* Tactile 3D Action Buttons (Pin 2 Inspired) */}
        <div className="space-y-2.5 pt-1">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            pill
            onClick={() => onNavigate('stage-map')}
            className="text-base font-black shadow-lg"
          >
            🗺️ 스테이지 여정 (5개 월드)
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            pill
            onClick={() => onNavigate('profile')}
            className="text-sm font-bold"
          >
            🏅 내 프로필 & 업적 수집
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => onNavigate('settings')}
            className="text-sm font-semibold"
          >
            ⚙️ 게임 설정
          </Button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="text-center text-xs text-slate-500 dark:text-slate-500 mt-4">
        <p>내사랑 스도쿠 · v1.0.0 · 한국 수묵 담채화 에디션</p>
      </footer>
    </div>
  );
};
