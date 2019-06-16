const { find } = require('lodash');
const { ROOM_ROLES, GAME_MODES, SOCKETS } = require('../config/constants');
const Player = require('./Player');

const generateID = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

class Game {
  constructor(props) {
    this.id = props.roomId || generateID(64);
    this.name = props.roomName;
    this.maxPlayers = props.maxPlayers || 1;
    this.hasPassword = props.roomHasPassword || false;
    this.password = props.roomPassword || '';
    this.mode = props.roomMode || GAME_MODES[0];
    this.hasStarted = false;
    this.players = [];
  }

  toObject() {
    return {
      roomId: this.id,
      roomName: this.name,
      nbPlayers: this.players.length,
      maxPlayers: this.maxPlayers,
      roomHasPassword: this.hasPassword,
      roomPassword: this.password,
      roomMode: this.mode,
      gameHasStarted: this.hasStarted,
      users: this.players,
    };
  }

  update(data) {
    this.id = data.roomId || this.id;
    this.name = data.roomName || this.name;
    this.maxPlayers = data.maxPlayers || this.maxPlayers;
    this.hasPassword = data.roomHasPassword || this.hasPassword;
    this.password = data.roomPassword || this.password;
    this.mode = data.roomMode || this.mode;
    this.hasStarted = data.gameHasStarted || this.hasStarted;
    this.players = data.users || this.players;
  }
}

class Games {

  constructor() {
    this.games = [];
  }

  getRoom({ roomId }) {
    return find(this.rooms, { id: roomId });
  }

  getPlayerAndRoom({ roomId }, socketId) {
    const room = this.getRoom({ roomId });
    if (!room) return { room, player: undefined };
    return { room, player: find(room.players, { socketId }) };
  }

  addLobby(socket, data) {
    const room = new Game(data);
    this.games.push(room);
    socket.emit(SOCKETS.NOTIFY_ROOM_CREATED, data.roomName);
    socket.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      tournaments: this.rooms.map(el => el.toObject()),
    });
    socket.broadcast.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      tournaments: this.rooms.map(el => el.toObject()),
    });
  }

  setLobby(socket, data) {
    const room = this.getRoom(data);
    if (!room) return;

    room.update(data);
    console.log('... TOURNAMENTS_UPDATE and ROOM_UPDATE');
    socket.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      tournaments: this.rooms.map(el => el.toObject()),
    });
    socket.broadcast.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      tournaments: this.rooms.map(el => el.toObject()),
    });
    room.players.forEach(player => (
      this.io.to(player.socketId).emit(SOCKETS.ROOM_UPDATE, room.toObject())
    ));
  }

  deleteLobby(socket, { roomId }) {
    this.rooms = this.rooms.filter(room => room.id !== roomId);
    socket.broadcast.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      tournaments: this.rooms.map(el => el.toObject()),
    });
  }

  setPlayer(socket, data) {
    const { room, player } = this.getPlayer(data, socket.id);
    if (!player) return;
    player.update(data.user);

    console.log('... TOURNAMENTS_UPDATE + ROOM_UPDATE');
    socket.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      tournaments: this.rooms.map(el => el.toObject()),
    });
    socket.broadcast.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      tournaments: this.rooms.map(el => el.toObject()),
    });
    room.players.forEach(el => (
      this.io.to(el.socketId).emit(SOCKETS.ROOM_UPDATE, room.toObject())
    ));
  }

  addPlayer(socket, data) {
    const room = this.getRoom(data);
    if (!room) return;

    const player = new Player({ ...data.user, socketId: socket.id });
    room.players.push(player);

    room.players.forEach((el) => {
      if (el.socketId !== socket.id) {
        this.io.to(el.socketId).emit(SOCKETS.NOTIFY_PLAYER_ENTERS_GAME, el);
      }
      this.io.to(el.socketId).emit(SOCKETS.ROOM_UPDATE, room.toObject());
    });
    if (player.role === ROOM_ROLES.SPECTATOR) return;
    socket.broadcast.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      tournaments: this.rooms.map(el => el.toObject()),
    });
  }

  deletePlayer(socket, data) {
    const { room, player } = this.getPlayer(data, socket.id);
    if (!player) return;

    // Check current number of players in room
    if (room.players.length === 1) {
      this.deleteLobby(socket, data);
      return;
    }

    // Check if player status is creator
    if (player.role === ROOM_ROLES.CREATOR) {
      const newCreator = find(room.players, { role: ROOM_ROLES.PLAYER });
      if (newCreator) newCreator.role = ROOM_ROLES.CREATOR;
      else {
        room.players.forEach((el) => {
          if (el.socketId !== socket.id) {
            this.io.to(el.socketId).emit(SOCKETS.GAME_OVER, {});
          }
        });
      }
    }

    // If deserter role was not spectator, notify users
    if (player.role !== ROOM_ROLES.SPECTATOR) {
      room.players.forEach((el) => {
        if (el.socketId !== socket.id) {
          this.io.to(el.socketId).emit(SOCKETS.NOTIFY_PLAYER_LEFT_GAME, player.username);
        }
      });
    }

    // Delete user from list
    room.players = room.players.filter(el => el.socketId !== socket.id);
  }

  // Process
  //    - check if player is creator -> find next arrived player and set him as leader
  //    - delete user from list of players
  //    - check game over
}

module.exports = Games;
