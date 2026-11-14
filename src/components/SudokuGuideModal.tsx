import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useI18n } from '../i18n';

interface SudokuGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GuideContent {
  introTitle: string;
  introDesc: string;
  rules: { tag: string; desc: string }[];
  techniques: { title: string; desc: string; tagColor: string }[];
  benefitsTitle: string;
  benefitsDesc: string;
  benefits: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
}

const GUIDE_DATA: Record<string, GuideContent> = {
  ko: {
    introTitle: '스도쿠(Sudoku, 數獨)란?',
    introDesc: "'숫자가 한 번만 들어간다'는 뜻으로, 수학적 계산이 전혀 필요 없이 오직 논리적인 추론만으로 빈칸을 완성하는 전 세계 최고의 지능형 두뇌 퍼즐입니다.",
    rules: [
      {
        tag: '규칙 1. 가로줄 (Row)',
        desc: '가로로 놓인 9칸의 한 줄 안에는 1부터 9까지의 숫자가 중복 없이 단 한 번씩만 채워져야 합니다.'
      },
      {
        tag: '규칙 2. 세로줄 (Column)',
        desc: '세로로 놓인 9칸의 한 줄 안에도 1부터 9까지의 숫자가 중복 없이 단 한 번씩만 채워져야 합니다.'
      },
      {
        tag: '규칙 3. 3×3 미니 박스 (Box)',
        desc: '굵은 선으로 구분된 9개의 3×3 정사각형 구역 안에도 각각 1부터 9까지의 숫자가 빠짐없이 한 번씩 들어가야 합니다.'
      }
    ],
    techniques: [
      {
        title: '1단계. 단일 후보수 (Naked Single)',
        desc: '특정 빈칸의 가로줄, 세로줄, 3×3 박스에 이미 놓인 숫자들을 모두 제외했을 때, 남는 가능한 숫자가 단 1개뿐인 경우입니다. 가장 기본적이면서 확실한 첫 단추입니다.',
        tagColor: 'text-blue-600 dark:text-blue-400'
      },
      {
        title: '2단계. 숨겨진 후보수 (Hidden Single)',
        desc: '특정 빈칸 자체에는 여러 후보 숫자가 들어갈 수 있어 보이지만, 해당 가로줄이나 세로줄, 또는 3×3 박스 전체를 통틀어 어떤 특정 숫자가 들어갈 수 있는 자리가 오직 그 한 칸뿐인 경우입니다.',
        tagColor: 'text-blue-600 dark:text-blue-400'
      },
      {
        title: '3단계. 라인-블록 교차 배제 (Pointing Pairs / Triples)',
        desc: '3×3 박스 안에서 특정 숫자의 후보가 같은 가로줄이나 세로줄에 일렬로 정렬되어 있다면, 그 줄의 다른 박스 구역에서는 해당 숫자가 절대 들어갈 수 없으므로 후보에서 즉시 제거할 수 있습니다.',
        tagColor: 'text-indigo-600 dark:text-indigo-400'
      },
      {
        title: '4단계. X-Wing 고급 테크닉',
        desc: '서로 다른 두 가로줄에서 특정 후보 숫자가 동일한 두 세로줄에만 들어갈 수 있는 직사각형 형태를 형성할 때, 해당 두 세로줄의 나머지 모든 칸에서 그 숫자를 후보에서 확실하게 제거하는 고급 공식입니다.',
        tagColor: 'text-rose-600 dark:text-rose-400'
      }
    ],
    benefitsTitle: '🧠 의학 및 뇌과학계가 검증한 스도쿠의 효능',
    benefitsDesc: '옥스퍼드 및 하버드 연구진에 따르면, 매일 1~2회의 스도쿠 풀이는 전두엽과 해마를 활성화하여 뇌의 신경 가소성(Neuroplasticity)을 지속 유지시켜 줍니다.',
    benefits: [
      {
        title: '1. 인지 기능 유지 및 치매 예방:',
        desc: '전두엽의 논리 분석 회로를 자극하여 노화로 인한 기억력 감퇴를 방지하고 뇌 활력을 젊게 유지합니다.'
      },
      {
        title: '2. 작업 기억력(Working Memory) 극대화:',
        desc: '여러 후보수를 머릿속에 기억하고 비교·배제하는 과정을 통해 일상 기억력과 순간 암기력이 상승합니다.'
      },
      {
        title: '3. 집중력 향상 및 디지털 디톡스:',
        desc: '도파민 자극형 숏폼 영상에서 벗어나 깊은 사유와 몰입(Flow) 상태를 경험할 수 있습니다.'
      }
    ],
    faq: [
      {
        q: 'Q1. 게임 중에 창을 닫아도 기록이 유지되나요?',
        a: "네! 한 칸을 입력할 때마다 브라우저 로컬 저장소에 실시간 자동 저장되므로, 브라우저를 닫거나 다시 켜도 홈 화면의 '이어하기'를 통해 1초 만에 복구됩니다."
      },
      {
        q: 'Q2. 앱스토어나 플레이스토어에서 받아야 하나요?',
        a: "앱스토어 방문 없이 우측 상단의 [📲 앱 설치] 버튼을 누르면 스마트폰 바탕화면에 즉시 설치되어 인터넷 없이도 오프라인 플레이가 가능한 PWA(웹앱)입니다."
      },
      {
        q: 'Q3. 레벨 테스트는 몇 번이고 다시 볼 수 있나요?',
        a: "네, 홈 화면의 '실력 진단 레벨 테스트'를 통해 언제든 본인의 스도쿠 실력을 다시 측정하고 원하는 단계부터 퍼즐을 시작하실 수 있습니다."
      },
      {
        q: 'Q4. 게임 내 광고는 어디에 노출되나요?',
        a: '퍼즐 풀이에 방해되지 않도록 보드 외곽 및 결과 화면에만 정돈된 형태로 표시되며 구글 애드센스 정책을 엄격히 준수합니다.'
      }
    ]
  },
  en: {
    introTitle: 'What is Sudoku (數獨)?',
    introDesc: "Meaning 'single number', Sudoku is the world's most beloved logic puzzle. It requires zero arithmetic or math—only pure logical deduction to fill every empty cell.",
    rules: [
      {
        tag: 'Rule 1. Row',
        desc: 'Each horizontal row of 9 cells must contain digits 1 through 9 with no duplicates.'
      },
      {
        tag: 'Rule 2. Column',
        desc: 'Each vertical column of 9 cells must contain digits 1 through 9 with no duplicates.'
      },
      {
        tag: 'Rule 3. 3×3 Mini Box',
        desc: 'Each of the 9 outlined 3×3 square blocks must contain digits 1 through 9 without omission.'
      }
    ],
    techniques: [
      {
        title: 'Step 1. Naked Single',
        desc: 'When all other digits are already present in a cell’s row, column, and 3×3 box, exactly one candidate remains. This is the most fundamental starting move.',
        tagColor: 'text-blue-600 dark:text-blue-400'
      },
      {
        title: 'Step 2. Hidden Single',
        desc: 'Even if a cell seems to have several possibilities, if a specific digit can only fit in that single cell throughout an entire row, column, or box, it must be placed there.',
        tagColor: 'text-blue-600 dark:text-blue-400'
      },
      {
        title: 'Step 3. Pointing Pairs / Triples',
        desc: 'When candidate digits in a 3×3 box align along a single row or column, that digit can be safely eliminated from the rest of that line outside the box.',
        tagColor: 'text-indigo-600 dark:text-indigo-400'
      },
      {
        title: 'Step 4. X-Wing Advanced Strategy',
        desc: 'When a candidate occurs only twice in two separate rows and forms a rectangle across two columns, that candidate can be removed from all other cells in those columns.',
        tagColor: 'text-rose-600 dark:text-rose-400'
      }
    ],
    benefitsTitle: '🧠 Clinically Proven Brain & Cognitive Health',
    benefitsDesc: 'According to Oxford and Harvard neuroscientists, solving 1-2 Sudoku puzzles daily stimulates the prefrontal cortex and hippocampus, promoting long-term neuroplasticity.',
    benefits: [
      {
        title: '1. Cognitive Longevity & Dementia Prevention:',
        desc: 'Stimulates frontal lobe analytical pathways, counteracting age-related memory decline and rejuvenating brain vitality.'
      },
      {
        title: '2. Working Memory Expansion:',
        desc: 'Holding, comparing, and eliminating candidate numbers in your head boosts short-term recall and mental clarity.'
      },
      {
        title: '3. Focus Enhancement & Digital Detox:',
        desc: 'Step away from dopamine-heavy short-form video feeds and experience a state of deep, calming mental flow.'
      }
    ],
    faq: [
      {
        q: 'Q1. Will my progress be saved if I close the browser?',
        a: "Yes! Every single digit placed is automatically saved in your browser's LocalStorage. You can resume instantly via 'Resume Game' on the home screen."
      },
      {
        q: 'Q2. Do I need to download from an app store?',
        a: "No! Tap the [📲 Install] button at the top right to install it directly to your home screen as a standalone PWA that works offline without an internet connection."
      },
      {
        q: 'Q3. Can I retake the Diagnostic Level Test?',
        a: "Yes! You can retake the 3-question diagnostic test anytime from the home screen to calibrate your skill and skip to your preferred world."
      },
      {
        q: 'Q4. Where are advertisements shown?',
        a: 'Ads appear strictly outside the puzzle board and on victory result screens to ensure an uninterrupted, distraction-free puzzle experience.'
      }
    ]
  },
  ja: {
    introTitle: '数独（Sudoku、すうどく）とは？',
    introDesc: '「数字は単数に限る」に由来し、計算は一切不要で、純粋な論理的推論だけでマス目を埋めていく世界最高峰の知能パズルです。',
    rules: [
      {
        tag: 'ルール 1. 行（横の列）',
        desc: '横に並ぶ9マスの中には、1から9までの数字が重複なく1つずつ入ります。'
      },
      {
        tag: 'ルール 2. 列（縦の列）',
        desc: '縦に並ぶ9マスの中にも、1から9までの数字が重複なく1つずつ入ります。'
      },
      {
        tag: 'ルール 3. 3×3のブロック',
        desc: '太線で囲まれた9つの3×3正方形ブロック内にも、それぞれ1から9までの数字が漏れなく1回ずつ入ります。'
      }
    ],
    techniques: [
      {
        title: '第1手. 単一候補（Naked Single）',
        desc: 'そのマスが属する行・列・3×3ブロック内の既存数字を除外した結果、入る可能性のある数字が残り1つだけになる基本の手です。',
        tagColor: 'text-blue-600 dark:text-blue-400'
      },
      {
        title: '第2手. 隠れた単一候補（Hidden Single）',
        desc: 'マス単体には複数候補があっても、行・列・ブロック全体を見渡したとき、特定の数字が入れるマスがそこしかない場合に確定する手です。',
        tagColor: 'text-blue-600 dark:text-blue-400'
      },
      {
        title: '第3手. 指向対（Pointing Pairs / Triples）',
        desc: '3×3ブロック内で特定数字の候補が一列（行または列）に並んでいる場合、その延長線上にある他のブロックの候補からその数字を除外できます。',
        tagColor: 'text-indigo-600 dark:text-indigo-400'
      },
      {
        title: '第4手. X-Wing 上級定石',
        desc: '2つの異なる行で特定候補が同じ2つの列にのみ入り四角形を形成するとき、その2列の他のすべてのマスから候補を除去する強力な技法です。',
        tagColor: 'text-rose-600 dark:text-rose-400'
      }
    ],
    benefitsTitle: '🧠 脳科学と医学が証明した数独の健康効果',
    benefitsDesc: 'オックスフォード大学などの研究によると、毎日の数独は前頭葉と海馬を活性化し、脳の神経可塑性を健やかに保ちます。',
    benefits: [
      {
        title: '1. 認知機能の維持と予防：',
        desc: '前頭葉の論理回路を刺激し、加齢による記憶力低下を抑え、脳年齢を若々しく保ちます。'
      },
      {
        title: '2. ワーキングメモリの最大化：',
        desc: '複数の候補数字を頭の中で保持・比較・排除する過程で、日々の短期記憶力や判断力が高まります。'
      },
      {
        title: '3. 集中力の向上とデジタルデトックス：',
        desc: 'ショート動画の過剰な刺激から離れ、深い思考と静寂な没頭（フロー状態）を体験できます。'
      }
    ],
    faq: [
      {
        q: 'Q1. 途中で画面を閉じても記録は残りますか？',
        a: 'はい！1マス入力するごとにブラウザのローカルストレージへ即座に自動保存されます。ホームの「再開する」から一瞬で復帰できます。'
      },
      {
        q: 'Q2. ストアからアプリをダウンロードする必要がありますか？',
        a: 'いいえ！右上の[📲 インストール]を押すだけでホーム画面にアプリアイコンが追加され、オフラインでも軽快にプレイできるPWA仕様です。'
      },
      {
        q: 'Q3. レベル診断テストは何度でも受けられますか？',
        a: 'はい、ホーム画面の「レベル診断テスト」からいつでも再挑戦し、実力に合ったワールドへスキップできます。'
      },
      {
        q: 'Q4. 広告はどこに表示されますか？',
        a: 'パズルの邪魔にならないよう盤面外枠およびクリア結果画面にのみ整然と配置され、Google AdSenseポリシーを遵守しています。'
      }
    ]
  },
  zh: {
    introTitle: '什么是数独（Sudoku、數獨）？',
    introDesc: '意为“数字唯独出现一次”。数独完全不需要数学计算，仅凭纯粹的逻辑推理即可填补每一个空格，是享誉全球的最佳益智大脑谜题。',
    rules: [
      {
        tag: '规则 1. 横行（Row）',
        desc: '每行横向9个空格内，必须填入数字1至9，且不得重复。'
      },
      {
        tag: '规则 2. 竖列（Column）',
        desc: '每列纵向9个空格内，必须填入数字1至9，且不得重复。'
      },
      {
        tag: '规则 3. 3×3 九宫格（Box）',
        desc: '由粗线划分的9个3×3正方形宫格内，亦必须分别包含数字1至9且各出现一次。'
      }
    ],
    techniques: [
      {
        title: '第1阶. 显性唯余数（Naked Single）',
        desc: '排除某空格所在行、列及3×3九宫格中已出现的所有数字后，候选数仅剩唯一1个的情况。这是最基础且必胜的关键第一步。',
        tagColor: 'text-blue-600 dark:text-blue-400'
      },
      {
        title: '第2阶. 隐性唯余数（Hidden Single）',
        desc: '某个空格自身可能存在多个候选数，但纵观整个行、列或九宫格，某个数字唯一能填入的位置仅此一格。',
        tagColor: 'text-blue-600 dark:text-blue-400'
      },
      {
        title: '第3阶. 区块对齐排除（Pointing Pairs / Triples）',
        desc: '在3×3九宫格内，若某候选数仅排列在同一行或同一列，则可安全排除该行或该列在九宫格外其他空格中的该候选数。',
        tagColor: 'text-indigo-600 dark:text-indigo-400'
      },
      {
        title: '第4阶. X-Wing 矩阵高级技巧',
        desc: '当某候选数在两个不同横行中均只出现在相同的两列，形成矩形结构时，可彻底消除这两列中其他所有空格的该候选数。',
        tagColor: 'text-rose-600 dark:text-rose-400'
      }
    ],
    benefitsTitle: '🧠 经脑科学与医学验证的健康益处',
    benefitsDesc: '牛津大学及哈佛大学神经科学研究表明，每日坚持解1~2道数独题目，可显著激活前额叶皮层与海马体，保持神经可塑性。',
    benefits: [
      {
        title: '1. 维持认知机能与延缓衰退：',
        desc: '持续刺激大脑逻辑分析神经网络，有助于预防记忆力衰退，让大脑思维保持年轻敏锐。'
      },
      {
        title: '2. 提升工作记忆力（Working Memory）：',
        desc: '在脑海中暂存、比对并剔除候选数字的推理过程，能极大锻炼日常短期记忆与专注力。'
      },
      {
        title: '3. 专注心流与数字排毒：',
        desc: '远离充斥多巴胺刺激的短视频，体验深度沉静的思考与心流境界。'
      }
    ],
    faq: [
      {
        q: 'Q1. 游戏过程中关闭网页，记录会保存吗？',
        a: '是的！每填入一个数字都会即时自动保存至浏览器本地存储，重新打开网页点击“继续挑战”即可一秒复原。'
      },
      {
        q: 'Q2. 是否必须在应用商店下载？',
        a: '无需下载！直接点击右上角【📲 安装】按钮，即可将快捷应用图标添加至桌面，断网时亦可离线畅玩（PWA规范）。'
      },
      {
        q: 'Q3. 水平诊断测试可以重复参加吗？',
        a: '可以！随时可在首页点击“实力诊断测试”重新测定水平，并跳至最适合您的关卡世界。'
      },
      {
        q: 'Q4. 游戏中的广告展示在何处？',
        a: '广告仅出现在棋盘外围及通关结算页面，绝不打扰解题体验，并严格遵守谷歌AdSense发布政策。'
      }
    ]
  }
};

