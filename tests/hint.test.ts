import { describe, it, expect } from 'vitest';
import { findLogicalHint } from '../src/features/hint/hintEngine';
import { Board81 } from '../src/domain/sudoku/types';
import { getStageById } from '../src/features/stages/stageData';

describe('Step 7: Logical Hints Engine', () => {
  const stage1 = getStageById(1)!;

  it('detects a Naked Single when only 1 candidate remains in a cell', () => {
    // Construct a board where cell (0, 0) has 8 peers filled with 1..8, leaving only 9
    const board: Board81 = Array(81).fill(0);
    // Fill first row with 1..8
    for (let c = 1; c <= 8; c++) {
      board[c] = c;
    }
    // Now cell 0 (0,0) only has candidate 9
    const hint = findLogicalHint(board, stage1.solution);
    expect(hint).not.toBeNull();
    expect(hint?.type).toBe('naked-single');
    expect(hint?.cellIndex).toBe(0);
    expect(hint?.digit).toBe(9);
    expect(hint?.title).toContain('Naked Single');
    expect(hint?.explanation).toContain('오직 [9]만 들어갈 수 있습니다');
  });

  it('detects a Hidden Single in a unit when a digit can only go in one place', () => {
    // Valid almost-complete board
    const complete = [
      5, 3, 4, 6, 7, 8, 9, 1, 2,
      6, 7, 2, 1, 9, 5, 3, 4, 8,
      1, 9, 8, 3, 4, 2, 5, 6, 7,
      8, 5, 9, 7, 6, 1, 4, 2, 3,
      4, 2, 6, 8, 5, 3, 7, 9, 1,
      7, 1, 3, 9, 2, 4, 8, 5, 6,
      9, 6, 1, 5, 3, 7, 2, 8, 4,
      2, 8, 7, 4, 1, 9, 6, 3, 5,
      3, 4, 5, 2, 8, 6, 1, 7, 9
    ];
    const testBoard = [...complete];
    // Empty two cells that have 2 candidates each, but one number is forced in row
    testBoard[0] = 0; // was 5
    testBoard[1] = 0; // was 3
    testBoard[9] = 0; // was 6
    testBoard[10] = 0; // was 7

    const hint = findLogicalHint(testBoard, complete);
    expect(hint).not.toBeNull();
    expect(hint?.digit).toBe(complete[hint!.cellIndex]);
  });

  it('finds a valid hint on real stage 1 puzzle', () => {
    const hint = findLogicalHint(stage1.puzzle, stage1.solution);
    expect(hint).not.toBeNull();
    expect(hint?.digit).toBe(stage1.solution[hint!.cellIndex]);
    expect(stage1.puzzle[hint!.cellIndex]).toBe(0); // must be an empty cell
  });
});
