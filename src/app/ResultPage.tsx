import React, { useEffect } from 'react';
import { RewardResult, getRequiredXPForLevel } from '../features/progression/progression';
import { Achievement } from '../features/achievements/achievements';
import { getStageById } from '../features/stages/stageData';
import { sound } from '../audio/sound';
import { fireVictoryConfetti } from '../components/ConfettiCelebration';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { StarRating } from '../components/StarRating';
import { ProgressBar } from '../components/ProgressBar';
import { Badge } from '../components/Badge';

interface ResultPageProps {
  stageId: number;
  rewardResult: RewardResult;
  newAchievements: Achievement[];
  elapsedSeconds: number;
  mistakes: number;
  hintsUsed: number;
  reducedMotion?: boolean;
  onNextStage: (nextStageId: number) => void;
  onReplay: (stageId: number) => void;
  onGoToMap: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  stageId,
  rewardResult,
  newAchievements,
  elapsedSeconds,
  mistakes,
  hintsUsed,
  reducedMotion = false,
  onNextStage,
  onReplay,
  onGoToMap
}) => {
  const stage = getStageById(stageId);
  const nextStageId = rewardResult.nextUnlockedStage || (stageId < 50 ? stageId + 1 : null);

  useEffect(() => {
    sound.playVictory();
    fireVictoryConfetti(reducedMotion);
    if (rewardResult.leveledUp) {
      setTimeout(() => sound.playLevelUp(), 800);
    }
  }, [reducedMotion, rewardResult.leveledUp]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const reqXP = getRequiredXPForLevel(rewardResult.updatedProgression.level);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen max-w-md mx-auto p-4 sm:p-6 pb-8 select-none">
      {/* Top Victory Header */}
      <header className="text-center mt-6">
        <div className="text-4xl animate-bounce mb-2">🎉</div>
        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-500 bg-clip-text text-transparent">
          스테이지 완료!
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
          스테이지 {stageId}. {stage?.title}
        </p>
      </header>

      {/* Main Result Card */}
      <main className="w-full space-y-4 my-auto">
        <Card className="text-center p-6 border-blue-200 dark:border-blue-900/60 shadow-xl bg-gradient-to-b from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-950/20">
          {/* Star Rating */}
          <div className="mb-4">
            <StarRating stars={rewardResult.starsEarned} size="lg" animated />
            <div className="text-xs font-bold text-amber-500 mt-2">
              {rewardResult.starsEarned === 3
                ? '완벽한 추론! ★★★'
                : rewardResult.starsEarned === 2
                ? '훌륭한 논리! ★★'
                : '스테이지 클리어! ★'}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl mb-4 text-center">
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">클리어 시간</div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {formatTime(elapsedSeconds)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">실수 횟수</div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {mistakes}회
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">사용한 힌트</div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {hintsUsed}회
              </div>
            </div>
          </div>

          {/* XP Gained Announcement */}
          <div className="p-3 bg-blue-100/60 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-2xl mb-4">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400">획득 경험치</div>
            <div className="text-2xl font-black text-blue-700 dark:text-blue-300">
              +{rewardResult.xpEarned} <span className="text-xs font-semibold">XP</span>
            </div>
            {rewardResult.isFirstClear && (
              <div className="text-[11px] text-blue-500 dark:text-blue-400 font-medium mt-0.5">
                최초 클리어 보너스 지급 완료!
              </div>
            )}
            {!rewardResult.isFirstClear && rewardResult.isNewStarRecord && (
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                별점 최고 기록 갱신 보너스 지급 완료!
              </div>
            )}
          </div>

          {/* Level Up Fanfare Banner */}
          {rewardResult.leveledUp && (
            <div className="p-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-2xl font-black mb-4 shadow-lg animate-pop">
              <div className="text-sm">🌟 레벨 업! 🌟</div>
              <div className="text-lg">
                Lv. {rewardResult.oldLevel} ➔ Lv. {rewardResult.newLevel}
              </div>
            </div>
          )}

          {/* Level Progress */}
          <div className="text-left">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">
                플레이어 레벨 {rewardResult.updatedProgression.level}
              </span>
              <span className="text-blue-600 dark:text-blue-400">
                {rewardResult.updatedProgression.currentXP} / {reqXP} XP
              </span>
            </div>
            <ProgressBar
              value={rewardResult.updatedProgression.currentXP}
              max={reqXP}
              color="blue"
            />
          </div>
        </Card>

        {/* New Achievements alert if unlocked */}
        {newAchievements.length > 0 && (
          <div className="space-y-2">
            {newAchievements.map(ach => (
              <div
                key={ach.id}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-slate-900 dark:to-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-2xl animate-pop"
              >
                <span className="text-2xl">{ach.icon}</span>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      새로운 업적 달성!
                    </span>
                    <Badge variant="amber" size="sm">
                      {ach.rewardTitle}
                    </Badge>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {ach.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {nextStageId && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => onNextStage(nextStageId)}
              className="text-base font-black shadow-lg shadow-blue-500/25"
            >
              다음 스테이지로 도전 (스테이지 {nextStageId}) ➔
            </Button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => onReplay(stageId)}
              className="font-bold"
            >
              🔄 다시 풀기
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={onGoToMap}
              className="font-bold"
            >
              🗺️ 스테이지 목록
            </Button>
          </div>
        </div>
      </main>

      <footer className="text-xs text-slate-400 dark:text-slate-500 text-center">
        내사랑 스도쿠 · 자동 저장 완료
      </footer>
    </div>
  );
};
