import _ from 'lodash';
import http from 'http';
import path from 'path';
import express from 'express'; // Just for testing
import socketIO from 'socket.io';

import { SERVER, SOCKETS } from './config/constants';
import generatePiece from './helpers/generator';
import formatRoomList from './helpers/rooms';

class Server {
  constructor() {
    // Server variables
    this.app = express();
    this.http = http.Server(this.app);

    // Game tables
    this.roomTable = [];
    this.playerTable = {};
    // Just for me to able to test socket logic
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(`${__dirname}/test.html`));
    });

    // Sockets handler
    this.io = socketIO(this.http, { pingTimeout: 60000 }); // eslint-disable-line
    this.io.sockets.on('connection', (socket) => {
      console.log(`connection from: ${socket.id}`);
      // Add correlation UserId - SocketId when login event is triggered
      socket.on('loginUser', (uid) => {
        if (!_.isEmpty(uid)) {
          const id = parseInt(uid, 10);
          if (_.isEmpty(this.playerTable[id])) {
            Object.assign(this.playerTable, { [id]: [socket.id] });
          } else this.playerTable[id].push(socket.id);
        }
      });

      // Remove all sockets Id when user logs out
      socket.on('logoutUser', (uid) => {
        if (!_.isEmpty(this.playerTable[parseInt(uid, 10)])) {
          this.playerTable[parseInt(uid, 10)].forEach((socketId) => {
            this.io.to(`${socketId}`).emit('logout');
          });
        }
      });

      // Part of Game
      // newRoom creation
      socket.on(SOCKETS.NEW_ROOM, (data, callback) => {
        /*
          Has to be improved. Validation etc.
        */
        const newRoom = {
          tiles: [],
          players: [
            { // Owner of lobby is a player also
              tile: 0,
              winner: false,
              id: socket.id,
              type: 'player',
            },
          ],
          started: false,
          pwd: data.pwd,
          mode: data.mode,
          owner: socket.id,
          hasPwd: data.hasPwd,
          roomId: data.roomId,
          roomName: data.roomName,
          maxPlayers: data.maxPlayers,
        };
        if (this.roomTable.every(el => el.roomId !== newRoom.roomId)) {
          this.roomTable.push(newRoom);
          callback(newRoom);
          // update everyones room list
          socket.broadcast.emit(SOCKETS.ROOM_LIST, formatRoomList(this.roomTable));
        } else callback({ error: 'Room with this roomId already exists!' });
        console.log(this.roomTable); // for debugging
      });

      // startGame logic
      socket.on(SOCKETS.GAME_START, (data, callback) => {
        const key = _.findIndex(this.roomTable, elm => elm.owner === socket.id);
        if (key === -1) callback({ error: 'You don\'t have any lobby to start game on' });
        else if (this.roomTable[key].started) callback({ error: 'Game is already started' });
        else {
          this.roomTable[key].started = true;
          // Generate and spawn first tile
          this.roomTable[key].tiles.push(generatePiece());
          // Emit to all player in this lobby to force game start
          this.roomTable[key].players.forEach((player) => {
            this.io.to(`${player.id}`).emit('gameHasStarted', this.roomTable[key]);
          });
          callback(this.roomTable[key]);
        }
      });

      // get room list
      socket.on(SOCKETS.ROOM_LIST, () => {
        const ret = formatRoomList(this.roomTable);
        this.io.to(`${socket.id}`).emit(SOCKETS.ROOM_LIST, ret);
      });

      // player joins room
      socket.on(SOCKETS.JOIN_ROOM, (data, callback) => {
        const key = _.findIndex(this.roomTable, elm => elm.roomId === data.roomId);
        if (key === -1) callback({ error: 'There is no such room' });
        else {
          const room = this.roomTable[key];
          if (room.players.length === room.maxPlayers) callback({ error: 'Room is already full' });
          else if ((_.findIndex(room.players, elm => elm.id === socket.id)) !== -1) callback({ error: 'You are already in room' });
          else if (room.hasPwd && room.pwd !== data.pwd) callback({ error: 'Wrong password' });
          else if (room.started) callback({ error: 'Game is already started' });
          else {
            // add player to player list
            room.players.push({
              tile: 0,
              winner: false,
              id: socket.id,
              type: 'player', // pass player type with data?
            });
            room.players.forEach((player) => { // recheck with FrontEnd(send new palyer list)
              this.io.to(`${player.id}`).emit('playerJoined', room.players);
            });
            callback(room);
          }
        }
      });

      // player asks for next piece
      socket.on(SOCKETS.NEXT_PIECE, (data, callback) => {
        const key = _.findIndex(this.roomTable, elm => elm.roomId === data.roomId);
        const room = this.roomTable[key];
        if (room) {
          if (room.started !== true) callback({ error: 'Game haven\'t started!' });
          else {
            const playerKey = _.findIndex(room.players, elm => elm.id === socket.id);
            const player = room.players[playerKey];
            player.tile += 1;
            // spawn new one
            if (player.tile === room.tiles.length) room.tiles.push(generatePiece());
            callback(room.tiles[player.tile]);
          }
        } else callback({ error: 'There is no avialable game' });
      });

      // /Part of Game
      // [PRESET EVENT] remove socket Id from playerTable(later game table)
      socket.on('disconnect', () => {
        // Delete user rooms on his disconnect
        // TODO: Implament kick out of lobby for other players.
        _.remove(this.roomTable, el => el.owner === socket.id);
        // /game
        const key = _.findKey(this.playerTable, socketIds => (
          socketIds.indexOf(socket.id) > -1
        ));
        _.remove(this.playerTable[key], el => el === socket.id);
      });
    });
  }

  listen() {
    this.http.listen(SERVER.PORT, SERVER.HOST, () => {
      console.log(`Listening on http://${SERVER.HOST}:${SERVER.PORT}`);
    });
  }
}

new Server().listen();
