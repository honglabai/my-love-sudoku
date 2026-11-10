import React, { useState, useEffect, useCallback } from 'react';
import {
  loadGameData,
  saveGameData,
  resetAllData,
  SaveDataV1,
  ActiveGameSave,
  UserSettings
} from '../storage/storage';
import { claimStageReward, RewardResult } from '../features/progression/progression';
import { evaluateAchievements, Achievement } from '../features/achievements/achievements';
import { getStageById } from '../features/stages/stageData';
import { sound } from '../audio/sound';

import { ThemeBackground } from '../components/ThemeBackground';
import { BottomNavigationBar } from '../components/BottomNavigationBar';
import { HomePage } from './HomePage';
import { StageMapPage } from './StageMapPage';
import { DailyQuestPage } from './DailyQuestPage';
import { GamePage } from './GamePage';
import { ResultPage } from './ResultPage';
import { ProfilePage } from './ProfilePage';

export type AppView = 'home' | 'stage-map' | 'daily-quest' | 'game' | 'result' | 'profile' | 'settings';

interface GameResultData {
  stageId: number;
  rewardResult: RewardResult;
  newAchievements: Achievement[];
  elapsedSeconds: number;
  mistakes: number;
  hintsUsed: number;
}

export const App: React.FC = () => {
  const [data, setData] = useState<SaveDataV1>(() => loadGameData());
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedStageId, setSelectedStageId] = useState<number>(1);
  const [selectedWorldId, setSelectedWorldId] = useState<number>(1);
  const [lastResult, setLastResult] = useState<GameResultData | null>(null);

  // Sync sound manager enabled state
  useEffect(() => {
    sound.setEnabled(data.settings.soundEnabled);
  }, [data.settings.soundEnabled]);

  // Sync Theme (dark class on document root)
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      data.settings.theme === 'dark' ||
      (data.settings.theme === 'system' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [data.settings.theme]);

  // Persist save data on change
  const updateData = useCallback((updater: (prev: SaveDataV1) => SaveDataV1) => {
    setData(prev => {
      const next = updater(prev);
      saveGameData(next);
      return next;
    });
  }, []);

  const handleNavigate = (view: AppView, stageId?: number) => {
    if (stageId) {
      setSelectedStageId(stageId);
      const st = getStageById(stageId);
      if (st) setSelectedWorldId(st.worldId);
    }
    setCurrentView(view);
  };

  const handleSelectStage = (stageId: number) => {
    setSelectedStageId(stageId);
    const st = getStageById(stageId);
    if (st) setSelectedWorldId(st.worldId);
    setCurrentView('game');
  };

  const handleSaveActiveGame = useCallback((activeGame: ActiveGameSave | null) => {
    updateData(prev => ({
      ...prev,
      activeGame
    }));
  }, [updateData]);

  // Stage clear handler with idempotent transaction
  const handleGameComplete = useCallback((result: {
    stageId: number;
    worldId: number;
    mistakes: number;
    hintsUsed: number;
    elapsedSeconds: number;
  }) => {
    updateData(prev => {
      // 1. Claim stage reward (stars, XP, levelup, unlock next stage)
      const rewardResult = claimStageReward(
        prev.progression,
        result.stageId,
        result.worldId,
        result.mistakes,
        result.hintsUsed,
        result.elapsedSeconds
      );

      // 2. Evaluate achievements
      const achResult = evaluateAchievements(
        rewardResult.updatedProgression,
        prev.achievements,
        {
          stageId: result.stageId,
          mistakes: result.mistakes,
          hintsUsed: result.hintsUsed,
          elapsedSeconds: result.elapsedSeconds
        }
      );

      // 3. Add any newly unlocked titles
      const updatedTitles = [...rewardResult.updatedProgression.unlockedTitles];
      achResult.newTitles.forEach(t => {
        if (!updatedTitles.includes(t)) updatedTitles.push(t);
      });
      rewardResult.updatedProgression.unlockedTitles = updatedTitles;

      setLastResult({
        stageId: result.stageId,
        rewardResult,
        newAchievements: achResult.newlyUnlocked,
        elapsedSeconds: result.elapsedSeconds,
        mistakes: result.mistakes,
        hintsUsed: result.hintsUsed
      });

      setCurrentView('result');

      return {
        ...prev,
        progression: rewardResult.updatedProgression,
        achievements: achResult.updatedAchievements,
        activeGame: null // clear active game upon completion
      };
    });
  }, [updateData]);

  const handleUpdateSettings = (partial: Partial<UserSettings>) => {
    updateData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...partial
      }
    }));
  };

  const handleEquipTitle = (title: string) => {
    updateData(prev => ({
      ...prev,
      progression: {
        ...prev.progression,
        equippedTitle: title
      }
    }));
  };

  const handleResetData = () => {
    const fresh = resetAllData();
    setData(fresh);
    setCurrentView('home');
  };

  const handlePlayGame = () => {
    if (data.activeGame) {
      setSelectedStageId(data.activeGame.stageId);
      const st = getStageById(data.activeGame.stageId);
      if (st) setSelectedWorldId(st.worldId);
    } else {
      const nextStage = data.progression.unlockedStageMax || 1;
      setSelectedStageId(nextStage);
      const st = getStageById(nextStage);
      if (st) setSelectedWorldId(st.worldId);
    }
    setCurrentView('game');
  };

  const handleStartDailyStage = (stageId: number) => {
    setSelectedStageId(stageId);
    const st = getStageById(stageId);
    if (st) setSelectedWorldId(st.worldId);
    setCurrentView('game');
  };

  // Determine which background to show
  let currentBackgroundWorldId: number | undefined = undefined;
  if (currentView === 'game') {
    const st = getStageById(selectedStageId);
    currentBackgroundWorldId = st ? st.worldId : 1;
  } else if (currentView === 'stage-map') {
    currentBackgroundWorldId = selectedWorldId;
  } else if (currentView === 'result' && lastResult) {
    const st = getStageById(lastResult.stageId);
    currentBackgroundWorldId = st ? st.worldId : 1;
  }

  return (
    <div className="relative min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Dynamic Zen Watercolor Theme Background */}
      <ThemeBackground
        worldId={currentBackgroundWorldId || 1}
        isGameView={currentView === 'game'}
      />

      {/* Screen Views */}
      {currentView === 'home' && (
        <HomePage
          progression={data.progression}
          activeGame={data.activeGame}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'stage-map' && (
        <StageMapPage
          progression={data.progression}
          onSelectStage={handleSelectStage}
          onBack={() => setCurrentView('home')}
          onWorldChange={(wId) => setSelectedWorldId(wId)}
        />
      )}

      {currentView === 'daily-quest' && (
        <DailyQuestPage
          progression={data.progression}
          onStartDailyStage={handleStartDailyStage}
          onBack={() => setCurrentView('home')}
        />
      )}

      {currentView === 'game' && (
        <GamePage
          stageId={selectedStageId}
          activeGameSave={data.activeGame}
          settings={data.settings}
          inventory={data.progression.inventory}
          onUpdateInventory={(nextInv) => {
            updateData(prev => ({
              ...prev,
              progression: {
                ...prev.progression,
                inventory: nextInv
              }
            }));
          }}
          onGameComplete={handleGameComplete}
          onSaveActiveGame={handleSaveActiveGame}
          onExit={() => setCurrentView('stage-map')}
        />
      )}

      {currentView === 'result' && lastResult && (
        <ResultPage
          stageId={lastResult.stageId}
          rewardResult={lastResult.rewardResult}
          newAchievements={lastResult.newAchievements}
          elapsedSeconds={lastResult.elapsedSeconds}
          mistakes={lastResult.mistakes}
          hintsUsed={lastResult.hintsUsed}
          reducedMotion={data.settings.reducedMotion}
          onNextStage={(nextId) => {
            setSelectedStageId(nextId);
            const st = getStageById(nextId);
            if (st) setSelectedWorldId(st.worldId);
            setCurrentView('game');
          }}
          onReplay={(stageId) => {
            setSelectedStageId(stageId);
            setCurrentView('game');
          }}
          onGoToMap={() => setCurrentView('stage-map')}
        />
      )}

      {currentView === 'profile' && (
        <ProfilePage
          progression={data.progression}
          achievements={data.achievements}
          settings={data.settings}
          onUpdateSettings={handleUpdateSettings}
          onEquipTitle={handleEquipTitle}
          onResetData={handleResetData}
          onBack={() => setCurrentView('home')}
          initialTab="profile"
        />
      )}

      {currentView === 'settings' && (
        <ProfilePage
          progression={data.progression}
          achievements={data.achievements}
          settings={data.settings}
          onUpdateSettings={handleUpdateSettings}
          onEquipTitle={handleEquipTitle}
          onResetData={handleResetData}
          onBack={() => setCurrentView('home')}
          initialTab="settings"
        />
      )}

      {/* Pin 3 Protruding Bottom Navigation Dock Bar */}
      {currentView !== 'game' && currentView !== 'result' && (
        <BottomNavigationBar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onPlayGame={handlePlayGame}
          hasActiveGame={!!data.activeGame}
        />
      )}
    </div>
  );
};
