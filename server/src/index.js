import _ from 'lodash';
import http from 'http';
import path from 'path';
import express from 'express'; // Just for testing
import socketIO from 'socket.io';

import formatRoom from './helpers/room';
import formatPlayer from './helpers/player';
import formatRoomList from './helpers/rooms';
import generatePiece from './helpers/generator';
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

      /*
        EXPERIMENTAL function!
        Action:   to create a new room and update lobby list to players
        Input:    data => { pwd, mode, hasPwd, roomId, roomName, maxPlayers }
        Output:   callback -> new room structure Object
      */
      socket.on(SOCKETS.NEW_ROOM, (data, callback) => {
        /*
          Has to be improved. Validation etc.
        */
        const newRoom = {
          tiles: [],
          players: [formatPlayer(socket.id, 'player')], // owner is a player too
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
          // Notification new room created to all except creator
          socket.broadcast.emit(SOCKETS.NOTIFICATIONS.ROOM_CREATED,
            { roomName: newRoom.roomName });
        } else callback({ error: 'Room with this roomId already exists!' });
        console.log(this.roomTable); // for debugging
      });

      /*
        Action:   Room owner sends signal to start game and
                    emits(SOCKETS.GAME_BEGIN) to all players of lobby that
                    games has stated
        Input:    none
        Output:   callback -> room structure Object
      */
      socket.on(SOCKETS.GAME_START, (data, callback) => {
        const key = _.findIndex(this.roomTable, elm => elm.owner === socket.id);
        if (key === -1) return callback({ error: 'You don\'t have any lobby to start game on' });
        if (this.roomTable[key].started) return callback({ error: 'Game is already started' });
        // check if all players ready
        if ((_.findIndex(this.roomTable[key].players, elm => elm.ready === false)) !== -1) return callback({ error: 'Not all players are ready' });
        this.roomTable[key].started = true;
        // Generate and spawn first tile
        this.roomTable[key].tiles.push(generatePiece());
        // Emit to all player in this lobby to force game start
        this.roomTable[key].players.forEach((player) => {
          this.io.to(`${player.id}`).emit(SOCKETS.GAME_BEGIN, this.roomTable[key]);
        });
        return callback(this.roomTable[key]);
      });

      /* getRoomList
        Action:   player call to get full room list
        Input:    none
        Output:   callback of roomlist Object
      */
      socket.on(SOCKETS.ROOM_LIST, (data, callback) => callback(formatRoomList(this.roomTable)));

      /*
        Action:   player joins room
                  and emits to whole lobby that player has joined
        Input:    data => { roomId: 'id of room', userRole: 'optional usr role' }
        Output:   returns callback => (error) || (room structure)
      */
      socket.on(SOCKETS.JOIN_ROOM, (data, callback) => {
        const key = _.findIndex(this.roomTable, elm => elm.roomId === data.roomId);
        if (key === -1) return callback({ error: 'There is no such room' });

        const room = this.roomTable[key];
        if (room.players.length === room.maxPlayers) return callback({ error: 'Room is already full' });
        if ((_.findIndex(room.players, elm => elm.id === socket.id)) !== -1) return callback({ error: 'You are already in room' });
        if (room.hasPwd && room.pwd !== data.pwd) return callback({ error: 'Wrong password' });
        if (room.started) return callback({ error: 'Game is already started' });
        // Notify lobby players that new player entered
        room.players.forEach((player) => {
          this.io.to(`${player.id}`).emit(SOCKETS.NOTIFICATIONS.PLAYER_ENTERED, { username: socket.id });
        });
        // add player to player list
        room.players.push(formatPlayer(socket.id, 'player'));
        return callback(room);
      });

      /*
        Action:   player wants info about room
        Input:    data => { roomId: 'id of room' }
        Output:   calback -> room structure Object
      */
      socket.on(SOCKETS.ROOM_INFO, (data, callback) => {
        const key = _.findIndex(this.roomTable, elm => elm.roomId === data.roomId);
        if (key === -1) callback({ error: 'There is no such room' });
        else callback(formatRoom(this.roomTable[key]));
      });

      /*
          Action:   player asks for next piece
          Input:    data => { roomId: 'id of room' }
          Output:   callback => (error) || (tile Object)
      */
      socket.on(SOCKETS.GAME.NEXT_PIECE, (data, callback) => {
        const key = _.findIndex(this.roomTable, elm => elm.roomId === data.roomId);
        const room = this.roomTable[key];
        if (!room) return callback({ error: 'There is no avialable game' });
        if (room.started !== true) return callback({ error: 'Game haven\'t started!' });

        const playerKey = _.findIndex(room.players, elm => elm.id === socket.id);
        const player = room.players[playerKey];
        player.tile += 1;
        // spawn new one
        if (player.tile === room.tiles.length) room.tiles.push(generatePiece());
        return callback({ tile: room.tiles[player.tile] });
      });

      /*
        Action:     player is scoring a line. We have to
                    add other players penalty line and player additional score
        Input:      data => { roomId: (id of room), score: (total scored point) }
        Output:     callback(self player struct) && emit(SOCKETS.APPLY_PENALTY) to other players
      */
      socket.on(SOCKETS.GAME.PLAYER_SCORE, (data, callback) => {
        const key = _.findIndex(this.roomTable, elm => elm.roomId === data.roomId);
        if (key === -1) return callback({ error: 'There is no such room' });
        if (this.roomTable[key].started === false) return callback({ error: 'Game has not started yet' });

        const playerKey = _.findIndex(this.roomTable[key].players, elm => elm.id === socket.id);
        if (playerKey === -1) return callback({ error: 'It seems like your are not in this room' });
        if (this.roomTable[key].players[playerKey].type === 'spectator') return callback({ error: 'This function is only for players' });

        this.roomTable[key].players.forEach((player, index) => {
          if (player.id !== socket.id) {
            this.roomTable[key].players[index].penalty += data.score;
            // Emit to other players to add penalty block
            this.io.to(`${player.id}`).emit(SOCKETS.GAME.PLAYER_SCORE,
              {
                roomId: this.roomTable,
                score: data.score,
              });
          }
        });
        this.roomTable[key].players[playerKey].score += data.score;
        return callback(this.roomTable[key].players[playerKey]);
      });

      /*
        Action:     sets player state ready in that particular lobby
        Input:      data => { roomId: (id of room) }
        Output:     callback(self player obj) with player info
      */
      socket.on(SOCKETS.PLAYER_READY, (data, callback) => {
        const key = _.findIndex(this.roomTable, elm => elm.roomId === data.roomId);
        if (key === -1) return callback({ error: 'There is no such room' });
        const playerKey = _.findIndex(this.roomTable[key].players, elm => elm.id === socket.id);
        if (playerKey === -1) return callback({ error: 'Apparantely you are not in this lobby' });
        this.roomTable[key].players[playerKey].ready = true;
        return callback(this.roomTable[key].players[playerKey]);
      });

      /* !!! EXPERIMENTAL
        Action:     player just finished game and it should
                    finish for other players too
                    !! Logic: player reached top and LOST. So other players considered as winners
        Input:      data => { roomId: 'id of room' }
        Output:     callback -> (player that ended game) && emit to other room players && close room
      */
      socket.on(SOCKETS.GAME.FINISH, (data, callback) => {
        let self = {};
        const key = _.findIndex(this.roomTable, elm => elm.roomId === data.roomId);
        if (key === -1) return callback({ error: 'There is no such room' });
        if (this.roomTable[key].started === false) return callback({ error: 'There is nothing to end on this room' });

        // Set other players as winners
        this.roomTable[key].players.forEach((player, index) => {
          if (player.id !== socket.id) this.roomTable[key].players[index].winner = true;
          else self = player;
          // emit announcing that game ended and sending it's own player struct const
          this.io.to(`${player.id}`).emit(SOCKETS.GAME.FINISH,
            {
              ...this.roomTable[key].players[index],
              gameState: 'over',
              roomId: this.roomTable[key].roomId,
            });
          // TODO: send info to API to add scores and stats for player
        });
        // Remove game structure
        this.roomTable.splice(key, 1);
        return callback({ ...self, gameState: 'over' });
      });

      // /Part of Game
      /*
        !!! Everything in disconnect is EXPERIMENTAL !!!
      */
      socket.on('disconnect', () => {
        // If player were lobby leader.
        const lobbyKey = _.findIndex(this.roomTable, el => el.owner === socket.id);
        if (lobbyKey !== -1) { // Player has lobby as a leader
          // set other players to winner
          this.roomTable[lobbyKey].players.forEach((player, index) => {
            if (player.id !== socket.id) this.roomTable[lobbyKey].players[index].winner = true;
            // username = socket.id for NOW
            this.io.to(`${player.id}`).emit(SOCKETS.NOTIFICATIONS.PLAYER_LEFT, { username: socket.id });
            this.io.to(`${player.id}`).emit(SOCKETS.END_OF_GAME, { ...this.roomTable[lobbyKey].players[index], gameState: 'over' });
          });
        } else {
          let usr = {};
          let room = {};
          this.roomTable.some((elm) => {
            elm.players.some((player) => {
              if (player.id === socket.id) {
                usr = player;
                room = elm;
                return true;
              }
              return false;
            });
            return false;
          });
          if (!_.isEmpty(usr)) { // when casual player left -> notification
            room.players.forEach(player => this.io.to(`${player.id}`).emit(SOCKETS.NOTIFICATIONS.PLAYER_LEFT, { username: player.id }));
          }
        }

        // TODO: Implament kick out of lobby for other players.
        _.remove(this.roomTable, el => el.owner === socket.id);
        // /game --- !!! Everything below is unused for NOW !!!
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
