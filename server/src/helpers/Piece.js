const { PIECES, COLORS } = require('../config/constants');

class Piece {
  constructor() {
    this.piece = Object.assign(
      PIECES[Math.floor(Math.random() * PIECES.length)],
      { color: COLORS[Math.floor(Math.random() * COLORS.length)] },
    );
  }
}

module.exports = Piece;
