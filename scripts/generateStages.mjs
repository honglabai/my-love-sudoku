import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import types & engine logic from TS compiled or inline
// We can implement the generator directly in this generator script
function createRng(seed) {
  let s = seed >>> 0;
  return function next() {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRowIndices(row) {
  const indices = [];
  const start = row * 9;
  for (let i = 0; i < 9; i++) indices.push(start + i);
  return indices;
}

function getColIndices(col) {
  const indices = [];
  for (let r = 0; r < 9; r++) indices.push(r * 9 + col);
  return indices;
}

function getBoxIndices(box) {
  const indices = [];
  const startRow = Math.floor(box / 3) * 3;
  const startCol = (box % 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      indices.push((startRow + r) * 9 + (startCol + c));
    }
  }
  return indices;
}

const PEERS_TABLE = Array.from({ length: 81 }, (_, i) => {
  const r = Math.floor(i / 9);
  const c = i % 9;
  const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
  const peers = new Set();
  getRowIndices(r).forEach(idx => peers.add(idx));
  getColIndices(c).forEach(idx => peers.add(idx));
  getBoxIndices(b).forEach(idx => peers.add(idx));
  peers.delete(i);
  return Array.from(peers);
});

function getCandidates(board, cellIndex) {
  if (board[cellIndex] !== 0) return [];
  const used = new Uint8Array(10);
  const peers = PEERS_TABLE[cellIndex];
  for (let i = 0; i < peers.length; i++) {
    const v = board[peers[i]];
    if (v !== 0) used[v] = 1;
  }
  const candidates = [];
  for (let num = 1; num <= 9; num++) {
    if (used[num] === 0) candidates.push(num);
  }
  return candidates;
}

function countSolutions(board, limit = 2) {
  const working = [...board];
  let solutionCount = 0;

  function backtrack() {
    if (solutionCount >= limit) return true;

    let bestCell = -1;
    let minCandidatesCount = 10;
    let bestCandidates = [];

    for (let i = 0; i < 81; i++) {
      if (working[i] === 0) {
        const cands = getCandidates(working, i);
        if (cands.length === 0) return false;
        if (cands.length < minCandidatesCount) {
          minCandidatesCount = cands.length;
          bestCell = i;
          bestCandidates = cands;
          if (minCandidatesCount === 1) break;
        }
      }
    }

    if (bestCell === -1) {
      solutionCount++;
      return solutionCount >= limit;
    }

    for (const num of bestCandidates) {
      working[bestCell] = num;
      const shouldStop = backtrack();
      working[bestCell] = 0;
      if (shouldStop) return true;
    }
    return false;
  }

  backtrack();
  return solutionCount;
}

function generateSolvedBoard(seed) {
  const rng = createRng(seed);
  const board = Array(81).fill(0);

  for (let box = 0; box < 9; box += 4) {
    const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);
    const startRow = Math.floor(box / 3) * 3;
    const startCol = (box % 3) * 3;
    let idx = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        board[(startRow + r) * 9 + (startCol + c)] = digits[idx++];
      }
    }
  }

  function fillRemaining(cellIndex) {
    if (cellIndex >= 81) return true;
    if (board[cellIndex] !== 0) return fillRemaining(cellIndex + 1);

    const candidates = shuffle(getCandidates(board, cellIndex), rng);
    for (const num of candidates) {
      board[cellIndex] = num;
      if (fillRemaining(cellIndex + 1)) return true;
      board[cellIndex] = 0;
    }
    return false;
  }

  fillRemaining(0);
  return board;
}

function carvePuzzle(solvedBoard, targetClues, seed) {
  const rng = createRng(seed);
  const puzzle = [...solvedBoard];
  const order = shuffle(Array.from({ length: 81 }, (_, i) => i), rng);

  let currentClues = 81;
  for (const idx of order) {
    if (currentClues <= targetClues) break;
    const removedVal = puzzle[idx];
    puzzle[idx] = 0;
    if (countSolutions(puzzle, 2) === 1) {
      currentClues--;
    } else {
      puzzle[idx] = removedVal;
    }
  }
  return { puzzle, solution: solvedBoard, cluesCount: currentClues };
}

console.log("Generating 50 stages...");

const worlds = [
  { id: 1, name: "첫걸음", difficulty: "입문", desc: "기본 규칙과 풀이 방법 학습", clueRange: [42, 46] },
  { id: 2, name: "논리의 길", difficulty: "초급", desc: "후보 숫자와 논리 추론", clueRange: [35, 38] },
  { id: 3, name: "도전의 탑", difficulty: "중급", desc: "복합적인 논리 기법", clueRange: [31, 34] },
  { id: 4, name: "전문가의 성", difficulty: "고급", desc: "여러 단계 추론", clueRange: [27, 30] },
  { id: 5, name: "마스터 리그", difficulty: "최고급", desc: "고난도 퍼즐 정복", clueRange: [24, 26] },
];

