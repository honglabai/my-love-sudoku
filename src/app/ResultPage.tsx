import React, { useEffect, useState } from 'react';
import { RewardResult, getRequiredXPForLevel, PlayerInventory } from '../features/progression/progression';
import { Achievement } from '../features/achievements/achievements';
import { getStageById } from '../features/stages/stageData';
import { sound } from '../audio/sound';
import { fireVictoryConfetti } from '../components/ConfettiCelebration';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { StarRating } from '../components/StarRating';
import { ProgressBar } from '../components/ProgressBar';
import { Badge } from '../components/Badge';
import { ItemDrawer } from '../components/ItemDrawer';
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
  onBuyItem?: (itemType: keyof PlayerInventory) => boolean;
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
  onGoToMap,
  onBuyItem
}) => {
  const { t, language } = useI18n();
  const [showShopModal, setShowShopModal] = useState(false);
  const stage = getStageById(stageId);
  const nextStageId = rewardResult.nextUnlockedStage || (stageId < 50 ? stageId + 1 : null);

  useEffect(() => {
    sound.playVictory();
    fireVictoryConfetti(reducedMotion);
    // Play cheerful coin jingle after victory fanfare
    const coinTimer = setTimeout(() => sound.playCoin(), 450);
    if (rewardResult.leveledUp) {
      setTimeout(() => sound.playLevelUp(), 800);
    }
    return () => clearTimeout(coinTimer);
  }, [reducedMotion, rewardResult.leveledUp]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const reqXP = getRequiredXPForLevel(rewardResult.updatedProgression.level);

  const getItemName = (id: keyof PlayerInventory) => {
    switch (id) {
      case 'autoSolve': return language === 'en' ? 'Clairvoyant Magnifier' : language === 'ja' ? '千里眼の虫眼鏡' : language === 'zh' ? '千里眼放大镜' : '천리안 돋보기';
      case 'healMistake': return language === 'en' ? 'Heart-Calming Pill' : language === 'ja' ? '清心丸' : language === 'zh' ? '定心丸' : '정심환';
      case 'clearErrors': return language === 'en' ? 'Incense of Purification' : language === 'ja' ? '浄化の香' : language === 'zh' ? '清净檀香' : '정화의 향';
      case 'autoCandidates': return language === 'en' ? 'Talisman of Insight' : language === 'ja' ? '洞察の護符' : language === 'zh' ? '洞察符文' : '통찰의 부적';
    }
  };

  const getItemIcon = (id: keyof PlayerInventory) => {
    switch (id) {
      case 'autoSolve': return '🔍';
      case 'healMistake': return '💊';
      case 'clearErrors': return '🧹';
      case 'autoCandidates': return '📜';
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-screen max-w-md mx-auto p-4 sm:p-6 pb-8 select-none">
      {/* Top Victory Header */}
      <header className="text-center mt-3">
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
        <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
          {t('common.stage')} {stageId}. {stage ? getLocalizedStageTitle(stage.id, language) : ''}
        </p>
      </header>

      {/* Main Result Card */}
      <main className="w-full space-y-3 my-auto">
        <Card className="text-center p-5 sm:p-6 border-blue-200/80 dark:border-blue-900/60 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          {/* Star Rating */}
          <div className="mb-3.5">
            <StarRating stars={rewardResult.starsEarned} size="lg" animated />
            <div className="text-sm font-black text-amber-500 mt-1.5">
              {rewardResult.starsEarned === 3
                ? t('result.perfectLogic')
                : rewardResult.starsEarned === 2
                ? t('result.greatLogic')
                : t('result.clear')}
            </div>
          </div>

          {/* Stats Grid: Time / Mistakes / Hints */}
          <div className="grid grid-cols-3 gap-1.5 p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl mb-3 text-center border border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{t('result.clearTime')}</div>
              <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                {formatTime(elapsedSeconds)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{t('result.mistakes')}</div>
              <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                {mistakes}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{t('result.hintsUsed')}</div>
              <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                {hintsUsed}
              </div>
            </div>
          </div>

          {/* Dual Clear Rewards Announcement Card: Credits & XP */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-center">
            {/* 🪙 Credits Earned Box */}
            <div className="p-3 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-slate-800 dark:to-amber-950/40 border border-amber-300 dark:border-amber-700/70 rounded-2xl shadow-xs">
              <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center justify-center gap-1">
                <span>🪙</span>
                <span>{t('result.creditsEarned')}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
                +{rewardResult.creditsEarned}
              </div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5 truncate">
                {t('result.currentCredits')}: {rewardResult.updatedProgression.credits}
              </div>
            </div>

            {/* 🌟 XP Earned Box */}
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-slate-800 dark:to-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl shadow-xs">
              <div className="text-[11px] font-bold text-blue-700 dark:text-blue-300 flex items-center justify-center gap-1">
                <span>🌟</span>
                <span>{t('result.xpEarned')}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-300 mt-0.5">
                +{rewardResult.xpEarned} <span className="text-xs font-semibold">XP</span>
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5 truncate">
                {rewardResult.isFirstClear
                  ? t('result.firstClearBonus')
                  : rewardResult.isNewStarRecord
                  ? t('result.newStarRecord')
                  : `Lv. ${rewardResult.updatedProgression.level}`}
              </div>
            </div>
          </div>

          {/* 🎁 Bonus Item Reward Banner if awarded */}
          {rewardResult.bonusItemAwarded && (
            <div className="p-2.5 mb-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 dark:from-slate-800 dark:to-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-left flex items-center gap-2.5 animate-pop shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-emerald-300 dark:border-emerald-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
                {getItemIcon(rewardResult.bonusItemAwarded.item)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    {t('result.bonusItem')}
                  </span>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                    +{rewardResult.bonusItemAwarded.count}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                  {getItemName(rewardResult.bonusItemAwarded.item)}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {t('result.bonusItemDesc')}
                </div>
              </div>
            </div>
          )}

          {/* Level Up Fanfare Banner */}
          {rewardResult.leveledUp && (
            <div className="p-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-2xl font-black mb-3 shadow-lg animate-pop">
              <div className="text-xs">🌟 {t('result.levelUp')} 🌟</div>
              <div className="text-base sm:text-lg">
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

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {nextStageId && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              pill
              onClick={() => onNextStage(nextStageId)}
              className="text-base font-black shadow-lg py-3"
            >
              {t('result.nextStage')} ({t('common.stage')} {nextStageId}) ➔
            </Button>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="secondary"
              size="md"
              pill
              onClick={() => onReplay(stageId)}
              className="font-bold text-xs py-2 px-1"
            >
              🔄 {t('result.replay')}
            </Button>

            <Button
              variant="secondary"
              size="md"
              pill
              onClick={() => setShowShopModal(true)}
              className="font-black text-xs py-2 px-1 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700"
            >
              🎒 {t('item.buy')}
            </Button>

            <Button
              variant="ghost"
              size="md"
              pill
              onClick={onGoToMap}
              className="font-bold text-xs py-2 px-1 bg-white/70 dark:bg-slate-800/70"
            >
              🗺️ {t('result.stageList')}
            </Button>
          </div>
        </div>
      </main>

      <footer className="text-xs text-slate-500 dark:text-slate-400 text-center">
        {t('common.autoSaved')}
      </footer>

      {/* Item Shop Drawer Modal from Result Page */}
      <ItemDrawer
        isOpen={showShopModal}
        onClose={() => setShowShopModal(false)}
        inventory={rewardResult.updatedProgression.inventory}
        credits={rewardResult.updatedProgression.credits}
        onBuyItem={onBuyItem}
        mistakes={0}
        hasErrorsOnBoard={false}
        onUseItem={() => {
          setShowShopModal(false);
        }}
      />
    </div>
  );
};
