'use strict';

export function getAspectRatio(x, y) {
  let ratio = x / y
  return {
    width : ratio * 100,
    height: 100
  }
}

export function getRowsSliceBoundaries(y, rows, row) {
  let start = y - rows
  let end   = y + rows
  if (start < 0) {
    end   = end - start
    start = 0
  } else if (end > row) {
    start = start - (end - row)
    end   = row
  }

  return {
    start: start,
    end  : end + 1
  }
}

export function getCellsSliceBoundaries(x, cells, cell) {
  let start = x - cells
  let end   = x + cells
  if (start < 0) {
    end   = end - start
    start = 0
  } else if (end > cell) {
    start = start - (end - cell)
    end   = cell
  }

  return {
    start: start,
    end  : end + 1
  }
}
