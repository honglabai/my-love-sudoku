import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useI18n, getLocalizedDiagnosticTier, getLocalizedWorld } from '../i18n';

interface LevelTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlacementStage: (stageId: number) => void;
}

interface LocalizedQuestion {
  tier: string;
  badgeColor: string;
  title: string;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

const QUESTIONS_DATA: Record<string, LocalizedQuestion[]> = {
  ko: [
    {
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
  ],
  en: [
    {
      tier: 'Beginner (Basic Rules)',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      title: 'Fill in the Blank in a Row',
      question: 'In the 9-cell row below, which single digit must go into the blank [ ? ]?',
      options: [
        { text: '6', isCorrect: true },
        { text: '3', isCorrect: false },
        { text: '4', isCorrect: false },
        { text: '7', isCorrect: false }
      ],
      explanation: 'A row must contain digits 1 through 9 with no repetition. In [5, 3, 2, 7, 8, 4, 1, 9], the only missing digit is 6.'
    },
    {
      tier: 'Intermediate (Elimination)',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      title: '3×3 Box Elimination (Hidden Single)',
      question: 'When placing digit 5 in a 3×3 box, conflicting rows and columns eliminate all but one cell for 5. What logic technique is this?',
      options: [
        { text: 'Hidden Single', isCorrect: true },
        { text: 'X-Wing Advanced Strategy', isCorrect: false },
        { text: 'Random Guessing', isCorrect: false },
        { text: 'Coloring Technique', isCorrect: false }
      ],
      explanation: 'When a digit can only fit in one specific cell within a unit, this technique is called Hidden Single.'
    },
    {
      tier: 'Advanced (Candidate Logic)',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
      title: 'Naked Pair Strategy',
      question: 'In a single column, two cells have candidates narrowed down exclusively to [ 3, 8 ]. What is the correct deductive action for other cells in that column?',
      options: [
        { text: 'Eliminate digits 3 and 8 from candidate lists of all other cells in the column', isCorrect: true },
        { text: 'Forcefully write 3 and 8 into other cells', isCorrect: false },
        { text: 'Ignore it because no immediate placement can be made', isCorrect: false },
        { text: 'Erase the entire column', isCorrect: false }
      ],
      explanation: 'Because [3, 8] must occupy those two cells, neither 3 nor 8 can appear anywhere else in that column.'
    }
  ],
  ja: [
    {
      tier: '初級 (基本ルール)',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      title: '行の空きマス補充',
      question: '下の横一列（9マス）において、空欄 [ ? ] に入る唯一の数字は何でしょうか？',
      options: [
        { text: '6', isCorrect: true },
        { text: '3', isCorrect: false },
        { text: '4', isCorrect: false },
        { text: '7', isCorrect: false }
      ],
      explanation: '1つの行には1から9までの数字が重複なく入ります。[5, 3, 2, 7, 8, 4, 1, 9] の中で欠けている数字は 6 です。'
    },
    {
      tier: '中級 (除外手法)',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      title: '3×3ブロックの消去法 (Hidden Single)',
      question: 'ある3×3ブロック内で数字5が入る場所を探す際、周囲の行・列の制約で1マス以外の候補が消去されました。この確定技法の名称は？',
      options: [
        { text: '隠れた候補 (Hidden Single)', isCorrect: true },
        { text: 'X-Wing 上級定石', isCorrect: false },
        { text: 'あてずっぽう (Guessing)', isCorrect: false },
        { text: 'カラーリング法', isCorrect: false }
      ],
      explanation: 'ユニット内で特定の数字が入れるマスが残り1箇所しかない確定法を Hidden Single（隠れた候補）と呼びます。'
    },
    {
      tier: '上級 (候補数推論)',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
      title: 'ネイキッドペア (Naked Pair)',
      question: 'ある列の2つのマスに入る候補が [ 3, 8 ] の2つだけに絞られました。この列の他の空きマスに対して行うべき正しい論理的操作は？',
      options: [
        { text: 'その列の他のすべての空きマスの候補から 3 と 8 を除外する', isCorrect: true },
        { text: '他の空きマスに 3 と 8 を無理やり埋める', isCorrect: false },
        { text: '確定しないため何もしない', isCorrect: false },
        { text: 'その列の数字をすべてリセットする', isCorrect: false }
      ],
      explanation: '2マスに [3, 8] が確定するため、同じ列の他のマスには 3 と 8 は絶対に入りません。'
    }
  ],
  zh: [
    {
      tier: '初级 (基本规则)',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      title: '填补单行空格',
      question: '在下方由9个格子组成的横行中，空格 [ ? ] 处必须填入的唯一数字是什么？',
      options: [
        { text: '6', isCorrect: true },
        { text: '3', isCorrect: false },
        { text: '4', isCorrect: false },
        { text: '7', isCorrect: false }
      ],
      explanation: '每一行必须完整填入数字1至9且不重复。[5, 3, 2, 7, 8, 4, 1, 9] 中唯一缺失的数字正是 6。'
    },
    {
      tier: '中级 (排除技法)',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      title: '九宫格排除定位 (Hidden Single)',
      question: '在寻找某3×3九宫格内填入数字5的位置时，周围行与列已有5，导致仅剩唯一一格可填入5。这种数独推理技法称为？',
      options: [
        { text: '隐性唯余数 (Hidden Single)', isCorrect: true },
        { text: 'X-Wing 矩形定石', isCorrect: false },
        { text: '盲目猜测 (Guessing)', isCorrect: false },
        { text: '着色法 (Coloring)', isCorrect: false }
      ],
      explanation: '当区域内某个特定数字唯一能容纳的位置仅此一格时，该核心技法被称为隐性唯余数（Hidden Single）。'
    },
    {
      tier: '高级 (候选数推演)',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
      title: '数对删减法 (Naked Pair)',
      question: '在同一列的两个空格中，候选数被精确锁定为 [ 3, 8 ]。此时对该列的其他所有空格应采取何种正确的推论操作？',
      options: [
        { text: '从该列其他所有空格的候选数列表中彻底剔除 3 和 8', isCorrect: true },
        { text: '强制将 3 和 8 填入其他空格', isCorrect: false },
        { text: '因无法立刻填数而忽略不理', isCorrect: false },
        { text: '清空整列已填数字', isCorrect: false }
      ],
      explanation: '因为 [3, 8] 必将占满这两个空格，故同列的其他任何格子均不可能再包含 3 或 8。'
    }
  ]
};

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

  const questions = QUESTIONS_DATA[language] || QUESTIONS_DATA.ko;

  const handleStartTest = () => {
    setCurrentQIndex(0);
    setSelectedAnswers([]);
    setScore(0);
    setStep('testing');
  };

  const handleAnswer = (optionIndex: number) => {
    const q = questions[currentQIndex];
    const isCorrect = q.options[optionIndex].isCorrect;
    const nextAnswers = [...selectedAnswers, optionIndex];
    setSelectedAnswers(nextAnswers);

    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQIndex + 1 < questions.length) {
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

  const modalTitle =
    step === 'testing'
      ? `${language === 'en' ? 'Skill Test' : language === 'ja' ? '実力テスト' : language === 'zh' ? '实力测试' : '실력 테스트'} (${currentQIndex + 1}/3)`
      : `🎯 ${language === 'en' ? 'Sudoku Diagnostic Level Test' : language === 'ja' ? '数独実力診断テスト' : language === 'zh' ? '数独水平诊断测试' : '스도쿠 실력 진단 레벨 테스트'}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <div className="space-y-4 text-slate-800 dark:text-slate-200">
        {/* VIEW 1: INTRO */}
        {step === 'intro' && (
          <div className="space-y-4 text-center py-1">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20">
              🎯
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                {language === 'en'
                  ? 'Start right at the perfect stage for you!'
                  : language === 'ja'
                  ? 'あなたに最適なステージから今すぐスタート！'
                  : language === 'zh'
                  ? '从最适合您的关卡立即启程！'
                  : '나에게 딱 맞는 단계부터 바로 시작하세요!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {language === 'en'
                  ? 'Skip basic beginner puzzles and jump straight to your matching world with a quick 3-question skill test.'
                  : language === 'ja'
                  ? '最初の1段階から解き直す必要なく、3問の簡単なテストで実力に合ったワールドへ直行できます。'
                  : language === 'zh'
                  ? '无需从头繁琐解题，通过简短的3道测验即可直接跳转至契合您实力的世界。'
                  : '처음 1단계부터 지루하게 풀 필요 없이, 간단한 3문항 실력 테스트로 내 수준에 맞는 월드로 즉시 점프할 수 있습니다.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <span>⏱️ {language === 'en' ? 'Estimated Time:' : language === 'ja' ? '所要時間:' : language === 'zh' ? '测验耗时:' : '소요 시간:'}</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {language === 'en' ? '~1 min (Only 3 questions)' : language === 'ja' ? '約1分 (3問のみ)' : language === 'zh' ? '约1分钟 (仅3题)' : '약 1분 (단 3문항)'}
                </span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <span>🎁 {language === 'en' ? 'Perks:' : language === 'ja' ? '特典:' : language === 'zh' ? '特权奖励:' : '특별 혜택:'}</span>
                <span>
                  {language === 'en'
                    ? 'Skipped stages will be automatically cleared with 3 stars (⭐).'
                    : language === 'ja'
                    ? 'スキップした過去ステージのスター(⭐)と称号が自動付与されます。'
                    : language === 'zh'
                    ? '跳过的先前关卡将自动获得满星(⭐)通关奖励与称号。'
                    : '건너뛴 이전 단계의 별점(⭐)과 등급이 자동 지급됩니다.'}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Button variant="primary" size="lg" fullWidth onClick={handleStartTest} className="font-black shadow-md">
                🚀 {language === 'en' ? 'Start 1-Min Skill Test' : language === 'ja' ? '1分実力テストを開始' : language === 'zh' ? '开启1分钟实力测验' : '1분 실력 테스트 시작하기'}
              </Button>
              <Button variant="ghost" size="sm" fullWidth onClick={() => setStep('manual')} className="text-xs">
                {language === 'en' ? 'Select starting stage manually →' : language === 'ja' ? '開始ステージを直接選択 →' : language === 'zh' ? '手动自选起始关卡 →' : '원하는 시작 단계 직접 선택하기 →'}
              </Button>
            </div>
          </div>
        )}

        {/* VIEW 2: TESTING (QUESTIONS) */}
        {step === 'testing' && (
          <div className="space-y-3.5">
            {/* Question Header */}
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${questions[currentQIndex].badgeColor}`}>
                {questions[currentQIndex].tier}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {currentQIndex + 1} / {questions.length}
              </span>
            </div>

            <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              {questions[currentQIndex].title}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700">
              {questions[currentQIndex].question}
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
              {questions[currentQIndex].options.map((opt, idx) => (
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
                {language === 'en'
                  ? `Diagnostic Complete · Correct ${score} / 3`
                  : language === 'ja'
                  ? `実力診断テスト完了 · 正解数 ${score} / 3`
                  : language === 'zh'
                  ? `诊断测验完成 · 正确题数 ${score} / 3`
                  : `실력 진단 테스트 완료 · 정답 ${score} / 3`}
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
                {language === 'en' ? 'Recommended Start: ' : language === 'ja' ? '推奨スタート: ' : language === 'zh' ? '建议起始位置: ' : '추천 시작 위치: '}{worldName}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                {recommendedStage > 1
                  ? language === 'en'
                    ? `Previous ${recommendedStage - 1} stages will be automatically cleared with 3 stars.`
                    : language === 'ja'
                    ? `以前の${recommendedStage - 1}個のステージが3つ星で自動完了処理されます。`
                    : language === 'zh'
                    ? `前${recommendedStage - 1}道关卡将自动以3星满星结算。`
                    : `이전 ${recommendedStage - 1}개 스테이지가 3성으로 자동 완료 처리되어 별점이 지급됩니다.`
                  : language === 'en'
                  ? 'Start comfortably from the peaceful foundations of Sudoku.'
                  : language === 'ja'
                  ? '数独の基礎からゆったりとお楽しみください。'
                  : language === 'zh'
                  ? '从数独的基础开始循序渐进体验乐趣。'
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
                🎮 {worldName} {language === 'en' ? 'Play Now' : language === 'ja' ? '今すぐプレイ' : language === 'zh' ? '立即开局' : '바로 시작하기'}
              </Button>

              <Button variant="ghost" size="sm" fullWidth onClick={() => setStep('manual')} className="text-xs">
                {language === 'en' ? 'Select a different stage manually →' : language === 'ja' ? '他のステージを手動で選択 →' : language === 'zh' ? '手动选择其他关卡 →' : '다른 단계로 직접 선택하기 →'}
              </Button>
            </div>
          </div>
        )}

        {/* VIEW 4: MANUAL STAGE SELECTION */}
        {step === 'manual' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {language === 'en'
                ? 'Select your starting world and difficulty to jump in immediately:'
                : language === 'ja'
                ? '開始したいワールドと難易度を選択して即座にプレイできます:'
                : language === 'zh'
                ? '选择您想要开始的世界与难度，即可即时体验:'
                : '시작하고 싶은 월드와 난이도를 선택하시면 해당 단계부터 즉시 플레이하실 수 있습니다:'}
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {[
                { worldId: 1, stageId: 1, color: 'text-rose-600' },
                { worldId: 2, stageId: 11, color: 'text-emerald-600' },
                { worldId: 3, stageId: 21, color: 'text-amber-600' },
                { worldId: 4, stageId: 31, color: 'text-sky-600' },
                { worldId: 5, stageId: 41, color: 'text-purple-600' }
              ].map(w => {
                const locWorld = getLocalizedWorld(w.worldId, language);
                const titleStr = `${w.worldId}${language === 'en' ? ' World. ' : language === 'ja' ? '界. ' : language === 'zh' ? '卷. ' : '월드. '}${locWorld.name}`;
                return (
                  <button
                    key={w.stageId}
                    onClick={() => handleApplyPlacement(w.stageId)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 active:scale-[0.98] transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-slate-100">{titleStr}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {w.stageId === 1
                          ? (language === 'en' ? 'Start from the beginning' : language === 'ja' ? '最初から開始' : language === 'zh' ? '从头开始' : '처음부터 시작')
                          : (language === 'en' ? `Previous ${w.stageId - 1} stages auto-cleared` : language === 'ja' ? `以前の${w.stageId - 1}ステージを完了処理` : language === 'zh' ? `自动完成前${w.stageId - 1}关` : `이전 ${w.stageId - 1}개 스테이지 완료 처리`)}
                      </div>
                    </div>
                    <span className={`text-xs font-black ${w.color}`}>
                      {language === 'en' ? 'Select →' : language === 'ja' ? '選択 →' : language === 'zh' ? '选择 →' : '선택 →'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <Button variant="ghost" size="sm" onClick={() => setStep('intro')} className="text-xs">
                ← {language === 'en' ? 'Back' : language === 'ja' ? '戻る' : language === 'zh' ? '返回' : '돌아가기'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
