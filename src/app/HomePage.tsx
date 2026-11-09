import React from 'react';
import { PlayerProgression, getRequiredXPForLevel } from '../features/progression/progression';
import { ActiveGameSave } from '../storage/storage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { Badge } from '../components/Badge';
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

  return (
    <div className="flex flex-col items-center justify-between min-h-screen max-w-md mx-auto p-4 sm:p-6 pb-8">
      {/* Top Header / Branding */}
      <header className="w-full text-center mt-6 mb-4">
        <div className="inline-flex items-center justify-center gap-2 mb-1">
          <span className="text-3xl animate-bounce">💖</span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-500 bg-clip-text text-transparent">
            내사랑 스도쿠
          </h1>
          <span className="text-3xl animate-bounce" style={{ animationDelay: '150ms' }}>
            💖
          </span>
        </div>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
          한 칸씩 풀고, 한 단계씩 성장하는 스도쿠
        </p>
      </header>

      {/* Main Center Area: Profile Summary Card */}
      <main className="w-full space-y-4 my-auto">
        <Card className="border-blue-200/70 dark:border-blue-900/50 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👑</span>
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">칭호</div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {progression.equippedTitle}
                </div>
              </div>
            </div>
            <Badge variant="blue" size="md">
              Lv. {progression.level}
            </Badge>
          </div>

          <ProgressBar
            value={progression.currentXP}
            max={reqXP}
            label={`경험치 (${progression.currentXP} / ${reqXP} XP)`}
            showPercent
            color="blue"
            className="mb-3"
          />

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2 bg-white/60 dark:bg-slate-800/60 rounded-xl">
              <div className="text-xs text-slate-500 dark:text-slate-400">획득 별점</div>
              <div className="text-base font-extrabold text-amber-500">
                ⭐ {progression.totalStars} <span className="text-xs text-slate-400">/ 150</span>
              </div>
            </div>
            <div className="p-2 bg-white/60 dark:bg-slate-800/60 rounded-xl">
              <div className="text-xs text-slate-500 dark:text-slate-400">클리어 스테이지</div>
              <div className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                🧩 {Object.keys(progression.stageRecords).length}{' '}
                <span className="text-xs text-slate-400">/ 50</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Continue in-progress game button if active game exists */}
        {activeGame && activeStage && (
          <Card
            hoverable
            onClick={() => onNavigate('game', activeGame.stageId)}
            className="border-amber-300 dark:border-amber-700/60 bg-amber-50/60 dark:bg-amber-950/30 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏳</span>
                <div>
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    플레이 중인 게임 이어하기
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    스테이지 {activeStage.id}. {activeStage.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    진행 시간: {formatTime(activeGame.elapsedSeconds)} · 실수: {activeGame.mistakes}
                  </div>
                </div>
              </div>
              <Button size="sm" variant="accent">
                이어하기
              </Button>
            </div>
          </Card>
        )}

        {/* Main Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => onNavigate('stage-map')}
            className="text-base font-black shadow-lg shadow-blue-500/20"
          >
            🗺️ 스테이지 선택 (5개 월드)
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
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
      <footer className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
        <p>내사랑 스도쿠 · v1.0.0 · 오프라인 PWA 지원</p>
      </footer>
    </div>
  );
};
