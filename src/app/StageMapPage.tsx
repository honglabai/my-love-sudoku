import React, { useState } from 'react';
import { WORLDS, getStagesByWorld } from '../features/stages/stageData';
import { PlayerProgression } from '../features/progression/progression';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { StarRating } from '../components/StarRating';
import { StampBadge } from '../components/StampBadge';

interface StageMapPageProps {
  progression: PlayerProgression;
  onSelectStage: (stageId: number) => void;
  onBack: () => void;
  onWorldChange?: (worldId: number) => void;
}

export const StageMapPage: React.FC<StageMapPageProps> = ({
  progression,
  onSelectStage,
  onBack,
  onWorldChange
}) => {
  const currentWorldId = Math.min(5, Math.floor((progression.unlockedStageMax - 1) / 10) + 1);
  const [selectedWorldId, setSelectedWorldId] = useState<number>(currentWorldId);
  const [viewMode, setViewMode] = useState<'roadmap' | 'list'>('roadmap');

  const handleSelectWorld = (worldId: number) => {
    setSelectedWorldId(worldId);
    onWorldChange?.(worldId);
  };

  const activeWorld = WORLDS.find(w => w.id === selectedWorldId) || WORLDS[0];
  const stages = getStagesByWorld(selectedWorldId);

  let clearedCount = 0;
  let worldStars = 0;
  stages.forEach(s => {
    const rec = progression.stageRecords[s.id];
    if (rec) {
      clearedCount++;
      worldStars += rec.stars;
    }
  });

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen max-w-lg mx-auto p-3 sm:p-4 pb-20 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-3 pt-2">
        <Button variant="ghost" size="sm" pill onClick={onBack}>
          ← 홈으로
        </Button>
        <div className="text-center">
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
            스테이지 여정
          </h2>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            총 별점: ⭐ {progression.totalStars} / 150
          </span>
        </div>
        <div className="w-16 text-right">
          <Badge variant="blue" size="sm">
            Lv. {progression.level}
          </Badge>
        </div>
      </div>

      {/* World Selector Tabs (Segmented Pill) */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-full mb-3 shadow-sm">
        {WORLDS.map(w => {
          const isCurrent = w.id === selectedWorldId;
          const isWorldUnlocked = progression.unlockedStageMax >= w.stageStart;
          return (
            <button
              key={w.id}
              onClick={() => handleSelectWorld(w.id)}
              className={`py-2 px-1 text-center rounded-full transition-all font-bold text-xs ${
                isCurrent
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div>{w.id}월드</div>
              <div className="text-[10px] font-normal truncate opacity-85">{w.name}</div>
              {!isWorldUnlocked && <div className="text-[10px] mt-0.5">🔒</div>}
            </button>
          );
        })}
      </div>

      {/* World Thematic Banner */}
      <Card className="mb-3 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-blue-200/70 dark:border-blue-900/50 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">
                {activeWorld.id === 1 ? '🌸' : activeWorld.id === 2 ? '🎋' : activeWorld.id === 3 ? '🏯' : activeWorld.id === 4 ? '🍁' : '☀️'}
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                월드 {activeWorld.id}. {activeWorld.name}
              </h3>
              <Badge variant={activeWorld.id === 5 ? 'rose' : activeWorld.id >= 3 ? 'amber' : 'blue'} size="sm">
                {activeWorld.difficulty}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{activeWorld.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">클리어</div>
            <div className="text-base font-black text-blue-600 dark:text-blue-400">
              {clearedCount} / 10
            </div>
          </div>
        </div>
      </Card>

      {/* View Mode Toggle (Roadmap vs List) */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-full text-xs font-bold shadow-inner">
          <button
            onClick={() => setViewMode('roadmap')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              viewMode === 'roadmap'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            🗺️ 스탬프 여정
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            📋 상세 목록
          </button>
        </div>
      </div>

      {/* Mode 1: Winding Stamp Journey Roadmap (Inspired by Pin 2) */}
      {viewMode === 'roadmap' && (
        <Card className="relative p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-blue-200/60 dark:border-blue-900/40">
          <div className="text-center text-xs font-bold text-slate-500 dark:text-slate-400 mb-6">
            단계별 스탬프를 획득하여 월드를 정복하세요!
          </div>

          {/* Staggered S-Curve Stamp Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-7 gap-x-4 place-items-center">
            {stages.map(stage => {
              const isUnlocked = stage.id <= progression.unlockedStageMax;
              const isCurrent = stage.id === progression.unlockedStageMax;
              const record = progression.stageRecords[stage.id];

              return (
                <StampBadge
                  key={stage.id}
                  stageId={stage.id}
                  stageNumberInWorld={stage.stageNumberInWorld}
                  title={stage.title}
                  isUnlocked={isUnlocked}
                  isCurrent={isCurrent}
                  isBoss={stage.isBoss}
                  stars={record ? record.stars : 0}
                  onClick={() => onSelectStage(stage.id)}
                />
              );
            })}
          </div>
        </Card>
      )}

      {/* Mode 2: Detailed Stage List */}
      {viewMode === 'list' && (
        <div className="space-y-2.5">
          {stages.map(stage => {
            const isUnlocked = stage.id <= progression.unlockedStageMax;
            const record = progression.stageRecords[stage.id];

            return (
              <Card
                key={stage.id}
                hoverable={isUnlocked}
                onClick={() => {
                  if (isUnlocked) onSelectStage(stage.id);
                }}
                className={`transition-all ${
                  !isUnlocked
                    ? 'opacity-40 pointer-events-none bg-slate-100 dark:bg-slate-900/40'
                    : stage.isBoss
                    ? 'border-amber-400/80 dark:border-amber-500/60 bg-gradient-to-r from-amber-50/60 to-orange-50/40 dark:from-slate-900 dark:to-amber-950/20'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${
                        !isUnlocked
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                          : stage.isBoss
                          ? 'bg-amber-500 text-white shadow-amber-500/30'
                          : record
                          ? 'bg-blue-600 text-white shadow-blue-500/20'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {!isUnlocked ? '🔒' : stage.isBoss ? '👑' : stage.id}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {stage.title}
                        </span>
                        {stage.isBoss && (
                          <Badge variant="amber" size="sm">
                            보스
                          </Badge>
                        )}
                        {stage.hasTutorial && (
                          <Badge variant="emerald" size="sm">
                            가이드
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        단서 {stage.cluesCount}개 · {stage.difficulty}
                        {record && ` · 최고기록: ${formatTime(record.bestTime)}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {record ? (
                      <StarRating stars={record.stars} size="sm" />
                    ) : isUnlocked ? (
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                        도전
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">잠김</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