const stageNames = [
  // World 1
  "첫 번째 퍼즐", "행과 열의 조화", "3×3 박스 정복", "숫자의 길", "작은 실마리",
  "맑은 생각", "빈칸 채우기", "확신의 한 수", "마지막 준비", "첫걸음 졸업 시험",
  // World 2
  "논리의 첫걸음", "후보 숫자 찾기", "숨은 단서", "추론의 즐거움", "단 하나의 길",
  "침착한 분석", "흩어진 숫자들", "빛나는 통찰", "마음의 균형", "논리의 관문",
  // World 3
  "도전의 시작", "탑의 1층", "얽힌 숫자망", "신중한 판단", "깊어지는 사고",
  "흔들리지 않는 수", "교차로의 열쇠", "안개의 탑", "집중의 순간", "도전의 탑 정상",
  // World 4
  "전문가의 부름", "성의 외곽", "정밀한 추론", "숨겨진 퍼즐", "냉철한 계산",
  "미로의 중심", "직관과 논리", "굳건한 전략", "성채의 심장", "전문가의 그랜드 챔버",
  // World 5
  "마스터의 영역", "신의 수읽기", "한계 돌파", "심연의 퍼즐", "궁극의 지혜",
  "침묵의 바둑판", "초월적 사유", "황금빛 해답", "전설의 문턱", "내사랑 스도쿠의 신"
];

const stages = [];

for (let i = 1; i <= 50; i++) {
  const worldIndex = Math.floor((i - 1) / 10);
  const world = worlds[worldIndex];
  const isBoss = (i % 10 === 0);
  const name = stageNames[i - 1];

  // Target clues within world range, boss is slightly tighter
  const [minClues, maxClues] = world.clueRange;
  const stageInWorld = (i - 1) % 10;
  // Decrease clues gradually as stage index increases
  const target = Math.round(maxClues - (stageInWorld / 9) * (maxClues - minClues));

  let solved, puzzleData;
  let attempts = 0;
  let seed = 10000 + i * 777;

  while (attempts < 50) {
    solved = generateSolvedBoard(seed + attempts * 13);
    puzzleData = carvePuzzle(solved, target, seed + attempts * 19);
    const count = countSolutions(puzzleData.puzzle, 2);
    if (count === 1) {
      break;
    }
    attempts++;
  }

  // Final verification
  const count = countSolutions(puzzleData.puzzle, 2);
  if (count !== 1) {
    throw new Error(`Stage ${i} does not have a unique solution! Count: ${count}`);
  }

  stages.push({
    id: i,
    worldId: world.id,
    worldName: world.name,
    stageNumberInWorld: stageInWorld + 1,
    title: name,
    difficulty: world.difficulty,
    isBoss,
    cluesCount: puzzleData.cluesCount,
    puzzle: puzzleData.puzzle,
    solution: puzzleData.solution,
    hasTutorial: i <= 3
  });

  process.stdout.write(`Stage ${i}/50 (World ${world.id}, Clues: ${puzzleData.cluesCount}) [Unique Solution OK]\n`);
}

const outputPath = path.resolve(__dirname, '../src/features/stages/stageData.ts');

const fileContent = `// Automatically generated & 100% verified unique-solution stages for 내사랑 스도쿠
import { Board81 } from '../../domain/sudoku/types';

export interface Stage {
  id: number;
  worldId: number;
  worldName: string;
  stageNumberInWorld: number;
  title: string;
  difficulty: '입문' | '초급' | '중급' | '고급' | '최고급';
  isBoss: boolean;
  cluesCount: number;
  puzzle: Board81;
  solution: Board81;
  hasTutorial: boolean;
}

export interface WorldInfo {
  id: number;
  name: string;
  difficulty: '입문' | '초급' | '중급' | '고급' | '최고급';
  description: string;
  stageStart: number;
  stageEnd: number;
}

export const WORLDS: WorldInfo[] = [
  { id: 1, name: "첫걸음", difficulty: "입문", description: "기본 규칙과 풀이 방법 학습", stageStart: 1, stageEnd: 10 },
  { id: 2, name: "논리의 길", difficulty: "초급", description: "후보 숫자와 논리 추론", stageStart: 11, stageEnd: 20 },
  { id: 3, name: "도전의 탑", difficulty: "중급", description: "복합적인 논리 기법", stageStart: 21, stageEnd: 30 },
  { id: 4, name: "전문가의 성", difficulty: "고급", description: "여러 단계 추론", stageStart: 31, stageEnd: 40 },
  { id: 5, name: "마스터 리그", difficulty: "최고급", description: "고난도 퍼즐 정복", stageStart: 41, stageEnd: 50 },
];

export const ALL_STAGES: Stage[] = ${JSON.stringify(stages, null, 2)};

export function getStageById(id: number): Stage | undefined {
  return ALL_STAGES.find(s => s.id === id);
}

export function getStagesByWorld(worldId: number): Stage[] {
  return ALL_STAGES.filter(s => s.worldId === worldId);
}
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Successfully generated and verified all 50 stages in ${outputPath}!`);
