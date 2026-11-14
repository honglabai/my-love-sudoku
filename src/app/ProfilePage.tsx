import React, { useState } from 'react';
import { PlayerProgression, getRequiredXPForLevel } from '../features/progression/progression';
import { ACHIEVEMENTS } from '../features/achievements/achievements';
import { UserSettings } from '../storage/storage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { Modal } from '../components/Modal';
import { LevelTestModal } from '../components/LevelTestModal';
import { PrivacyPolicyModal } from '../components/PrivacyPolicyModal';
import { TermsOfServiceModal } from '../components/TermsOfServiceModal';
import { SudokuGuideModal } from '../components/SudokuGuideModal';
import { AboutContactModal } from '../components/AboutContactModal';
import { LanguageSelector } from '../components/LanguageSelector';
import { useI18n, getLocalizedTitle, getLocalizedAchievement } from '../i18n';
import { sound } from '../audio/sound';

interface ProfilePageProps {
  progression: PlayerProgression;
  achievements: Record<string, number>;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onEquipTitle: (title: string) => void;
  onResetData: () => void;
  onBack: () => void;
  onApplyLevelTest?: (stageId: number) => void;
  initialTab?: 'profile' | 'settings';
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  progression,
  achievements,
  settings,
  onUpdateSettings,
  onEquipTitle,
  onResetData,
  onBack,
  onApplyLevelTest,
  initialTab = 'profile'
}) => {
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(initialTab);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showLevelTest, setShowLevelTest] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [tutorialResetNotice, setTutorialResetNotice] = useState(false);

  const reqXP = getRequiredXPForLevel(progression.level);

  const totalCleared = Object.keys(progression.stageRecords).length;
  const perfectClears = Object.values(progression.stageRecords).filter(r => r.stars === 3).length;

  const handleToggleSound = () => {
    const nextVal = !settings.soundEnabled;
    sound.setEnabled(nextVal);
    if (nextVal) sound.playTap();
    onUpdateSettings({ soundEnabled: nextVal });
  };

  const handleResetTutorial = () => {
    try {
      localStorage.removeItem('my_love_sudoku_tutorial_seen');
      sound.playTap();
      setTutorialResetNotice(true);
      setTimeout(() => setTutorialResetNotice(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto p-3 sm:p-4 pb-20 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 pt-1">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-xs">
          ← {t('common.toHome')}
        </Button>
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
          {t('nav.profile')}
        </h2>
        <div className="w-16" />
      </div>

      {/* Segmented Sub-Navigation: [👤 내 정보 & 업적] | [⚙️ 게임 설정] */}
      <div className="flex bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl mb-3 shadow-inner">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>👤</span>
          <span>{t('profile.tabProfile')}</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>⚙️</span>
          <span>{t('profile.tabSettings')}</span>
        </button>
      </div>

      {/* TAB 1: Profile, Inventory & Achievements */}
      {activeTab === 'profile' && (
        <div className="space-y-3">
          {/* Main Player Info Card */}
          <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/40 dark:from-slate-900 dark:to-blue-950/20 border-blue-200/70 dark:border-blue-900/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20 text-white">
                  👤
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="blue" size="sm" className="text-xs">
                      Lv. {progression.level}
                    </Badge>
                    <button
                      onClick={() => setShowTitleModal(true)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      [{t('profile.titleTitle')}]
                    </button>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
                    {getLocalizedTitle(progression.equippedTitle, language)}
                  </h3>
                </div>
              </div>
            </div>

            <ProgressBar
              value={progression.currentXP}
              max={reqXP}
              label={`${t('profile.levelInfo')} (${progression.currentXP} / ${reqXP} XP)`}
              showPercent
              color="blue"
              className="mb-2"
            />

            {/* Checkpoint Tier Markers */}
            <div className="grid grid-cols-4 gap-1 text-xs text-center mb-3 font-bold text-slate-500 dark:text-slate-400">
              <div className={progression.level >= 1 ? 'text-blue-600 dark:text-blue-400' : ''}>
                <div>{language === 'en' ? 'Novice' : language === 'ja' ? '入門者' : language === 'zh' ? '初学者' : '입문자'}</div>
                <div className="text-[10px] opacity-75">Lv.1</div>
              </div>
              <div className={progression.level >= 5 ? 'text-blue-600 dark:text-blue-400' : ''}>
                <div>{language === 'en' ? 'Explorer' : language === 'ja' ? '探検家' : language === 'zh' ? '探索者' : '탐험가'}</div>
                <div className="text-[10px] opacity-75">Lv.5</div>
              </div>
              <div className={progression.level >= 15 ? 'text-blue-600 dark:text-blue-400' : ''}>
                <div>{language === 'en' ? 'Collector' : language === 'ja' ? '収集家' : language === 'zh' ? '收集家' : '수집가'}</div>
                <div className="text-[10px] opacity-75">Lv.15</div>
              </div>
              <div className={progression.level >= 30 ? 'text-blue-600 dark:text-blue-400' : ''}>
                <div>{language === 'en' ? 'Master' : language === 'ja' ? '達人' : language === 'zh' ? '宗师' : '마스터'}</div>
                <div className="text-[10px] opacity-75">Lv.30+</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-center">
              <div className="p-2 bg-white/70 dark:bg-slate-800/60 rounded-xl">
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold">총 획득 별점</div>
                <div className="text-sm sm:text-base font-extrabold text-amber-500">
                  ⭐ {progression.totalStars}
                </div>
              </div>
              <div className="p-2 bg-white/70 dark:bg-slate-800/60 rounded-xl">
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold">클리어 스테이지</div>
                <div className="text-sm sm:text-base font-extrabold text-blue-600 dark:text-blue-400">
                  {totalCleared} / 50
                </div>
              </div>
              <div className="p-2 bg-white/70 dark:bg-slate-800/60 rounded-xl">
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold">3성 완벽 클리어</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {perfectClears}개
                </div>
              </div>
            </div>
          </Card>

          {/* Item Inventory Section */}
          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-amber-200/80 dark:border-amber-900/50 shadow-md">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between">
              <span>🎒 보유 중인 아이템</span>
              <span className="text-[10.5px] sm:text-xs text-amber-600 dark:text-amber-400 font-semibold">스도쿠 인게임에서 사용 가능</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-xl mb-0.5">🔍</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">천리안 돋보기</div>
                <div className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400">{progression.inventory?.autoSolve ?? 3}개</div>
                <div className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400">정답 1칸 입력</div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-xl mb-0.5">💊</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">정심환 (부활)</div>
                <div className="text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400">{progression.inventory?.healMistake ?? 3}개</div>
                <div className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400">실수 회복 / 부활</div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-xl mb-0.5">🧹</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">정화의 향</div>
                <div className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400">{progression.inventory?.clearErrors ?? 3}개</div>
                <div className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400">오답 일괄 제거</div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-xl mb-0.5">📜</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">통찰의 부적</div>
                <div className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">{progression.inventory?.autoCandidates ?? 3}개</div>
                <div className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400">후보수 자동 메모</div>
              </div>
            </div>
          </Card>

          {/* Achievements Section */}
          <div className="mb-4">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 px-1">
              수집한 업적 배지 ({Object.keys(achievements).length} / {ACHIEVEMENTS.length})
            </h3>

            <div className="space-y-2">
              {ACHIEVEMENTS.map(ach => {
                const isUnlocked = !!achievements[ach.id];
                const locAch = getLocalizedAchievement(ach.id, language) || ach;
                return (
                  <Card
                    key={ach.id}
                    className={`transition-all ${
                      isUnlocked
                        ? 'border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-r from-amber-50/20 to-transparent'
                        : 'opacity-50 grayscale'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{ach.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            {locAch.name}
                          </span>
                          {isUnlocked && (
                            <Badge variant="amber" size="sm" className="text-xs">
                              {getLocalizedTitle(ach.rewardTitle, language)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          {locAch.description}
                        </p>
                      </div>
                      <div>
                        {isUnlocked ? (
                          <span className="text-xs font-bold text-amber-500">
                            {language === 'en' ? 'Unlocked' : language === 'ja' ? '達成' : language === 'zh' ? '达成' : '달성'}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">
                            {language === 'en' ? 'Locked' : language === 'ja' ? '未開放' : language === 'zh' ? '未解锁' : '잠김'}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Game Settings inside My Page */}
      {activeTab === 'settings' && (
        <div className="space-y-2.5">
          {/* Language Selector Card */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>🌐</span>
                <span>{t('profile.language')}</span>
              </div>
            </div>
            <LanguageSelector variant="settings" />
          </Card>

          {/* Sound FX Toggle */}
          <Card className="flex items-center justify-between">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                🔊 {t('profile.sound')}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                {t('profile.soundDesc')}
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                settings.soundEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </Card>

          {/* Theme Selector (Default: Light) */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                🎨 {t('profile.theme')}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: `☀️ ${t('profile.themeLight')}` },
                { id: 'dark', label: `🌙 ${t('profile.themeDark')}` },
                { id: 'system', label: `💻 ${t('profile.themeSystem')}` }
              ].map(item => {
                const isSelected = settings.theme === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onUpdateSettings({ theme: item.id as UserSettings['theme'] })}
                    className={`py-1.5 px-2 rounded-xl font-bold text-xs transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Highlight Conflicts Toggle */}
          <Card className="flex items-center justify-between">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                ⚠️ {t('profile.highlightErrors')}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                {t('profile.highlightErrorsDesc')}
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ showErrors: !settings.showErrors })}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                settings.showErrors ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  settings.showErrors ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </Card>

          {/* Auto Remove Notes Toggle */}
          <Card className="flex items-center justify-between">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                ✏️ {t('profile.autoNotes')}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                {t('profile.autoNotesDesc')}
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ autoRemoveNotes: !settings.autoRemoveNotes })}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                settings.autoRemoveNotes ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  settings.autoRemoveNotes ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </Card>

          {/* Highlight Same Numbers Toggle */}
          <Card className="flex items-center justify-between">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                🔢 {t('profile.highlightSame')}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                {t('profile.highlightSameDesc')}
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ highlightSame: !settings.highlightSame })}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                settings.highlightSame ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  settings.highlightSame ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </Card>

          {/* Reduced Motion Toggle */}
          <Card className="flex items-center justify-between">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                🍃 {t('profile.reducedMotion')}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                {t('profile.reducedMotionDesc')}
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                settings.reducedMotion ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </Card>

          {/* Tutorial Guide Reset */}
          <Card className="flex items-center justify-between">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                📖 튜토리얼 가이드 다시 보기
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                게임 시작 시 입문 도움말 안내 팝업을 다시 표시합니다
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetTutorial}
              className="text-xs shrink-0"
            >
              {tutorialResetNotice ? '초기화됨! ✓' : '다시 보기'}
            </Button>
          </Card>

          {/* Level Test Placement Retake */}
          {onApplyLevelTest && (
            <Card className="flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40">
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  🎯 실력 진단 레벨 테스트
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  3문항 실력 테스트를 다시 치르고 원하는 단계로 바로 점프합니다
                </div>
              </div>
              <Button
                variant="accent"
                size="sm"
                onClick={() => setShowLevelTest(true)}
                className="text-xs shrink-0 font-bold"
              >
                테스트 시작
              </Button>
            </Card>
          )}

          {/* App Info Card with Policy & Guide Links for AdSense & User Transparency */}
          <Card className="text-center p-3.5 bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 space-y-2">
            <div className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">내사랑 스도쿠</div>
            <div>버전 1.0.0 (정식 배포판) · 한국 수묵 담채화 에디션</div>
            <div className="text-[11px] text-slate-400">오프라인 PWA 및 고화질 벡터 스도쿠 보드 지원</div>

            <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/60 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <button
                onClick={() => setShowPrivacy(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400 underline decoration-slate-300 dark:decoration-slate-700"
              >
                개인정보처리방침
              </button>
              <span>·</span>
              <button
                onClick={() => setShowTerms(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400 underline decoration-slate-300 dark:decoration-slate-700"
              >
                이용약관
              </button>
              <span>·</span>
              <button
                onClick={() => setShowGuide(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400 underline decoration-slate-300 dark:decoration-slate-700"
              >
                게임 가이드 & FAQ
              </button>
              <span>·</span>
              <button
                onClick={() => setShowAbout(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400 underline decoration-slate-300 dark:decoration-slate-700"
              >
                고객지원 문의
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Reset Data Button at bottom of My Page */}
      <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800 text-center">
        <button
          onClick={() => setShowResetModal(true)}
          className="text-xs font-semibold text-rose-500 hover:text-rose-700 underline"
        >
          게임 진행 데이터 초기화
        </button>
      </div>

      {/* Title Selection Modal */}
      <Modal
        isOpen={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        title={t('profile.titleTitle')}
      >
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {progression.unlockedTitles.map(title => {
            const isSelected = progression.equippedTitle === title;
            return (
              <button
                key={title}
                onClick={() => {
                  onEquipTitle(title);
                  setShowTitleModal(false);
                }}
                className={`w-full p-2.5 rounded-xl font-bold text-xs sm:text-sm text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{getLocalizedTitle(title, language)}</span>
                {isSelected && <span>✓ {language === 'en' ? 'Equipped' : language === 'ja' ? '装着中' : language === 'zh' ? '佩戴中' : '장착 중'}</span>}
              </button>
            );
          })}
        </div>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={() => setShowTitleModal(false)}
          className="mt-3 text-xs"
        >
          닫기
        </Button>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="데이터 초기화"
      >
        <div className="space-y-3 text-center">
          <div className="text-3xl">⚠️</div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            정말로 모든 게임 데이터를 초기화하시겠습니까?
            <br />
            모든 스테이지 기록, 획득한 별점, 경험치, 업적이 초기화되며 되돌릴 수 없습니다.
          </p>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowResetModal(false)}
              className="flex-1 text-xs"
            >
              취소
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onResetData();
                setShowResetModal(false);
              }}
              className="flex-1 text-xs"
            >
              초기화 확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* Diagnostic Level Test Modal */}
      {showLevelTest && onApplyLevelTest && (
        <LevelTestModal
          isOpen={showLevelTest}
          onClose={() => setShowLevelTest(false)}
          onSelectPlacementStage={onApplyLevelTest}
        />
      )}

      {/* Google AdSense Mandatory Modals */}
      <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsOfServiceModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <SudokuGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      <AboutContactModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
};
