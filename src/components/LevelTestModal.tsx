import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useI18n, getLocalizedDiagnosticTier } from '../i18n';

interface LevelTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlacementStage: (stageId: number) => void;
}

interface Question {
  id: number;
  tier: string;
  badgeColor: string;
  title: string;
  question: string;
  diagram?: React.ReactNode;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    tier: '초급 (기본 규칙)',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    title: '행의 빈칸 채우기',
    question: '아래 가로 한 줄(9칸)에서 빈칸 [ ? ]에 들어갈 유일한 숫자는 무엇일까요?',
    options: [
      { text: '6', isCorrect: true },
      { text: '3', isCorrect: false },
      { text: '4', isCorrect: false },
      { text: '7', isCorrect: false }
    ],
    explanation: '한 행에는 1부터 9까지 숫자가 겹치지 않고 모두 들어가야 합니다. [5, 3, 2, 7, 8, 4, 1, 9] 중 없는 숫자는 6입니다.'
  },
  {
    id: 2,
    tier: '중급 (배제 기법)',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    title: '3×3 박스 배제 (Hidden Single)',
    question: '특정 3×3 박스에 5가 들어갈 자리를 찾을 때, 주변 가로줄/세로줄에 이미 5가 있어 한 칸을 제외한 모든 칸이 불가능합니다. 이 자리에 5를 채우는 스도쿠 논리 기법은 무엇일까요?',
    options: [
      { text: '숨겨진 유일수 (Hidden Single)', isCorrect: true },
      { text: 'X-Wing (엑스윙 고급 기법)', isCorrect: false },
      { text: '단순 추측 (Guessing)', isCorrect: false },
      { text: '색칠 기법 (Coloring)', isCorrect: false }
    ],
    explanation: '한 영역 내에서 특정 숫자가 들어갈 수 있는 자리가 단 하나뿐일 때 찾는 핵심 기법을 Hidden Single(숨겨진 유일수)이라고 합니다.'
  },
  {
    id: 3,
    tier: '고급 (후보수 추론)',
    badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    title: '네이키드 페어 (Naked Pair)',
    question: '한 열의 두 빈칸에 들어갈 수 있는 후보 숫자가 오직 [ 3, 8 ] 두 개로만 좁혀졌습니다. 이때 같은 열의 다른 모든 빈칸에 적용해야 하는 올바른 조치는?',
    options: [
      { text: '다른 빈칸들의 후보수 목록에서 3과 8을 모두 제거한다', isCorrect: true },
      { text: '다른 빈칸들에 3과 8을 강제로 채워 넣는다', isCorrect: false },
      { text: '아무런 조치도 취할 수 없으므로 무시한다', isCorrect: false },
      { text: '그 열의 모든 칸을 즉시 지운다', isCorrect: false }
    ],
    explanation: '두 칸에 [3, 8] 쌍이 확정되면, 3과 8은 반드시 그 두 칸 중 하나에 들어가므로 같은 열의 다른 칸에서는 3과 8을 배제해야 합니다.'
  }
];

