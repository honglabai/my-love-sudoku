export interface StageRecord {
  stageId: number;
  stars: number; // 1, 2, 3
  bestTime: number; // in seconds
  clearCount: number;
  firstClearedAt: number; // timestamp
}

export interface PlayerInventory {
  autoSolve: number;     // 천리안 돋보기 (정답 1칸 확정 입력)
  healMistake: number;   // 정심환 (실수 1회 회복 / 부활)
  clearErrors: number;   // 정화의 향 (오답 일괄 제거)
  autoCandidates: number;// 통찰의 부적 (후보수 자동 메모)
}

export const DEFAULT_INVENTORY: PlayerInventory = {
  autoSolve: 3,
  healMistake: 3,
  clearErrors: 3,
  autoCandidates: 3
};

export interface PlayerProgression {
  level: number;
  currentXP: number; // XP within current level
  totalXP: number; // Lifetime cumulative XP
  stageRecords: Record<number, StageRecord>;
  unlockedStageMax: number; // highest unlocked stage ID (1..50)
  totalStars: number;
  equippedTitle: string;
  unlockedTitles: string[];
  inventory: PlayerInventory;
}

export function createInitialProgression(): PlayerProgression {
  return {
    level: 1,
    currentXP: 0,
    totalXP: 0,
    stageRecords: {},
    unlockedStageMax: 1, // Stage 1 starts unlocked
    totalStars: 0,
    equippedTitle: '스도쿠 입문자',
    unlockedTitles: ['스도쿠 입문자'],
    inventory: { ...DEFAULT_INVENTORY }
  };
}

/**
 * Star criteria:
 * ★★★ : 0 mistakes, 0 hints
 * ★★  : <= 2 mistakes, <= 1 hint
 * ★   : Any other valid completion
 */
export function calculateStars(mistakes: number, hintsUsed: number): number {
  if (mistakes === 0 && hintsUsed === 0) return 3;
  if (mistakes <= 2 && hintsUsed <= 1) return 2;
  return 1;
}

/**
 * First clear XP formula:
 * 80 + 20 * (world - 1) + 20 * (stars - 1)
 */
export function calculateFirstClearXP(worldId: number, stars: number): number {
  return 80 + 20 * (worldId - 1) + 20 * (stars - 1);
}

/**
 * XP required to advance from `level` to `level + 1`:
 * 100 + 40 * (level - 1)
 */
export function getRequiredXPForLevel(level: number): number {
  return 100 + 40 * (level - 1);
}

/**
 * Calculates level advancement with rollover XP and multi-level-up support.
 */
export function applyXPGain(
  currentLevel: number,
  currentXP: number,
  xpToAdd: number
): {
  newLevel: number;
  newXP: number;
  leveledUp: boolean;
  levelsGained: number;
} {
  let level = currentLevel;
  let xp = currentXP + xpToAdd;
  let leveledUp = false;
  let levelsGained = 0;

  while (true) {
    const required = getRequiredXPForLevel(level);
    if (xp >= required) {
      xp -= required;
      level++;
      leveledUp = true;
      levelsGained++;
    } else {
      break;
    }
  }

  return {
    newLevel: level,
    newXP: xp,
    leveledUp,
    levelsGained
  };
}

export interface RewardResult {
  updatedProgression: PlayerProgression;
  starsEarned: number;
  xpEarned: number;
  isFirstClear: boolean;
  isNewStarRecord: boolean;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  nextUnlockedStage: number | null;
}

/**
 * Idempotent, transaction-like reward processor.
 * Prevents duplicate XP payout on repeated clicks or refreshes.
 */
