import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

interface TutorialOverlayProps {
  onClose: () => void;
}

const STEPS = [
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
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <Card className="w-full max-w-sm text-center relative border-blue-500/40 shadow-2xl">
        <div className="text-4xl mb-3">{step.icon}</div>
        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
          초보자 가이드 ({currentStep + 1} / {STEPS.length})
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
              이전
            </Button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentStep(s => s + 1)}
              className="flex-1"
            >
              다음
            </Button>
          ) : (
            <Button
              variant="accent"
              size="md"
              onClick={onClose}
              className="flex-1"
            >
              퍼즐 시작하기!
            </Button>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
        >
          튜토리얼 건너뛰기
        </button>
      </Card>
    </div>
  );
};
