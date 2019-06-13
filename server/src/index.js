import _ from 'lodash';
import http from 'http';
import express from 'express';

import SERVER from './config/constants';

class Server {
  constructor() {
    // Server variables
    this.app = express();
    this.http = http.Server(this.app);

    // Sockets handler
    this.io = require('socket.io')(this.http, { pingTimeout: 60000 }); // eslint-disable-line
    this.roomTable = {};
    this.playerTable = {};
    this.io.sockets.on('connection', (socket) => {
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

      // Handle if a given user is connected or not
      socket.on('isOnline', (userIds) => {
        const onlineUsers = userIds.map((userId) => {
          const id = parseInt(userId, 10);
          let isOnline = false;
          Object.keys(this.playerTable).forEach((key) => {
            if (parseInt(key, 10) === id && !_.isEmpty(this.playerTable[key])) isOnline = true;
          });
          return { id, isOnline };
        });
        this.io.to(`${socket.id}`).emit('isOnline', { data: { onlineUsers } });
      });

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
