'use strict';

import Config from './../config';

export function getLineOfSightCoordinates(direction, x, y) {
  switch (direction) {
    case 'up':
      y--
      break
    case 'right':
      x++
      break
    case 'down':
      y++
      break
    case 'left':
      x--
      break
    case 'leftup':
      y--
      x--
      break
    case 'rightup':
      y--
      x++
      break
    case 'leftdown':
      y++
      x--
      break
    case 'rightdown':
      y++
      x++
      break
    default:
      break
  }

  return {
    x: x,
    y: y
  }
}

