import { describe, it, expect } from 'vitest';
import {
  USER_TITLES_I18N,
  getLocalizedTitle,
  getLocalizedDifficulty,
  getLocalizedWorld,
  getLocalizedStageTitle,
  ACHIEVEMENTS_I18N,
  getLocalizedAchievement,
  getLocalizedDiagnosticTier
} from '../src/i18n/gameContent';
import { Language } from '../src/i18n/types';

const LANGUAGES: Language[] = ['ko', 'en', 'ja', 'zh'];

describe('i18n Game Content Localization', () => {
  it('localizes all 13 user titles across all 4 languages', () => {
    const titles = Object.keys(USER_TITLES_I18N);
    expect(titles.length).toBeGreaterThanOrEqual(13);

    titles.forEach(title => {
      LANGUAGES.forEach(lang => {
        const localized = getLocalizedTitle(title, lang);
        expect(localized).toBeTruthy();
        expect(typeof localized).toBe('string');
        expect(localized.length).toBeGreaterThan(0);
      });
    });
  });

  it('localizes all 5 difficulty levels across all 4 languages', () => {
    const diffs = ['입문', '초급', '중급', '고급', '최고급'];
    diffs.forEach(diff => {
      LANGUAGES.forEach(lang => {
        const localized = getLocalizedDifficulty(diff, lang);
        expect(localized).toBeTruthy();
        expect(localized).not.toBe('');
      });
    });
  });

  it('localizes all 5 worlds across all 4 languages', () => {
    for (let w = 1; w <= 5; w++) {
      LANGUAGES.forEach(lang => {
        const world = getLocalizedWorld(w, lang);
        expect(world.name).toBeTruthy();
        expect(world.description).toBeTruthy();
      });
    }
  });

  it('localizes all 50 stage titles across all 4 languages', () => {
    for (let s = 1; s <= 50; s++) {
      LANGUAGES.forEach(lang => {
        const title = getLocalizedStageTitle(s, lang);
        expect(title).toBeTruthy();
        expect(title).not.toBe(`Stage ${s}`);
      });
    }
  });

  it('localizes all 11 achievements across all 4 languages', () => {
    const achIds = Object.keys(ACHIEVEMENTS_I18N);
    expect(achIds.length).toBe(11);

    achIds.forEach(id => {
      LANGUAGES.forEach(lang => {
        const ach = getLocalizedAchievement(id, lang);
        expect(ach).not.toBeNull();
        expect(ach?.name).toBeTruthy();
        expect(ach?.description).toBeTruthy();
        expect(ach?.rewardTitle).toBeTruthy();
      });
    });
  });

  it('returns appropriate diagnostic tier recommendation for each score and language', () => {
    [0, 1, 2, 3].forEach(score => {
      LANGUAGES.forEach(lang => {
        const result = getLocalizedDiagnosticTier(score, lang);
        expect(result.recommendedStage).toBeGreaterThanOrEqual(1);
        expect(result.tierTitle).toBeTruthy();
        expect(result.tierDesc).toBeTruthy();
        expect(result.worldName).toBeTruthy();
      });
    });
  });
});
