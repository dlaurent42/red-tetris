const { COLORS } = require('../config/constants');

const getPiece = () => (
  [{
    // Cube
    positions: [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    innerPositions: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    size: 2,
    type: 'Cube',
    // Pipe
  }, {
    positions: [
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
    ],
    innerPositions: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
    size: 4,
    type: 'Pipe',
    // Reversed L
  }, {
    positions: [
      { x: 5, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    innerPositions: [
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    size: 3,
    type: 'Reversed L',
  // L
  }, {
    positions: [
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    innerPositions: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    size: 3,
    type: 'L',
  // S
  }, {
    positions: [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
    ],
    innerPositions: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    size: 3,
    type: 'S',
  // T
  }, {
    positions: [
      { x: 5, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
    ],
    innerPositions: [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    size: 3,
    type: 'T',
  // Z
  }, {
    positions: [
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    innerPositions: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    size: 3,
    type: 'Z',
  },
  ][Math.floor(Math.random() * 7)]
);

class Piece {
  constructor() {
    this.piece = Object.assign(
      getPiece(),
      { color: COLORS[Math.floor(Math.random() * COLORS.length)] },
    );
  }
}

module.exports = Piece;
