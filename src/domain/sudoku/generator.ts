import { Board81 } from './types';
import { getCandidates, countSolutions } from './engine';

/**
 * Deterministic Pseudo-Random Number Generator (Mulberry32)
 */
export function createRng(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle with custom RNG
 */
function shuffle<T>(array: T[], rng: () => number): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a valid full 9x9 Sudoku board deterministically using `seed`.
 */
export function generateSolvedBoard(seed: number): Board81 {
  const rng = createRng(seed);
  const board: Board81 = Array(81).fill(0);

  // Fill the three independent diagonal boxes (0, 4, 8)
  for (let box = 0; box < 9; box += 4) {
    const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);
    const startRow = Math.floor(box / 3) * 3;
    const startCol = (box % 3) * 3;
    let idx = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        board[(startRow + r) * 9 + (startCol + c)] = digits[idx++];
      }
    }
  }

  // Solve the rest using randomized candidate order
  function fillRemaining(cellIndex: number): boolean {
    if (cellIndex >= 81) return true;
    if (board[cellIndex] !== 0) return fillRemaining(cellIndex + 1);

    const candidates = shuffle(getCandidates(board, cellIndex), rng);
    for (const num of candidates) {
      board[cellIndex] = num;
      if (fillRemaining(cellIndex + 1)) return true;
      board[cellIndex] = 0;
    }
    return false;
  }

  fillRemaining(0);
  return board;
}

/**
 * Removes clues from a solved board while ensuring a single UNIQUE solution exists.
 */
export function carvePuzzle(
  solvedBoard: Board81,
  targetClues: number,
  seed: number
): { puzzle: Board81; solution: Board81; cluesCount: number } {
  const rng = createRng(seed);
  const puzzle = [...solvedBoard];

  // Try to remove cells in randomized order
  const order = shuffle(Array.from({ length: 81 }, (_, i) => i), rng);

  let currentClues = 81;
  for (const idx of order) {
    if (currentClues <= targetClues) break;

    const removedVal = puzzle[idx];
    puzzle[idx] = 0;

    // Check if unique solution is preserved
    if (countSolutions(puzzle, 2) === 1) {
      currentClues--;
    } else {
      // Multiple solutions or unsolvable, restore
      puzzle[idx] = removedVal;
    }
  }

  return {
    puzzle,
    solution: solvedBoard,
    cluesCount: currentClues
  };
}

export type Technique = 'Naked Single' | 'Hidden Single' | 'Intersections' | 'Subsets' | 'Advanced Trial';

/**
 * Analyzes the logical techniques required to solve a puzzle.
 */
export function analyzeTechniques(puzzle: Board81): { techniques: Technique[]; maxTechnique: Technique } {
  const working = [...puzzle];
  const usedTechniques = new Set<Technique>();

  let progress = true;
  while (progress) {
    progress = false;

    // 1. Check for Naked Single
    let nakedSingleFound = false;
    for (let i = 0; i < 81; i++) {
      if (working[i] === 0) {
        const cands = getCandidates(working, i);
        if (cands.length === 1) {
          working[i] = cands[0];
          usedTechniques.add('Naked Single');
          progress = true;
          nakedSingleFound = true;
          break;
        }
      }
    }
    if (nakedSingleFound) continue;

    // 2. Check for Hidden Single (Row, Col, Box)
    // Check rows
    let hiddenSingleFound = false;
    for (let r = 0; r < 9 && !hiddenSingleFound; r++) {
      for (let num = 1; num <= 9 && !hiddenSingleFound; num++) {
        const possibleIndices: number[] = [];
        for (let c = 0; c < 9; c++) {
          const idx = r * 9 + c;
          if (working[idx] === 0 && getCandidates(working, idx).includes(num)) {
            possibleIndices.push(idx);
          }
        }
        if (possibleIndices.length === 1) {
          working[possibleIndices[0]] = num;
          usedTechniques.add('Hidden Single');
          progress = true;
          hiddenSingleFound = true;
          break;
        }
      }
    }
    if (hiddenSingleFound) continue;

    // Check columns
    for (let c = 0; c < 9 && !hiddenSingleFound; c++) {
      for (let num = 1; num <= 9 && !hiddenSingleFound; num++) {
        const possibleIndices: number[] = [];
        for (let r = 0; r < 9; r++) {
          const idx = r * 9 + c;
          if (working[idx] === 0 && getCandidates(working, idx).includes(num)) {
            possibleIndices.push(idx);
          }
        }
        if (possibleIndices.length === 1) {
          working[possibleIndices[0]] = num;
          usedTechniques.add('Hidden Single');
          progress = true;
          hiddenSingleFound = true;
          break;
        }
      }
    }
    if (hiddenSingleFound) continue;

    // Check 3x3 boxes
    for (let b = 0; b < 9 && !hiddenSingleFound; b++) {
      for (let num = 1; num <= 9 && !hiddenSingleFound; num++) {
        const possibleIndices: number[] = [];
        const startRow = Math.floor(b / 3) * 3;
        const startCol = (b % 3) * 3;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const idx = (startRow + r) * 9 + (startCol + c);
            if (working[idx] === 0 && getCandidates(working, idx).includes(num)) {
              possibleIndices.push(idx);
            }
          }
        }
        if (possibleIndices.length === 1) {
          working[possibleIndices[0]] = num;
          usedTechniques.add('Hidden Single');
          progress = true;
          hiddenSingleFound = true;
          break;
        }
      }
    }
    if (hiddenSingleFound) continue;

    // If still empty cells remain and simple singles cannot progress
    let hasZero = false;
    for (let i = 0; i < 81; i++) {
      if (working[i] === 0) {
        hasZero = true;
        break;
      }
    }
    if (hasZero) {
      usedTechniques.add('Advanced Trial');
      break;
    }
  }

  const techniques = Array.from(usedTechniques);
  let maxTechnique: Technique = 'Naked Single';
  if (techniques.includes('Advanced Trial')) maxTechnique = 'Advanced Trial';
  else if (techniques.includes('Hidden Single')) maxTechnique = 'Hidden Single';

  return { techniques, maxTechnique };
}
