const socketIO = require('socket.io');
const { find, countBy } = require('lodash');
const Game = require('./Games');
const Piece = require('./Piece');
const { SOCKETS, ROOM_ROLES } = require('../config/constants');

class Sockets {

  constructor(http) {
    this.rooms = [];
    this.io = socketIO(http, { pingTimeout: 60000 });
  }

  listenToEvents() {
    this.io.sockets.on('connection', (socket) => {

      socket.on(SOCKETS.TOURNAMENTS_LIST, (payload, callback) => {
        console.log('\n[TOURNAMENTS_LIST]');
        console.log(payload);
        callback({ tournaments: this.rooms.map(room => room.toObject()) });
      });

      socket.on(SOCKETS.ROOM_INFOS, (payload, callback) => {
        console.log('\n[ROOM_INFOS]');
        console.log(payload);
        let room;

        // Case 1: payload contains valid room ID and room is found
        if (payload.roomId && payload.roomName) {
          room = find(this.rooms, { id: payload.roomId, name: payload.roomName });

          // Case 2: payload contains only room name and room is found
        } else if (payload.roomName && countBy(this.rooms, { name: payload.roomName }).true === 1) {
          room = find(this.rooms, { name: payload.roomName });

          // Case 3: none of the above, create a new room
        } else {
          room = new Game(payload);
          this.rooms.push(room);

          // Send a notification to warn user of room creation
          console.log('... NOTIFY_ROOM_CREATED + TOURNAMENTS_UPDATE');
          socket.emit(SOCKETS.NOTIFY_ROOM_CREATED, payload);

          // Update tournaments for all users
          socket.emit(SOCKETS.TOURNAMENTS_UPDATE, {
            tournaments: this.rooms.map(el => el.toObject()),
          });
          socket.broadcast.emit(SOCKETS.TOURNAMENTS_UPDATE, {
            tournaments: this.rooms.map(el => el.toObject()),
          });
        }
        callback(room.toObject());
      });

      // socket.on(SOCKETS.ROOM_UPDATE, (payload) => {
      //   console.log('\n[ROOM_UPDATE]');
      //   console.log(payload);

      //   // Find concerned room based on its ID
      //   const room = find(this.rooms, { id: payload.roomId, name: payload.roomName });
      //   if (!room) return;

      //   // Update room
      //   room.update(payload);

      //   // Warn all players about update
      //   console.log('... TOURNAMENTS_UPDATE and ROOM_UPDATE');
      //   socket.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      //     tournaments: this.rooms.map(el => el.toObject()),
      //   });
      //   socket.broadcast.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      //     tournaments: this.rooms.map(el => el.toObject()),
      //   });
      //   room.players.forEach(player => (
      //     this.io.to(player.socketId).emit(SOCKETS.ROOM_UPDATE, room.toObject())
      //   ));
      // });

      // socket.on(SOCKETS.ROOM_CREATION, (payload) => {
      //   console.log('\n[ROOM_CREATION]');
      //   console.log(payload);

      //   // Create a new room and push it to array
      //   this.rooms.push(new Game(payload));

      //   // Warn all players about room creation
      //   console.log('... NOTIFY_ROOM_CREATED && TOURNAMENTS_UPDATE');
      //   socket.emit(SOCKETS.NOTIFY_ROOM_CREATED, payload);
      //   socket.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      //     tournaments: this.rooms.map(el => el.toObject()),
      //   });
      //   socket.broadcast.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      //     tournaments: this.rooms.map(el => el.toObject()),
      //   });
      // });

      socket.on(SOCKETS.ROOM_FORBIDDEN_ACCESS, (payload) => {
        console.log('\n[ROOM_FORBIDDEN_ACCESS]');
        console.log(payload);
        console.log('... NOTIFY_ROOM_FORBIDDEN_ACCESS');
        socket.emit(SOCKETS.NOTIFY_ROOM_FORBIDDEN_ACCESS, (payload));
      });

      // socket.on(SOCKETS.ROOM_USER_UPDATE, (payload) => {
      //   console.log('\n[ROOM_USER_UPDATE]');
      //   console.log(payload);

      //   // Find concerned room
      //   const room = find(this.rooms, { id: payload.roomId });
      //   if (!room) return;

      //   // Find concerner user in concerned room
      //   const user = find(room.players, { socketId: socket.id });
      //   if (!user) return;
      //   console.log('user found');
      //   console.log(user);
      //   // Update
      //   user.update(payload.user);

      //   // Warn other players of the update
      //   console.log('... TOURNAMENTS_UPDATE + ROOM_UPDATE');
      //   socket.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      //     tournaments: this.rooms.map(el => el.toObject()),
      //   });
      //   socket.broadcast.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      //     tournaments: this.rooms.map(el => el.toObject()),
      //   });
      //   room.players.forEach(player => (
      //     this.io.to(player.socketId).emit(SOCKETS.ROOM_UPDATE, room.toObject())
      //   ));
      // });

      // socket.on(SOCKETS.ROOM_USER_JOINED, (payload) => {
      //   console.log('\n[ROOM_USER_JOINED]');
      //   console.log(payload);

      //   // Find concerned room
      //   const room = find(this.rooms, { id: payload.roomId });
      //   if (!room) return;

      //   // Push new player to list of users in room
      //   room.players.push(Object.assign(payload.user, { socketId: socket.id }));

      //   // Warn other players
      //   room.players.forEach((player) => {
      //     if (player.socketId !== socket.id) {
      //       this.io.to(player.socketId).emit(SOCKETS.NOTIFY_PLAYER_ENTERS_GAME, player);
      //     }
      //     this.io.to(player.socketId).emit(SOCKETS.ROOM_UPDATE, room.toObject());
      //   });

      //   // Warn all
      //   if (payload.user.role === ROOM_ROLES.SPECTATOR) return;
      //   console.log('... TOURNAMENTS_UPDATE');
      //   socket.broadcast.emit(SOCKETS.TOURNAMENTS_UPDATE, {
      //     tournaments: this.rooms.map(el => el.toObject()),
      //   });
      // });

      socket.on(SOCKETS.ROOM_USER_LEFT, (payload) => {
        console.log('\n[ROOM_USER_LEFT]');
        console.log(payload);

        // Find concerned room
        const room = find(this.rooms, { id: payload.roomId });
        if (!room) return;

        // Check if the person who has left was alone in the room, then delete the room
        if (room.players.length === 1) {
          this.rooms = this.rooms.filter(el => el.id !== payload.roomId);

        // Check role of deserter
        } else {
          const deserter = find(room.players, { socketId: socket.id });

          // If deserter was creator, we change rights in room
          if (deserter.role === ROOM_ROLES.CREATOR) {
            const firstPlayer = find(room.players, { role: ROOM_ROLES.PLAYER });
            if (firstPlayer) firstPlayer.role = ROOM_ROLES.CREATOR;
          }

          // If deserter role was not spectator, notify users
          if (deserter.role !== ROOM_ROLES.SPECTATOR) {
            room.players.forEach((player) => {
              if (player.socketId !== socket.id) {
                this.io.to(player.socketId).emit(SOCKETS.NOTIFY_PLAYER_LEFT_GAME, room.toObject());
              }
            });
          }

          // Remove him from list of players
          room.players = room.players.filter(player => player.socketId !== socket.id);

          // Check if there is only one player left
          if (countBy(room.players, { role: ROOM_ROLES.PLAYER }) === 0) {
            room.players.forEach((player) => {
              if (player.socketId !== socket.id) {
                this.io.to(player.socketId).emit(SOCKETS.GAME_OVER, {});
              }
            });
          }
        }

        // Warn other players of the update
        console.log('... TOURNAMENTS_UPDATE + ROOM_UPDATE');
        socket.emit(SOCKETS.TOURNAMENTS_UPDATE, {
          tournaments: this.rooms.map(el => el.toObject()),
        });
        socket.broadcast.emit(SOCKETS.TOURNAMENTS_UPDATE, {
          tournaments: this.rooms.map(el => el.toObject()),
        });
        room.players.forEach(player => (
          this.io.to(player.socketId).emit(SOCKETS.ROOM_UPDATE, room.toObject())
        ));
      });

      socket.on(SOCKETS.GAME_SPECTER_UPDATE, (payload) => {
        console.log('\n[GAME_SPECTER_UPDATE]');
        console.log(payload);
        console.log('... GAME_SPECTER_UPDATE');
        socket.emit(SOCKETS.GAME_SPECTER_UPDATE, (payload));
      });

      socket.on(SOCKETS.GAME_SCORED, (payload) => {
        console.log('\n[GAME_SCORED]');
        console.log(payload);

        // Find concerned room
        const room = find(this.rooms, { id: payload.roomId });
        if (!room) return;

        // Warn other players
        console.log('... GAME_SCORED');
        room.players.forEach((player) => {
          if (player.socketId !== socket.id) {
            this.io.to(player.socketId).emit(SOCKETS.GAME_SCORED, payload);
          }
        });
      });

      socket.on(SOCKETS.GAME_START, (payload) => {
        console.log('\n[GAME_START]');
        console.log(payload);

        // Find concerned room
        const room = find(this.rooms, { id: payload.roomId });
        if (!room) return;

        // Create 3 new pieces
        const tiles = Array(3).fill(new Piece());

        // Warn players
        console.log('... GAME_STARTS');
        room.players.forEach((player) => {
          this.io.to(player.socketId).emit(SOCKETS.GAME_STARTS, { tiles });
        });
      });

      socket.on(SOCKETS.GAME_NEW_TILE, (payload, callback) => {
        console.log('\n[GAME_NEW_TILE]');
        console.log(payload);

        // Find concerned room
        const room = find(this.rooms, { id: payload.roomId });
        if (!room) return;

        const tile = new Piece();
        // Warn other players
        console.log('... GAME_STARTS');
        room.players.forEach((player) => {
          if (player.socketId !== socket.id && player.role !== ROOM_ROLES.SPECTATOR) {
            this.io.to(player.socketId).emit(SOCKETS.GAME_STARTS, { tile });
          }
        });
        callback({ tile });
      });

    });
  }
}

module.exports = Sockets;
