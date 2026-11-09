import React, { useState } from 'react';
import { PlayerProgression, getRequiredXPForLevel } from '../features/progression/progression';
import { ACHIEVEMENTS } from '../features/achievements/achievements';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { Modal } from '../components/Modal';

interface ProfilePageProps {
  progression: PlayerProgression;
  achievements: Record<string, number>;
  onEquipTitle: (title: string) => void;
  onResetData: () => void;
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  progression,
  achievements,
  onEquipTitle,
  onResetData,
  onBack
}) => {
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const reqXP = getRequiredXPForLevel(progression.level);

  const totalCleared = Object.keys(progression.stageRecords).length;
  const perfectClears = Object.values(progression.stageRecords).filter(r => r.stars === 3).length;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto p-4 pb-12 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 pt-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← 홈으로
        </Button>
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">프로필 & 업적</h2>
        <div className="w-16" />
      </div>

      {/* Main Player Info Card */}
      <Card className="mb-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/40 dark:from-slate-900 dark:to-blue-950/20 border-blue-200/70 dark:border-blue-900/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20 text-white">
              👤
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Badge variant="blue" size="sm">
                  Lv. {progression.level}
                </Badge>
                <button
                  onClick={() => setShowTitleModal(true)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  [칭호 변경]
                </button>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mt-0.5">
                {progression.equippedTitle}
              </h3>
            </div>
          </div>
        </div>

        <ProgressBar
          value={progression.currentXP}
          max={reqXP}
          label={`경험치 (${progression.currentXP} / ${reqXP} XP)`}
          showPercent
          color="blue"
          className="mb-3"
        />

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-center">
          <div className="p-2 bg-white/70 dark:bg-slate-800/60 rounded-xl">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">총 획득 별점</div>
            <div className="text-sm font-extrabold text-amber-500">
              ⭐ {progression.totalStars}
            </div>
          </div>
          <div className="p-2 bg-white/70 dark:bg-slate-800/60 rounded-xl">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">클리어 스테이지</div>
            <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
              {totalCleared} / 50
            </div>
          </div>
          <div className="p-2 bg-white/70 dark:bg-slate-800/60 rounded-xl">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">3성 완벽 클리어</div>
            <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {perfectClears}개
            </div>
          </div>
        </div>
      </Card>

      {/* Achievements Section */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 px-1">
          수집한 업적 배지 ({Object.keys(achievements).length} / {ACHIEVEMENTS.length})
        </h3>

        <div className="space-y-2">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = !!achievements[ach.id];
            return (
              <Card
                key={ach.id}
                className={`transition-all ${
                  isUnlocked
                    ? 'border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-r from-amber-50/20 to-transparent'
                    : 'opacity-50 grayscale'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{ach.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {ach.name}
                      </span>
                      {isUnlocked && (
                        <Badge variant="amber" size="sm">
                          {ach.rewardTitle}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {ach.description}
                    </p>
                  </div>
                  <div>
                    {isUnlocked ? (
                      <span className="text-xs font-bold text-amber-500">달성</span>
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

      {/* Reset Data Button */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
        <button
          onClick={() => setShowResetModal(true)}
          className="text-xs font-semibold text-rose-500 hover:text-rose-700 underline"
        >
          게임 진행 데이터 초기화
        </button>
      </div>

      {/* Title Selection Modal */}
      <Modal
        isOpen={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        title="칭호 선택"
      >
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {progression.unlockedTitles.map(title => {
            const isSelected = progression.equippedTitle === title;
            return (
              <button
                key={title}
                onClick={() => {
                  onEquipTitle(title);
                  setShowTitleModal(false);
                }}
                className={`w-full p-3 rounded-xl font-bold text-sm text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{title}</span>
                {isSelected && <span>✓ 장착 중</span>}
              </button>
            );
          })}
        </div>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => setShowTitleModal(false)}
          className="mt-4"
        >
          닫기
        </Button>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="데이터 초기화"
      >
        <div className="space-y-4 text-center">
          <div className="text-4xl">⚠️</div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            정말로 모든 게임 데이터를 초기화하시겠습니까?
            <br />
            모든 스테이지 기록, 획득한 별점, 경험치, 업적이 초기화되며 되돌릴 수 없습니다.
          </p>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowResetModal(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={() => {
                onResetData();
                setShowResetModal(false);
              }}
              className="flex-1"
            >
              초기화 확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
