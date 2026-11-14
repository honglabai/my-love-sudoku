import { Language } from './types';

export const USER_TITLES_I18N: Record<string, Record<Language, string>> = {
  '스도쿠 입문자': {
    ko: '스도쿠 입문자',
    en: 'Sudoku Beginner',
    ja: '数独入門者',
    zh: '数独入门者'
  },
  '스도쿠 탐험가': {
    ko: '스도쿠 탐험가',
    en: 'Sudoku Explorer',
    ja: '数独探検家',
    zh: '数独探索者'
  },
  '스도쿠 수집가': {
    ko: '스도쿠 수집가',
    en: 'Sudoku Collector',
    ja: '数独コレクター',
    zh: '数独收藏家'
  },
  '스도쿠 마스터': {
    ko: '스도쿠 마스터',
    en: 'Sudoku Master',
    ja: '数独マスター',
    zh: '数独大师'
  },
  '완벽한 추론가': {
    ko: '완벽한 추론가',
    en: 'Flawless Reasoner',
    ja: '完璧な推論家',
    zh: '完美推理家'
  },
  '첫 월드 정복자': {
    ko: '첫 월드 정복자',
    en: 'World 1 Champion',
    ja: '第1世界制覇者',
    zh: '首界征服者'
  },
  '독립적인 해결사': {
    ko: '독립적인 해결사',
    en: 'Independent Solver',
    ja: '自立した解答者',
    zh: '独立解题者'
  },
  '논리의 탐구자': {
    ko: '논리의 탐구자',
    en: 'Seeker of Logic',
    ja: '論理の探求者',
    zh: '逻辑探求者'
  },
  '탑의 정복자': {
    ko: '탑의 정복자',
    en: 'Tower Conqueror',
    ja: '試練の塔の覇者',
    zh: '挑战之塔征服者'
  },
  '전문가의 위엄': {
    ko: '전문가의 위엄',
    en: 'Expert Dignity',
    ja: '達人の威厳',
    zh: '专家的威严'
  },
  '별빛 수집가': {
    ko: '별빛 수집가',
    en: 'Starlight Collector',
    ja: '星屑の収集家',
    zh: '星光收集者'
  },
  '은하수 마스터': {
    ko: '은하수 마스터',
    en: 'Milky Way Master',
    ja: '天の川マスター',
    zh: '银河大师'
  },
  '신속한 통찰가': {
    ko: '신속한 통찰가',
    en: 'Swift Insight',
    ja: '疾風の洞察者',
    zh: '敏捷洞察者'
  }
};

export function getLocalizedTitle(title: string, lang: Language): string {
  if (USER_TITLES_I18N[title] && USER_TITLES_I18N[title][lang]) {
    return USER_TITLES_I18N[title][lang];
  }
  return title;
}

export const DIFFICULTIES_I18N: Record<string, Record<Language, string>> = {
  '입문': { ko: '입문', en: 'Beginner', ja: '入門', zh: '入门' },
  '초급': { ko: '초급', en: 'Easy', ja: '初級', zh: '初级' },
  '중급': { ko: '중급', en: 'Medium', ja: '中級', zh: '中级' },
  '고급': { ko: '고급', en: 'Hard', ja: '上級', zh: '高级' },
  '최고급': { ko: '최고급', en: 'Master', ja: '最高級', zh: '大师' }
};

export function getLocalizedDifficulty(difficulty: string, lang: Language): string {
  if (DIFFICULTIES_I18N[difficulty] && DIFFICULTIES_I18N[difficulty][lang]) {
    return DIFFICULTIES_I18N[difficulty][lang];
  }
  return difficulty;
}

