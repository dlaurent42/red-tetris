const {
  get,
  find,
  findIndex,
  countBy,
} = require('lodash');
const { ROOM_ROLES } = require('../config/constants');
const Player = require('./Player');
const Game = require('./Game');
const Piece = require('./Piece');

class Games {

  constructor() {
    this.lobbies = [];
  }

  // Method used to find a lobby based on its id
  getLobby({ id }) {
    return find(this.lobbies, { id });
  }

  // Method used to fetch all lobbies as formatted object
  getFormatedLobbies() {
    return this.lobbies.map(lobby => lobby.toObject()).filter(lobby => (
      (!lobby.hasEnded
        && get(countBy(lobby.players, { role: ROOM_ROLES.SPECTATOR }), 'false', 0))
    ));
  }

  // Method used to verify wheter a lobby exists and to return it
  getInfos(data) {
    return this.getLobby(data)
      ? find(this.lobbies, { name: data.name })
      : undefined;
  }

  // Method used to find a user in a lobby based on its socket id
  getPlayerAndLobby({ id }, socketId) {
    const lobby = this.getLobby({ id });
    return { lobby, player: (!lobby) ? undefined : find(lobby.players, { socketId }) };
  }

  // Method used to create a new lobby
  addLobby(data) {
    // Create lobby
    const lobby = new Game(data);

    // Verify that key is uniq
    if (countBy(this.lobbies, { id: lobby.id }).true > 0) {
      process.stderr.write('Duplicate ID in lobby creation\n');
      return undefined;
    }

    // Add the lobby to lobbies
    this.lobbies.push(lobby);
    return lobby;
  }

  // Method used to generate a new tile and to send it to client
  addLobbyTile(data, socketId) {
    const lobby = this.getLobby(data);
    if (!lobby) return lobby;
    const tile = new Piece().piece;
    lobby.update({
      players: lobby.players.map((player) => {
        if (player.role === ROOM_ROLES.SPECTATOR) return player;
        return {
          ...player,
          tilesStack: (socketId === player.socketId)
            ? player.tilesStack.slice(1).concat(tile)
            : player.tilesStack.concat(tile),
        };
      }),
    });
    return lobby;
  }

  // Method used to update a lobby
  setLobby(data) {
    const lobby = this.getLobby(data);
    if (lobby) lobby.update(data);
    return lobby;
  }

  // Method used to set a lobby as started and to generate initial tiles
  setLobbyStart(data) {
    const lobby = this.getLobby(data);
    if (!lobby) return { lobby: undefined, startTile: undefined };
    const startTile = new Piece().piece;
    const tilesStack = [new Piece().piece, new Piece().piece, new Piece().piece];
    lobby.update({
      hasStarted: true,
      players: lobby.players.map(player => (
        (player.role === ROOM_ROLES.SPECTATOR) ? player : { ...player, tilesStack }
      )),
      scores: lobby.players
        .filter(player => player.role !== ROOM_ROLES.SPECTATOR)
        .map(player => ({ ...player, score: 0 })),
    });
    return { lobby, startTile };
  }

  // Method used to set a lobby as ended
  setLobbyEnd(data) {
    const lobby = this.getLobby(data);
    if (lobby) lobby.hasEnded = true;
    return lobby;
  }

  // Method used to delete a lobby
  deleteLobby({ id }) {
    this.lobbies = this.lobbies.filter(lobby => lobby.id !== id);
    return undefined;
  }

  // Method used to update player information
  setPlayer(data, socketId) {
    const { lobby, player } = this.getPlayerAndLobby(data, socketId);
    if (player) Object.assign(player, data.user);
    return { lobby, player };
  }

  // Method used to update score of a user and number of blocked rows of other players
  setPlayerScoring(data, socketId) {
    const { lobby, player } = this.getPlayerAndLobby(data, socketId);
    if (!player) return lobby;

    // Update player score
    Object.assign(player, { score: player.score + (data.score ** 2) * 100 });

    // Update also score in lobby.scores
    const scoredPlayer = find(lobby.scores, { socketId });
    if (scoredPlayer) {
      Object.assign(scoredPlayer, {
        score: scoredPlayer.score + (data.score ** 2) * 100,
      });
    }

    // Check wheter an update of other players is relevant
    if (data.score - 1 === 0) return lobby;

    // Update players number of blocked rows
    Object.assign(lobby, {
      players: lobby.players.map(el => (
        (el.role !== ROOM_ROLES.SPECTATOR && el.socketId !== socketId)
          ? {
            ...el,
            blockedRows: el.blockedRows + data.score - 1,
          } : el
      )),
    });
    return lobby;
  }

  // Method used to add a player to lobby
  addPlayer(data, socketId) {
    const lobby = this.getLobby(data);
    if (!lobby) return { lobby, player: undefined };

    // Check if player is already in room
    const playerIndex = findIndex(lobby.players, { socketId });

    // If player is not already in lobby, insert it
    if (playerIndex === -1) {
      const player = new Player({ ...data.user, socketId });
      if (player) lobby.players.push(player);
      return { lobby, player };
    }

    // If player is already in lobby, update it
    const player = find(lobby.players, { socketId });
    player.role = ROOM_ROLES.PLAYER;
    return { lobby, player };
  }

  // Method used to delete a player from lobby
  deletePlayer(data, socketId) {
    const { lobby, player } = this.getPlayerAndLobby(data, socketId);

    if (!player) return null;

    // Check if player is the last one in lobby
    if (lobby.players.length === 1) return this.deleteLobby(data);

    // Delete user from list
    const { role } = player;
    lobby.players = lobby.players.filter(el => el.socketId !== socketId);

    // Check if player role is creator
    if (role === ROOM_ROLES.CREATOR) {
      const newCreator = find(lobby.players, { role: ROOM_ROLES.PLAYER });
      if (newCreator) newCreator.role = ROOM_ROLES.CREATOR;
    }

    return lobby;
  }

  // Method used to delete a player from lobby
  deletePlayerFromAnyLobby(socketId) {
    let lobby = false;
    let playerInfos;
    this.lobbies.some((room) => {
      if (find(room.players, { socketId })) {
        const { player } = this.getPlayerAndLobby({ id: room.id }, socketId);
        playerInfos = { ...player };
        lobby = this.deletePlayer({ id: room.id }, socketId);
      }
      return lobby;
    });
    return { lobby, player: playerInfos };
  }

}

module.exports = Games;
