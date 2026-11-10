import React, { useState } from 'react';
import { UserSettings } from '../storage/storage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { sound } from '../audio/sound';

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
          ← 홈으로
        </Button>
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">게임 설정</h2>
        <div className="w-16" />
      </div>

      <div className="space-y-3">
        {/* Sound FX Toggle */}
        <Card className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">🔊 효과음</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              숫자 입력, 성공, 완성 연출 효과음 재생
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
            🎨 화면 테마
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: '☀️ 라이트' },
              { id: 'dark', label: '🌙 다크' },
              { id: 'system', label: '💻 시스템' }
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
              ⚠️ 중복 오류 강조
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              행, 열, 박스 내 중복된 숫자를 붉은색으로 표시
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
              ✏️ 후보 메모 자동 정리
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              숫자 입력 시 연결된 행·열·박스의 후보 메모 자동 삭제
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
              🔍 동일한 숫자 강조
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              선택한 셀과 같은 번호를 가진 모든 칸 강조
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
              🍃 모션 줄이기
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              화면 흔들림 및 불꽃 효과 애니메이션 최소화
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
              📖 초보자 가이드 안내
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {tutorialResetNotice ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ 안내가 초기화되었습니다. 다음 게임 시 다시 표시됩니다.
                </span>
              ) : (
                '스도쿠 규칙 및 게임 조작법 가이드 다시 보기'
              )}
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            pill
            onClick={handleResetTutorial}
          >
            안내 초기화
          </Button>
        </Card>

        {/* Info Card */}
        <Card className="text-center p-4 bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-500 space-y-1">
          <div className="font-extrabold text-slate-800 dark:text-slate-200">내사랑 스도쿠</div>
          <div>버전 1.0.0 (정식 배포판)</div>
          <div>순수 TypeScript 엔진 · 오프라인 PWA 지원</div>
        </Card>
      </div>
    </div>
  );
};
