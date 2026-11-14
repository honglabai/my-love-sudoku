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
import { useI18n, getLocalizedStageTitle, getLocalizedTitle, getLocalizedAchievement } from '../i18n';

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
  const { t, language } = useI18n();
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
    <div className="relative z-10 flex flex-col items-center justify-between min-h-screen max-w-md mx-auto p-4 sm:p-6 pb-8 select-none">
      {/* Top Victory Header */}
      <header className="text-center mt-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl sm:text-3xl select-none" aria-hidden="true">
            🎉
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-serif">
            {t('result.stageComplete')}
          </h1>
          <span className="inline-block text-2xl sm:text-3xl select-none -scale-x-100" aria-hidden="true">
            🎉
          </span>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
          {t('common.stage')} {stageId}. {stage ? getLocalizedStageTitle(stage.id, language) : ''}
        </p>
      </header>

      {/* Main Result Card */}
      <main className="w-full space-y-3.5 my-auto">
        <Card className="text-center p-6 border-blue-200/80 dark:border-blue-900/60 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          {/* Star Rating */}
          <div className="mb-4">
            <StarRating stars={rewardResult.starsEarned} size="lg" animated />
            <div className="text-sm font-black text-amber-500 mt-2">
              {rewardResult.starsEarned === 3
                ? t('result.perfectLogic')
                : rewardResult.starsEarned === 2
                ? t('result.greatLogic')
                : t('result.clear')}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl mb-4 text-center border border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{t('result.clearTime')}</div>
              <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                {formatTime(elapsedSeconds)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{t('result.mistakes')}</div>
              <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                {mistakes}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{t('result.hintsUsed')}</div>
              <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                {hintsUsed}
              </div>
            </div>
          </div>

          {/* XP Gained Announcement */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900 rounded-2xl mb-4">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400">{t('result.xpEarned')}</div>
            <div className="text-2xl font-black text-blue-700 dark:text-blue-300">
              +{rewardResult.xpEarned} <span className="text-xs font-semibold">XP</span>
            </div>
            {rewardResult.isFirstClear && (
              <div className="text-[11px] text-blue-500 dark:text-blue-400 font-bold mt-0.5">
                {t('result.firstClearBonus')}
              </div>
            )}
            {!rewardResult.isFirstClear && rewardResult.isNewStarRecord && (
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                {t('result.newStarRecord')}
              </div>
            )}
          </div>

          {/* Level Up Fanfare Banner */}
          {rewardResult.leveledUp && (
            <div className="p-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-2xl font-black mb-4 shadow-lg animate-pop">
              <div className="text-sm">🌟 {t('result.levelUp')} 🌟</div>
              <div className="text-lg">
                Lv. {rewardResult.oldLevel} ➔ Lv. {rewardResult.newLevel}
              </div>
            </div>
          )}

          {/* Level Progress */}
          <div className="text-left">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-slate-700 dark:text-slate-300">
                {t('result.playerLevel')} {rewardResult.updatedProgression.level}
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
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-slate-900 dark:to-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-2xl animate-pop shadow-sm"
              >
                <span className="text-2xl">{ach.icon}</span>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {t('result.newAchievement')}
                    </span>
                    <Badge variant="amber" size="sm">
                      {getLocalizedTitle(ach.rewardTitle, language)}
                    </Badge>
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {getLocalizedAchievement(ach.id, language)?.name || ach.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons (3D Tactile Pills) */}
        <div className="space-y-2 pt-2">
          {nextStageId && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              pill
              onClick={() => onNextStage(nextStageId)}
              className="text-base font-black shadow-lg"
            >
              {t('result.nextStage')} ({t('common.stage')} {nextStageId}) ➔
            </Button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="md"
              pill
              onClick={() => onReplay(stageId)}
              className="font-bold"
            >
              🔄 {t('result.replay')}
            </Button>

            <Button
              variant="ghost"
              size="md"
              pill
              onClick={onGoToMap}
              className="font-bold bg-white/70 dark:bg-slate-800/70"
            >
              🗺️ {t('result.stageList')}
            </Button>
          </div>
        </div>
      </main>

      <footer className="text-xs text-slate-500 dark:text-slate-400 text-center">
        {t('common.autoSaved')}
      </footer>
    </div>
  );
};
