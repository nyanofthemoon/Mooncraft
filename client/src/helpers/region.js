'use strict';

export function getAspectRatio(x, y) {
  let ratio = x / y
  return {
    width : ratio * 100,
    height: 100
  }
}

export function getSliceBoundaries(coordinate, boundary, length) {
  length--;
  let start = coordinate - boundary
  let end   = coordinate + boundary
  if (start < 0) {
    end   = Math.min(length, end - start)
    start = 0
  } else if (end > length) {
    start = Math.max(0, start - (end - length))
    end   = length
  }

  return {
    start: start,
    end  : end + 1
  }
}