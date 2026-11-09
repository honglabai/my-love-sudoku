import { describe, it, expect } from 'vitest';
import { ALL_STAGES, getStageById } from '../src/features/stages/stageData';
import { countSolutions, isSolved, validateBoard } from '../src/domain/sudoku/engine';

describe('100% Full Verification of all 50 Stages', () => {
  it('has exactly 50 stages configured', () => {
    expect(ALL_STAGES.length).toBe(50);
  });

  // Test every single stage from 1 to 50
  for (let id = 1; id <= 50; id++) {
    it(`Stage ${id} has valid puzzle, valid solution, and EXACTLY ONE unique solution`, () => {
      const stage = getStageById(id);
      expect(stage).toBeDefined();
      if (!stage) return;

      // 1. Valid puzzle array length
      expect(stage.puzzle.length).toBe(81);
      expect(stage.solution.length).toBe(81);

      // 2. Puzzle format and initial non-conflict
      expect(validateBoard(stage.puzzle)).toBe(true);

      // 3. Solution format and full match
      expect(validateBoard(stage.solution)).toBe(true);
      expect(isSolved(stage.solution, stage.puzzle)).toBe(true);

      // 4. Exactly one unique solution
      const solutions = countSolutions(stage.puzzle, 2);
      expect(solutions).toBe(1);

      // 5. Boss status check
      if (id % 10 === 0) {
        expect(stage.isBoss).toBe(true);
      }
    });
  }
});
