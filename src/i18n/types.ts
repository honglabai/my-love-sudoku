export type Language = 'ko' | 'en' | 'ja' | 'zh';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'ko', label: '한국어', nativeLabel: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇺🇸' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', flag: '🇨🇳' }
];

export type TranslationKey =
  // App brand & common
  | 'brand.title'
  | 'brand.subtitle'
  | 'brand.edition'
  | 'common.back'
  | 'common.toHome'
  | 'common.confirm'
  | 'common.cancel'
  | 'common.close'
  | 'common.install'
  | 'common.installed'
  | 'common.autoSaved'
  | 'common.level'
  | 'common.stage'
  | 'common.stars'
  | 'common.xp'
  | 'common.loading'

  // Navigation
  | 'nav.home'
  | 'nav.stages'
  | 'nav.daily'
  | 'nav.profile'

  // Home Page
  | 'home.activeGameTitle'
  | 'home.activeGameProgress'
  | 'home.continue'
  | 'home.stageJourney'
  | 'home.levelTest'
  | 'home.sudokuGuide'
  | 'home.dailyTitle'
  | 'home.dailySubtitle'
  | 'home.dailyStart'
  | 'home.dailyCleared'
  | 'home.statsLevel'
  | 'home.statsCleared'
  | 'home.statsStars'
  | 'home.quickStart'

  // Game Page
  | 'game.exit'
  | 'game.time'
  | 'game.mistakes'
  | 'game.undo'
  | 'game.redo'
  | 'game.erase'
  | 'game.notes'
  | 'game.notesOn'
  | 'game.notesOff'
  | 'game.hint'
  | 'game.inventory'
  | 'game.pause'
  | 'game.pauseTitle'
  | 'game.pauseDesc'
  | 'game.resume'
  | 'game.restart'
  | 'game.exitToMap'
  | 'game.gameOverTitle'
  | 'game.gameOverDesc'
  | 'game.reviveItem'
  | 'game.hintModalTitle'
  | 'game.recommendedDigit'
  | 'game.solveDirect'
  | 'game.applyHint'
  | 'game.itemDrawerTitle'
  | 'game.noItems'

  // Result Page
  | 'result.stageComplete'
  | 'result.perfectLogic'
  | 'result.greatLogic'
  | 'result.clear'
  | 'result.clearTime'
  | 'result.mistakes'
  | 'result.hintsUsed'
  | 'result.xpEarned'
  | 'result.firstClearBonus'
  | 'result.newStarRecord'
  | 'result.levelUp'
  | 'result.playerLevel'
  | 'result.nextStage'
  | 'result.replay'
  | 'result.stageList'
  | 'result.newAchievement'

  // Stage Map Page
  | 'map.title'
  | 'map.roadmap'
  | 'map.list'
  | 'map.skipTest'
  | 'map.boss'
  | 'map.locked'
  | 'map.bestTime'
  | 'map.world1'
  | 'map.world2'
  | 'map.world3'
  | 'map.world4'
  | 'map.world5'

  // Daily Quest Page
  | 'daily.title'
  | 'daily.streak'
  | 'daily.todayTitle'
  | 'daily.clearStatus'
  | 'daily.rewards'
  | 'daily.playNow'
  | 'daily.alreadyCleared'
  | 'daily.stampsTitle'
  | 'daily.days'

  // Profile & Settings
  | 'profile.tabProfile'
  | 'profile.tabSettings'
  | 'profile.titleTitle'
  | 'profile.levelInfo'
  | 'profile.statsTitle'
  | 'profile.totalTime'
  | 'profile.clearedStages'
  | 'profile.perfectClears'
  | 'profile.inventoryTitle'
  | 'profile.achievementsTitle'
  | 'profile.preferencesTitle'
  | 'profile.language'
  | 'profile.sound'
  | 'profile.soundDesc'
  | 'profile.theme'
  | 'profile.themeLight'
  | 'profile.themeDark'
  | 'profile.themeSystem'
  | 'profile.highlightErrors'
  | 'profile.highlightErrorsDesc'
  | 'profile.autoNotes'
  | 'profile.autoNotesDesc'
  | 'profile.highlightSame'
  | 'profile.highlightSameDesc'
  | 'profile.reducedMotion'
  | 'profile.reducedMotionDesc'
  | 'profile.resetData'
  | 'profile.resetDesc'
  | 'profile.about'
  | 'profile.privacy'
  | 'profile.terms'

  // Items
  | 'item.hint'
  | 'item.hintDesc'
  | 'item.heal'
  | 'item.healDesc'
  | 'item.erase'
  | 'item.eraseDesc'
  | 'item.inspect'
  | 'item.inspectDesc'

  // Modals
  | 'modal.guideTitle'
  | 'modal.levelTestTitle'
  | 'modal.installTitle';

export type Translations = Record<TranslationKey, string>;
