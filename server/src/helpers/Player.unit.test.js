const Player = require('./Player');
const { ROOM_ROLES } = require('../config/constants');

describe('Player class is used to represent a player, a room owner or a spectator', () => {

  let player;
  beforeEach(() => { player = new Player({}); });

  it('should instanciate player with default values', () => {
    expect(player).toEqual({
      id: 0,
      socketId: undefined,
      username: undefined,
      avatar: undefined,
      score: 0,
      blockedRows: 0,
      isReady: false,
      specter: {},
      role: ROOM_ROLES.SPECTATOR,
      tilesStack: [],
    });
  });

  it('should update with given values', () => {
    const update = {
      username: 'jest',
      avatar: 'is',
      score: 2,
      blockedRows: 10,
      isReady: true,
      specter: {},
      role: 'geat',
      tilesStack: [],
    };
    player.update(update);
    expect(player).toMatchObject(update);
  });

  it('should update only fields with value', () => {
    const playerSnapshot = player;
    player.update({});
    expect(player).toEqual(playerSnapshot);
  });

  it('should not update (empty data)', () => {
    const playerSnapshot = player;
    player.update();
    expect(player).toEqual(playerSnapshot);
  });

});
