export type Board81 = number[];

export interface CellCoord {
  row: number;
  col: number;
  box: number;
}

export function getRow(index: number): number {
  return Math.floor(index / 9);
}

export function getCol(index: number): number {
  return index % 9;
}

export function getBox(index: number): number {
  const r = Math.floor(index / 9);
  const c = index % 9;
  return Math.floor(r / 3) * 3 + Math.floor(c / 3);
}

export function getIndex(row: number, col: number): number {
  return row * 9 + col;
}

export function getRowIndices(row: number): number[] {
  const indices: number[] = [];
  const start = row * 9;
  for (let i = 0; i < 9; i++) {
    indices.push(start + i);
  }
  return indices;
}

export function getColIndices(col: number): number[] {
  const indices: number[] = [];
  for (let r = 0; r < 9; r++) {
    indices.push(r * 9 + col);
  }
  return indices;
}

export function getBoxIndices(box: number): number[] {
  const indices: number[] = [];
  const startRow = Math.floor(box / 3) * 3;
  const startCol = (box % 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      indices.push((startRow + r) * 9 + (startCol + c));
    }
  }
  return indices;
}

// Precomputed peer indices for all 81 cells (performance optimization)
const PEERS_TABLE: number[][] = Array.from({ length: 81 }, (_, i) => {
  const r = getRow(i);
  const c = getCol(i);
  const b = getBox(i);
  const peers = new Set<number>();

  getRowIndices(r).forEach(idx => peers.add(idx));
  getColIndices(c).forEach(idx => peers.add(idx));
  getBoxIndices(b).forEach(idx => peers.add(idx));
  peers.delete(i);

  return Array.from(peers);
});

export function getPeerIndices(index: number): number[] {
  return PEERS_TABLE[index];
}
