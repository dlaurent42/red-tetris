import _ from 'lodash';
import http from 'http';
import path from 'path';
import express from 'express'; // Just for testing
import socketIO from 'socket.io';

import { SERVER, SOCKETS } from './config/constants';

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
          //
        } else callback({ error: 'Room with this roomId already exists!' });
        console.log(this.roomTable); // for debugging
      });

      // startGame logic
      socket.on(SOCKETS.GAME_START, (data, callback) => {
        const key = _.findIndex(this.roomTable, elm => elm.owner === socket.id);
        if (key === -1) callback({ error: 'You don\'t have any lobby to start game on' });
        else if (this.roomTable[key].started) callback({ message: 'Game is already started' });
        else {
          this.roomTable[key].started = true;
          // NOT NEEDED PROBABLT: Return to owner(game starter) game structure again IDK WHY.
          callback(this.roomTable[key]);
          // Emit to all player in this lobby to force game start

          // Generate and spawn first tile

        }
      });

      socket.on(SOCKETS.ROOM_LIST, (data, callback) => {
        const ret = {};
        this.roomTable.forEach((room) => {
          const tmp = {
            mode: room.mode,
            roomId: room.roomId,
            hasPwd: room.hasPwd,
            roomName: room.roomName,
            maxPlayers: room.maxPlayers,
            players: room.players.length,
          };
          _.assign(ret, tmp);
        });
        callback(ret);
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
