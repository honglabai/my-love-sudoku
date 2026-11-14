import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useI18n } from '../../i18n';

interface TutorialOverlayProps {
  onClose: (dontShowAgain: boolean) => void;
}

const TUTORIAL_CONTENT = {
  ko: [
    {
      title: '스도쿠 기본 규칙',
      desc: '가로줄, 세로줄, 그리고 3×3 박스 안에 1부터 9까지의 숫자가 중복 없이 단 하나씩만 들어가야 합니다.',
      icon: '🧩'
    },
    {
      title: '셀 선택과 숫자 입력',
      desc: '원하는 빈칸을 먼저 탭하여 선택한 뒤, 화면 하단 숫자 키패드(1~9)를 눌러 숫자를 채워 넣으세요.',
      icon: '👆'
    },
    {
      title: '후보 숫자 메모 기능',
      desc: '아직 확신이 서지 않을 때는 [메모] 모드를 켜서 가능한 후보 숫자들을 적어두고 비교해 보세요.',
      icon: '📝'
    },
    {
      title: '논리적 힌트 지원',
      desc: '막힐 때는 [힌트] 버튼을 눌러보세요. Naked Single, Hidden Single 등 논리적 추론 과정을 상세히 설명해 드립니다.',
      icon: '💡'
    },
    {
      title: '별점과 레벨업 성장',
      desc: '실수와 힌트 없이 퍼즐을 완성하면 최고 등급인 ★★★ 별점과 풍성한 경험치를 얻고 레벨업할 수 있습니다!',
      icon: '⭐'
    }
  ],
  en: [
    {
      title: 'Basic Sudoku Rules',
      desc: 'Each row, column, and 3×3 box must contain digits 1 through 9 without repetition.',
      icon: '🧩'
    },
    {
      title: 'Select Cell & Input Digits',
      desc: 'Tap an empty cell to select it, then tap a digit (1-9) on the bottom keypad to place it.',
      icon: '👆'
    },
    {
      title: 'Candidate Notes Feature',
      desc: 'When unsure, switch on [Notes] mode to mark possible candidate digits for easy comparison.',
      icon: '📝'
    },
    {
      title: 'Logical Hint Assistant',
      desc: 'Stuck? Tap [Hint] for detailed step-by-step logic like Naked Single or Hidden Single.',
      icon: '💡'
    },
    {
      title: 'Stars & Level Progression',
      desc: 'Solve puzzles cleanly without mistakes to earn 3 stars, gain massive XP, and level up!',
      icon: '⭐'
    }
  ],
  ja: [
    {
      title: '数独の基本ルール',
      desc: '各行、各列、3×3のブロック内に1〜9の数字が重複なく1つずつ入ります。',
      icon: '🧩'
    },
    {
      title: 'マスの選択と入力',
      desc: '空いたマスをタップして選択後、画面下のテンキー(1〜9)を押して数字を入力します。',
      icon: '👆'
    },
    {
      title: '候補メモ機能',
      desc: '確信が持てない時は[メモ]をオンにして候補数字を書き留めましょう。',
      icon: '📝'
    },
    {
      title: '論理ヒント機能',
      desc: '手が止まったら[ヒント]をタップ。確定マスを論理的に解説します。',
      icon: '💡'
    },
    {
      title: 'スターとレベルアップ',
      desc: 'ノーミスでクリアして★★★スターと経験値を獲得し、称号を高めましょう！',
      icon: '⭐'
    }
  ],
  zh: [
    {
      title: '数独基本规则',
      desc: '每一行、每一列及每个3×3宫格内，数字1至9必须恰好出现一次且不重复。',
      icon: '🧩'
    },
    {
      title: '选择空格与填入数字',
      desc: '先点击要填写的空格，再点击下方数字键盘（1~9）填入数字。',
      icon: '👆'
    },
    {
      title: '候选数笔记功能',
      desc: '尚不确定时可开启[笔记]模式，标记可能填入的候选数以便推导。',
      icon: '📝'
    },
    {
      title: '逻辑线索提示',
      desc: '遇到难关时点击[提示]，系统会按逻辑推理逐步揭晓关键解法。',
      icon: '💡'
    },
    {
      title: '星级与段位升级',
      desc: '零失误通关可获★★★满星与丰厚经验值，不断晋升更高称号！',
      icon: '⭐'
    }
  ]
};

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const { language } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(() => {
    try {
      return localStorage.getItem('my_love_sudoku_tutorial_seen') === 'true';
    } catch {
      return false;
    }
  });

  const steps = TUTORIAL_CONTENT[language] || TUTORIAL_CONTENT.ko;
  const step = steps[currentStep];

  const guideLabel = language === 'en' ? 'Beginner Guide' : language === 'ja' ? '初心者ガイド' : language === 'zh' ? '新手指南' : '초보자 가이드';
  const prevLabel = language === 'en' ? 'Back' : language === 'ja' ? '前へ' : language === 'zh' ? '上一步' : '이전';
  const nextLabel = language === 'en' ? 'Next' : language === 'ja' ? '次へ' : language === 'zh' ? '下一步' : '다음';
  const startLabel = language === 'en' ? 'Start Puzzle!' : language === 'ja' ? 'パズルを始める！' : language === 'zh' ? '开始挑战！' : '퍼즐 시작하기!';
  const dontShowLabel = language === 'en' ? "Don't show again" : language === 'ja' ? '次回から表示しない' : language === 'zh' ? '不再提示' : '다음에 다시 보지 않기';
  const skipLabel = language === 'en' ? 'Skip' : language === 'ja' ? 'スキップ' : language === 'zh' ? '跳过' : '건너뛰기';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <Card className="w-full max-w-sm text-center relative border-blue-500/40 shadow-2xl overflow-x-hidden">
        {/* Top-right close button */}
        <button
          type="button"
          onClick={() => onClose(dontShowAgain)}
          aria-label={language === 'en' ? 'Close Tutorial' : language === 'ja' ? 'チュートリアルを閉じる' : language === 'zh' ? '关闭指南' : '튜토리얼 닫기'}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold text-sm"
        >
          ✕
        </button>

        <div className="text-4xl mb-3">{step.icon}</div>
        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
          {guideLabel} ({currentStep + 1} / {steps.length})
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-2">
          {step.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 min-h-[64px]">
          {step.desc}
        </p>

        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => setCurrentStep(s => s - 1)}
              className="flex-1"
            >
              {prevLabel}
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentStep(s => s + 1)}
              className="flex-1"
            >
              {nextLabel}
            </Button>
          ) : (
            <Button
              variant="accent"
              size="md"
              onClick={() => onClose(dontShowAgain)}
              className="flex-1"
            >
              {startLabel}
            </Button>
          )}
        </div>

        {/* Checkbox: 다음에 다시 보지 않기 & 건너뛰기 */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs px-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 cursor-pointer"
            />
            <span className="font-bold">{dontShowLabel}</span>
          </label>

          <button
            type="button"
            onClick={() => onClose(dontShowAgain)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline font-medium"
          >
            {skipLabel}
          </button>
        </div>
      </Card>
    </div>
  );
};
