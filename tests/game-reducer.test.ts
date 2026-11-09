import { describe, it, expect } from 'vitest';
import { createInitialState, gameReducer } from '../src/features/game/reducer';
import { getStageById } from '../src/features/stages/stageData';

describe('Step 4: Game State and Input System', () => {
  const stage1 = getStageById(1)!;

  it('prevents modifying given fixed cells', () => {
    let state = createInitialState(stage1);
    // Find a given cell
    const givenIndex = state.givens.findIndex(g => g === true);
    expect(givenIndex).toBeGreaterThanOrEqual(0);

    const originalVal = state.board[givenIndex];

    // Select the given cell and attempt to change it
    state = gameReducer(state, { type: 'SELECT_CELL', payload: { index: givenIndex } });
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: ((originalVal % 9) + 1) } });
    expect(state.board[givenIndex]).toBe(originalVal);

    // Attempt to erase given cell
    state = gameReducer(state, { type: 'ERASE_CELL' });
    expect(state.board[givenIndex]).toBe(originalVal);
  });

  it('allows entering and erasing digits in empty cells', () => {
    let state = createInitialState(stage1);
    const emptyIndex = state.givens.findIndex(g => !g);
    expect(emptyIndex).toBeGreaterThanOrEqual(0);

    state = gameReducer(state, { type: 'SELECT_CELL', payload: { index: emptyIndex } });
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: 7 } });
    expect(state.board[emptyIndex]).toBe(7);

    // Erase cell
    state = gameReducer(state, { type: 'ERASE_CELL' });
    expect(state.board[emptyIndex]).toBe(0);
  });

  it('supports note mode toggle and candidate note management', () => {
    let state = createInitialState(stage1);
    const emptyIndex = state.givens.findIndex(g => !g);

    // Turn on note mode
    state = gameReducer(state, { type: 'TOGGLE_NOTE_MODE' });
    expect(state.isNoteMode).toBe(true);

    state = gameReducer(state, { type: 'SELECT_CELL', payload: { index: emptyIndex } });

    // Add note 3
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: 3 } });
    expect(state.notes[emptyIndex]).toEqual([3]);

    // Add note 7
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: 7 } });
    expect(state.notes[emptyIndex]).toEqual([3, 7]);

    // Toggle note 3 off
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: 3 } });
    expect(state.notes[emptyIndex]).toEqual([7]);

    // Notes do not count as mistakes
    expect(state.mistakes).toBe(0);
  });

  it('supports Undo and Redo', () => {
    let state = createInitialState(stage1);
    const emptyIndex = state.givens.findIndex(g => !g);

    state = gameReducer(state, { type: 'SELECT_CELL', payload: { index: emptyIndex } });
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: 5 } });
    expect(state.board[emptyIndex]).toBe(5);

    // Undo
    state = gameReducer(state, { type: 'UNDO' });
    expect(state.board[emptyIndex]).toBe(0);

    // Redo
    state = gameReducer(state, { type: 'REDO' });
    expect(state.board[emptyIndex]).toBe(5);
  });

  it('supports Pause and Resume', () => {
    let state = createInitialState(stage1);
    state = gameReducer(state, { type: 'PAUSE' });
    expect(state.isPaused).toBe(true);

    // During pause, inputs are ignored
    const emptyIndex = state.givens.findIndex(g => !g);
    state = gameReducer(state, { type: 'SELECT_CELL', payload: { index: emptyIndex } });
    expect(state.selectedCell).toBeNull();

    // Timer doesn't tick while paused
    state = gameReducer(state, { type: 'TICK_TIMER' });
    expect(state.elapsedSeconds).toBe(0);

    // Resume
    state = gameReducer(state, { type: 'RESUME' });
    expect(state.isPaused).toBe(false);

    state = gameReducer(state, { type: 'TICK_TIMER' });
    expect(state.elapsedSeconds).toBe(1);
  });

  it('detects valid completion and rejects invalid completion', () => {
    let state = createInitialState(stage1);

    // Fill all empty cells except one with correct solution
    const emptyIndices: number[] = [];
    for (let i = 0; i < 81; i++) {
      if (!state.givens[i]) emptyIndices.push(i);
    }

    const lastEmpty = emptyIndices.pop()!;
    for (const idx of emptyIndices) {
      state = gameReducer(state, { type: 'SELECT_CELL', payload: { index: idx } });
      state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: stage1.solution[idx] } });
    }

    expect(state.isCompleted).toBe(false);

    // Try placing wrong number in the last cell
    const correctVal = stage1.solution[lastEmpty];
    const wrongVal = (correctVal % 9) + 1;

    state = gameReducer(state, { type: 'SELECT_CELL', payload: { index: lastEmpty } });
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: wrongVal } });
    expect(state.isCompleted).toBe(false);
    expect(state.mistakes).toBe(1);

    // Now place the correct number
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: correctVal } });
    expect(state.isCompleted).toBe(true);
  });

  it('triggers round failure (isFailed) upon 3 mistakes and blocks further input', () => {
    let state = createInitialState(stage1);
    const emptyIndices = state.givens.map((g, i) => (!g ? i : -1)).filter(i => i !== -1);
    const cell0 = emptyIndices[0];
    const correctVal = stage1.solution[cell0];
    const wrongVal = (correctVal % 9) + 1;

    // 1st mistake
    state = gameReducer(state, { type: 'SELECT_CELL', payload: { index: cell0 } });
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: wrongVal } });
    expect(state.mistakes).toBe(1);
    expect(state.isFailed).toBe(false);

    // 2nd mistake
    const wrongVal2 = ((correctVal + 1) % 9) + 1;
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: wrongVal2 } });
    expect(state.mistakes).toBe(2);
    expect(state.isFailed).toBe(false);

    // 3rd mistake -> round failed!
    const wrongVal3 = ((correctVal + 2) % 9) + 1;
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: wrongVal3 } });
    expect(state.mistakes).toBe(3);
    expect(state.isFailed).toBe(true);

    // Further inputs are blocked while failed
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: correctVal } });
    expect(state.board[cell0]).toBe(wrongVal3); // did not change to correctVal!
    expect(state.isCompleted).toBe(false);

    // Timer stops while failed
    state = gameReducer(state, { type: 'TICK_TIMER' });
    expect(state.elapsedSeconds).toBe(0);
  });

  it('supports item usage: heal mistake / revive, auto solve, clear errors, and auto candidates', () => {
    let state = createInitialState(stage1);
    const emptyIndices = state.givens.map((g, i) => (!g ? i : -1)).filter(i => i !== -1);
    const cell0 = emptyIndices[0];
    const cell1 = emptyIndices[1];
    const wrongVal = (stage1.solution[cell0] % 9) + 1;

    // Trigger 3 mistakes -> failed
    state = gameReducer(state, { type: 'SELECT_CELL', payload: { index: cell0 } });
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: wrongVal } });
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: ((wrongVal % 9) + 1) } });
    state = gameReducer(state, { type: 'INPUT_DIGIT', payload: { digit: ((wrongVal + 1) % 9) + 1 } });
    expect(state.isFailed).toBe(true);
    expect(state.mistakes).toBe(3);

    // 1. Use ITEM_HEAL_MISTAKE (정심환 / 부활) -> revives to mistakes=2, isFailed=false
    state = gameReducer(state, { type: 'ITEM_HEAL_MISTAKE' });
    expect(state.mistakes).toBe(2);
    expect(state.isFailed).toBe(false);

    // 2. Use ITEM_CLEAR_ERRORS (정화의 향) -> clears wrongVal in cell0
    state = gameReducer(state, { type: 'ITEM_CLEAR_ERRORS' });
    expect(state.board[cell0]).toBe(0);

    // 3. Use ITEM_SOLVE_CELL (천리안 돋보기) -> solves cell0 with 100% correct digit
    state = gameReducer(state, { type: 'ITEM_SOLVE_CELL', payload: { cellIndex: cell0 } });
    expect(state.board[cell0]).toBe(stage1.solution[cell0]);

    // 4. Use ITEM_AUTO_CANDIDATES (통찰의 부적) -> computes and fills candidates in empty cells
    state = gameReducer(state, { type: 'ITEM_AUTO_CANDIDATES' });
    expect(state.notes[cell1].length).toBeGreaterThan(0);
    expect(state.notes[cell1]).toContain(stage1.solution[cell1]);
  });
});