export const LevelTestModal: React.FC<LevelTestModalProps> = ({
  isOpen,
  onClose,
  onSelectPlacementStage
}) => {
  const { language } = useI18n();
  const [step, setStep] = useState<'intro' | 'testing' | 'result' | 'manual'>('intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const handleStartTest = () => {
    setCurrentQIndex(0);
    setSelectedAnswers([]);
    setScore(0);
    setStep('testing');
  };

  const handleAnswer = (optionIndex: number) => {
    const q = QUESTIONS[currentQIndex];
    const isCorrect = q.options[optionIndex].isCorrect;
    const nextAnswers = [...selectedAnswers, optionIndex];
    setSelectedAnswers(nextAnswers);

    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQIndex + 1 < QUESTIONS.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setStep('result');
    }
  };

  // Determine recommendation based on score and language
  const { recommendedStage, tierTitle, tierDesc, worldName } = getLocalizedDiagnosticTier(score, language);

  const handleApplyPlacement = (stageId: number) => {
    onSelectPlacementStage(stageId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        step === 'testing'
          ? `${language === 'en' ? 'Skill Test' : language === 'ja' ? '実力テスト' : language === 'zh' ? '实力测试' : '실력 테스트'} (${currentQIndex + 1}/3)`
          : `🎯 ${language === 'en' ? 'Sudoku Diagnostic Level Test' : language === 'ja' ? '数独実力診断テスト' : language === 'zh' ? '数独水平诊断测试' : '스도쿠 실력 진단 레벨 테스트'}`
      }
    >
      <div className="space-y-4 text-slate-800 dark:text-slate-200">
        {/* VIEW 1: INTRO */}
        {step === 'intro' && (
          <div className="space-y-4 text-center py-1">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20">
              🎯
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                나에게 딱 맞는 단계부터 바로 시작하세요!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                처음 1단계부터 지루하게 풀 필요 없이, 간단한 3문항 실력 테스트로 내 수준에 맞는 월드로 즉시 점프할 수 있습니다.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <span>⏱️ 소요 시간:</span>
                <span className="text-blue-600 dark:text-blue-400">약 1분 (단 3문항)</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <span>🎁 특별 혜택:</span>
                <span>건너뛴 이전 단계의 별점(⭐)과 등급이 자동 지급됩니다.</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Button variant="primary" size="lg" fullWidth onClick={handleStartTest} className="font-black shadow-md">
                🚀 1분 실력 테스트 시작하기
              </Button>
              <Button variant="ghost" size="sm" fullWidth onClick={() => setStep('manual')} className="text-xs">
                원하는 시작 단계 직접 선택하기 →
              </Button>
            </div>
          </div>
        )}

        {/* VIEW 2: TESTING (QUESTIONS) */}
        {step === 'testing' && (
          <div className="space-y-3.5">
            {/* Question Header */}
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${QUESTIONS[currentQIndex].badgeColor}`}>
                {QUESTIONS[currentQIndex].tier}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {currentQIndex + 1} / {QUESTIONS.length}
              </span>
            </div>

            <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              {QUESTIONS[currentQIndex].title}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700">
              {QUESTIONS[currentQIndex].question}
            </p>

            {/* Diagram for Q1 */}
            {currentQIndex === 0 && (
              <div className="flex items-center justify-center p-2 bg-stone-100 dark:bg-slate-900 rounded-xl border border-stone-300 dark:border-stone-700">
                <div className="grid grid-cols-9 gap-1 text-center font-serif font-black text-sm sm:text-base">
                  {['5', '3', '?', '2', '7', '8', '4', '1', '9'].map((val, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded border ${
                        val === '?'
                          ? 'bg-amber-300 text-amber-950 border-amber-500 animate-pulse'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Answer Options */}
            <div className="space-y-2 pt-1">
              {QUESTIONS[currentQIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 active:scale-[0.98] transition-all flex items-center justify-between"
                >
                  <span>{opt.text}</span>
                  <span className="text-slate-400">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: RESULT */}
        {step === 'result' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
              {score >= 2 ? '🏆' : '🌸'}
            </div>

            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                실력 진단 테스트 완료 · 정답 {score} / 3
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {tierTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {tierDesc}
              </p>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-slate-800/80 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 text-left space-y-1.5">
              <div className="text-xs font-black text-blue-700 dark:text-blue-300">
                추천 시작 위치: {worldName}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                {recommendedStage > 1
                  ? `이전 ${recommendedStage - 1}개 스테이지가 3성으로 자동 완료 처리되어 별점이 지급됩니다.`
                  : '스도쿠의 평온한 기초부터 즐겁게 시작해 보세요.'}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => handleApplyPlacement(recommendedStage)}
                className="font-black shadow-md"
              >
                🎮 {worldName} 바로 시작하기
              </Button>

              <Button variant="ghost" size="sm" fullWidth onClick={() => setStep('manual')} className="text-xs">
                다른 단계로 직접 선택하기 →
              </Button>
            </div>
          </div>
        )}

        {/* VIEW 4: MANUAL STAGE SELECTION */}
        {step === 'manual' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              시작하고 싶은 월드와 난이도를 선택하시면 해당 단계부터 즉시 플레이하실 수 있습니다:
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {[
                { stageId: 1, name: '월드 1. 평온의 정원 (입문)', badge: '입문 (1단계)', color: 'text-rose-600' },
                { stageId: 11, name: '월드 2. 푸른 대나무숲 (쉬움)', badge: '쉬움 (11단계)', color: 'text-emerald-600' },
                { stageId: 21, name: '월드 3. 황혼의 석탑 (보통)', badge: '보통 (21단계)', color: 'text-amber-600' },
                { stageId: 31, name: '월드 4. 설산과 백매화 (어려움)', badge: '어려움 (31단계)', color: 'text-sky-600' },
                { stageId: 41, name: '월드 5. 붉은 달과 천년송 (마스터)', badge: '마스터 (41단계)', color: 'text-purple-600' }
              ].map(w => (
                <button
                  key={w.stageId}
                  onClick={() => handleApplyPlacement(w.stageId)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 active:scale-[0.98] transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-slate-100">{w.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {w.stageId === 1 ? '처음부터 시작' : `이전 ${w.stageId - 1}개 스테이지 완료 처리`}
                    </div>
                  </div>
                  <span className={`text-xs font-black ${w.color}`}>선택 →</span>
                </button>
              ))}
            </div>

            <div className="pt-2 text-center">
              <Button variant="ghost" size="sm" onClick={() => setStep('intro')} className="text-xs">
                ← 돌아가기
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