export const WORLDS_I18N: Record<number, Record<Language, { name: string; description: string }>> = {
  1: {
    ko: { name: '첫걸음', description: '기본 규칙과 풀이 방법 학습' },
    en: { name: 'First Steps', description: 'Learn basic rules and core techniques' },
    ja: { name: '最初の一歩', description: '基本ルールと解き方の習得' },
    zh: { name: '初涉棋局', description: '学习基础规则与解题方法' }
  },
  2: {
    ko: { name: '논리의 길', description: '후보 숫자와 논리 추론' },
    en: { name: 'Path of Logic', description: 'Candidate notes and logical deduction' },
    ja: { name: '論理の道', description: '候補数字と論理推論の探求' },
    zh: { name: '逻辑之道', description: '候选数字与逻辑推理' }
  },
  3: {
    ko: { name: '도전의 탑', description: '복합적인 논리 기법' },
    en: { name: 'Tower of Challenge', description: 'Complex logic patterns and multi-step deduction' },
    ja: { name: '試練の塔', description: '複合的な論理技法の挑戦' },
    zh: { name: '挑战之塔', description: '复合逻辑技巧与实战' }
  },
  4: {
    ko: { name: '전문가의 성', description: '여러 단계 추론' },
    en: { name: 'Castle of Experts', description: 'Multi-stage inference and deep deduction' },
    ja: { name: '達人の城', description: '多段階の論理推論と洞察' },
    zh: { name: '专家之城', description: '多步推理与深度剖析' }
  },
  5: {
    ko: { name: '마스터 리그', description: '고난도 퍼즐 정복' },
    en: { name: 'Master League', description: 'Ultimate mastery over grand puzzles' },
    ja: { name: 'マスターリーグ', description: '最高難度パズルの完全制覇' },
    zh: { name: '大师联盟', description: '攻克超高难度终极谜题' }
  }
};

export function getLocalizedWorld(worldId: number, lang: Language): { name: string; description: string } {
  if (WORLDS_I18N[worldId] && WORLDS_I18N[worldId][lang]) {
    return WORLDS_I18N[worldId][lang];
  }
  return { name: `World ${worldId}`, description: '' };
}

