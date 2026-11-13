import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { PlayerProgression } from '../features/progression/progression';
import { useI18n } from '../i18n';

interface DailyQuestPageProps {
  progression: PlayerProgression;
  onStartDailyStage: (stageId: number) => void;
  onBack: () => void;
}

export const DailyQuestPage: React.FC<DailyQuestPageProps> = ({
  progression,
  onStartDailyStage,
  onBack
}) => {
  const { t, language } = useI18n();

  // Format current date according to language
  const today = new Date();
  const locale = language === 'en' ? 'en-US' : language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-CN' : 'ko-KR';
  const dateStr = today.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  // Calculate daily stage based on day of year
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const dailyStageId = ((dayOfYear * 7) % 50) + 1;

  // Check if today's daily quest is completed in localStorage
  const dailyKey = `DAILY_QUEST_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
  const [isCompletedToday] = useState(() => {
    try {
      return localStorage.getItem(dailyKey) === 'true';
    } catch {
      return false;
    }
  });

  // Weekly attendance simulation / tracking
  const weekDays = language === 'en'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : language === 'ja'
    ? ['月', '火', '水', '木', '金', '土', '日']
    : language === 'zh'
    ? ['一', '二', '三', '四', '五', '六', '日']
    : ['월', '화', '수', '목', '금', '토', '일'];
  const currentDayIndex = (today.getDay() + 6) % 7; // Monday = 0

  return (
    <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto p-3 sm:p-4 pb-20 select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-2 pb-4">
        <Button variant="ghost" size="sm" pill onClick={onBack}>
          ← {t('common.toHome')}
        </Button>
        <div className="text-center">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-serif">
            {t('daily.title')}
          </h2>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {dateStr}
          </span>
        </div>
        <div className="w-16 text-right">
          <Badge variant="blue" size="sm">
            Lv. {progression.level}
          </Badge>
        </div>
      </header>

      <main className="space-y-4 my-auto">
        {/* Today's Special Mission Card */}
        <Card className="relative overflow-hidden p-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-amber-200/80 dark:border-amber-900/50 shadow-xl">
          {/* Top Stamp Cartouche */}
          <div className="flex items-center justify-between mb-3">
            <span className="korean-seal text-xs px-2 py-0.5">
              {t('daily.todayTitle')}
            </span>
            <Badge variant={isCompletedToday ? 'emerald' : 'amber'} size="sm">
              {isCompletedToday ? (language === 'en' ? 'Completed ✓' : language === 'ja' ? '完了 ✓' : language === 'zh' ? '完成 ✓' : '수련 완료 ✓') : (language === 'en' ? 'Available' : language === 'ja' ? '挑戦可能' : language === 'zh' ? '可挑战' : '도전 가능')}
            </Badge>
          </div>

          <div className="text-center py-2">
            <div className="text-4xl mb-2 animate-bounce">🌟</div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 font-serif tracking-tight">
              {t('home.dailyTitle')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              {t('home.dailySubtitle')}
            </p>
          </div>

          {/* Daily Rewards Grid */}
          <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl p-3 border border-amber-200/60 dark:border-amber-900/40 my-3">
            <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300 text-center mb-2">
              🎁 {t('daily.rewards')}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="p-2 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-xs">
                <div>🌟</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{language === 'en' ? 'Stamp' : language === 'ja' ? 'スタンプ' : language === 'zh' ? '签到印章' : '출석 스탬프'}</div>
                <div className="text-amber-600 font-black">+1</div>
              </div>
              <div className="p-2 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-xs">
                <div>⚡</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{language === 'en' ? 'Bonus XP' : language === 'ja' ? 'ボーナスXP' : language === 'zh' ? '奖励经验' : '보너스 경험치'}</div>
                <div className="text-blue-600 font-black">+150 XP</div>
              </div>
              <div className="p-2 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-xs">
                <div>🎒</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{language === 'en' ? 'Item Gift' : language === 'ja' ? 'アイテム' : language === 'zh' ? '道具宝箱' : '랜덤 보물'}</div>
                <div className="text-rose-600 font-black">+1</div>
              </div>
            </div>
          </div>

          {/* Start Daily Sudoku Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            pill
            onClick={() => onStartDailyStage(dailyStageId)}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-lg text-white font-black text-sm py-3 mt-1"
          >
            {isCompletedToday ? `🔄 ${t('daily.alreadyCleared')}` : `${t('daily.playNow')} ▶`}
          </Button>
        </Card>

        {/* Weekly Attendance Streak Calendar */}
        <Card className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-blue-200/70 dark:border-blue-900/40 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>📅</span>
              <span>{t('daily.stampsTitle')}</span>
            </h4>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
              🔥 {t('daily.streak')}: {currentDayIndex + 1}{t('daily.days')}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {weekDays.map((day, idx) => {
              const isPast = idx < currentDayIndex;
              const isToday = idx === currentDayIndex;
              return (
                <div
                  key={day}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-between transition-all ${
                    isToday
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50 scale-105'
                      : isPast
                      ? 'bg-blue-50 dark:bg-slate-800 text-blue-800 dark:text-blue-300'
                      : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-bold">{day}</span>
                  <span className="text-base my-1">
                    {isToday ? (isCompletedToday ? '💮' : '📍') : isPast ? '💮' : '🔒'}
                  </span>
                  <span className="text-[9px] opacity-80">
                    {isToday ? (language === 'en' ? 'Today' : language === 'ja' ? '今日' : language === 'zh' ? '今日' : '오늘') : isPast ? '✓' : '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
};
