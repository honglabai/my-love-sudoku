import { describe, it, expect, beforeEach } from 'vitest';
import {
  createDefaultSaveData,
  migrateOrSanitize,
  loadGameData,
  saveGameData,
  resetAllData,
  STORAGE_KEY
} from '../src/storage/storage';

describe('Step 8: Storage Persistence and Migration', () => {
  // Mock localStorage
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    const mockLocalStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
    Object.defineProperty(global, 'window', {
      value: { localStorage: mockLocalStorage },
      writable: true
    });
  });

  it('creates valid default data structure', () => {
    const data = createDefaultSaveData();
    expect(data.version).toBe(1);
    expect(data.progression.level).toBe(1);
    expect(data.progression.unlockedStageMax).toBe(1);
    expect(data.activeGame).toBeNull();
  });

  it('saves and loads game data correctly', () => {
    const data = createDefaultSaveData();
    data.progression.level = 5;
    data.progression.totalXP = 540;
    data.progression.unlockedStageMax = 12;

    const saved = saveGameData(data);
    expect(saved).toBe(true);

    const loaded = loadGameData();
    expect(loaded.progression.level).toBe(5);
    expect(loaded.progression.totalXP).toBe(540);
    expect(loaded.progression.unlockedStageMax).toBe(12);
  });

  it('safely handles corrupted JSON and recovers with defaults without crashing', () => {
    store[STORAGE_KEY] = '{"version": 1, "corrupted: [invalid json...';
    const recovered = loadGameData();
    expect(recovered).toBeDefined();
    expect(recovered.progression.level).toBe(1);
    expect(recovered.progression.unlockedStageMax).toBe(1);
  });

  it('migrates older or partial data and fills missing fields', () => {
    const legacyData = {
      progression: {
        level: 3,
        totalXP: 220
      }
    };
    const migrated = migrateOrSanitize(legacyData);
    expect(migrated.version).toBe(1);
    expect(migrated.progression.level).toBe(3);
    expect(migrated.progression.totalXP).toBe(220);
    expect(migrated.progression.unlockedStageMax).toBe(1);
    expect(migrated.settings.soundEnabled).toBe(true);
  });

  it('resets all data cleanly', () => {
    const data = createDefaultSaveData();
    data.progression.level = 10;
    saveGameData(data);

    const fresh = resetAllData();
    expect(fresh.progression.level).toBe(1);
    expect(store[STORAGE_KEY]).toBeUndefined();
  });
});
