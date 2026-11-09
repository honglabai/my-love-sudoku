import {
  Board81,
  getRowIndices,
  getColIndices,
  getBoxIndices,
  getPeerIndices
} from './types';

/**
 * Validates whether the board format is valid (81 numbers, 0..9)
 * and has no duplicate conflicting numbers in any row, column, or 3x3 box.
 */
export function validateBoard(board: Board81): boolean {
  if (!board || board.length !== 81) return false;
  for (let i = 0; i < 81; i++) {
    const val = board[i];
    if (typeof val !== 'number' || val < 0 || val > 9 || !Number.isInteger(val)) {
      return false;
    }
  }

  // Check rows, cols, and boxes for duplicates among non-zero numbers
  for (let r = 0; r < 9; r++) {
    const seen = new Set<number>();
    for (const idx of getRowIndices(r)) {
      const v = board[idx];
      if (v !== 0) {
        if (seen.has(v)) return false;
        seen.add(v);
      }
    }
  }

  for (let c = 0; c < 9; c++) {
    const seen = new Set<number>();
    for (const idx of getColIndices(c)) {
      const v = board[idx];
      if (v !== 0) {
        if (seen.has(v)) return false;
        seen.add(v);
      }
    }
  }

  for (let b = 0; b < 9; b++) {
    const seen = new Set<number>();
    for (const idx of getBoxIndices(b)) {
      const v = board[idx];
      if (v !== 0) {
        if (seen.has(v)) return false;
        seen.add(v);
      }
    }
  }

  return true;
}

/**
 * Returns a set of indices for all cells that are currently in conflict
 * (i.e. identical non-zero numbers in the same row, column, or 3x3 box).
 */
export function getConflicts(board: Board81): Set<number> {
  const conflicts = new Set<number>();

  const checkUnit = (indices: number[]) => {
    const map = new Map<number, number[]>();
    for (const idx of indices) {
      const val = board[idx];
      if (val !== 0) {
        const arr = map.get(val) || [];
        arr.push(idx);
        map.set(val, arr);
      }
    }
    for (const idxList of map.values()) {
      if (idxList.length > 1) {
        idxList.forEach(idx => conflicts.add(idx));
      }
    }
  };

  for (let r = 0; r < 9; r++) checkUnit(getRowIndices(r));
  for (let c = 0; c < 9; c++) checkUnit(getColIndices(c));
  for (let b = 0; b < 9; b++) checkUnit(getBoxIndices(b));

  return conflicts;
}

/**
 * Computes the candidate numbers (1..9) that can legally be placed
 * in the cell at `cellIndex`.
 */
export function getCandidates(board: Board81, cellIndex: number): number[] {
  if (board[cellIndex] !== 0) return [];

  const used = new Uint8Array(10);
  const peers = getPeerIndices(cellIndex);
  for (let i = 0; i < peers.length; i++) {
    const val = board[peers[i]];
    if (val !== 0) {
      used[val] = 1;
    }
  }

  const candidates: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (used[num] === 0) {
      candidates.push(num);
    }
  }
  return candidates;
}

/**
 * Checks if the board is completely filled (no zeros).
 */
export function isBoardFull(board: Board81): boolean {
  for (let i = 0; i < 81; i++) {
    if (board[i] === 0) return false;
  }
  return true;
}

/**
 * Validates if the board is correctly solved.
 * Criteria:
 * 1. Fully filled with numbers 1..9 (no 0).
 * 2. Has no conflicts.
 * 3. Preserves all initial given numbers unchanged.
 */
export function isSolved(board: Board81, givens: Board81): boolean {
  if (!isBoardFull(board)) return false;
  if (!validateBoard(board)) return false;

  for (let i = 0; i < 81; i++) {
    if (givens[i] !== 0 && board[i] !== givens[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Backtracking Sudoku solver with MRV (Minimum Remaining Values) heuristic.
 * Returns the solved Board81, or null if unsolvable.
 */
export function solveSudoku(board: Board81): Board81 | null {
  if (!validateBoard(board)) return null;

  const working = [...board];

  function backtrack(): boolean {
    let bestCell = -1;
    let minCandidatesCount = 10;
    let bestCandidates: number[] = [];

    // Find the empty cell with the fewest candidates (MRV)
    for (let i = 0; i < 81; i++) {
      if (working[i] === 0) {
        const cands = getCandidates(working, i);
        if (cands.length === 0) {
          return false; // Dead end
        }
        if (cands.length < minCandidatesCount) {
          minCandidatesCount = cands.length;
          bestCell = i;
          bestCandidates = cands;
          if (minCandidatesCount === 1) break; // Naked single, ideal choice
        }
      }
    }

    if (bestCell === -1) {
      return true; // No empty cells left, solved!
    }

    for (const num of bestCandidates) {
      working[bestCell] = num;
      if (backtrack()) {
        return true;
      }
      working[bestCell] = 0;
    }

    return false;
  }

  const success = backtrack();
  return success ? working : null;
}

/**
 * Counts the number of distinct solutions up to `limit`.
 * Halts immediately once `limit` solutions are found (typically limit=2 to check uniqueness).
 */
export function countSolutions(board: Board81, limit: number = 2): number {
  if (!validateBoard(board)) return 0;

  const working = [...board];
  let solutionCount = 0;

  function backtrack(): boolean {
    if (solutionCount >= limit) return true; // Stop early

    let bestCell = -1;
    let minCandidatesCount = 10;
    let bestCandidates: number[] = [];

    for (let i = 0; i < 81; i++) {
      if (working[i] === 0) {
        const cands = getCandidates(working, i);
        if (cands.length === 0) {
          return false;
        }
        if (cands.length < minCandidatesCount) {
          minCandidatesCount = cands.length;
          bestCell = i;
          bestCandidates = cands;
          if (minCandidatesCount === 1) break;
        }
      }
    }

    if (bestCell === -1) {
      solutionCount++;
      return solutionCount >= limit;
    }

    for (const num of bestCandidates) {
      working[bestCell] = num;
      const shouldStop = backtrack();
      working[bestCell] = 0;
      if (shouldStop) return true;
    }

    return false;
  }

  backtrack();
  return solutionCount;
}

/**
 * Identifies completed and valid rows, cols, and boxes.
 * Useful for celebratory feedback when a line or box is finished!
 */
export function getCompletedUnits(board: Board81): { rows: number[]; cols: number[]; boxes: number[] } {
  const rows: number[] = [];
  const cols: number[] = [];
  const boxes: number[] = [];

  const isValidUnit = (indices: number[]): boolean => {
    const seen = new Set<number>();
    for (const idx of indices) {
      const val = board[idx];
      if (val === 0 || seen.has(val)) return false;
      seen.add(val);
    }
    return seen.size === 9;
  };

  for (let r = 0; r < 9; r++) {
    if (isValidUnit(getRowIndices(r))) rows.push(r);
  }
  for (let c = 0; c < 9; c++) {
    if (isValidUnit(getColIndices(c))) cols.push(c);
  }
  for (let b = 0; b < 9; b++) {
    if (isValidUnit(getBoxIndices(b))) boxes.push(b);
  }

  return { rows, cols, boxes };
}
