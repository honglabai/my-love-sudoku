import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useI18n } from '../i18n';

interface SudokuGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SudokuGuideModal: React.FC<SudokuGuideModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState<'rules' | 'techniques' | 'benefits' | 'faq'>('rules');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`📖 ${t('modal.guideTitle')}`} maxWidth="max-w-lg">
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'rules'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {language === 'en' ? 'Rules' : language === 'ja' ? '基本ルール' : language === 'zh' ? '基本规则' : '기본 규칙'}
          </button>
          <button
            onClick={() => setActiveTab('techniques')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'techniques'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {language === 'en' ? 'Techniques' : language === 'ja' ? '解法公式' : language === 'zh' ? '解题技巧' : '핵심 풀이 공식'}
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'benefits'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {language === 'en' ? 'Brain Benefits' : language === 'ja' ? '脳トレ効果' : language === 'zh' ? '大脑健康' : '두뇌 건강 효과'}
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'faq'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {language === 'en' ? 'FAQ' : language === 'ja' ? 'FAQ' : language === 'zh' ? '常见问答' : '자주 묻는 질문'}
          </button>
        </div>

        {/* Tab 1: Basic Rules */}
        {activeTab === 'rules' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl">
              <h4 className="font-black text-amber-900 dark:text-amber-200 text-sm mb-1">
                스도쿠(Sudoku, 數獨)란?
              </h4>
              <p className="text-amber-800/90 dark:text-amber-300/90 text-xs">
                '숫자가 한 번만 들어간다'는 뜻으로, 수학적 계산이 전혀 필요 없이 오직 논리적인 추론만으로 빈칸을 완성하는 전 세계 최고의 지능형 두뇌 퍼즐입니다.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="inline-block px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-black text-xs mb-1">
                  규칙 1. 가로줄 (Row)
                </span>
                <p className="text-xs">
                  가로로 놓인 9칸의 한 줄 안에는 <strong>1부터 9까지의 숫자가 중복 없이 단 한 번씩만</strong> 채워져야 합니다.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-black text-xs mb-1">
                  규칙 2. 세로줄 (Column)
                </span>
                <p className="text-xs">
                  세로로 놓인 9칸의 한 줄 안에도 <strong>1부터 9까지의 숫자가 중복 없이 단 한 번씩만</strong> 채워져야 합니다.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-black text-xs mb-1">
                  규칙 3. 3×3 미니 박스 (Box)
                </span>
                <p className="text-xs">
                  굵은 선으로 구분된 9개의 3×3 정사각형 구역 안에도 각각 <strong>1부터 9까지의 숫자가 빠짐없이 한 번씩</strong> 들어가야 합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Core Techniques & Formulas */}
        {activeTab === 'techniques' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h5 className="font-black text-blue-600 dark:text-blue-400 text-xs mb-1">
                1단계. 단일 후보수 (Naked Single)
              </h5>
              <p className="text-xs">
                특정 빈칸의 가로줄, 세로줄, 3×3 박스에 이미 놓인 숫자들을 모두 제외했을 때, <strong>남는 가능한 숫자가 단 1개뿐인 경우</strong>입니다. 가장 기본적이면서 확실한 첫 단추입니다.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h5 className="font-black text-blue-600 dark:text-blue-400 text-xs mb-1">
                2단계. 숨겨진 후보수 (Hidden Single)
              </h5>
              <p className="text-xs">
                특정 빈칸 자체에는 여러 후보 숫자가 들어갈 수 있어 보이지만, 해당 가로줄이나 세로줄, 또는 3×3 박스 전체를 통틀어 <strong>어떤 특정 숫자가 들어갈 수 있는 자리가 오직 그 한 칸뿐인 경우</strong>입니다.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h5 className="font-black text-indigo-600 dark:text-indigo-400 text-xs mb-1">
                3단계. 라인-블록 교차 배제 (Pointing Pairs / Triples)
              </h5>
              <p className="text-xs">
                3×3 박스 안에서 특정 숫자의 후보가 같은 가로줄이나 세로줄에 일렬로 정렬되어 있다면, 그 줄의 다른 박스 구역에서는 해당 숫자가 절대 들어갈 수 없으므로 후보에서 즉시 제거할 수 있습니다.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h5 className="font-black text-rose-600 dark:text-rose-400 text-xs mb-1">
                4단계. X-Wing 고급 테크닉
              </h5>
              <p className="text-xs">
                서로 다른 두 가로줄에서 특정 후보 숫자가 동일한 두 세로줄에만 들어갈 수 있는 직사각형 형태를 형성할 때, 해당 두 세로줄의 나머지 모든 칸에서 그 숫자를 후보에서 확실하게 제거하는 고급 공식입니다.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Brain Health & Cognitive Benefits */}
        {activeTab === 'benefits' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 rounded-2xl">
              <h4 className="font-black text-emerald-900 dark:text-emerald-200 text-sm mb-1">
                🧠 의학 및 뇌과학계가 검증한 스도쿠의 효능
              </h4>
              <p className="text-emerald-800/90 dark:text-emerald-300/90 text-xs">
                옥스퍼드 및 하버드 연구진에 따르면, 매일 1~2회의 스도쿠 풀이는 전두엽과 해마를 활성화하여 뇌의 신경 가소성(Neuroplasticity)을 지속 유지시켜 줍니다.
              </p>
            </div>

            <ul className="space-y-2 text-xs">
              <li className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
                <strong>1. 인지 기능 유지 및 치매 예방:</strong> 전두엽의 논리 분석 회로를 자극하여 노화로 인한 기억력 감퇴를 방지하고 뇌 활력을 10년 이상 젊게 유지합니다.
              </li>
              <li className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
                <strong>2. 작업 기억력(Working Memory) 극대화:</strong> 여러 후보수를 머릿속에 기억하고 비교·배제하는 과정을 통해 일상 기억력과 순간 암기력이 상승합니다.
              </li>
              <li className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
                <strong>3. 집중력 향상 및 디지털 디톡스:</strong> 스마트폰의 도파민 자극형 숏폼 영상에서 벗어나 깊은 사유와 몰입(Flow) 상태를 경험할 수 있습니다.
              </li>
            </ul>
          </div>
        )}

        {/* Tab 4: FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-2.5 animate-fadeIn">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="font-black text-slate-900 dark:text-slate-100 text-xs mb-1">
                Q1. 게임 중에 창을 닫아도 기록이 유지되나요?
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                네! 한 칸을 입력할 때마다 브라우저 로컬 저장소에 실시간 자동 저장되므로, 브라우저를 닫거나 다시 켜도 홈 화면의 '플레이 중인 게임 이어하기'를 통해 1초 만에 복구됩니다.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="font-black text-slate-900 dark:text-slate-100 text-xs mb-1">
                Q2. 앱스토어나 플레이스토어에서 받아야 하나요?
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                앱스토어 설치 없이 우측 상단의 <strong>[📲 앱 설치]</strong> 버튼을 누르면 스마트폰 바탕화면에 즉시 설치되어 인터넷 없이도 오프라인 플레이가 가능한 PWA(웹앱)입니다.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="font-black text-slate-900 dark:text-slate-100 text-xs mb-1">
                Q3. 레벨 테스트는 몇 번이고 다시 볼 수 있나요?
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                네, 홈 화면의 '실력 진단 레벨 테스트'를 통해 언제든 본인의 스도쿠 실력을 다시 측정하고 원하는 단계부터 퍼즐을 시작하실 수 있습니다.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="font-black text-slate-900 dark:text-slate-100 text-xs mb-1">
                Q4. 게임 내 광고는 어디에 노출되나요?
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                게임 플레이 중 방해되지 않도록 퍼즐 풀이 영역 외곽(하단 배너 또는 클리어 결과 화면)에만 정돈된 형태로 표시되며, 구글 애드센스 정책을 엄격히 준수합니다.
              </p>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button variant="secondary" size="md" fullWidth onClick={onClose}>
            확인 및 닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
};
