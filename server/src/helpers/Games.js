const { find, countBy } = require('lodash');
const { ROOM_ROLES } = require('../config/constants');
const Player = require('./Player');
const Game = require('./Game');
const Piece = require('./Piece');

class Games {

  constructor() {
    this.lobbies = [];
  }

  // Method used to find a lobby based on its id
  getLobby({ roomId }) {
    return find(this.lobbies, { id: roomId });
  }

  // Method used to fetch all lobbies
  getLobbies() {
    return this.lobbies;
  }

  // Method used to fetch all lobbies as formatted object
  getFormatedLobbies() {
    return this.lobbies.map(lobby => lobby.toObject());
  }

  // Method used to verify wheter a lobby exists and to return it
  getInfos(data) {
    return this.getLobby(data) || (countBy(this.lobbies, { name: data.roomName }).true === 1)
      ? find(this.lobbies, { name: data.roomName })
      : undefined;
  }

  // Method used to find a user in a lobby based on its socket id
  getPlayerAndLobby({ roomId }, socketId) {
    const lobby = this.getLobby({ roomId });
    return { lobby, player: (!lobby) ? undefined : find(lobby.players, { socketId }) };
  }

  // Method used to create a new lobby
  addLobby(data) {
    // Create lobby
    const lobby = new Game(data);

    // Verify that key is uniq
    if (countBy(this.lobbies, { id: lobby.id }).true > 0) {
      console.error('Duplicate ID in lobby creation');
      return undefined;
    }

    // Add the lobby to lobbies
    this.lobbies.push(lobby);
    return lobby;
  }

  // Method used to generate a new tile and to send it to client
  addLobbyTile(data) {
    return { lobby: this.getLobby(data), tile: new Piece().piece };
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
    if (lobby) lobby.hasStarted = true;

    const tiles = [new Piece().piece, new Piece().piece, new Piece().piece];
    return { lobby, tiles };
  }

  // Method used to delete a lobby
  deleteLobby({ roomId }) {
    this.lobbies = this.lobbies.filter(lobby => lobby.id !== roomId);
    return undefined;
  }

  // Method used to update player information
  setPlayer(data, socketId) {
    const { lobby, player } = this.getPlayerAndLobby(data, socketId);
    if (player) player.update(data.user);
    return { lobby, player };
  }

  // Method used to add a player to lobby
  addPlayer(data, socketId) {
    const lobby = this.getLobby(data);
    const player = (lobby) ? new Player({ ...data.user, socketId }) : undefined;
    if (player) lobby.players.push(player);
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

    // Check if player status is creator
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
        const { player } = this.getPlayerAndLobby({ roomId: room.id }, socketId);
        playerInfos = { ...player };
        lobby = this.deletePlayer({ roomId: room.id }, socketId);
      }
      return lobby;
    });
    return { lobby, player: playerInfos };
  }

}

module.exports = Games;
