import React, { useState } from 'react';
import { UserSettings } from '../storage/storage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { sound } from '../audio/sound';
import { useI18n } from '../i18n';
import { LanguageSelector } from '../components/LanguageSelector';

interface SettingsPageProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onBack
}) => {
  const { t, language } = useI18n();
  const [tutorialResetNotice, setTutorialResetNotice] = useState(false);

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
    <div className="flex flex-col min-h-screen max-w-md mx-auto p-3 sm:p-4 pb-20 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 pt-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← {t('common.toHome')}
        </Button>
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
          {t('profile.preferencesTitle')}
        </h2>
        <div className="w-16" />
      </div>

      <div className="space-y-3">
        {/* Language Selector */}
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
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              🔊 {t('profile.sound')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t('profile.soundDesc')}
            </div>
          </div>
          <button
            onClick={handleToggleSound}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
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

        {/* Theme Selector */}
        <Card>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            🎨 {t('profile.theme')}
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
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
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
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              ⚠️ {t('profile.highlightErrors')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t('profile.highlightErrorsDesc')}
            </div>
          </div>
          <button
            onClick={() => onUpdateSettings({ showErrors: !settings.showErrors })}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
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
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              ✏️ {t('profile.autoNotes')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t('profile.autoNotesDesc')}
            </div>
          </div>
          <button
            onClick={() => onUpdateSettings({ autoRemoveNotes: !settings.autoRemoveNotes })}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
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
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              🔍 {t('profile.highlightSame')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t('profile.highlightSameDesc')}
            </div>
          </div>
          <button
            onClick={() => onUpdateSettings({ highlightSame: !settings.highlightSame })}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
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
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              🍃 {t('profile.reducedMotion')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t('profile.reducedMotionDesc')}
            </div>
          </div>
          <button
            onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
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

        {/* Tutorial Reset Option */}
        <Card className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              📖 {language === 'en' ? 'Beginner Guide' : language === 'ja' ? '初心者ガイド' : language === 'zh' ? '新手指南' : '초보자 가이드 안내'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {tutorialResetNotice ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ {language === 'en' ? 'Reset! Guide will show on next game.' : language === 'ja' ? 'リセット完了！次回プレイ時に表示されます。' : language === 'zh' ? '已重置！下次游戏将再次显示。' : '안내가 초기화되었습니다. 다음 게임 시 다시 표시됩니다.'}
                </span>
              ) : (
                language === 'en' ? 'Re-enable in-game tutorial guide' : language === 'ja' ? '数独のルールと操作方法ガイドを再表示' : language === 'zh' ? '重新显示数独规则与操作指南' : '스도쿠 규칙 및 게임 조작법 가이드 다시 보기'
              )}
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            pill
            onClick={handleResetTutorial}
          >
            {language === 'en' ? 'Reset' : language === 'ja' ? '再設定' : language === 'zh' ? '重置' : '안내 초기화'}
          </Button>
        </Card>

        {/* Info Card */}
        <Card className="text-center p-4 bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-500 space-y-1">
          <div className="font-extrabold text-slate-800 dark:text-slate-200">
            {t('brand.title')}
          </div>
          <div>
            {language === 'en' ? 'Version 1.0.0 (Official Release)' : language === 'ja' ? 'バージョン 1.0.0 (公式リリース)' : language === 'zh' ? '版本 1.0.0 (正式发布版)' : '버전 1.0.0 (정식 배포판)'}
          </div>
          <div>
            {language === 'en' ? 'TypeScript Engine · Offline PWA Supported' : language === 'ja' ? 'TypeScriptエンジン · オフラインPWA対応' : language === 'zh' ? 'TypeScript引擎 · 支持离线PWA' : '순수 TypeScript 엔진 · 오프라인 PWA 지원'}
          </div>
        </Card>
      </div>
    </div>
  );
};
