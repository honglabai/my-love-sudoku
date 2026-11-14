import { Board81, getRow, getCol, getRowIndices, getColIndices, getBoxIndices } from '../../domain/sudoku/types';
import { getCandidates } from '../../domain/sudoku/engine';
import { Language } from '../../i18n/types';

export interface HintResult {
  type: 'naked-single' | 'hidden-single' | 'reveal';
  cellIndex: number;
  row: number;
  col: number;
  digit: number;
  title: string;
  explanation: string;
  highlightUnitIndices?: number[];
}

/**
 * Searches for a logical hint on the board (Naked Single, Hidden Single, or solution fallback).
 */
export function findLogicalHint(board: Board81, solution: Board81, lang: Language = 'ko'): HintResult | null {
  // 1. Check for Naked Single (a cell with only 1 candidate remaining)
  for (let i = 0; i < 81; i++) {
    if (board[i] === 0) {
      const candidates = getCandidates(board, i);
      if (candidates.length === 1) {
        const digit = candidates[0];
        const r = getRow(i);
        const c = getCol(i);

        const title =
          lang === 'en'
            ? 'Naked Single'
            : lang === 'ja'
            ? '単一候補 (Naked Single)'
            : lang === 'zh'
            ? '唯一候选数 (Naked Single)'
            : '유일한 후보 (Naked Single)';

        const explanation =
          lang === 'en'
            ? `Cell (${r + 1}, ${c + 1}) can only contain [${digit}] because all other numbers already exist in its row, column, or 3×3 box.`
            : lang === 'ja'
            ? `${r + 1}行 ${c + 1}列は、同じ行・列・3×3ブロックの制約により [${digit}] だけが入ります。`
            : lang === 'zh'
            ? `第${r + 1}行第${c + 1}列受同行、同列及九宫格限制，只能填入 [${digit}]。`
            : `${r + 1}행 ${c + 1}열은 같은 행, 열, 3×3 박스의 다른 숫자들로 인해 오직 [${digit}]만 들어갈 수 있습니다.`;

        return {
          type: 'naked-single',
          cellIndex: i,
          row: r,
          col: c,
          digit,
          title,
          explanation
        };
      }
    }
  }

  // 2. Check for Hidden Single (a number that can only fit in one cell within a unit)
  // Check Rows
  for (let r = 0; r < 9; r++) {
    const rowIndices = getRowIndices(r);
    for (let num = 1; num <= 9; num++) {
      // Skip if number already placed in row
      if (rowIndices.some(idx => board[idx] === num)) continue;

      const possibleCells = rowIndices.filter(idx => board[idx] === 0 && getCandidates(board, idx).includes(num));
      if (possibleCells.length === 1) {
        const cellIdx = possibleCells[0];
        const c = getCol(cellIdx);

        const title =
          lang === 'en'
            ? 'Hidden Single (Row)'
            : lang === 'ja'
            ? '隠れた単一候補 (Hidden Single - 行)'
            : lang === 'zh'
            ? '隐性唯一数 (Hidden Single - 行)'
            : '숨은 유일수 (Hidden Single - 행)';

        const explanation =
          lang === 'en'
            ? `In row ${r + 1}, digit [${num}] can only fit in column ${c + 1}.`
            : lang === 'ja'
            ? `${r + 1}行全体で数字 [${num}] が入れるマスは ${c + 1}列目だけです。`
            : lang === 'zh'
            ? `在第${r + 1}行中，数字 [${num}] 唯一可填入的位置是第${c + 1}列。`
            : `${r + 1}행 전체에서 숫자 [${num}]은(는) 오직 ${c + 1}열에만 들어갈 수 있습니다.`;

        return {
          type: 'hidden-single',
          cellIndex: cellIdx,
          row: r,
          col: c,
          digit: num,
          title,
          explanation,
          highlightUnitIndices: rowIndices
        };
      }
    }
  }

  // Check Columns
  for (let c = 0; c < 9; c++) {
    const colIndices = getColIndices(c);
    for (let num = 1; num <= 9; num++) {
      if (colIndices.some(idx => board[idx] === num)) continue;

      const possibleCells = colIndices.filter(idx => board[idx] === 0 && getCandidates(board, idx).includes(num));
      if (possibleCells.length === 1) {
        const cellIdx = possibleCells[0];
        const r = getRow(cellIdx);

        const title =
          lang === 'en'
            ? 'Hidden Single (Column)'
            : lang === 'ja'
            ? '隠れた単一候補 (Hidden Single - 列)'
            : lang === 'zh'
            ? '隐性唯一数 (Hidden Single - 列)'
            : '숨은 유일수 (Hidden Single - 열)';

        const explanation =
          lang === 'en'
            ? `In column ${c + 1}, digit [${num}] can only fit in row ${r + 1}.`
            : lang === 'ja'
            ? `${c + 1}列全体で数字 [${num}] が入れるマスは ${r + 1}行目だけです。`
            : lang === 'zh'
            ? `在第${c + 1}列中，数字 [${num}] 唯一可填入的位置是第${r + 1}行。`
            : `${c + 1}열 전체에서 숫자 [${num}]은(는) 오직 ${r + 1}행에만 들어갈 수 있습니다.`;

        return {
          type: 'hidden-single',
          cellIndex: cellIdx,
          row: r,
          col: c,
          digit: num,
          title,
          explanation,
          highlightUnitIndices: colIndices
        };
      }
    }
  }

  // Check 3x3 Boxes
  for (let b = 0; b < 9; b++) {
    const boxIndices = getBoxIndices(b);
    for (let num = 1; num <= 9; num++) {
      if (boxIndices.some(idx => board[idx] === num)) continue;

      const possibleCells = boxIndices.filter(idx => board[idx] === 0 && getCandidates(board, idx).includes(num));
      if (possibleCells.length === 1) {
        const cellIdx = possibleCells[0];
        const r = getRow(cellIdx);
        const c = getCol(cellIdx);

        const title =
          lang === 'en'
            ? 'Hidden Single (3×3 Box)'
            : lang === 'ja'
            ? '隠れた単一候補 (Hidden Single - ブロック)'
            : lang === 'zh'
            ? '隐性唯一数 (Hidden Single - 九宫格)'
            : '숨은 유일수 (Hidden Single - 박스)';

        const explanation =
          lang === 'en'
            ? `In this 3×3 box, digit [${num}] can only fit in row ${r + 1}, column ${c + 1}.`
            : lang === 'ja'
            ? `この3×3ブロック内で数字 [${num}] が入れるマスは ${r + 1}行 ${c + 1}列目だけです。`
            : lang === 'zh'
            ? `在此3×3九宫格内，数字 [${num}] 只能填入第${r + 1}行第${c + 1}列。`
            : `이 3×3 박스 영역에서 숫자 [${num}]은(는) 오직 ${r + 1}행 ${c + 1}열에만 들어갈 수 있습니다.`;

        return {
          type: 'hidden-single',
          cellIndex: cellIdx,
          row: r,
          col: c,
          digit: num,
          title,
          explanation,
          highlightUnitIndices: boxIndices
        };
      }
    }
  }

  // 3. Fallback: Find empty cell with fewest candidates and reveal correct answer
  let bestCell = -1;
  let minCands = 10;
  for (let i = 0; i < 81; i++) {
    if (board[i] === 0) {
      const cands = getCandidates(board, i);
      if (cands.length < minCands && cands.length > 0) {
        minCands = cands.length;
        bestCell = i;
      }
    }
  }

  if (bestCell !== -1) {
    const r = getRow(bestCell);
    const c = getCol(bestCell);
    const digit = solution[bestCell];

    const title =
      lang === 'en'
        ? 'Solution Reveal Hint'
        : lang === 'ja'
        ? '確定数字の案内'
        : lang === 'zh'
        ? '确定答案线索'
        : '정답 공개 힌트';

    const explanation =
      lang === 'en'
        ? `The correct digit for row ${r + 1}, column ${c + 1} is [${digit}].`
        : lang === 'ja'
        ? `${r + 1}行 ${c + 1}列に入る確定数字は [${digit}] です。`
        : lang === 'zh'
        ? `第${r + 1}行第${c + 1}列的确定答案为 [${digit}]。`
        : `${r + 1}행 ${c + 1}열에 들어갈 올바른 숫자는 [${digit}]입니다.`;

    return {
      type: 'reveal',
      cellIndex: bestCell,
      row: r,
      col: c,
      digit,
      title,
      explanation
    };
  }

  return null;
}
