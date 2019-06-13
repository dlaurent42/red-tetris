import _ from 'lodash';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';

import { SERVER, SOCKETS } from './config/constants';

class Server {
  constructor() {
    // Server variables
    this.app = express();
    this.http = http.Server(this.app);

    // Game tables
    this.roomTable = {};
    this.playerTable = {};
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

      socket.on(SOCKETS.newRoom, (data) => {
        try {
          const parsed = JSON.parse(data);
          const newRoom = {
            tiles: [],
            players: [],
            pwd: parsed.pwd,
            mode: parsed.mode,
            hasPwd: parsed.hasPwd,
            roomId: parsed.roomId,
            roomName: parsed.roomName,
            maxPlayers: parsed.maxPlayers,
          };
          Object.assign(this.roomTable, newRoom);
          // Send something back
        } catch (error) { // Parsing error
          console.log(error);
        }
      });

      socket.on(SOCKETS.getRoomList, () => {
        const ret = {};
        this.roomTable.forEach((room) => {
          const tmp = {
            hasPwd: room.hasPwd,
            mode: room.mode,
            roomId: room.roomId,
            roomName: room.roomName,
            maxPlayers: room.maxPlayers,
            players: room.players.length,
          };
          Object.assign(ret, tmp);
        });
        this.io.to(`${socket.id}`).emit('getRoomList', JSON.stringify(ret));
      });

      // /Part of Game
      // [PRESET EVENT] remove socket Id from playerTable(later game table)
      socket.on('disconnect', () => {
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
