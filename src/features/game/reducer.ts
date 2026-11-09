import { GameState, GameAction, HistorySnapshot } from './types';
import { Stage } from '../stages/stageData';
import { getConflicts, isSolved, getCompletedUnits } from '../../domain/sudoku/engine';
import { getPeerIndices } from '../../domain/sudoku/types';

export function createInitialState(stage: Stage): GameState {
  const givens = stage.puzzle.map(val => val !== 0);
  const board = [...stage.puzzle];
  const notes: number[][] = Array.from({ length: 81 }, () => []);

  return {
    stageId: stage.id,
    stageTitle: stage.title,
    worldId: stage.worldId,
    difficulty: stage.difficulty,
    isBoss: stage.isBoss,
    givens,
    solution: [...stage.solution],
    board,
    notes,
    selectedCell: null,
    isNoteMode: false,
    mistakes: 0,
    hintsUsed: 0,
    elapsedSeconds: 0,
    isPaused: false,
    isCompleted: false,
    conflicts: [],
    lastCompletedUnits: { rows: [], cols: [], boxes: [] },
    history: [],
    future: []
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CELL': {
      if (state.isPaused || state.isCompleted) return state;
      return {
        ...state,
        selectedCell: action.payload.index
      };
    }

    case 'TOGGLE_NOTE_MODE': {
      return {
        ...state,
        isNoteMode: !state.isNoteMode
      };
    }

    case 'SET_NOTE_MODE': {
      return {
        ...state,
        isNoteMode: action.payload.enabled
      };
    }

    case 'INPUT_DIGIT': {
      if (state.isPaused || state.isCompleted) return state;
      const { selectedCell, isNoteMode, givens, board, notes, solution } = state;
      if (selectedCell === null || givens[selectedCell]) return state;

      const { digit, autoRemoveNotes = true } = action.payload;
      if (digit < 1 || digit > 9) return state;

      // Create snapshot for history
      const currentSnapshot: HistorySnapshot = {
        board: [...board],
        notes: notes.map(arr => [...arr])
      };

      if (isNoteMode) {
        // Only toggle note on empty cells
        if (board[selectedCell] !== 0) return state;

        const cellNotes = notes[selectedCell];
        const hasDigit = cellNotes.includes(digit);
        const nextCellNotes = hasDigit
          ? cellNotes.filter(d => d !== digit)
          : [...cellNotes, digit].sort((a, b) => a - b);

        const nextNotes = notes.map((arr, idx) => (idx === selectedCell ? nextCellNotes : [...arr]));

        return {
          ...state,
          notes: nextNotes,
          history: [...state.history, currentSnapshot],
          future: []
        };
      }

      // Normal number placement
      // If pressing the same number that is already in cell, keep it or do nothing
      if (board[selectedCell] === digit) {
        return state;
      }

      const nextBoard = [...board];
      nextBoard[selectedCell] = digit;

      // Check for mistake (placing a number that doesn't match the unique solution)
      const isMistake = digit !== solution[selectedCell];
      const nextMistakes = isMistake ? state.mistakes + 1 : state.mistakes;

      // Update notes: clear notes for this cell
      let nextNotes = notes.map((arr, idx) => (idx === selectedCell ? [] : [...arr]));

      // Auto-remove candidate from peer notes if enabled
      if (autoRemoveNotes) {
        const peers = getPeerIndices(selectedCell);
        peers.forEach(peerIdx => {
          if (nextNotes[peerIdx].length > 0) {
            nextNotes[peerIdx] = nextNotes[peerIdx].filter(d => d !== digit);
          }
        });
      }

      const conflictsSet = getConflicts(nextBoard);
      const conflicts = Array.from(conflictsSet);
      const completedUnits = getCompletedUnits(nextBoard);

      // Check win condition
      const givensBoard = state.board.map((_, i) => (givens[i] ? solution[i] : 0));
      const completed = isSolved(nextBoard, givensBoard);

      return {
        ...state,
        board: nextBoard,
        notes: nextNotes,
        mistakes: nextMistakes,
        conflicts,
        lastCompletedUnits: completedUnits,
        isCompleted: completed,
        history: [...state.history, currentSnapshot],
        future: []
      };
    }

    case 'ERASE_CELL': {
      if (state.isPaused || state.isCompleted) return state;
      const { selectedCell, givens, board, notes } = state;
      if (selectedCell === null || givens[selectedCell]) return state;

      if (board[selectedCell] === 0 && notes[selectedCell].length === 0) {
        return state; // Nothing to erase
      }

      const currentSnapshot: HistorySnapshot = {
        board: [...board],
        notes: notes.map(arr => [...arr])
      };

      const nextBoard = [...board];
      nextBoard[selectedCell] = 0;

      const nextNotes = notes.map((arr, idx) => (idx === selectedCell ? [] : [...arr]));
      const conflicts = Array.from(getConflicts(nextBoard));

      return {
        ...state,
        board: nextBoard,
        notes: nextNotes,
        conflicts,
        history: [...state.history, currentSnapshot],
        future: []
      };
    }

    case 'UNDO': {
      if (state.isPaused || state.isCompleted || state.history.length === 0) return state;

      const lastSnapshot = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);

      const currentSnapshot: HistorySnapshot = {
        board: [...state.board],
        notes: state.notes.map(arr => [...arr])
      };

      const conflicts = Array.from(getConflicts(lastSnapshot.board));

      return {
        ...state,
        board: [...lastSnapshot.board],
        notes: lastSnapshot.notes.map(arr => [...arr]),
        conflicts,
        history: newHistory,
        future: [currentSnapshot, ...state.future]
      };
    }

    case 'REDO': {
      if (state.isPaused || state.isCompleted || state.future.length === 0) return state;

      const nextSnapshot = state.future[0];
      const newFuture = state.future.slice(1);

      const currentSnapshot: HistorySnapshot = {
        board: [...state.board],
        notes: state.notes.map(arr => [...arr])
      };

      const conflicts = Array.from(getConflicts(nextSnapshot.board));

      return {
        ...state,
        board: [...nextSnapshot.board],
        notes: nextSnapshot.notes.map(arr => [...arr]),
        conflicts,
        history: [...state.history, currentSnapshot],
        future: newFuture
      };
    }

    case 'APPLY_HINT': {
      if (state.isPaused || state.isCompleted) return state;
      const { cellIndex, digit } = action.payload;
      if (cellIndex < 0 || cellIndex >= 81 || state.givens[cellIndex]) return state;

      const currentSnapshot: HistorySnapshot = {
        board: [...state.board],
        notes: state.notes.map(arr => [...arr])
      };

      const nextBoard = [...state.board];
      nextBoard[cellIndex] = digit;

      const nextNotes = state.notes.map((arr, idx) => (idx === cellIndex ? [] : [...arr]));
      const peers = getPeerIndices(cellIndex);
      peers.forEach(peerIdx => {
        if (nextNotes[peerIdx].length > 0) {
          nextNotes[peerIdx] = nextNotes[peerIdx].filter(d => d !== digit);
        }
      });

      const conflicts = Array.from(getConflicts(nextBoard));
      const givensBoard = state.board.map((_, i) => (state.givens[i] ? state.solution[i] : 0));
      const completed = isSolved(nextBoard, givensBoard);

      return {
        ...state,
        selectedCell: cellIndex,
        board: nextBoard,
        notes: nextNotes,
        hintsUsed: state.hintsUsed + 1,
        conflicts,
        isCompleted: completed,
        history: [...state.history, currentSnapshot],
        future: []
      };
    }

    case 'PAUSE': {
      if (state.isCompleted) return state;
      return {
        ...state,
        isPaused: true
      };
    }

    case 'RESUME': {
      return {
        ...state,
        isPaused: false
      };
    }

    case 'TICK_TIMER': {
      if (state.isPaused || state.isCompleted) return state;
      return {
        ...state,
        elapsedSeconds: state.elapsedSeconds + 1
      };
    }

    case 'INIT_STAGE': {
      return createInitialState(action.payload.stage);
    }

    case 'RESTART_CURRENT_STAGE': {
      const resetBoard = state.board.map((_, i) => (state.givens[i] ? state.solution[i] : 0));
      return {
        ...state,
        board: resetBoard,
        notes: Array.from({ length: 81 }, () => []),
        selectedCell: null,
        mistakes: 0,
        hintsUsed: 0,
        elapsedSeconds: 0,
        isPaused: false,
        isCompleted: false,
        conflicts: [],
        history: [],
        future: []
      };
    }

    case 'RESTORE_GAME': {
      return action.payload.state;
    }

    default:
      return state;
  }
}
