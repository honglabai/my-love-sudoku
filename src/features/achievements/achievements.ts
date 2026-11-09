import { PlayerProgression } from '../progression/progression';

export interface Achievement {
  id: string;
  name: string;
  rewardTitle: string;
  description: string;
  icon: string;
  isUnlocked: (
    progression: PlayerProgression,
    recentClear?: { stageId: number; mistakes: number; hintsUsed: number; elapsedSeconds: number }
  ) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: '첫 승리',
    rewardTitle: '스도쿠 입문자',
    description: '어떤 스테이지든 첫 번째로 클리어하세요.',
    icon: '🌱',
    isUnlocked: (prog) => Object.keys(prog.stageRecords).length >= 1
  },
  {
    id: 'perfect_reasoning',
    name: '완벽한 추론가',
    rewardTitle: '완벽한 추론가',
    description: '실수와 힌트 없이 퍼즐을 풀어 3성을 달성하세요.',
    icon: '⭐',
    isUnlocked: (prog) => Object.values(prog.stageRecords).some(r => r.stars === 3)
  },
  {
    id: 'world1_clear',
    name: '첫 월드 정복자',
    rewardTitle: '첫 월드 정복자',
    description: '월드 1 (첫걸음) 10개 스테이지를 모두 클리어하세요.',
    icon: '🏆',
    isUnlocked: (prog) => {
      for (let i = 1; i <= 10; i++) {
        if (!prog.stageRecords[i]) return false;
      }
      return true;
    }
  },
  {
    id: 'independent_solver',
    name: '독립적인 해결사',
    rewardTitle: '독립적인 해결사',
    description: '힌트를 전혀 사용하지 않고 10개 이상의 스테이지를 완료하세요.',
    icon: '💡',
    isUnlocked: (prog) => {
      // At least 10 stages cleared with 0 hints (stars >= 2 and mistakes/hints criteria)
      const count = Object.values(prog.stageRecords).filter(r => r.stars >= 2).length;
      return count >= 10;
    }
  },
  {
    id: 'world2_clear',
    name: '논리의 탐구자',
    rewardTitle: '논리의 탐구자',
    description: '월드 2 (논리의 길) 20개 스테이지를 모두 클리어하세요.',
    icon: '🧭',
    isUnlocked: (prog) => {
      for (let i = 1; i <= 20; i++) {
        if (!prog.stageRecords[i]) return false;
      }
      return true;
    }
  },
  {
    id: 'world3_clear',
    name: '탑의 정복자',
    rewardTitle: '탑의 정복자',
    description: '월드 3 (도전의 탑) 30개 스테이지를 모두 클리어하세요.',
    icon: '🏰',
    isUnlocked: (prog) => {
      for (let i = 1; i <= 30; i++) {
        if (!prog.stageRecords[i]) return false;
      }
      return true;
    }
  },
  {
    id: 'world4_clear',
    name: '전문가의 위엄',
    rewardTitle: '전문가의 위엄',
    description: '월드 4 (전문가의 성) 40개 스테이지를 모두 클리어하세요.',
    icon: '👑',
    isUnlocked: (prog) => {
      for (let i = 1; i <= 40; i++) {
        if (!prog.stageRecords[i]) return false;
      }
      return true;
    }
  },
  {
    id: 'sudoku_master',
    name: '스도쿠 마스터',
    rewardTitle: '스도쿠 마스터',
    description: '50개 모든 스테이지를 클리어하고 스도쿠의 신화가 되세요.',
    icon: '✨',
    isUnlocked: (prog) => Object.keys(prog.stageRecords).length >= 50
  },
  {
    id: 'star_collector_30',
    name: '별빛 수집가',
    rewardTitle: '별빛 수집가',
    description: '누적 별 30개 이상을 수집하세요.',
    icon: '🌟',
    isUnlocked: (prog) => prog.totalStars >= 30
  },
  {
    id: 'galaxy_master_100',
    name: '찬란한 은하수',
    rewardTitle: '은하수 마스터',
    description: '누적 별 100개 이상을 수집하세요.',
    icon: '🌌',
    isUnlocked: (prog) => prog.totalStars >= 100
  },
  {
    id: 'speed_demon',
    name: '빛의 속도',
    rewardTitle: '신속한 통찰가',
    description: '3분(180초) 이내에 스테이지를 완료하세요.',
    icon: '⚡',
    isUnlocked: (prog, recentClear) => {
      if (recentClear && recentClear.elapsedSeconds <= 180) return true;
      return Object.values(prog.stageRecords).some(r => r.bestTime <= 180);
    }
  }
];

export interface AchievementEvaluationResult {
  updatedAchievements: Record<string, number>;
  newlyUnlocked: Achievement[];
  newTitles: string[];
}

/**
 * Checks all achievements against current progression.
 * Returns newly unlocked achievements and titles without duplicates.
 */
export function evaluateAchievements(
  progression: PlayerProgression,
  existingAchievements: Record<string, number>,
  recentClear?: { stageId: number; mistakes: number; hintsUsed: number; elapsedSeconds: number }
): AchievementEvaluationResult {
  const updatedAchievements = { ...existingAchievements };
  const newlyUnlocked: Achievement[] = [];
  const newTitles: string[] = [];

  for (const ach of ACHIEVEMENTS) {
    if (!updatedAchievements[ach.id]) {
      if (ach.isUnlocked(progression, recentClear)) {
        updatedAchievements[ach.id] = Date.now();
        newlyUnlocked.push(ach);
        if (!progression.unlockedTitles.includes(ach.rewardTitle)) {
          newTitles.push(ach.rewardTitle);
        }
      }
    }
  }

  return {
    updatedAchievements,
    newlyUnlocked,
    newTitles
  };
}
