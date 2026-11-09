import { describe, it, expect } from 'vitest';
import {
  validateBoard,
  getCandidates,
  getConflicts,
  solveSudoku,
  countSolutions,
  isSolved,
  getCompletedUnits
} from '../src/domain/sudoku/engine';
import { Board81 } from '../src/domain/sudoku/types';

// A known valid complete board
const VALID_COMPLETE: Board81 = [
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

// A known valid puzzle with a UNIQUE solution
const UNIQUE_PUZZLE: Board81 = [
  5, 3, 0, 0, 7, 0, 0, 0, 0,
  6, 0, 0, 1, 9, 5, 0, 0, 0,
  0, 9, 8, 0, 0, 0, 0, 6, 0,
  8, 0, 0, 0, 6, 0, 0, 0, 3,
  4, 0, 0, 8, 0, 3, 0, 0, 1,
  7, 0, 0, 0, 2, 0, 0, 0, 6,
  0, 6, 0, 0, 0, 0, 2, 8, 0,
  0, 0, 0, 4, 1, 9, 0, 0, 5,
  0, 0, 0, 0, 8, 0, 0, 7, 9
];

describe('Step 2: Sudoku Core Engine', () => {
  it('validates a valid complete board', () => {
    expect(validateBoard(VALID_COMPLETE)).toBe(true);
    expect(getConflicts(VALID_COMPLETE).size).toBe(0);
  });

  it('validates a valid incomplete board with 0s', () => {
    expect(validateBoard(UNIQUE_PUZZLE)).toBe(true);
    expect(getConflicts(UNIQUE_PUZZLE).size).toBe(0);
  });

  it('detects duplicate numbers and marks conflicts', () => {
    const invalidBoard = [...UNIQUE_PUZZLE];
    // Put duplicate 5 in the first row
    invalidBoard[2] = 5; // cell 0 has 5, cell 2 has 5
    expect(validateBoard(invalidBoard)).toBe(false);

    const conflicts = getConflicts(invalidBoard);
    expect(conflicts.has(0)).toBe(true);
    expect(conflicts.has(2)).toBe(true);
  });

  it('calculates candidates correctly for an empty cell', () => {
    // In UNIQUE_PUZZLE, cell 2 (row 0, col 2):
    // Row 0 has: 5, 3, 7
    // Col 2 has: 8
    // Box 0 (top-left) has: 5, 3, 6, 9, 8
    // Remaining available: 1, 2, 4
    const candidates = getCandidates(UNIQUE_PUZZLE, 2);
    expect(candidates).toEqual([1, 2, 4]);

    // Filled cell should have 0 candidates
    expect(getCandidates(UNIQUE_PUZZLE, 0)).toEqual([]);
  });

  it('solves a puzzle with a unique solution', () => {
    const solution = solveSudoku(UNIQUE_PUZZLE);
    expect(solution).not.toBeNull();
    expect(solution).toEqual(VALID_COMPLETE);
  });

  it('accurately counts solutions (unique solution = 1)', () => {
    const count = countSolutions(UNIQUE_PUZZLE, 2);
    expect(count).toBe(1);
  });

  it('accurately detects multiple solutions for under-constrained puzzle', () => {
    // Mostly empty board
    const multiPuzzle: Board81 = Array(81).fill(0);
    multiPuzzle[0] = 5;
    multiPuzzle[1] = 3;
    const count = countSolutions(multiPuzzle, 2);
    expect(count).toBe(2); // hit limit 2 early
  });

  it('handles unsolvable boards (no solution)', () => {
    // Contradictory board (e.g. forced cell has no candidates)
    const unsolvable: Board81 = [...UNIQUE_PUZZLE];
    // Create an impossible constraint without immediate duplicate in same unit:
    // Put numbers in peers of cell 2 such that all 1..9 are used in peers of cell 2
    // Row 0 peers: 5, 3, 7. Col 2 peers: 8. Box 0 peers: 6, 9.
    // That left 1, 2, 4. Let's put 1, 2, 4 in col 2 row 3, 4, 5
    unsolvable[3 * 9 + 2] = 1;
    unsolvable[4 * 9 + 2] = 2;
    unsolvable[5 * 9 + 2] = 4;
    // Now cell 2 has candidates: []
    expect(getCandidates(unsolvable, 2)).toEqual([]);
    expect(solveSudoku(unsolvable)).toBeNull();
    expect(countSolutions(unsolvable, 2)).toBe(0);
  });

  it('correctly assesses isSolved', () => {
    // Valid complete matching givens
    expect(isSolved(VALID_COMPLETE, UNIQUE_PUZZLE)).toBe(true);

    // Incomplete board
    expect(isSolved(UNIQUE_PUZZLE, UNIQUE_PUZZLE)).toBe(false);

    // Complete board where a given number was modified
    const tampered = [...VALID_COMPLETE];
    tampered[0] = 9; // original given was 5
    expect(isSolved(tampered, UNIQUE_PUZZLE)).toBe(false);
  });

  it('detects completed rows, cols, and boxes', () => {
    const { rows, cols, boxes } = getCompletedUnits(VALID_COMPLETE);
    expect(rows.length).toBe(9);
    expect(cols.length).toBe(9);
    expect(boxes.length).toBe(9);

    const incomplete = [...VALID_COMPLETE];
    incomplete[0] = 0; // erase top-left cell
    const units = getCompletedUnits(incomplete);
    expect(units.rows.includes(0)).toBe(false);
    expect(units.cols.includes(0)).toBe(false);
    expect(units.boxes.includes(0)).toBe(false);
    // other rows/cols not affected by cell 0 should still be complete
    expect(units.rows.includes(1)).toBe(true);
  });
});
