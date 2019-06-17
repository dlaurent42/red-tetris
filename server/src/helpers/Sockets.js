const socketIO = require('socket.io');
const { get, countBy } = require('lodash');
const Games = require('./Games');
const { SOCKETS, ROOM_ROLES } = require('../config/constants');

class Sockets {

  constructor(http) {
    this.lobbies = new Games();
    this.io = socketIO(http, { pingTimeout: 60000 });
  }

  handlePlayerLeft(lobby, player, socket) {
    // Check if player deletion worked
    if (lobby === null) return;

    // Broadcast
    this.broadcastTournamentsList(socket);

    // Check if lobby has been deleted
    if (lobby === undefined) return;

    // Check if game is over (one player left)
    if (countBy(lobby.players, { role: ROOM_ROLES.SPECTATOR }).false === 1) {
      lobby.players.forEach(el => this.io.to(el.socketId).emit(SOCKETS.GAME_OVER, {}));
    }

    // Update client's info
    const username = get(player, 'username', 'Someone');
    const role = get(player, 'username', ROOM_ROLES.SPECTATOR);
    lobby.players.forEach((el) => {
      this.io.to(el.socketId).emit(SOCKETS.ROOM_UPDATE, lobby.toObject());
      if (role === ROOM_ROLES.SPECTATOR) return;
      this.io.to(el.socketId).emit(SOCKETS.NOTIFY_PLAYER_LEFT_GAME, { username });
    });
  }

  broadcastTournamentsList(socket) {
    const tournaments = this.lobbies.getFormatedLobbies();
    socket.emit(SOCKETS.TOURNAMENTS_UPDATE, { tournaments });
    socket.broadcast.emit(SOCKETS.TOURNAMENTS_UPDATE, { tournaments });
  }

  listenToEvents() {
    this.io.sockets.on('connection', (socket) => {

      socket.on(SOCKETS.TOURNAMENTS_LIST, (payload, callback) => {
        callback({ tournaments: this.lobbies.getFormatedLobbies() });
      });

      socket.on(SOCKETS.ROOM_INFOS, (payload, callback) => {

        // Fetch lobby based on information received
        let lobby = this.lobbies.getInfos(payload);

        // If lobby could not be found, create it
        if (lobby === undefined) {
          lobby = this.lobbies.addLobby(payload);

          // If lobby is correctly created, update client's info
          if (lobby === undefined) {
            socket.emit(SOCKETS.NOTIFY_ROOM_NOT_CREATED, { roomName: payload.roomName });
            return;
          }
          this.broadcastTournamentsList(socket);
          socket.emit(SOCKETS.NOTIFY_ROOM_CREATED, { roomName: lobby.name });
        }

        // Callback
        callback(lobby.toObject());
      });

      socket.on(SOCKETS.ROOM_UPDATE, (payload) => {

        // Update lobby
        const lobby = this.lobbies.setLobby(payload);

        // If update went well, update client's info
        this.broadcastTournamentsList(socket);
        lobby.players.forEach(player => (
          this.io.to(player.socketId).emit(SOCKETS.ROOM_UPDATE, lobby.toObject())
        ));
      });

      socket.on(SOCKETS.ROOM_CREATION, (payload) => {

        // Create new lobby
        const lobby = this.lobbies.addLobby(payload);

        // If lobby is correctly created, update client's info
        if (!lobby) return;
        this.broadcastTournamentsList(socket);
        socket.emit(SOCKETS.NOTIFY_ROOM_CREATED, { roomName: lobby.name });
      });

      socket.on(SOCKETS.ROOM_FORBIDDEN_ACCESS, (payload) => {
        socket.emit(SOCKETS.NOTIFY_ROOM_FORBIDDEN_ACCESS, { payload });
      });

      socket.on(SOCKETS.ROOM_USER_UPDATE, (payload) => {

        // Update user
        const { lobby, player } = this.lobbies.setPlayer(payload, socket.id);

        // If player is correctly created, update client's info
        if (!player) return;
        this.broadcastTournamentsList(socket);
        lobby.players.forEach(el => (
          this.io.to(el.socketId).emit(SOCKETS.ROOM_UPDATE, lobby.toObject())
        ));
      });

      socket.on(SOCKETS.ROOM_USER_JOINED, (payload) => {

        // Add user
        const { lobby, player } = this.lobbies.addPlayer(payload, socket.id);

        // If player has been correctly added, update client's info
        if (!player) return;
        lobby.players.forEach((el) => {
          this.io.to(el.socketId).emit(SOCKETS.ROOM_UPDATE, lobby.toObject());
          if (el.socketId === socket.id || player.role === ROOM_ROLES.SPECTATOR) return;
          this.io.to(el.socketId).emit(
            SOCKETS.NOTIFY_PLAYER_ENTERS_GAME,
            { username: player.username },
          );
        });

        // Broadcast information if user is a player / lobby owner
        if (player.role !== ROOM_ROLES.SPECTATOR) this.broadcastTournamentsList(socket);
      });

      socket.on(SOCKETS.ROOM_USER_LEFT, (payload) => {
        const lobby = this.lobbies.deletePlayer(payload, socket.id);
        this.handlePlayerLeft(lobby, payload.user, socket);
      });

      socket.on(SOCKETS.GAME_SPECTER_UPDATE, (payload) => {
        const lobby = this.lobbies.getLobby(payload);
        if (!lobby) return;
        lobby.players.forEach((player) => {
          if (player.socketId === socket.id) return;
          this.io.to(player.socketId).emit(SOCKETS.GAME_SPECTER_UPDATE, (payload));
        });
      });

      socket.on(SOCKETS.GAME_SCORED, (payload) => {
        const lobby = this.lobbies.getLobby(payload);
        if (!lobby) return;

        // Update players game
        lobby.players.forEach((player) => {
          if (player.socketId !== socket.id) {
            this.io.to(player.socketId).emit(SOCKETS.GAME_SCORED, payload);
          }
        });
      });

      socket.on(SOCKETS.GAME_STARTS, (payload) => {
        const { lobby, tiles } = this.lobbies.setLobbyStart(payload);
        if (!lobby) return;
        lobby.players.forEach(el => this.io.to(el.socketId).emit(SOCKETS.GAME_STARTS, { tiles }));
      });

      socket.on(SOCKETS.GAME_NEW_TILE, (payload, callback) => {
        const { lobby, tile } = this.lobbies.addLobbyTile(payload);

        // Check if tile has been successfully created
        if (!lobby || !tile) return callback({ tile });

        // Update users' info
        lobby.players.forEach((player) => {
          if (player.socketId !== socket.id && player.role !== ROOM_ROLES.SPECTATOR) {
            this.io.to(player.socketId).emit(SOCKETS.GAME_NEW_TILE, { tile });
          }
        });
        return callback({ tile });
      });

      socket.on('disconnect', () => {

        // Delete player from any lobby
        const { lobby, player } = this.lobbies.deletePlayerFromAnyLobby(socket.id);
        if (lobby) this.handlePlayerLeft(lobby, player, socket);

      });
    });
  }
}

module.exports = Sockets;
