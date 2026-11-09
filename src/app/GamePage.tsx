import React, { useEffect, useReducer, useState, useRef, useCallback } from 'react';
import { getStageById } from '../features/stages/stageData';
import { gameReducer, createInitialState } from '../features/game/reducer';
import { ActiveGameSave, UserSettings } from '../storage/storage';
import { sound } from '../audio/sound';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { TutorialOverlay } from '../features/tutorial/TutorialOverlay';
import { findLogicalHint, HintResult } from '../features/hint/hintEngine';
import { getRow, getCol, getBox } from '../domain/sudoku/types';

interface GamePageProps {
  stageId: number;
  activeGameSave: ActiveGameSave | null;
  settings: UserSettings;
  onGameComplete: (result: {
    stageId: number;
    worldId: number;
    mistakes: number;
    hintsUsed: number;
    elapsedSeconds: number;
  }) => void;
  onSaveActiveGame: (save: ActiveGameSave | null) => void;
  onExit: () => void;
}

export const GamePage: React.FC<GamePageProps> = ({
  stageId,
  activeGameSave,
  settings,
  onGameComplete,
  onSaveActiveGame,
  onExit
}) => {
  const stage = getStageById(stageId) || getStageById(1)!;

  const [state, dispatch] = useReducer(gameReducer, stage, (initialStage) => {
    const fresh = createInitialState(initialStage);
    if (activeGameSave && activeGameSave.stageId === stageId) {
      return {
        ...fresh,
        board: [...activeGameSave.board],
        notes: activeGameSave.notes.map(arr => [...arr]),
        mistakes: activeGameSave.mistakes,
        hintsUsed: activeGameSave.hintsUsed,
        elapsedSeconds: activeGameSave.elapsedSeconds
      };
    }
    return fresh;
  });

  const [showTutorial, setShowTutorial] = useState(stage.hasTutorial);
  const [activeHint, setActiveHint] = useState<HintResult | null>(null);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [completedUnitsFlashed, setCompletedUnitsFlashed] = useState<{ rows: number[]; cols: number[]; boxes: number[] }>({
    rows: [],
    cols: [],
    boxes: []
  });

  const prevCompletedUnitsRef = useRef<{ rows: number[]; cols: number[]; boxes: number[] }>({
    rows: [],
    cols: [],
    boxes: []
  });

  // Timer interval
  useEffect(() => {
    if (state.isPaused || state.isCompleted) return;
    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.isPaused, state.isCompleted]);

  // Auto-save active game
  useEffect(() => {
    if (state.isCompleted) {
      onSaveActiveGame(null);
    } else {
      onSaveActiveGame({
        stageId: state.stageId,
        board: state.board,
        notes: state.notes,
        mistakes: state.mistakes,
        hintsUsed: state.hintsUsed,
        elapsedSeconds: state.elapsedSeconds,
        lastSavedAt: Date.now()
      });
    }
  }, [state.board, state.notes, state.mistakes, state.hintsUsed, state.elapsedSeconds, state.isCompleted, state.stageId, onSaveActiveGame]);

  // Line / Box completion detection and celebration FX
  useEffect(() => {
    const current = state.lastCompletedUnits;
    const prev = prevCompletedUnitsRef.current;

    const newRows = current.rows.filter(r => !prev.rows.includes(r));
    const newCols = current.cols.filter(c => !prev.cols.includes(c));
    const newBoxes = current.boxes.filter(b => !prev.boxes.includes(b));

    if (newRows.length > 0 || newCols.length > 0 || newBoxes.length > 0) {
      sound.playLineComplete();
      setCompletedUnitsFlashed({ rows: newRows, cols: newCols, boxes: newBoxes });
      const timer = setTimeout(() => {
        setCompletedUnitsFlashed({ rows: [], cols: [], boxes: [] });
      }, 700);
      return () => clearTimeout(timer);
    }

    prevCompletedUnitsRef.current = current;
  }, [state.lastCompletedUnits]);

  // Handle victory completion transition
  useEffect(() => {
    if (state.isCompleted) {
      onGameComplete({
        stageId: state.stageId,
        worldId: state.worldId,
        mistakes: state.mistakes,
        hintsUsed: state.hintsUsed,
        elapsedSeconds: state.elapsedSeconds
      });
    }
  }, [state.isCompleted, state.stageId, state.worldId, state.mistakes, state.hintsUsed, state.elapsedSeconds, onGameComplete]);

  // Keyboard navigation & inputs
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (state.isPaused || state.isCompleted || showPauseModal || showHintModal || showTutorial) {
        return;
      }

      // Numbers 1-9
      if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const digit = parseInt(e.key, 10);
        if (state.isNoteMode) {
          sound.playTap();
        } else {
          sound.playPlaceNumber(digit);
        }
        dispatch({
          type: 'INPUT_DIGIT',
          payload: { digit, autoRemoveNotes: settings.autoRemoveNotes }
        });
        return;
      }

      // Delete / Backspace
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        sound.playErase();
        dispatch({ type: 'ERASE_CELL' });
        return;
      }

      // Note mode toggle: 'n' or 'N'
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        sound.playTap();
        dispatch({ type: 'TOGGLE_NOTE_MODE' });
        return;
      }

      // Undo: Ctrl+Z or 'u'
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          dispatch({ type: 'REDO' });
        } else {
          dispatch({ type: 'UNDO' });
        }
        return;
      }
      if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
        return;
      }

      // Redo: Ctrl+Y
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
        return;
      }

      // Arrow navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const current = state.selectedCell ?? 0;
        let r = Math.floor(current / 9);
        let c = current % 9;

        if (e.key === 'ArrowUp') r = (r + 8) % 9;
        if (e.key === 'ArrowDown') r = (r + 1) % 9;
        if (e.key === 'ArrowLeft') c = (c + 8) % 9;
        if (e.key === 'ArrowRight') c = (c + 1) % 9;

        dispatch({ type: 'SELECT_CELL', payload: { index: r * 9 + c } });
        return;
      }

      // Escape / Space: Pause
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        setShowPauseModal(true);
        dispatch({ type: 'PAUSE' });
        return;
      }

      // 'h' or 'H': Hint
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handleTriggerHint();
        return;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.selectedCell, state.isNoteMode, state.isPaused, state.isCompleted, showPauseModal, showHintModal, showTutorial, settings.autoRemoveNotes]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleCellClick = (index: number) => {
    sound.playTap();
    dispatch({ type: 'SELECT_CELL', payload: { index } });
  };

  const handleNumpadClick = (digit: number) => {
    if (state.isNoteMode) {
      sound.playTap();
    } else {
      sound.playPlaceNumber(digit);
    }
    dispatch({
      type: 'INPUT_DIGIT',
      payload: { digit, autoRemoveNotes: settings.autoRemoveNotes }
    });
  };

  const handleTriggerHint = () => {
    const hint = findLogicalHint(state.board, state.solution);
    if (hint) {
      sound.playHint();
      setActiveHint(hint);
      setShowHintModal(true);
    }
  };

  const handleApplyHint = () => {
    if (activeHint) {
      dispatch({
        type: 'APPLY_HINT',
        payload: { cellIndex: activeHint.cellIndex, digit: activeHint.digit }
      });
      setShowHintModal(false);
      setActiveHint(null);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Remaining counts of numbers 1..9
  const digitCounts: Record<number, number> = {};
  for (let num = 1; num <= 9; num++) digitCounts[num] = 0;
  state.board.forEach(val => {
    if (val >= 1 && val <= 9) digitCounts[val]++;
  });

  const selectedValue = state.selectedCell !== null ? state.board[state.selectedCell] : 0;
  const selectedRow = state.selectedCell !== null ? getRow(state.selectedCell) : -1;
  const selectedCol = state.selectedCell !== null ? getCol(state.selectedCell) : -1;
  const selectedBox = state.selectedCell !== null ? getBox(state.selectedCell) : -1;

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-screen max-w-md mx-auto p-2 sm:p-4 select-none">
      {/* Top Bar (Zen Header with Korean Stamp) */}
      <header className="w-full flex items-center justify-between pt-1 pb-2 px-1">
        <Button variant="ghost" size="sm" pill onClick={onExit} aria-label="이전 화면으로 이동">
          ← 나가기
        </Button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="korean-seal text-[9px] py-0 px-1">
              {stage.worldName}
            </span>
            <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">
              {stage.id}단계. {stage.title}
            </h2>
            {stage.isBoss && (
              <Badge variant="amber" size="sm">
                보스
              </Badge>
            )}
          </div>
          <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
            시간: {formatTimer(state.elapsedSeconds)} · 실수: {state.mistakes}/3
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          pill
          onClick={() => {
            dispatch({ type: 'PAUSE' });
            setShowPauseModal(true);
          }}
          aria-label="게임 일시정지"
        >
          ⏸️
        </Button>
      </header>

      {/* 9x9 Sudoku Board Container (Porcelain & Zen Glass Finish) */}
      <main className="w-full flex items-center justify-center my-auto py-1">
        <div
          role="grid"
          aria-label="스도쿠 게임 보드"
          className="w-full aspect-square max-w-[390px] grid grid-cols-9 bg-slate-800/90 dark:bg-slate-950/90 backdrop-blur-md p-1 sm:p-1.5 rounded-3xl shadow-2xl border-4 border-slate-700/80 dark:border-slate-800 gap-[1px]"
        >
          {state.board.map((cellValue, idx) => {
            const isGiven = state.givens[idx];
            const isSelected = state.selectedCell === idx;
            const r = getRow(idx);
            const c = getCol(idx);
            const b = getBox(idx);

            const isPeer =
              state.selectedCell !== null &&
              !isSelected &&
              (r === selectedRow || c === selectedCol || b === selectedBox);

            const isSameNumber =
              settings.highlightSame &&
              selectedValue !== 0 &&
              cellValue === selectedValue &&
              !isSelected;

            const isConflict = settings.showErrors && state.conflicts.includes(idx);
            const isHintTarget = activeHint && activeHint.cellIndex === idx;

            // 3x3 block borders
            const isRightBorder = c === 2 || c === 5;
            const isBottomBorder = r === 2 || r === 5;

            // Line/box complete flash
            const isFlashingUnit =
              completedUnitsFlashed.rows.includes(r) ||
              completedUnitsFlashed.cols.includes(c) ||
              completedUnitsFlashed.boxes.includes(b);

            let cellBg = 'bg-white/95 dark:bg-slate-900/95';
            if (isSelected) {
              cellBg = 'bg-amber-300 dark:bg-amber-600 text-slate-950 dark:text-white ring-2 ring-amber-400';
            } else if (isHintTarget) {
              cellBg = 'bg-emerald-200 dark:bg-emerald-900 ring-2 ring-emerald-500 animate-pulse';
            } else if (isConflict) {
              cellBg = 'bg-rose-200 dark:bg-rose-950/90 text-rose-700 dark:text-rose-300 animate-shake';
            } else if (isSameNumber) {
              cellBg = 'bg-blue-100 dark:bg-blue-900/70 font-black';
            } else if (isPeer) {
              cellBg = 'bg-slate-100/90 dark:bg-slate-800/80';
            }

            if (isFlashingUnit) {
              cellBg = 'bg-blue-300 dark:bg-blue-600 animate-flashLine';
            }

            return (
              <div
                key={idx}
                role="gridcell"
                tabIndex={0}
                aria-label={`${r + 1}행 ${c + 1}열, ${cellValue !== 0 ? `숫자 ${cellValue}` : '빈칸'}`}
                aria-selected={isSelected}
                onClick={() => handleCellClick(idx)}
                className={`relative flex items-center justify-center aspect-square cursor-pointer transition-colors duration-100 ${cellBg} ${
                  isRightBorder ? 'mr-0.5 sm:mr-1' : ''
                } ${isBottomBorder ? 'mb-0.5 sm:mb-1' : ''}`}
              >
                {cellValue !== 0 ? (
                  <span
                    className={`font-black text-base sm:text-xl md:text-2xl font-serif ${
                      isGiven
                        ? 'text-slate-900 dark:text-slate-100'
                        : isConflict
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {cellValue}
                  </span>
                ) : (
                  /* Candidate Notes 3x3 Grid */
                  <div className="w-full h-full p-0.5 grid grid-cols-3 grid-rows-3 text-[8px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-none pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <span
                        key={num}
                        className={`flex items-center justify-center ${
                          state.notes[idx].includes(num) ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Controls & Numpad (3D Tactile Buttons) */}
      <footer className="w-full max-w-[390px] space-y-2 pb-2">
        {/* Action Controls Row */}
        <div className="grid grid-cols-5 gap-1.5 px-1">
          <Button
            variant="ghost"
            size="sm"
            pill
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={state.history.length === 0}
            className="flex-col py-1 text-[11px] font-bold gap-0.5 bg-white/80 dark:bg-slate-800/80 shadow-sm"
          >
            <span className="text-sm">↩️</span>
            <span>취소</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            pill
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={state.future.length === 0}
            className="flex-col py-1 text-[11px] font-bold gap-0.5 bg-white/80 dark:bg-slate-800/80 shadow-sm"
          >
            <span className="text-sm">↪️</span>
            <span>다시</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            pill
            onClick={() => {
              sound.playErase();
              dispatch({ type: 'ERASE_CELL' });
            }}
            className="flex-col py-1 text-[11px] font-bold gap-0.5 bg-white/80 dark:bg-slate-800/80 shadow-sm"
          >
            <span className="text-sm">🧹</span>
            <span>지우기</span>
          </Button>

          <Button
            variant={state.isNoteMode ? 'accent' : 'ghost'}
            size="sm"
            pill
            onClick={() => {
              sound.playTap();
              dispatch({ type: 'TOGGLE_NOTE_MODE' });
            }}
            className={`flex-col py-1 text-[11px] font-bold gap-0.5 ${
              state.isNoteMode
                ? 'shadow-md'
                : 'bg-white/80 dark:bg-slate-800/80 shadow-sm'
            }`}
          >
            <span className="text-sm">✏️</span>
            <span>메모 {state.isNoteMode ? 'ON' : 'OFF'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            pill
            onClick={handleTriggerHint}
            className="flex-col py-1 text-[11px] font-bold gap-0.5 bg-white/80 dark:bg-slate-800/80 shadow-sm text-amber-600 dark:text-amber-400"
          >
            <span className="text-sm">💡</span>
            <span>힌트</span>
          </Button>
        </div>

        {/* Number Keypad 1~9 (Tactile Porcelain Aesthetic) */}
        <div className="grid grid-cols-9 gap-1 sm:gap-1.5 px-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
            const isCompletedNum = digitCounts[num] >= 9;
            return (
              <button
                key={num}
                onClick={() => handleNumpadClick(num)}
                disabled={isCompletedNum && !state.isNoteMode}
                className={`flex flex-col items-center justify-center h-12 sm:h-14 rounded-2xl font-black font-serif transition-all active:translate-y-1 active:shadow-none ${
                  isCompletedNum && !state.isNoteMode
                    ? 'opacity-30 bg-slate-200 dark:bg-slate-800 pointer-events-none'
                    : 'bg-white/95 dark:bg-slate-800/95 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-slate-700 shadow-[0_3px_0_#cbd5e1] dark:shadow-[0_3px_0_#0f172a]'
                }`}
              >
                <span className="text-lg sm:text-xl leading-none">{num}</span>
                <span className="text-[9px] font-sans font-semibold text-slate-400 mt-0.5">
                  {isCompletedNum ? '완료' : `${9 - digitCounts[num]}`}
                </span>
              </button>
            );
          })}
        </div>
      </footer>

      {/* Tutorial Overlay */}
      {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}

      {/* Hint Explanation Modal */}
      <Modal
        isOpen={showHintModal && !!activeHint}
        onClose={() => setShowHintModal(false)}
        title="💡 논리적 힌트"
      >
        {activeHint && (
          <div className="space-y-4 text-center">
            <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-2xl">
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                {activeHint.title}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {activeHint.explanation}
              </p>
            </div>

            <div className="text-base font-extrabold text-blue-600 dark:text-blue-400">
              추천 숫자: <span className="text-2xl font-black">{activeHint.digit}</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="md"
                pill
                onClick={() => setShowHintModal(false)}
                className="flex-1"
              >
                직접 풀기
              </Button>
              <Button
                variant="primary"
                size="md"
                pill
                onClick={handleApplyHint}
                className="flex-1"
              >
                적용하기
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Pause Modal */}
      <Modal
        isOpen={showPauseModal}
        onClose={() => {
          setShowPauseModal(false);
          dispatch({ type: 'RESUME' });
        }}
        title="일시 정지"
      >
        <div className="space-y-3">
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            현재 스테이지 진행 상황은 자동으로 저장됩니다.
          </p>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            pill
            onClick={() => {
              setShowPauseModal(false);
              dispatch({ type: 'RESUME' });
            }}
          >
            ▶️ 계속하기
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            pill
            onClick={() => {
              dispatch({ type: 'RESTART_CURRENT_STAGE' });
              setShowPauseModal(false);
            }}
          >
            🔄 처음부터 다시 풀기
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            pill
            onClick={onExit}
          >
            🗺️ 스테이지 선택으로 나가기
          </Button>
        </div>
      </Modal>
    </div>
  );
};
