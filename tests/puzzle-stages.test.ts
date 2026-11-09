import { describe, it, expect } from 'vitest';
import { ALL_STAGES, getStageById, getStagesByWorld, WORLDS } from '../src/features/stages/stageData';
import { countSolutions, isSolved, validateBoard } from '../src/domain/sudoku/engine';

describe('Step 3: Puzzle Generation and 50 Stages Verification', () => {
  it('contains exactly 50 stages across 5 worlds', () => {
    expect(ALL_STAGES.length).toBe(50);
    expect(WORLDS.length).toBe(5);
    for (let w = 1; w <= 5; w++) {
      const worldStages = getStagesByWorld(w);
      expect(worldStages.length).toBe(10);
    }
  });

  it('marks stages 1~3 with tutorial support', () => {
    expect(getStageById(1)?.hasTutorial).toBe(true);
    expect(getStageById(2)?.hasTutorial).toBe(true);
    expect(getStageById(3)?.hasTutorial).toBe(true);
    expect(getStageById(4)?.hasTutorial).toBe(false);
  });

  it('marks boss stages at 10, 20, 30, 40, 50', () => {
    [10, 20, 30, 40, 50].forEach(id => {
      const stage = getStageById(id);
      expect(stage?.isBoss).toBe(true);
    });
    [1, 5, 9, 11, 25, 49].forEach(id => {
      const stage = getStageById(id);
      expect(stage?.isBoss).toBe(false);
    });
  });

  it('verifies that the first 10 stages (World 1 MVP) each have EXACTLY 1 unique solution', () => {
    for (let id = 1; id <= 10; id++) {
      const stage = getStageById(id)!;
      expect(stage).toBeDefined();
      expect(stage.puzzle.length).toBe(81);
      expect(stage.solution.length).toBe(81);

      // Verify puzzle matches solution on all givens
      for (let i = 0; i < 81; i++) {
        if (stage.puzzle[i] !== 0) {
          expect(stage.puzzle[i]).toBe(stage.solution[i]);
        }
      }

      // Verify solution is valid and solved
      expect(validateBoard(stage.solution)).toBe(true);
      expect(isSolved(stage.solution, stage.puzzle)).toBe(true);

      // Verify exactly ONE solution
      const solCount = countSolutions(stage.puzzle, 2);
      expect(solCount).toBe(1);
    }
  });

  it('verifies sample stages from each world (World 2, 3, 4, 5) have unique solutions', () => {
    const sampleIds = [11, 20, 21, 30, 31, 40, 41, 50];
    for (const id of sampleIds) {
      const stage = getStageById(id)!;
      expect(stage).toBeDefined();
      expect(isSolved(stage.solution, stage.puzzle)).toBe(true);
      expect(countSolutions(stage.puzzle, 2)).toBe(1);
    }
  });

  it('guarantees deterministic reproducibility: re-accessing returns the exact same puzzle', () => {
    const stage1a = getStageById(1);
    const stage1b = getStageById(1);
    expect(stage1a?.puzzle).toEqual(stage1b?.puzzle);
    expect(stage1a?.solution).toEqual(stage1b?.solution);
  });
});