export const STAGES_I18N: Record<number, Record<Language, string>> = {
  1: { ko: '첫 번째 퍼즐', en: 'The First Puzzle', ja: '最初のパズル', zh: '第一道谜题' },
  2: { ko: '행과 열의 조화', en: 'Harmony of Rows & Columns', ja: '行と列の調和', zh: '行列的和鸣' },
  3: { ko: '3×3 박스 정복', en: '3×3 Box Conquest', ja: '3×3ブロックの制覇', zh: '攻克3×3九宫格' },
  4: { ko: '숫자의 길', en: 'Path of Numbers', ja: '数字の道標', zh: '数字之路' },
  5: { ko: '작은 실마리', en: 'A Subtle Clue', ja: '小さな手がかり', zh: '微小的线索' },
  6: { ko: '맑은 생각', en: 'Clear Thought', ja: '澄んだ思考', zh: '澄明思绪' },
  7: { ko: '빈칸 채우기', en: 'Filling the Blanks', ja: '空欄の調和', zh: '填补空白' },
  8: { ko: '확신의 한 수', en: 'A Confident Move', ja: '確信の一手', zh: '确信的一步' },
  9: { ko: '마지막 준비', en: 'Final Preparations', ja: '最後の準備', zh: '最后的准备' },
  10: { ko: '첫걸음 졸업 시험', en: 'First Steps Graduation', ja: '最初の一歩・修了試練', zh: '初试啼声·毕业考核' },

  11: { ko: '논리의 첫걸음', en: 'First Step of Logic', ja: '論理の第一歩', zh: '逻辑的第一步' },
  12: { ko: '후보 숫자 찾기', en: 'Finding Candidates', ja: '候補数字の発見', zh: '寻觅候选数' },
  13: { ko: '숨은 단서', en: 'Hidden Clues', ja: '隠された手がかり', zh: '隐藏的线索' },
  14: { ko: '추론의 즐거움', en: 'Joy of Deduction', ja: '推論の喜び', zh: '推理之乐' },
  15: { ko: '단 하나의 길', en: 'The Only Path', ja: '唯一の道', zh: '独一之道' },
  16: { ko: '침착한 분석', en: 'Calm Analysis', ja: '冷静な分析', zh: '从容分析' },
  17: { ko: '흩어진 숫자들', en: 'Scattered Numbers', ja: '散らばる数字たち', zh: '散落的数字' },
  18: { ko: '빛나는 통찰', en: 'Radiant Insight', ja: '輝く洞察', zh: '闪烁的洞见' },
  19: { ko: '마음의 균형', en: 'Inner Balance', ja: '心の均衡', zh: '心之均衡' },
  20: { ko: '논리의 관문', en: 'Gateway of Logic', ja: '論理の関門', zh: '逻辑之门' },

  21: { ko: '도전의 시작', en: 'Beginning of Challenge', ja: '挑戦の始まり', zh: '挑战的序幕' },
  22: { ko: '탑의 1층', en: 'Tower First Floor', ja: '試練の塔・第一層', zh: '挑战之塔·第一层' },
  23: { ko: '얽힌 숫자망', en: 'Entangled Web', ja: '絡み合う数字の網', zh: '交织的数网' },
  24: { ko: '신중한 판단', en: 'Prudent Judgement', ja: '慎重な判断', zh: '审慎决断' },
  25: { ko: '깊어지는 사고', en: 'Deepening Thought', ja: '深まりゆく思索', zh: '深邃的思考' },
  26: { ko: '흔들리지 않는 수', en: 'An Unwavering Move', ja: '揺るぎなき一手', zh: '笃定不移之着' },
  27: { ko: '교차로의 열쇠', en: 'Key to Crossroads', ja: '交差点の鍵', zh: '十字路口的钥匙' },
  28: { ko: '안개의 탑', en: 'Tower of Mist', ja: '霧深き塔', zh: '迷雾之塔' },
  29: { ko: '집중의 순간', en: 'Moment of Focus', ja: '集中の瞬間', zh: '凝神专注' },
  30: { ko: '도전의 탑 정상', en: 'Summit of the Tower', ja: '試練の塔・頂上', zh: '挑战之塔·峰顶' },

  31: { ko: '전문가의 부름', en: 'Call of the Expert', ja: '達人の召喚', zh: '专家的召唤' },
  32: { ko: '성의 외곽', en: 'Castle Outskirts', ja: '城の外郭', zh: '城堡外缘' },
  33: { ko: '정밀한 추론', en: 'Precision Deduction', ja: '精密なる推論', zh: '精准推导' },
  34: { ko: '숨겨진 퍼즐', en: 'Hidden Enigma', ja: '隠蔽された謎', zh: '隐匿之谜' },
  35: { ko: '냉철한 계산', en: 'Cold Calculation', ja: '明鏡止水の計算', zh: '冷静推算' },
  36: { ko: '미로의 중심', en: 'Heart of the Labyrinth', ja: '迷宮の中心', zh: '迷宫核心' },
  37: { ko: '직관과 논리', en: 'Intuition & Logic', ja: '直感と論理', zh: '直觉与逻辑' },
  38: { ko: '굳건한 전략', en: 'Steadfast Strategy', ja: '堅固なる戦略', zh: '坚如磐石之策' },
  39: { ko: '성채의 심장', en: 'Heart of Citadel', ja: '城塞の心臓', zh: '城塞之心' },
  40: { ko: '전문가의 그랜드 챔버', en: 'Grand Chamber of Experts', ja: '達人の大広間', zh: '专家大殿' },

  41: { ko: '마스터의 영역', en: 'Domain of the Master', ja: 'マスターの領域', zh: '大师领域' },
  42: { ko: '신의 수읽기', en: 'Divine Foresight', ja: '神の一手読み', zh: '神之推步' },
  43: { ko: '한계 돌파', en: 'Breakthrough', ja: '限界突破', zh: '突破极限' },
  44: { ko: '심연의 퍼즐', en: 'Abyssal Enigma', ja: '深淵の謎', zh: '深渊之谜' },
  45: { ko: '궁극의 지혜', en: 'Ultimate Wisdom', ja: '究極の叡智', zh: '终极智慧' },
  46: { ko: '침묵의 바둑판', en: 'Silent Grid', ja: '静寂の碁盤', zh: '沉寂棋枰' },
  47: { ko: '초월적 사유', en: 'Transcendent Thought', ja: '超越的思索', zh: '超然玄思' },
  48: { ko: '황금빛 해답', en: 'Golden Solution', ja: '黄金の解', zh: '鎏金正解' },
  49: { ko: '전설의 문턱', en: 'Threshold of Legend', ja: '伝説の敷居', zh: '传奇门槛' },
  50: { ko: '내사랑 스도쿠의 신', en: 'God of My Love Sudoku', ja: '愛しの数独の神', zh: '我爱数独之神' }
};

