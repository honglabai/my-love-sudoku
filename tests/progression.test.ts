import { describe, it, expect } from 'vitest';
import {
  calculateStars,
  calculateFirstClearXP,
  getRequiredXPForLevel,
  applyXPGain,
  claimStageReward,
  createInitialProgression
} from '../src/features/progression/progression';

describe('Step 6: RPG Progression and Reward System', () => {
  it('accurately calculates stars according to rules', () => {
    // 3 Stars: 0 mistakes, 0 hints
    expect(calculateStars(0, 0)).toBe(3);

    // 2 Stars: <= 2 mistakes, <= 1 hint
    expect(calculateStars(1, 0)).toBe(2);
    expect(calculateStars(2, 0)).toBe(2);
    expect(calculateStars(0, 1)).toBe(2);
    expect(calculateStars(2, 1)).toBe(2);

    // 1 Star: > 2 mistakes or > 1 hint
    expect(calculateStars(3, 0)).toBe(1);
    expect(calculateStars(0, 2)).toBe(1);
    expect(calculateStars(3, 2)).toBe(1);
  });

  it('calculates first clear XP based on world and stars', () => {
    // World 1 (worldId = 1):
    // 3 stars: 80 + 20*0 + 20*2 = 120
    expect(calculateFirstClearXP(1, 3)).toBe(120);
    // 2 stars: 80 + 20*0 + 20*1 = 100
    expect(calculateFirstClearXP(1, 2)).toBe(100);
    // 1 star: 80 + 20*0 + 20*0 = 80
    expect(calculateFirstClearXP(1, 1)).toBe(80);

    // World 2 (worldId = 2):
    // 3 stars: 80 + 20*1 + 20*2 = 140
    expect(calculateFirstClearXP(2, 3)).toBe(140);

    // World 5 (worldId = 5):
    // 3 stars: 80 + 20*4 + 20*2 = 200
    expect(calculateFirstClearXP(5, 3)).toBe(200);
  });

  it('calculates required XP per level', () => {
    // 100 + 40 * (level - 1)
    expect(getRequiredXPForLevel(1)).toBe(100);
    expect(getRequiredXPForLevel(2)).toBe(140);
    expect(getRequiredXPForLevel(3)).toBe(180);
    expect(getRequiredXPForLevel(4)).toBe(220);
  });

  it('handles XP gains, rollover, and multi-level-ups', () => {
    // Level 1, 0 XP, gain 80 XP -> Level 1, 80 XP, no levelup
    let res = applyXPGain(1, 0, 80);
    expect(res.newLevel).toBe(1);
    expect(res.newXP).toBe(80);
    expect(res.leveledUp).toBe(false);

    // Level 1, 80 XP, gain 40 XP -> Level 2, 20 XP (120 - 100 = 20)
    res = applyXPGain(1, 80, 40);
    expect(res.newLevel).toBe(2);
    expect(res.newXP).toBe(20);
    expect(res.leveledUp).toBe(true);
    expect(res.levelsGained).toBe(1);

    // Multi level-up: Level 1, 0 XP, gain 250 XP
    // Level 1 -> 2: 100 XP (150 remaining)
    // Level 2 -> 3: 140 XP (10 remaining)
    res = applyXPGain(1, 0, 250);
    expect(res.newLevel).toBe(3);
    expect(res.newXP).toBe(10);
    expect(res.leveledUp).toBe(true);
    expect(res.levelsGained).toBe(2);
  });

  it('prevents duplicate XP payout on replay with same or lower stars', () => {
    let prog = createInitialProgression();

    // First clear: Stage 1 (World 1) with 3 stars -> 120 XP
    const res1 = claimStageReward(prog, 1, 1, 0, 0, 150);
    expect(res1.isFirstClear).toBe(true);
    expect(res1.xpEarned).toBe(120);
    expect(res1.starsEarned).toBe(3);
    expect(res1.newLevel).toBe(2);
    expect(res1.updatedProgression.currentXP).toBe(20); // 120 - 100 = 20

    // Replay Stage 1 with 3 stars again -> 0 XP!
    const res2 = claimStageReward(res1.updatedProgression, 1, 1, 0, 0, 120);
    expect(res2.isFirstClear).toBe(false);
    expect(res2.isNewStarRecord).toBe(false);
    expect(res2.xpEarned).toBe(0);
    expect(res2.updatedProgression.totalXP).toBe(120); // unchanged!
    expect(res2.updatedProgression.stageRecords[1].bestTime).toBe(120); // best time updated

    // Replay with 1 star -> 0 XP
    const res3 = claimStageReward(res2.updatedProgression, 1, 1, 3, 2, 90);
    expect(res3.xpEarned).toBe(0);
    expect(res3.updatedProgression.totalXP).toBe(120);
    expect(res3.updatedProgression.stageRecords[1].stars).toBe(3); // keeps 3 stars
  });

  it('awards only difference XP when setting a new star record on replay', () => {
    let prog = createInitialProgression();

    // First clear with 1 star (Stage 1, World 1): 80 XP
    const res1 = claimStageReward(prog, 1, 1, 3, 2, 200);
    expect(res1.isFirstClear).toBe(true);
    expect(res1.xpEarned).toBe(80);
    expect(res1.starsEarned).toBe(1);

    // Replay with 3 stars: difference = 20 * (3 - 1) = 40 XP
    const res2 = claimStageReward(res1.updatedProgression, 1, 1, 0, 0, 100);
    expect(res2.isFirstClear).toBe(false);
    expect(res2.isNewStarRecord).toBe(true);
    expect(res2.xpEarned).toBe(40);
    expect(res2.updatedProgression.totalXP).toBe(120);
  });

  it('unlocks next stage sequentially upon clear', () => {
    let prog = createInitialProgression();
    expect(prog.unlockedStageMax).toBe(1);

    const res1 = claimStageReward(prog, 1, 1, 0, 0, 100);
    expect(res1.updatedProgression.unlockedStageMax).toBe(2);
    expect(res1.nextUnlockedStage).toBe(2);

    // Clearing stage 1 again should not advance unlockedStageMax
    const res2 = claimStageReward(res1.updatedProgression, 1, 1, 0, 0, 90);
    expect(res2.updatedProgression.unlockedStageMax).toBe(2);
    expect(res2.nextUnlockedStage).toBeNull();
  });
});