export function claimStageReward(
  progression: PlayerProgression,
  stageId: number,
  worldId: number,
  mistakes: number,
  hintsUsed: number,
  elapsedSeconds: number
): RewardResult {
  const stars = calculateStars(mistakes, hintsUsed);
  const existingRecord = progression.stageRecords[stageId];

  let xpEarned = 0;
  let isFirstClear = false;
  let isNewStarRecord = false;

  if (!existingRecord) {
    // First clear: full base XP + star bonus
    isFirstClear = true;
    isNewStarRecord = true;
    xpEarned = calculateFirstClearXP(worldId, stars);
  } else if (stars > existingRecord.stars) {
    // Replay with new star record: only star difference XP
    isNewStarRecord = true;
    xpEarned = 20 * (stars - existingRecord.stars);
  } else {
    // Replay with equal or lower stars: 0 XP
    xpEarned = 0;
  }

  // Calculate level up
  const levelResult = applyXPGain(progression.level, progression.currentXP, xpEarned);

  // Update stage record
  const bestStars = existingRecord ? Math.max(existingRecord.stars, stars) : stars;
  const bestTime = existingRecord ? Math.min(existingRecord.bestTime, elapsedSeconds) : elapsedSeconds;
  const clearCount = existingRecord ? existingRecord.clearCount + 1 : 1;

  const newRecords = {
    ...progression.stageRecords,
    [stageId]: {
      stageId,
      stars: bestStars,
      bestTime,
      clearCount,
      firstClearedAt: existingRecord?.firstClearedAt ?? Date.now()
    }
  };

  // Stage unlocking: clearing stageId unlocks stageId + 1 (capped at 50)
  const candidateNextStage = Math.min(50, stageId + 1);
  const newUnlockedMax = Math.max(progression.unlockedStageMax, candidateNextStage);
  const nextUnlockedStage = newUnlockedMax > progression.unlockedStageMax ? candidateNextStage : null;

  // Calculate total stars across all cleared stages
  const totalStars = Object.values(newRecords).reduce((acc, rec) => acc + rec.stars, 0);

  const updatedProgression: PlayerProgression = {
    ...progression,
    level: levelResult.newLevel,
    currentXP: levelResult.newXP,
    totalXP: progression.totalXP + xpEarned,
    stageRecords: newRecords,
    unlockedStageMax: newUnlockedMax,
    totalStars
  };

  return {
    updatedProgression,
    starsEarned: stars,
    xpEarned,
    isFirstClear,
    isNewStarRecord,
    leveledUp: levelResult.leveledUp,
    oldLevel: progression.level,
    newLevel: levelResult.newLevel,
    nextUnlockedStage
  };
}

/**
 * Applies Level Test diagnostic placement results.
 * Instantly unlocks the corresponding target world stage, auto-fills previous stage records
 * with 3 stars, awards stars/levels, and equips the matching title.
 */
export function applyLevelTestPlacement(
  progression: PlayerProgression,
  targetStageId: number
): PlayerProgression {
  if (targetStageId <= 1) return progression;

  const newRecords: Record<number, StageRecord> = { ...progression.stageRecords };

  for (let s = 1; s < targetStageId; s++) {
    if (!newRecords[s]) {
      newRecords[s] = {
        stageId: s,
        stars: 3,
        bestTime: 90,
        clearCount: 1,
        firstClearedAt: Date.now()
      };
    }
  }

  const newTotalStars = Object.values(newRecords).reduce((acc, r) => acc + r.stars, 0);

  // Derive level and title based on target stage
  let level = progression.level;
  let title = progression.equippedTitle;
  const titles = new Set(progression.unlockedTitles);

  if (targetStageId >= 31) {
    level = Math.max(level, 30);
    title = '스도쿠 마스터';
    titles.add('스도쿠 탐험가');
    titles.add('스도쿠 수집가');
    titles.add('스도쿠 마스터');
  } else if (targetStageId >= 21) {
    level = Math.max(level, 15);
    title = '스도쿠 수집가';
    titles.add('스도쿠 탐험가');
    titles.add('스도쿠 수집가');
  } else if (targetStageId >= 11) {
    level = Math.max(level, 5);
    title = '스도쿠 탐험가';
    titles.add('스도쿠 탐험가');
  }

  return {
    ...progression,
    level,
    stageRecords: newRecords,
    unlockedStageMax: Math.max(progression.unlockedStageMax, targetStageId),
    totalStars: newTotalStars,
    equippedTitle: title,
    unlockedTitles: Array.from(titles)
  };
}