export function getLocalizedStageTitle(stageId: number, lang: Language): string {
  if (STAGES_I18N[stageId] && STAGES_I18N[stageId][lang]) {
    return STAGES_I18N[stageId][lang];
  }
  return `Stage ${stageId}`;
}

export const ACHIEVEMENTS_I18N: Record<string, Record<Language, { name: string; description: string; rewardTitle: string }>> = {
  first_win: {
    ko: { name: '첫 승리', description: '어떤 스테이지든 첫 번째로 클리어하세요.', rewardTitle: '스도쿠 입문자' },
    en: { name: 'First Victory', description: 'Clear any stage for the first time.', rewardTitle: 'Sudoku Beginner' },
    ja: { name: '初勝利', description: 'いずれかのステージを初めてクリアする。', rewardTitle: '数独入門者' },
    zh: { name: '初战告捷', description: '首次通关任意关卡。', rewardTitle: '数独入门者' }
  },
  perfect_reasoning: {
    ko: { name: '완벽한 추론가', description: '실수와 힌트 없이 퍼즐을 풀어 3성을 달성하세요.', rewardTitle: '완벽한 추론가' },
    en: { name: 'Flawless Reasoner', description: 'Solve a puzzle with 0 mistakes and 0 hints to earn 3 stars.', rewardTitle: 'Flawless Reasoner' },
    ja: { name: '完璧な推論家', description: 'ノーミス＆ノーヒントで3つ星を達成する。', rewardTitle: '完璧な推論家' },
    zh: { name: '完美推理家', description: '零失误且不使用提示获得3星。', rewardTitle: '完美推理家' }
  },
  world1_clear: {
    ko: { name: '첫 월드 정복자', description: '월드 1 (첫걸음) 10개 스테이지를 모두 클리어하세요.', rewardTitle: '첫 월드 정복자' },
    en: { name: 'World 1 Champion', description: 'Clear all 10 stages of World 1.', rewardTitle: 'World 1 Champion' },
    ja: { name: '第1世界制覇者', description: 'ワールド1（最初の一歩）の全10ステージをクリアする。', rewardTitle: '第1世界制覇者' },
    zh: { name: '首界征服者', description: '通关第1世界全部10个关卡。', rewardTitle: '首界征服者' }
  },
  independent_solver: {
    ko: { name: '독립적인 해결사', description: '힌트를 전혀 사용하지 않고 10개 이상의 스테이지를 완료하세요.', rewardTitle: '독립적인 해결사' },
    en: { name: 'Independent Solver', description: 'Complete 10 or more stages without using hints.', rewardTitle: 'Independent Solver' },
    ja: { name: '自立した解答者', description: 'ヒントを一切使わずに10ステージ以上クリアする。', rewardTitle: '自立した解答者' },
    zh: { name: '独立解题者', description: '完全不使用提示完成10个以上关卡。', rewardTitle: '独立解题者' }
  },
  world2_clear: {
    ko: { name: '논리의 탐구자', description: '월드 2 (논리의 길) 20개 스테이지를 모두 클리어하세요.', rewardTitle: '논리의 탐구자' },
    en: { name: 'Seeker of Logic', description: 'Clear all stages through World 2 (Stage 20).', rewardTitle: 'Seeker of Logic' },
    ja: { name: '論理の探求者', description: 'ワールド2（論理の道）までの全20ステージをクリアする。', rewardTitle: '論理の探求者' },
    zh: { name: '逻辑探求者', description: '通关至第2世界全部20个关卡。', rewardTitle: '逻辑探求者' }
  },
  world3_clear: {
    ko: { name: '탑의 정복자', description: '월드 3 (도전의 탑) 30개 스테이지를 모두 클리어하세요.', rewardTitle: '탑의 정복자' },
    en: { name: 'Tower Conqueror', description: 'Clear all stages through World 3 (Stage 30).', rewardTitle: 'Tower Conqueror' },
    ja: { name: '試練の塔の覇者', description: 'ワールド3（試練の塔）までの全30ステージをクリアする。', rewardTitle: '試練の塔の覇者' },
    zh: { name: '挑战之塔征服者', description: '通关至第3世界全部30个关卡。', rewardTitle: '挑战之塔征服者' }
  },
  world4_clear: {
    ko: { name: '전문가의 위엄', description: '월드 4 (전문가의 성) 40개 스테이지를 모두 클리어하세요.', rewardTitle: '전문가의 위엄' },
    en: { name: 'Expert Dignity', description: 'Clear all stages through World 4 (Stage 40).', rewardTitle: 'Expert Dignity' },
    ja: { name: '達人の威厳', description: 'ワールド4（達人の城）までの全40ステージをクリアする。', rewardTitle: '達人の威厳' },
    zh: { name: '专家的威严', description: '通关至第4世界全部40个关卡。', rewardTitle: '专家的威严' }
  },
  sudoku_master: {
    ko: { name: '스도쿠 마스터', description: '50개 모든 스테이지를 클리어하고 스도쿠의 신화가 되세요.', rewardTitle: '스도쿠 마스터' },
    en: { name: 'Sudoku Master', description: 'Clear all 50 stages and become a Sudoku legend.', rewardTitle: 'Sudoku Master' },
    ja: { name: '数独マスター', description: '全50ステージを制覇し、数独の伝説となる。', rewardTitle: '数独マスター' },
    zh: { name: '数独大师', description: '通关全部50关，成为数独传奇。', rewardTitle: '数独大师' }
  },
  star_collector_30: {
    ko: { name: '별빛 수집가', description: '누적 별 30개 이상을 수집하세요.', rewardTitle: '별빛 수집가' },
    en: { name: 'Starlight Collector', description: 'Collect 30 or more cumulative stars.', rewardTitle: 'Starlight Collector' },
    ja: { name: '星屑の収集家', description: '累計30個以上の星を集める。', rewardTitle: '星屑の収集家' },
    zh: { name: '星光收集者', description: '累计收集30颗以上星星。', rewardTitle: '星光收集者' }
  },
  galaxy_master_100: {
    ko: { name: '찬란한 은하수', description: '누적 별 100개 이상을 수집하세요.', rewardTitle: '은하수 마스터' },
    en: { name: 'Milky Way Master', description: 'Collect 100 or more cumulative stars.', rewardTitle: 'Milky Way Master' },
    ja: { name: '天の川マスター', description: '累計100個以上の星を集める。', rewardTitle: '天の川マスター' },
    zh: { name: '银河大师', description: '累计收集100颗以上星星。', rewardTitle: '银河大师' }
  },
  speed_demon: {
    ko: { name: '빛의 속도', description: '3분(180초) 이내에 스테이지를 완료하세요.', rewardTitle: '신속한 통찰가' },
    en: { name: 'Speed of Light', description: 'Complete a stage within 3 minutes (180 seconds).', rewardTitle: 'Swift Insight' },
    ja: { name: '光速の解', description: '3分（180秒）以内にステージをクリアする。', rewardTitle: '疾風の洞察者' },
    zh: { name: '极速破局', description: '在3分钟（180秒）内通关任意关卡。', rewardTitle: '敏捷洞察者' }
  }
};