export const SudokuGuideModal: React.FC<SudokuGuideModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState<'rules' | 'techniques' | 'benefits' | 'faq'>('rules');

  const content = GUIDE_DATA[language] || GUIDE_DATA.ko;

  const tabLabels = {
    rules: language === 'en' ? 'Rules' : language === 'ja' ? '基本ルール' : language === 'zh' ? '基本规则' : '기본 규칙',
    techniques: language === 'en' ? 'Techniques' : language === 'ja' ? '解法公式' : language === 'zh' ? '解题技巧' : '핵심 풀이 공식',
    benefits: language === 'en' ? 'Brain Benefits' : language === 'ja' ? '脳トレ効果' : language === 'zh' ? '大脑健康' : '두뇌 건강 효과',
    faq: language === 'en' ? 'FAQ' : language === 'ja' ? 'FAQ' : language === 'zh' ? '常见问答' : '자주 묻는 질문'
  };

  const closeButtonText = language === 'en' ? 'Confirm & Close' : language === 'ja' ? '確認して閉じる' : language === 'zh' ? '确认并关闭' : '확인 및 닫기';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`📖 ${t('modal.guideTitle')}`} maxWidth="max-w-lg">
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1 text-xs font-bold shrink-0">
          {(['rules', 'techniques', 'benefits', 'faq'] as const).map(tabKey => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center truncate ${
                activeTab === tabKey
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tabLabels[tabKey]}
            </button>
          ))}
        </div>

        {/* Tab 1: Basic Rules */}
        {activeTab === 'rules' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl">
              <h4 className="font-black text-amber-900 dark:text-amber-200 text-sm mb-1">
                {content.introTitle}
              </h4>
              <p className="text-amber-800/90 dark:text-amber-300/90 text-xs leading-relaxed">
                {content.introDesc}
              </p>
            </div>

            <div className="space-y-2">
              {content.rules.map((r, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-black text-xs mb-1">
                    {r.tag}
                  </span>
                  <p className="text-xs leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Core Techniques & Formulas */}
        {activeTab === 'techniques' && (
          <div className="space-y-3 animate-fadeIn">
            {content.techniques.map((tech, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h5 className={`font-black ${tech.tagColor} text-xs mb-1`}>
                  {tech.title}
                </h5>
                <p className="text-xs leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Brain Health & Cognitive Benefits */}
        {activeTab === 'benefits' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 rounded-2xl">
              <h4 className="font-black text-emerald-900 dark:text-emerald-200 text-sm mb-1">
                {content.benefitsTitle}
              </h4>
              <p className="text-emerald-800/90 dark:text-emerald-300/90 text-xs leading-relaxed">
                {content.benefitsDesc}
              </p>
            </div>

            <ul className="space-y-2 text-xs">
              {content.benefits.map((b, idx) => (
                <li key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
                  <strong>{b.title}</strong> {b.desc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 4: FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-2.5 animate-fadeIn">
            {content.faq.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="font-black text-slate-900 dark:text-slate-100 text-xs mb-1">
                  {item.q}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2">
          <Button variant="secondary" size="md" fullWidth onClick={onClose}>
            {closeButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
