import React, { useState } from 'react';
import { WORLDS, getStagesByWorld } from '../features/stages/stageData';
import { PlayerProgression } from '../features/progression/progression';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { StarRating } from '../components/StarRating';

interface StageMapPageProps {
  progression: PlayerProgression;
  onSelectStage: (stageId: number) => void;
  onBack: () => void;
}

export const StageMapPage: React.FC<StageMapPageProps> = ({
  progression,
  onSelectStage,
  onBack
}) => {
  // Determine the default active world tab based on highest unlocked stage
  const currentWorldId = Math.min(5, Math.floor((progression.unlockedStageMax - 1) / 10) + 1);
  const [selectedWorldId, setSelectedWorldId] = useState<number>(currentWorldId);

  const activeWorld = WORLDS.find(w => w.id === selectedWorldId) || WORLDS[0];
  const stages = getStagesByWorld(selectedWorldId);

  // Calculate stats for current world
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
    <div className="flex flex-col min-h-screen max-w-lg mx-auto p-4 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 pt-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← 홈으로
        </Button>
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">스테이지 지도</h2>
        <div className="w-16 text-right">
          <Badge variant="amber" size="sm">
            ⭐ {progression.totalStars}
          </Badge>
        </div>
      </div>

      {/* World Selector Tabs */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl mb-4">
        {WORLDS.map(w => {
          const isCurrent = w.id === selectedWorldId;
          const isWorldUnlocked = progression.unlockedStageMax >= w.stageStart;
          return (
            <button
              key={w.id}
              onClick={() => setSelectedWorldId(w.id)}
              className={`py-2 px-1 text-center rounded-xl transition-all font-bold text-xs ${
                isCurrent
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div>{w.id}월드</div>
              <div className="text-[10px] font-normal truncate opacity-80">{w.name}</div>
              {!isWorldUnlocked && <div className="text-[10px] mt-0.5">🔒</div>}
            </button>
          );
        })}
      </div>

      {/* World Info Card */}
      <Card className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border-blue-200/60 dark:border-blue-900/40">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">
                {activeWorld.id === 1 ? '🌱' : activeWorld.id === 2 ? '🧭' : activeWorld.id === 3 ? '🏰' : activeWorld.id === 4 ? '👑' : '✨'}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                월드 {activeWorld.id}. {activeWorld.name}
              </h3>
              <Badge variant={activeWorld.id === 5 ? 'rose' : activeWorld.id >= 3 ? 'amber' : 'blue'} size="sm">
                {activeWorld.difficulty}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{activeWorld.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">진행률</div>
            <div className="text-sm font-black text-blue-600 dark:text-blue-400">
              {clearedCount} / 10
            </div>
          </div>
        </div>
      </Card>

      {/* Stages List */}
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
                  ? 'opacity-50 pointer-events-none bg-slate-100 dark:bg-slate-900/40'
                  : stage.isBoss
                  ? 'border-amber-400/80 dark:border-amber-500/60 bg-gradient-to-r from-amber-50/50 to-orange-50/30 dark:from-slate-900 dark:to-amber-950/20'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                      !isUnlocked
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        : stage.isBoss
                        ? 'bg-amber-500 text-white shadow-amber-500/30 shadow-md'
                        : record
                        ? 'bg-blue-600 text-white shadow-blue-500/20 shadow-sm'
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
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                      도전 가능
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
    </div>
  );
};
