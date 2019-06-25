const Piece = require('./Piece');

describe('Piece class is used to represent a piece generated randomly', () => {

  let piece;
  beforeEach(() => { piece = new Piece({}); });

  it('should instanciate piece with random piece', () => {
    expect(Object.keys(piece.piece)).toEqual(['positions', 'innerPositions', 'size', 'type', 'color']);
  });

});
