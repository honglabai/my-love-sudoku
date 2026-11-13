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
import { PlayerInventory, DEFAULT_INVENTORY } from '../features/progression/progression';
import { ItemDrawer } from '../components/ItemDrawer';
import { useI18n } from '../i18n';

interface WorldZenMeta {
  themeName: string;
  pill: string;
  pillColor: string;
  motto: string;
  seal: [string, string];
}

const WORLD_ZEN_META: Record<number, WorldZenMeta> = {
  1: {
    themeName: '평온의 정원',
    pill: 'BEGINNER · 평온의 정원',
    pillColor: 'text-rose-700 bg-rose-50/90 border-rose-300',
    motto: '맑은 마음으로 첫 수를 놓아보세요.',
    seal: ['평', '온']
  },
  2: {
    themeName: '푸른 대나무숲',
    pill: 'EASY · 푸른 대나무숲',
    pillColor: 'text-emerald-800 bg-emerald-50/90 border-emerald-300',
    motto: '차분한 시선으로 논리의 실마리를 찾으세요.',
    seal: ['통', '찰']
  },
  3: {
    themeName: '황혼의 석탑',
    pill: 'NORMAL · 황혼의 석탑',
    pillColor: 'text-amber-800 bg-amber-50/90 border-amber-300',
    motto: '깊은 집중으로 숨겨진 한 수를 밝히세요.',
    seal: ['정', '진']
  },
  4: {
    themeName: '설산과 백매화',
    pill: 'HARD · 설산과 백매화',
    pillColor: 'text-sky-800 bg-sky-50/90 border-sky-300',
    motto: '정교한 추론으로 복잡한 실타래를 푸세요.',
    seal: ['지', '혜']
  },
  5: {
    themeName: '붉은 달과 천년송',
    pill: 'MASTER · 붉은 달과 천년송',
    pillColor: 'text-purple-800 bg-purple-50/90 border-purple-300',
    motto: '완전한 통찰로 최고의 경지를 이루세요.',
    seal: ['극', '치']
  }
};

