'use strict';

export function getAspectRatio(x, y) {
  let ratio = x / y
  return {
    width : ratio * 100,
    height: 100
  }
}

export function getSliceBoundaries(y, total, surrounding) {
  let start = y - total
  let end   = y + total
  if (start < 0) {
    end   = end - start
    start = 0
  } else if (end > surrounding) {
    start = start - (end - surrounding)
    end   = surrounding
  }

  return {
    start: start,
    end  : end + 1
  }
}