export function getLocalizedAchievement(
  achId: string,
  lang: Language
): { name: string; description: string; rewardTitle: string } | null {
  if (ACHIEVEMENTS_I18N[achId] && ACHIEVEMENTS_I18N[achId][lang]) {
    return ACHIEVEMENTS_I18N[achId][lang];
  }
  return null;
}

export function getLocalizedDiagnosticTier(score: number, lang: Language): {
  recommendedStage: number;
  tierTitle: string;
  tierDesc: string;
  worldName: string;
} {
  if (score === 3) {
    return {
      recommendedStage: 31,
      tierTitle: {
        ko: '스도쿠 마스터 (고급)',
        en: 'Sudoku Master (Hard)',
        ja: '数独マスター (上級)',
        zh: '数独大师 (高级)'
      }[lang],
      tierDesc: {
        ko: '고난도 추론과 후보수 기법을 완벽히 이해하고 계십니다! 4월드부터 바로 시작하세요.',
        en: 'You have mastered complex deduction and candidate methods! Jump right into World 4.',
        ja: '高難度の論理推論と候補技法を完全に理解しています！ワールド4から開始しましょう。',
        zh: '您已精通高难度推论与候选数技巧！请直接从第4世界开始挑战。'
      }[lang],
      worldName: {
        ko: '월드 4 (전문가의 성 · 31단계)',
        en: 'World 4 (Castle of Experts · Stage 31)',
        ja: 'ワールド4 (達人の城 · 31段階)',
        zh: '第4世界 (专家之城 · 第31关)'
      }[lang]
    };
  }

  if (score === 2) {
    return {
      recommendedStage: 21,
      tierTitle: {
        ko: '스도쿠 수집가 (중급)',
        en: 'Sudoku Collector (Medium)',
        ja: '数独コレクター (中級)',
        zh: '数独收藏家 (中级)'
      }[lang],
      tierDesc: {
        ko: '스도쿠의 주요 논리 기법을 잘 활용하고 계십니다! 3월드부터 바로 시작하세요.',
        en: 'You effectively apply key Sudoku strategies! Start directly from World 3.',
        ja: '数独の主要な解法テクニックを熟知しています！ワールド3から挑戦しましょう。',
        zh: '您能熟练运用主要数独技巧！请从第3世界展开攻势。'
      }[lang],
      worldName: {
        ko: '월드 3 (도전의 탑 · 21단계)',
        en: 'World 3 (Tower of Challenge · Stage 21)',
        ja: 'ワールド3 (試練の塔 · 21段階)',
        zh: '第3世界 (挑战之塔 · 第21关)'
      }[lang]
    };
  }

  if (score === 1) {
    return {
      recommendedStage: 11,
      tierTitle: {
        ko: '스도쿠 탐험가 (초급)',
        en: 'Sudoku Explorer (Easy)',
        ja: '数独探検家 (初級)',
        zh: '数独探索者 (初级)'
      }[lang],
      tierDesc: {
        ko: '기본기를 갖추셨습니다! 지루한 입문 단계를 건너뛰고 2월드부터 시작하세요.',
        en: 'You have solid fundamentals! Skip basic levels and start from World 2.',
        ja: '基礎がしっかりしています！入門段階をスキップしてワールド2から始めましょう。',
        zh: '您已具备扎实基础！可跳过初级关卡，直接从第2世界启程。'
      }[lang],
      worldName: {
        ko: '월드 2 (논리의 길 · 11단계)',
        en: 'World 2 (Path of Logic · Stage 11)',
        ja: 'ワールド2 (論理の道 · 11段階)',
        zh: '第2世界 (逻辑之道 · 第11关)'
      }[lang]
    };
  }

  return {
    recommendedStage: 1,
    tierTitle: {
      ko: '스도쿠 입문자',
      en: 'Sudoku Beginner',
      ja: '数独入門者',
      zh: '数独入门者'
    }[lang],
    tierDesc: {
      ko: '스도쿠의 기초 규칙부터 한 걸음씩 차근차근 시작해보세요.',
      en: 'Start step-by-step from the foundational rules of Sudoku.',
      ja: '数独の基本ルールから一歩ずつ着実に始めましょう。',
      zh: '从数独的基础规则开始，循序渐进踏上征途。'
    }[lang],
    worldName: {
      ko: '월드 1 (첫걸음 · 1단계)',
      en: 'World 1 (First Steps · Stage 1)',
      ja: 'ワールド1 (最初の一歩 · 1段階)',
      zh: '第1世界 (初涉棋局 · 第1关)'
    }[lang]
  };
}