interface GamePageProps {
  stageId: number;
  activeGameSave: ActiveGameSave | null;
  settings: UserSettings;
  inventory?: PlayerInventory;
  onUpdateInventory?: (inv: PlayerInventory) => void;
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
  inventory,
  onUpdateInventory,
  onGameComplete,
  onSaveActiveGame,
  onExit
}) => {
  const { t, language } = useI18n();
  const stage = getStageById(stageId) || getStageById(1)!;
  const currentInventory = inventory || DEFAULT_INVENTORY;
  const zenMeta = WORLD_ZEN_META[stage.worldId] || WORLD_ZEN_META[1];

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

  const [showTutorial, setShowTutorial] = useState(() => {
    if (!stage.hasTutorial) return false;
    try {
      return !localStorage.getItem('my_love_sudoku_tutorial_seen');
    } catch {
      return false;
    }
  });

  const handleCloseTutorial = (dontShowAgain: boolean) => {
    setShowTutorial(false);
    try {
      if (dontShowAgain) {
        localStorage.setItem('my_love_sudoku_tutorial_seen', 'true');
      } else {
        localStorage.removeItem('my_love_sudoku_tutorial_seen');
      }
    } catch {
      // ignore
    }
  };
  const [activeHint, setActiveHint] = useState<HintResult | null>(null);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showItemDrawer, setShowItemDrawer] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
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

  // Handle game over / defeat when 3 mistakes are reached
  useEffect(() => {
    if (state.isFailed) {
      sound.playGameOver();
      setShowGameOverModal(true);
    }
  }, [state.isFailed]);

  // Handle Item activation
  const handleUseItem = useCallback((itemType: keyof PlayerInventory) => {
    if ((currentInventory[itemType] || 0) <= 0) return;

    if (itemType === 'autoSolve') {
      let targetIdx = state.selectedCell;
      if (targetIdx === null || state.board[targetIdx] !== 0 || state.givens[targetIdx]) {
        targetIdx = state.board.findIndex((val, i) => val === 0 && !state.givens[i]);
      }
      if (targetIdx !== -1) {
        sound.playUseItem();
        dispatch({ type: 'ITEM_SOLVE_CELL', payload: { cellIndex: targetIdx } });
        if (onUpdateInventory) {
          onUpdateInventory({
            ...currentInventory,
            autoSolve: currentInventory.autoSolve - 1
          });
        }
      }
    } else if (itemType === 'healMistake') {
      sound.playRevive();
      dispatch({ type: 'ITEM_HEAL_MISTAKE' });
      setShowGameOverModal(false);
      if (onUpdateInventory) {
        onUpdateInventory({
          ...currentInventory,
          healMistake: currentInventory.healMistake - 1
        });
      }
    } else if (itemType === 'clearErrors') {
      sound.playUseItem();
      dispatch({ type: 'ITEM_CLEAR_ERRORS' });
      if (onUpdateInventory) {
        onUpdateInventory({
          ...currentInventory,
          clearErrors: currentInventory.clearErrors - 1
        });
      }
    } else if (itemType === 'autoCandidates') {
      sound.playUseItem();
      dispatch({ type: 'ITEM_AUTO_CANDIDATES' });
      if (onUpdateInventory) {
        onUpdateInventory({
          ...currentInventory,
          autoCandidates: currentInventory.autoCandidates - 1
        });
      }
    }
  }, [currentInventory, state.selectedCell, state.board, state.givens, onUpdateInventory]);

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

  const totalItemCount = (currentInventory.autoSolve || 0) + (currentInventory.healMistake || 0) + (currentInventory.clearErrors || 0) + (currentInventory.autoCandidates || 0);
  const hasErrorsOnBoard = state.board.some((val, i) => val !== 0 && !state.givens[i] && val !== state.solution[i]);

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
    <div className="relative z-10 flex flex-col items-center justify-between min-h-screen max-w-md mx-auto pt-1 px-1 pb-0 sm:pt-2 sm:px-2 sm:pb-0 select-none">
      {/* Top Sleek Control Bar - Compact Rounded-xl Buttons, Zero Text Wrapping */}
      <header className="w-full flex items-center justify-between gap-1.5 pt-1 pb-1.5 px-0.5">
        <button
          onClick={onExit}
          aria-label={t('game.exit')}
          className="flex items-center justify-center px-2 py-1 min-h-[30px] rounded-xl text-xs font-bold whitespace-nowrap bg-white/85 dark:bg-slate-900/85 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 backdrop-blur-md shadow-xs border border-slate-200/80 dark:border-slate-800 active:scale-95 transition-all"
        >
          ← {t('game.exit')}
        </button>

        <div className="flex-1 min-w-0 text-center bg-white/85 dark:bg-slate-900/85 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-center gap-1">
            <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 truncate whitespace-nowrap">
              {stage.id}{language === 'en' ? ' · ' : language === 'ja' ? ' · ' : language === 'zh' ? ' · ' : '단계 · '}{stage.title}
            </h2>
            {stage.isBoss && (
              <Badge variant="amber" size="sm" className="py-0 px-1 text-[9px]">
                {t('map.boss')}
              </Badge>
            )}
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
            {t('game.time')}: {formatTimer(state.elapsedSeconds)} · {t('game.mistakes')}: {state.mistakes}/3{' '}
            <span className="tracking-tighter">
              {state.mistakes === 0 ? '❤️❤️❤️' : state.mistakes === 1 ? '❤️❤️🖤' : state.mistakes === 2 ? '❤️🖤🖤' : '🖤🖤🖤'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowTutorial(true)}
            aria-label="도움말 가이드"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/85 dark:bg-slate-900/85 hover:bg-slate-100 dark:hover:bg-slate-800 backdrop-blur-md shadow-xs border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 active:scale-95 transition-all p-0"
          >
            ❓
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'PAUSE' });
              setShowPauseModal(true);
            }}
            aria-label="게임 일시정지"
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/85 dark:bg-slate-900/85 hover:bg-slate-100 dark:hover:bg-slate-800 backdrop-blur-md shadow-xs border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 active:scale-95 transition-all p-0"
          >
            ⏸️
          </button>
        </div>
      </header>

      {/* Authentic Zen Sudoku Sheet - Maximized Grid for Ultimate Tap Comfort */}
      <main className="w-full flex-1 flex flex-col items-center justify-center my-auto py-1 px-0.5">
        <div className="relative w-full max-w-[min(385px,calc(100vw-8px))] rounded-2xl shadow-2xl overflow-hidden border border-stone-800/20 dark:border-stone-700/50 select-none bg-[#faf8f1] dark:bg-slate-900 flex flex-col items-center p-1.5 sm:p-2">
          {/* Mobile-Optimized Authentic Korean Minhwa Landscape Wallpaper */}
          <picture className="absolute inset-0 pointer-events-none select-none z-0">
            <source srcSet={`/assets/wallpapers/stage_${stage.id}.webp`} type="image/webp" />
            <img
              src={`/assets/wallpapers/stage_${stage.id}.jpg`}
              alt={`제 ${stage.id}단계 배경`}
              className="w-full h-full object-cover object-center"
            />
          </picture>

          {/* Subtle Hanji paper tint for contrast and readability */}
          <div className="absolute inset-0 bg-[#faf8f1]/65 dark:bg-slate-950/75 pointer-events-none select-none z-0 backdrop-blur-[0.5px]" />

          {/* Top Zen Sheet Header: Clean Single Row for Maximum Grid Area */}
          <div className="relative z-10 w-full flex items-center justify-between px-2 pt-0.5 pb-1 pointer-events-none select-none">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-serif font-black text-xs sm:text-sm text-rose-700 dark:text-rose-500 tracking-tight">
                내사랑
              </span>
              <span className="font-serif font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                스도쿠
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-black tracking-wider uppercase border shadow-2xs ${zenMeta.pillColor}`}>
                {zenMeta.pill}
              </span>
            </div>
          </div>

          {/* Maximized Sudoku Grid: 81 Large Cells with Infallible Vector SVG Grid Overlay */}
          <div className="relative z-10 w-full flex items-center justify-center my-0.5">
            <div
              role="grid"
              aria-label="스도쿠 게임 보드"
              className="relative w-full max-w-[min(372px,calc(100vw-16px))] aspect-square rounded-xl shadow-xl overflow-hidden border-[2.5px] border-slate-900 dark:border-stone-100 select-none bg-[#faf8f1] dark:bg-slate-900"
            >
              {/* Layer 1: 9x9 Interactive Cells Grid */}
              <div className="w-full h-full grid grid-cols-9 grid-rows-9">
                {Array.from({ length: 81 }, (_, idx) => {
                  const r = Math.floor(idx / 9);
                  const c = idx % 9;
                  const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
                  const cellValue = state.board[idx];
                  const isGiven = state.givens[idx];
                  const isSelected = state.selectedCell === idx;

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

                  // Line/box complete flash
                  const isFlashingUnit =
                    completedUnitsFlashed.rows.includes(r) ||
                    completedUnitsFlashed.cols.includes(c) ||
                    completedUnitsFlashed.boxes.includes(b);

                  let cellBg = 'bg-[#faf8f1] dark:bg-slate-900';
                  if (isSelected) {
                    cellBg = 'bg-amber-300 dark:bg-amber-500 text-slate-950 font-black';
                  } else if (isHintTarget) {
                    cellBg = 'bg-emerald-300 dark:bg-emerald-500 animate-pulse';
                  } else if (isConflict) {
                    cellBg = 'bg-rose-200 dark:bg-rose-900/60 text-rose-950 dark:text-rose-100 font-black animate-shake';
                  } else if (isSameNumber) {
                    cellBg = 'bg-amber-100 dark:bg-amber-900/40 font-black text-amber-950 dark:text-amber-100';
                  } else if (isPeer) {
                    cellBg = 'bg-stone-100/90 dark:bg-slate-800/60';
                  }

                  if (isFlashingUnit) {
                    cellBg = 'bg-blue-300 dark:bg-blue-700 animate-flashLine';
                  }

                  return (
                    <div
                      key={idx}
                      role="gridcell"
                      tabIndex={0}
                      aria-label={`${r + 1}행 ${c + 1}열, ${cellValue !== 0 ? `숫자 ${cellValue}` : '빈칸'}`}
                      aria-selected={isSelected}
                      onClick={() => handleCellClick(idx)}
                      className={`relative flex items-center justify-center w-full h-full cursor-pointer transition-colors duration-100 select-none ${cellBg}`}
                    >
                      {cellValue !== 0 ? (
                        <span
                          className={`font-black text-lg sm:text-2xl font-serif select-none ${
                            isGiven
                              ? 'text-slate-950 dark:text-stone-100 font-black'
                              : isConflict
                              ? 'text-rose-700 dark:text-rose-400 font-black'
                              : 'text-blue-800 dark:text-blue-400 font-extrabold'
                          }`}
                        >
                          {cellValue}
                        </span>
                      ) : (
                        /* Candidate Notes 3x3 Grid */
                        <div className="w-full h-full p-0.5 grid grid-cols-3 grid-rows-3 text-[8px] sm:text-[9px] font-bold text-stone-700 dark:text-stone-300 leading-none pointer-events-none">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <span
                              key={num}
                              className={`flex items-center justify-center ${
                                state.notes[idx].includes(num) ? 'opacity-100 font-black text-slate-900 dark:text-stone-100' : 'opacity-0'
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

              {/* Layer 2: Vector SVG Grid Lines (On Top of Cells, Guaranteed Razor-Sharp on All Devices) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                viewBox="0 0 900 900"
                preserveAspectRatio="none"
                shapeRendering="crispEdges"
              >
                {/* 1. Thin Cell Dividing Lines: Solid Gray (1px equivalent) */}
                {/* Verticals for individual cells */}
                <line x1="100" y1="0" x2="100" y2="900" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="2.5" />
                <line x1="200" y1="0" x2="200" y2="900" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="2.5" />
                <line x1="400" y1="0" x2="400" y2="900" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="2.5" />
                <line x1="500" y1="0" x2="500" y2="900" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="2.5" />
                <line x1="700" y1="0" x2="700" y2="900" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="2.5" />
                <line x1="800" y1="0" x2="800" y2="900" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="2.5" />

                {/* Horizontals for individual cells */}
                <line x1="0" y1="100" x2="900" y2="100" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="2.5" />
                <line x1="0" y1="200" x2="900" y2="200" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="2.5" />
                <line x1="0" y1="400" x2="900" y2="400" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="2.5" />
                <line x1="0" y1="500" x2="900" y2="500" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="2.5" />
                <line x1="0" y1="700" x2="900" y2="700" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="2.5" />
                <line x1="0" y1="800" x2="900" y2="800" className="stroke-stone-400 dark:stroke-stone-500" strokeWidth="2.5" />

                {/* 2. Bold 3x3 Box Dividing Lines: Bold Dark in Light Mode / Crisp Bright Silver in Dark Mode */}
                {/* Major Verticals */}
                <line x1="300" y1="0" x2="300" y2="900" className="stroke-slate-900 dark:stroke-stone-100" strokeWidth="7" />
                <line x1="600" y1="0" x2="600" y2="900" className="stroke-slate-900 dark:stroke-stone-100" strokeWidth="7" />

                {/* Major Horizontals */}
                <line x1="0" y1="300" x2="900" y2="300" className="stroke-slate-900 dark:stroke-stone-100" strokeWidth="7" />
                <line x1="0" y1="600" x2="900" y2="600" className="stroke-slate-900 dark:stroke-stone-100" strokeWidth="7" />
              </svg>
            </div>
          </div>

          {/* Bottom Zen Motto */}
          <div className="relative z-10 w-full text-center pt-1 pb-0.5 pointer-events-none select-none">
            <span className="text-[10px] sm:text-[10.5px] text-stone-600 dark:text-stone-300 font-serif italic tracking-tight">
              “{zenMeta.motto}”
            </span>
          </div>
        </div>
      </main>

      {/* Bottom Menu Card: Controls & Numpad Flush to Bottom Edge */}
      <footer className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-t-2xl rounded-b-none p-1 sm:p-1.5 pb-1 sm:pb-2 border-t border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-0.5 mt-auto select-none">
        {/* Action Controls Row - Minimized Gaps */}
        <div className="grid grid-cols-6 gap-0.5 px-0.5">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              dispatch({ type: 'UNDO' });
            }}
            disabled={state.history.length === 0}
            className="flex flex-col items-center justify-center py-0.5 px-0.5 min-h-[26px] sm:min-h-[28px] rounded-xl text-[9.5px] sm:text-[10px] font-bold gap-0 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-300 shadow-2xs active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <span className="text-xs sm:text-sm leading-none">↩️</span>
            <span className="leading-tight mt-0.5">{t('game.undo')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              dispatch({ type: 'REDO' });
            }}
            disabled={state.future.length === 0}
            className="flex flex-col items-center justify-center py-0.5 px-0.5 min-h-[26px] sm:min-h-[28px] rounded-xl text-[9.5px] sm:text-[10px] font-bold gap-0 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-300 shadow-2xs active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <span className="text-xs sm:text-sm leading-none">↪️</span>
            <span className="leading-tight mt-0.5">{t('game.redo')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playErase();
              dispatch({ type: 'ERASE_CELL' });
            }}
            className="flex flex-col items-center justify-center py-0.5 px-0.5 min-h-[26px] sm:min-h-[28px] rounded-xl text-[9.5px] sm:text-[10px] font-bold gap-0 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-300 shadow-2xs active:scale-95 transition-all"
          >
            <span className="text-xs sm:text-sm leading-none">🧹</span>
            <span className="leading-tight mt-0.5">{t('game.erase')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              dispatch({ type: 'TOGGLE_NOTE_MODE' });
            }}
            className={`flex flex-col items-center justify-center py-0.5 px-0.5 min-h-[26px] sm:min-h-[28px] rounded-xl text-[9.5px] sm:text-[10px] font-bold gap-0 transition-all active:scale-95 ${
              state.isNoteMode
                ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-400'
                : 'bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-300 shadow-2xs'
            }`}
          >
            <span className="text-xs sm:text-sm leading-none">✏️</span>
            <span className="leading-tight mt-0.5">{t('game.notes')}</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerHint}
            className="flex flex-col items-center justify-center py-0.5 px-0.5 min-h-[26px] sm:min-h-[28px] rounded-xl text-[9.5px] sm:text-[10px] font-bold gap-0 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 text-amber-600 dark:text-amber-400 shadow-2xs active:scale-95 transition-all"
          >
            <span className="text-xs sm:text-sm leading-none">💡</span>
            <span className="leading-tight mt-0.5">{t('game.hint')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setShowItemDrawer(true);
            }}
            className="flex flex-col items-center justify-center py-0.5 px-0.5 min-h-[26px] sm:min-h-[28px] rounded-xl text-[9.5px] sm:text-[10px] font-bold gap-0 bg-gradient-to-b from-amber-100/90 to-orange-100/90 dark:from-slate-800 dark:to-amber-950/40 border border-amber-300 dark:border-amber-700 shadow-2xs text-amber-900 dark:text-amber-300 active:scale-95 transition-transform"
          >
            <span className="text-xs sm:text-sm leading-none">🎒</span>
            <span className="leading-tight mt-0.5 whitespace-nowrap">{t('game.inventory')}({totalItemCount})</span>
          </button>
        </div>

        {/* Number Keypad 1~9 - Minimized Gaps */}
        <div className="grid grid-cols-9 gap-0.5 px-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
            const isCompletedNum = digitCounts[num] >= 9;
            return (
              <button
                key={num}
                onClick={() => handleNumpadClick(num)}
                disabled={isCompletedNum && !state.isNoteMode}
                className={`flex flex-col items-center justify-center h-10 sm:h-11 rounded-xl font-black font-serif transition-all active:translate-y-0.5 active:shadow-none p-0.5 ${
                  isCompletedNum && !state.isNoteMode
                    ? 'opacity-30 bg-slate-200 dark:bg-slate-800 pointer-events-none'
                    : 'bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-blue-800 dark:text-blue-300 border border-slate-200 dark:border-slate-700 shadow-[0_2px_0_#cbd5e1] dark:shadow-[0_2px_0_#0f172a]'
                }`}
              >
                <span className="text-lg sm:text-xl leading-none">{num}</span>
                <span className="text-[9px] sm:text-[9.5px] font-sans font-bold text-slate-400 mt-0.5 leading-none">
                  {isCompletedNum ? (language === 'en' ? 'Done' : language === 'ja' ? '完了' : language === 'zh' ? '完成' : '완료') : `${9 - digitCounts[num]}`}
                </span>
              </button>
            );
          })}
        </div>
      </footer>

      {/* Tutorial Overlay */}
      {showTutorial && <TutorialOverlay onClose={handleCloseTutorial} />}

      {/* Hint Explanation Modal */}
      <Modal
        isOpen={showHintModal && !!activeHint}
        onClose={() => setShowHintModal(false)}
        title={`💡 ${t('game.hintModalTitle')}`}
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
              {t('game.recommendedDigit')}: <span className="text-2xl font-black">{activeHint.digit}</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="md"
                pill
                onClick={() => setShowHintModal(false)}
                className="flex-1"
              >
                {t('game.solveDirect')}
              </Button>
              <Button
                variant="primary"
                size="md"
                pill
                onClick={handleApplyHint}
                className="flex-1"
              >
                {t('game.applyHint')}
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
        title={t('game.pauseTitle')}
      >
        <div className="space-y-3">
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            {t('game.pauseDesc')}
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
            ▶️ {t('game.resume')}
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
            🔄 {t('game.restart')}
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            pill
            onClick={onExit}
          >
            🗺️ {t('game.exitToMap')}
          </Button>
        </div>
      </Modal>

      {/* Item Drawer */}
      <ItemDrawer
        isOpen={showItemDrawer}
        onClose={() => setShowItemDrawer(false)}
        inventory={currentInventory}
        mistakes={state.mistakes}
        hasErrorsOnBoard={hasErrorsOnBoard}
        onUseItem={handleUseItem}
      />

      {/* Game Over / Stage Defeat Modal (실수 3회 실패) */}
      <Modal
        isOpen={showGameOverModal || state.isFailed}
        onClose={() => {}}
        title={`💔 ${t('game.gameOverTitle')}`}
      >
        <div className="space-y-4 text-center">
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/60">
            <div className="text-3xl mb-2">🖤 🖤 🖤</div>
            <h3 className="text-base font-black text-rose-900 dark:text-rose-200 mb-1">
              {t('game.gameOverDesc')}
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed font-medium">
              {t('item.healDesc')}
            </p>
          </div>

          <div className="space-y-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              pill
              disabled={(currentInventory.healMistake || 0) <= 0}
              onClick={() => handleUseItem('healMistake')}
              className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-lg text-white"
            >
              💊 {t('game.reviveItem')} ({currentInventory.healMistake || 0})
            </Button>

            <Button
              variant="secondary"
              size="md"
              fullWidth
              pill
              onClick={() => {
                dispatch({ type: 'RESTART_CURRENT_STAGE' });
                setShowGameOverModal(false);
              }}
            >
              🔄 {t('game.restart')}
            </Button>

            <Button
              variant="ghost"
              size="md"
              fullWidth
              pill
              onClick={onExit}
            >
              🗺️ {t('game.exitToMap')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
