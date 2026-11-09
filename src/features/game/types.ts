import { Board81 } from '../../domain/sudoku/types';
import { Stage } from '../stages/stageData';

export interface HistorySnapshot {
  board: Board81;
  notes: number[][]; // 81 arrays of numbers 1..9
}

export interface GameState {
  stageId: number;
  stageTitle: string;
  worldId: number;
  difficulty: string;
  isBoss: boolean;
  givens: boolean[]; // 81 booleans, true if originally given
  solution: Board81;
  board: Board81;
  notes: number[][]; // 81 arrays
  selectedCell: number | null;
  isNoteMode: boolean;
  mistakes: number;
  hintsUsed: number;
  elapsedSeconds: number;
  isPaused: boolean;
  isCompleted: boolean;
  isFailed: boolean; // true if mistakes >= 3 (Round Failed / Game Over)
  conflicts: number[]; // indices of cells in conflict
  lastCompletedUnits: { rows: number[]; cols: number[]; boxes: number[] };
  history: HistorySnapshot[];
  future: HistorySnapshot[];
}

export type GameAction =
  | { type: 'SELECT_CELL'; payload: { index: number | null } }
  | { type: 'INPUT_DIGIT'; payload: { digit: number; autoRemoveNotes?: boolean } }
  | { type: 'ERASE_CELL' }
  | { type: 'TOGGLE_NOTE_MODE' }
  | { type: 'SET_NOTE_MODE'; payload: { enabled: boolean } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'TICK_TIMER' }
  | { type: 'APPLY_HINT'; payload: { cellIndex: number; digit: number } }
  | { type: 'INIT_STAGE'; payload: { stage: Stage } }
  | { type: 'RESTART_CURRENT_STAGE' }
  | { type: 'RESTORE_GAME'; payload: { state: GameState } }
  | { type: 'ITEM_SOLVE_CELL'; payload: { cellIndex: number } }
  | { type: 'ITEM_HEAL_MISTAKE' }
  | { type: 'ITEM_CLEAR_ERRORS' }
  | { type: 'ITEM_AUTO_CANDIDATES' };
