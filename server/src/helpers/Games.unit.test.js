const Game = require('./Game');
const Games = require('./Games');
const Player = require('./Player');
const { ROOM_ROLES } = require('../config/constants');

describe('Games class contains all logic relative to tetris game', () => {

  let games;
  let lobbies;
  let player;
  let owner;
  let spectator;

  beforeEach(() => {
    games = new Games({});
    lobbies = [new Game({}), new Game({}), new Game({}), new Game({}), new Game({})];
    player = new Player({
      id: 1,
      socketId: 'a',
      username: 'player',
      role: ROOM_ROLES.PLAYER,
    });
    owner = new Player({
      id: 2,
      socketId: 'b',
      username: 'owner',
      role: ROOM_ROLES.CREATOR,
    });
    spectator = new Player({
      id: 3,
      socketId: 'c',
      username: 'spectator',
      role: ROOM_ROLES.SPECTATOR,
    });
  });

  it('should instanciate games with empty lobbies array', () => {
    expect(games.lobbies).toEqual([]);
  });

  it('should return lobby found by id (getLobby)', () => {
    expect(games.getLobby({ id: 0 })).toEqual(undefined);
  });

  it('should return formatted lobbies (getFormatedLobbies)', () => {
    games.lobbies.push(...lobbies);
    expect(games.getFormatedLobbies({ id: lobbies[0].id })).toEqual([]);
  });

  it('should return info about a lobby (getInfos)', () => {
    expect(games.getInfos({ name: '' })).toEqual(undefined);
  });

  it('should return info about a lobby and player (getPlayerAndLobby)', () => {
    lobbies[0].players.push(player, owner, spectator);
    games.lobbies.push(...lobbies);
    expect(games.getPlayerAndLobby({ id: lobbies[0].id }, player.socketId))
      .toEqual({ lobby: lobbies[0], player });
  });

  it('should return info about a lobby and player but lobby could not be found (getPlayerAndLobby)', () => {
    expect(games.getPlayerAndLobby({ id: null })).toEqual({ lobby: undefined, player: undefined });
  });

  it('should create and return a new lobby (addLobby)', () => {
    games.addLobby({});
    expect(games.lobbies).toHaveLength(1);
  });

  it('should create and return undefined if there is duplicate in lobby id (addLobby)', () => {
    games.lobbies.push(lobbies[0]);
    const ret = games.addLobby(lobbies[0]);
    expect(ret).toEqual(undefined);
  });

  it('should create and return updated lobby with updated tilesStack for players (addLobbyTile)', () => {
    games.lobbies.push(lobbies[0]);
    games.lobbies[0].players.push(player, owner, spectator);
    games.addLobbyTile(games.lobbies[0], player.socketId);
    games.lobbies[0].players.forEach((el) => {
      if (el.role !== ROOM_ROLES.SPECTATOR) expect(el.tilesStack).toHaveLength(1);
    });
  });

  it('should return undefined if lobby is not found when adding new tile (addLobbyTile)', () => {
    expect(games.addLobbyTile(lobbies[0], undefined)).toEqual(undefined);
  });

  it('should update lobby based on data provided (setLobby)', () => {
    games.lobbies.push(lobbies[0]);
    expect(games.setLobby({ ...lobbies[0], ...lobbies[1], id: lobbies[0].id }))
      .toEqual({ ...lobbies[0], ...lobbies[1], id: lobbies[0].id });
  });

  it('should not update lobby based on data provided since lobby could not be found (setLobby)', () => {
    expect(games.setLobby({})).toEqual(undefined);
  });

  it('should set lobby status as "hasStarted" and to generate 3 tiles by player (setLobbyStart)', () => {
    games.lobbies.push(lobbies[0]);
    games.lobbies[0].players.push(player, owner, spectator);
    games.setLobbyStart(games.lobbies[0]);
    expect(games.lobbies[0].hasStarted).toEqual(true);
    games.lobbies[0].players.forEach((el) => {
      if (el.role !== ROOM_ROLES.SPECTATOR) expect(el.tilesStack).toHaveLength(3);
    });
  });

  it('should not considerer lobby with "hasStarted" status since lobby could not be found (setLobbyStart)', () => {
    expect(games.setLobbyStart({})).toEqual({ lobby: undefined, startTile: undefined });
  });

  it('should set lobby status as "hasStarted" (setLobbyEnd)', () => {
    games.lobbies.push(lobbies[0]);
    games.setLobbyEnd(games.lobbies[0]);
    expect(games.lobbies[0].hasEnded).toEqual(true);
  });

  it('should not considerer lobby with "hasEnded" status since lobby could not be found (setLobbyEnd)', () => {
    expect(games.setLobbyEnd({})).toEqual(undefined);
  });

  it('should delete lobby based on its ID (deleteLobby)', () => {
    games.lobbies.push(lobbies[0]);
    games.deleteLobby({ id: lobbies[0].id });
    expect(games.lobbies).toHaveLength(0);
  });

  it('should update information about a player (setPlayer)', () => {
    games.lobbies.push(lobbies[0]);
    games.lobbies[0].players.push(player, owner, spectator);
    games.setPlayer({
      id: lobbies[0].id,
      user: { ...owner, ...player, socketId: owner.socketId },
    }, owner.socketId);
    expect(games.lobbies[0].players[1]).toEqual(owner);
  });

  it('should update score of a player and do nothing else (setPlayerScoring)', () => {
    games.lobbies.push(...lobbies);
    games.lobbies[0].scores.push(player, owner, spectator);
    games.lobbies[0].players.push(player, owner, spectator);
    games.setPlayerScoring({ id: lobbies[0].id, score: 1 }, player.socketId);
    expect(games.lobbies[0].players[0].score).toEqual(200);
  });

  it('should update score of a player and add blocked rows to others (setPlayerScoring)', () => {
    games.lobbies.push(...lobbies);
    games.lobbies[0].players.push(player, owner, spectator);
    games.setPlayerScoring({ id: lobbies[0].id, score: 3 }, player.socketId);
    games.lobbies[0].players.forEach((el, idx) => {
      if (idx !== 1) expect(el.blockedRows).toEqual(0);
      else expect(el.blockedRows).toEqual(2);
    });
  });

  it('should not update score since lobby could not be found (setPlayerScoring)', () => {
    expect(games.setPlayerScoring({ id: undefined, score: undefined })).toEqual(undefined);
  });

  it('should add a player to lobby (addPlayer)', () => {
    games.lobbies.push(lobbies[0]);
    games.addPlayer({ ...lobbies[0], user: player }, player.socketId);
    expect(games.lobbies[0].players).toHaveLength(1);
    expect(games.lobbies[0].players[0]).toEqual(player);
  });

  it('should transfer a player from spectators to player (addPlayer)', () => {
    games.lobbies.push(lobbies[0]);
    games.addPlayer({ ...lobbies[0], user: spectator }, spectator.socketId);
    games.addPlayer({ ...lobbies[0], user: spectator }, spectator.socketId);
    expect(games.lobbies[0].players).toHaveLength(1);
    expect(games.lobbies[0].players[0]).toEqual({ ...spectator, role: ROOM_ROLES.PLAYER });
  });

  it('should not add a player to lobby since lobby could not be found (addPlayer)', () => {
    expect(games.addPlayer({})).toEqual({ lobby: undefined, player: undefined });
  });

  it('should not delete player from lobby since player is not in lobby (deletePlayer)', () => {
    games.lobbies.push(...lobbies);
    games.lobbies[0].players.push(owner, player);
    expect(games.deletePlayer(games.lobbies[0], spectator.socketId)).toEqual(null);
  });

  it('should delete a player from lobby (deletePlayerFromAnyLobby)', () => {
    games.lobbies.push(...lobbies);
    games.lobbies[0].players.push(owner, player);
    games.deletePlayerFromAnyLobby(owner.socketId);
    expect(games.lobbies[0].players).toHaveLength(1);
    expect(games.lobbies[0].players[0]).toEqual(player);
  });

  it('should delete a player from lobby and delete lobby (deletePlayerFromAnyLobby)', () => {
    games.lobbies.push(...lobbies);
    games.lobbies[0].players.push(owner);
    games.deletePlayerFromAnyLobby(owner.socketId);
    expect(games.lobbies).toHaveLength(4);
  });
});
