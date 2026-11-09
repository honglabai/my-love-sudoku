import { Board81, getRow, getCol, getRowIndices, getColIndices, getBoxIndices } from '../../domain/sudoku/types';
import { getCandidates } from '../../domain/sudoku/engine';

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
export function findLogicalHint(board: Board81, solution: Board81): HintResult | null {
  // 1. Check for Naked Single (a cell with only 1 candidate remaining)
  for (let i = 0; i < 81; i++) {
    if (board[i] === 0) {
      const candidates = getCandidates(board, i);
      if (candidates.length === 1) {
        const digit = candidates[0];
        const r = getRow(i);
        const c = getCol(i);
        return {
          type: 'naked-single',
          cellIndex: i,
          row: r,
          col: c,
          digit,
          title: '유일한 후보 (Naked Single)',
          explanation: `${r + 1}행 ${c + 1}열은 같은 행, 열, 3×3 박스의 다른 숫자들로 인해 오직 [${digit}]만 들어갈 수 있습니다.`
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
        return {
          type: 'hidden-single',
          cellIndex: cellIdx,
          row: r,
          col: c,
          digit: num,
          title: '숨은 유일수 (Hidden Single - 행)',
          explanation: `${r + 1}행 전체에서 숫자 [${num}]은(는) 오직 ${c + 1}열에만 들어갈 수 있습니다.`,
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
        return {
          type: 'hidden-single',
          cellIndex: cellIdx,
          row: r,
          col: c,
          digit: num,
          title: '숨은 유일수 (Hidden Single - 열)',
          explanation: `${c + 1}열 전체에서 숫자 [${num}]은(는) 오직 ${r + 1}행에만 들어갈 수 있습니다.`,
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
        return {
          type: 'hidden-single',
          cellIndex: cellIdx,
          row: r,
          col: c,
          digit: num,
          title: '숨은 유일수 (Hidden Single - 박스)',
          explanation: `이 3×3 박스 영역에서 숫자 [${num}]은(는) 오직 ${r + 1}행 ${c + 1}열에만 들어갈 수 있습니다.`,
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
    return {
      type: 'reveal',
      cellIndex: bestCell,
      row: r,
      col: c,
      digit,
      title: '정답 공개 힌트',
      explanation: `${r + 1}행 ${c + 1}열에 들어갈 올바른 숫자는 [${digit}]입니다.`
    };
  }

  return null;
}
