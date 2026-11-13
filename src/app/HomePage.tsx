import React, { useState, useEffect } from 'react';
import { PlayerProgression, getRequiredXPForLevel } from '../features/progression/progression';
import { ActiveGameSave } from '../storage/storage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { getStageById } from '../features/stages/stageData';
import { TopHeader } from '../components/TopHeader';
import { LevelTestModal } from '../components/LevelTestModal';
import { PrivacyPolicyModal } from '../components/PrivacyPolicyModal';
import { TermsOfServiceModal } from '../components/TermsOfServiceModal';
import { SudokuGuideModal } from '../components/SudokuGuideModal';
import { AboutContactModal } from '../components/AboutContactModal';
import { AdSenseUnit } from '../components/AdSenseUnit';
import { useI18n } from '../i18n';

interface HomePageProps {
  progression: PlayerProgression;
  activeGame: ActiveGameSave | null;
  onNavigate: (view: 'home' | 'stage-map' | 'game' | 'profile' | 'settings', stageId?: number) => void;
  onApplyLevelTest: (stageId: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  progression,
  activeGame,
  onNavigate,
  onApplyLevelTest
}) => {
  const { t, language } = useI18n();
  const [showLevelTest, setShowLevelTest] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Auto-open modal if URL query param is present (for crawlers, sitemap & deep links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'privacy') setShowPrivacy(true);
    else if (view === 'terms') setShowTerms(true);
    else if (view === 'guide') setShowGuide(true);
    else if (view === 'about') setShowAbout(true);
  }, []);
  const reqXP = getRequiredXPForLevel(progression.level);
  const activeStage = activeGame ? getStageById(activeGame.stageId) : null;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const percent = Math.min(100, Math.max(0, Math.round((progression.currentXP / Math.max(1, reqXP)) * 100)));

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-screen max-w-md mx-auto px-2.5 py-1 sm:px-4 pb-14">
      {/* Top Header: Title Logo Image with App Install Button */}
      <TopHeader />

      {/* Main Profile & Gamification Card */}
      <main className="w-full space-y-2 my-auto">
        <Card className="relative overflow-hidden border-blue-200/80 dark:border-blue-900/40 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 sm:p-3.5">
          {/* Top user title announcement */}
          <div className="text-center pt-0 pb-1">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
              {t('profile.titleTitle')}
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {progression.equippedTitle}
            </div>
          </div>

          {/* Gamification Tier Progression Bar with Tooltip */}
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-2.5 sm:p-3 border border-slate-100 dark:border-slate-800 mb-1.5">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">{t('profile.levelInfo')}</span>
              <span className="text-blue-600 dark:text-blue-400">
                {progression.currentXP} / {reqXP} XP ({percent}%)
              </span>
            </div>

            {/* Progress Track */}
            <div className="relative w-full h-2.5 bg-slate-200/80 dark:bg-slate-700/80 rounded-full p-0.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Checkpoint Tier Markers */}
            <div className="grid grid-cols-4 gap-0.5 text-[11px] text-center mt-1.5 font-bold text-slate-500 dark:text-slate-400">
              <div className={progression.level >= 1 ? 'text-blue-600 dark:text-blue-400' : ''}>
                <div>{language === 'en' ? 'Novice' : language === 'ja' ? '入門者' : language === 'zh' ? '初学者' : '입문자'}</div>
                <div className="text-[9.5px] opacity-75">Lv.1</div>
              </div>
              <div className={progression.level >= 5 ? 'text-blue-600 dark:text-blue-400' : ''}>
                <div>{language === 'en' ? 'Explorer' : language === 'ja' ? '探検家' : language === 'zh' ? '探索者' : '탐험가'}</div>
                <div className="text-[9.5px] opacity-75">Lv.5</div>
              </div>
              <div className={progression.level >= 15 ? 'text-blue-600 dark:text-blue-400' : ''}>
                <div>{language === 'en' ? 'Collector' : language === 'ja' ? '収集家' : language === 'zh' ? '收集家' : '수집가'}</div>
                <div className="text-[9.5px] opacity-75">Lv.15</div>
              </div>
              <div className={progression.level >= 30 ? 'text-blue-600 dark:text-blue-400' : ''}>
                <div>{language === 'en' ? 'Master' : language === 'ja' ? '達人' : language === 'zh' ? '宗师' : '마스터'}</div>
                <div className="text-[9.5px] opacity-75">Lv.30+</div>
              </div>
            </div>
          </div>

          {/* Cumulative Stats Grid */}
          <div className="grid grid-cols-2 gap-1.5 text-center">
            <div className="p-2 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-800/80 dark:to-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 rounded-xl">
              <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">{t('home.statsStars')}</div>
              <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
                ⭐ {progression.totalStars} <span className="text-[10px] font-semibold text-slate-400">/ 150</span>
              </div>
            </div>

            <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-800/80 dark:to-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 rounded-xl">
              <div className="text-[11px] font-bold text-blue-700 dark:text-blue-400">{t('home.statsCleared')}</div>
              <div className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
                🧩 {Object.keys(progression.stageRecords).length}{' '}
                <span className="text-[10px] font-semibold text-slate-400">/ 50</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Continue in-progress game card if active game exists */}
        {activeGame && activeStage && (
          <Card
            hoverable
            onClick={() => onNavigate('game', activeGame.stageId)}
            className="border-amber-300 dark:border-amber-700/80 bg-amber-50/90 dark:bg-amber-950/40 animate-pulse shadow-md p-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-base shadow-sm">
                  ⏳
                </div>
                <div>
                  <div className="text-[10px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    {t('home.activeGameTitle')}
                  </div>
                  <div className="text-xs font-black text-slate-900 dark:text-slate-100">
                    {t('common.stage')} {activeStage.id}. {activeStage.title}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    {t('home.activeGameProgress')}: {formatTime(activeGame.elapsedSeconds)} · {t('game.mistakes')}: {activeGame.mistakes}
                  </div>
                </div>
              </div>
              <Button size="sm" variant="accent" pill className="py-1 px-3 text-xs">
                {t('home.continue')}
              </Button>
            </div>
          </Card>
        )}

        {/* Action Buttons: Minimized Spacing & Compact Side-by-Side Sub-Actions */}
        <div className="space-y-1.5 pt-0.5">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => onNavigate('stage-map')}
            className="py-2.5 text-sm sm:text-base font-black shadow-md"
          >
            🗺️ {t('home.stageJourney')}
          </Button>

          {/* 2-Column Minimized Gap Sub Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => setShowLevelTest(true)}
              className="py-2 text-[11.5px] font-black bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-amber-950/30 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 shadow-2xs"
            >
              🎯 {t('home.levelTest')}
            </Button>

            <button
              onClick={() => setShowGuide(true)}
              className="py-2 px-2 rounded-xl bg-white/85 dark:bg-slate-900/85 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11.5px] flex items-center justify-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-98 transition-all shadow-2xs"
            >
              <span>📖</span>
              <span>{t('home.sudokuGuide')}</span>
            </button>
          </div>
        </div>

        {/* AdSense Placement Slot - Minimized Vertical Margins */}
        <AdSenseUnit className="my-1 py-1.5" />
      </main>

      {/* Semantic Footer with Full Transparency Links */}
      <footer className="w-full text-center text-xs text-slate-500 dark:text-slate-500 mt-1 space-y-1 select-none">
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
          <button
            onClick={() => setShowPrivacy(true)}
            className="hover:text-blue-600 dark:hover:text-blue-400 underline decoration-slate-300 dark:decoration-slate-700"
          >
            {t('profile.privacy')}
          </button>
          <span>·</span>
          <button
            onClick={() => setShowTerms(true)}
            className="hover:text-blue-600 dark:hover:text-blue-400 underline decoration-slate-300 dark:decoration-slate-700"
          >
            {t('profile.terms')}
          </button>
          <span>·</span>
          <button
            onClick={() => setShowGuide(true)}
            className="hover:text-blue-600 dark:hover:text-blue-400 underline decoration-slate-300 dark:decoration-slate-700"
          >
            {t('home.sudokuGuide')}
          </button>
          <span>·</span>
          <button
            onClick={() => setShowAbout(true)}
            className="hover:text-blue-600 dark:hover:text-blue-400 underline decoration-slate-300 dark:decoration-slate-700"
          >
            {t('profile.about')}
          </button>
        </div>

        <p className="text-[10px] text-slate-400 dark:text-slate-500">
          {t('brand.title')} · v1.0.0
        </p>
      </footer>

      {/* Diagnostic Level Test Modal */}
      <LevelTestModal
        isOpen={showLevelTest}
        onClose={() => setShowLevelTest(false)}
        onSelectPlacementStage={onApplyLevelTest}
      />

      {/* Google AdSense Mandatory Modals */}
      <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsOfServiceModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <SudokuGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      <AboutContactModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
};
