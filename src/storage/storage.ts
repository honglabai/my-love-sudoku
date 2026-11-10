import { PlayerProgression, createInitialProgression, DEFAULT_INVENTORY } from '../features/progression/progression';

export interface UserSettings {
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  showErrors: boolean;
  autoRemoveNotes: boolean;
  highlightSame: boolean;
  reducedMotion: boolean;
}

export interface ActiveGameSave {
  stageId: number;
  board: number[];
  notes: number[][];
  mistakes: number;
  hintsUsed: number;
  elapsedSeconds: number;
  lastSavedAt: number;
}

export interface SaveDataV1 {
  version: 1;
  progression: PlayerProgression;
  achievements: Record<string, number>; // achievementId -> timestamp
  activeGame: ActiveGameSave | null;
  settings: UserSettings;
}

export const STORAGE_KEY = 'MY_LOVE_SUDOKU_DATA_V1';

export const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  theme: 'light',
  showErrors: true,
  autoRemoveNotes: true,
  highlightSame: true,
  reducedMotion: false
};

export function createDefaultSaveData(): SaveDataV1 {
  return {
    version: 1,
    progression: createInitialProgression(),
    achievements: {},
    activeGame: null,
    settings: { ...DEFAULT_SETTINGS }
  };
}

/**
 * Validates and safely migrates older or corrupted save objects to V1.
 */
export function migrateOrSanitize(parsed: unknown): SaveDataV1 {
  const defaultData = createDefaultSaveData();
  if (!parsed || typeof parsed !== 'object') {
    return defaultData;
  }

  const obj = parsed as Record<string, unknown>;

  // Check version
  const progression: PlayerProgression = {
    ...defaultData.progression,
    ...((obj.progression as PlayerProgression) || {})
  };

  // Ensure stageRecords is valid
  if (!progression.stageRecords || typeof progression.stageRecords !== 'object') {
    progression.stageRecords = {};
  }

  // Ensure unlockedStageMax is at least 1 and within 1..50
  progression.unlockedStageMax = Math.max(1, Math.min(50, Number(progression.unlockedStageMax) || 1));
  progression.level = Math.max(1, Number(progression.level) || 1);
  progression.currentXP = Math.max(0, Number(progression.currentXP) || 0);
  progression.totalXP = Math.max(0, Number(progression.totalXP) || 0);

  // Ensure inventory is valid with default values
  progression.inventory = {
    ...DEFAULT_INVENTORY,
    ...(progression.inventory || {})
  };

  const achievements: Record<string, number> =
    obj.achievements && typeof obj.achievements === 'object'
      ? (obj.achievements as Record<string, number>)
      : {};

  let activeGame: ActiveGameSave | null = null;
  if (obj.activeGame && typeof obj.activeGame === 'object') {
    const ag = obj.activeGame as Partial<ActiveGameSave>;
    if (ag.stageId && Array.isArray(ag.board) && ag.board.length === 81) {
      activeGame = {
        stageId: ag.stageId,
        board: ag.board,
        notes: Array.isArray(ag.notes) && ag.notes.length === 81 ? ag.notes : Array.from({ length: 81 }, () => []),
        mistakes: Number(ag.mistakes) || 0,
        hintsUsed: Number(ag.hintsUsed) || 0,
        elapsedSeconds: Number(ag.elapsedSeconds) || 0,
        lastSavedAt: Number(ag.lastSavedAt) || Date.now()
      };
    }
  }

  const rawSettings = (obj.settings as Partial<UserSettings>) || {};
  const settings: UserSettings = {
    ...defaultData.settings,
    ...rawSettings,
    theme: rawSettings.theme === 'dark' ? 'dark' : rawSettings.theme === 'system' ? 'system' : 'light'
  };

  return {
    version: 1,
    progression,
    achievements,
    activeGame,
    settings
  };
}

/**
 * Loads game data from localStorage with graceful fallback.
 */
export function loadGameData(): SaveDataV1 {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return createDefaultSaveData();
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultSaveData();

    const parsed = JSON.parse(raw);
    return migrateOrSanitize(parsed);
  } catch (err) {
    console.warn('[내사랑 스도쿠] Failed to read localStorage, using default data:', err);
    return createDefaultSaveData();
  }
}

/**
 * Writes game data to localStorage.
 */
export function saveGameData(data: SaveDataV1): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.warn('[내사랑 스도쿠] Failed to write localStorage:', err);
    return false;
  }
}

/**
 * Resets all saved data back to factory defaults.
 */
export function resetAllData(): SaveDataV1 {
  const fresh = createDefaultSaveData();
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore error
  }
  return fresh;
}
