import { describe, it, expect } from 'vitest';
import { evaluateAchievements } from '../src/features/achievements/achievements';
import { createInitialProgression } from '../src/features/progression/progression';

describe('Step 9: Achievements and Title System', () => {
  it('unlocks "첫 승리" on the first stage clear', () => {
    const prog = createInitialProgression();
    prog.stageRecords[1] = {
      stageId: 1,
      stars: 3,
      bestTime: 120,
      clearCount: 1,
      firstClearedAt: Date.now()
    };
    prog.totalStars = 3;

    const res = evaluateAchievements(prog, {});
    const ids = res.newlyUnlocked.map(a => a.id);
    expect(ids).toContain('first_win');
    expect(ids).toContain('perfect_reasoning');
    expect(res.newTitles).toContain('완벽한 추론가');
  });

  it('prevents duplicate achievement unlocking', () => {
    const prog = createInitialProgression();
    prog.stageRecords[1] = {
      stageId: 1,
      stars: 3,
      bestTime: 120,
      clearCount: 1,
      firstClearedAt: Date.now()
    };

    const existingAchievements = { first_win: 123456789 };
    const res = evaluateAchievements(prog, existingAchievements);
    const ids = res.newlyUnlocked.map(a => a.id);
    expect(ids).not.toContain('first_win');
    expect(res.updatedAchievements.first_win).toBe(123456789);
  });
});
