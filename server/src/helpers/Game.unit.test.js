import Game from './Game';
import { GAME_MODES } from '../config/constants';

describe('Game class is used to represent a piece generated randomly', () => {

  it('should instanciate game with default values', () => {
    const game = new Game({});
    expect(game).toMatchObject({
      name: undefined,
      maxPlayers: 1,
      hasPassword: false,
      password: '',
      mode: GAME_MODES[0],
      hasStarted: false,
      hasEnded: false,
      players: [],
      scores: [],
    });
  });

  it('should instanciate game with given values', () => {
    const values = {
      id: 'test',
      name: 'jest',
      maxPlayers: 2,
      password: '',
      mode: GAME_MODES[0],
      hasStarted: false,
      hasEnded: false,
      players: [],
      scores: [],
    };
    const game = new Game(values);
    expect(game).toMatchObject(values);
  });

  it('should return formatted game', () => {
    const values = {
      id: 'test',
      name: 'jest',
      maxPlayers: 2,
      password: '',
      mode: GAME_MODES[0],
      hasStarted: false,
      hasEnded: false,
      players: [],
      scores: [],
    };
    const game = new Game(values);
    expect(game.toObject()).toMatchObject(values);
  });

  it('should update with given values', () => {
    const update = {
      id: 'test',
      name: 'jest',
      maxPlayers: 2,
      password: '',
      mode: GAME_MODES[0],
      hasStarted: false,
      hasEnded: false,
      players: [],
      scores: [],
    };
    const game = new Game({});
    game.update(update);
    expect(game).toMatchObject(update);
  });

  it('should update only fields with value', () => {
    const game = new Game({});
    const gameSnapshot = game;
    game.update({});
    expect(game).toEqual(gameSnapshot);
  });

  it('should not update (empty data)', () => {
    const game = new Game({});
    const gameSnapshot = game;
    game.update();
    expect(game).toEqual(gameSnapshot);
  });
});
