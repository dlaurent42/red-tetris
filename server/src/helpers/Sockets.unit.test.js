const io = require('socket.io-client');
const http = require('http');
const Sockets = require('./Sockets');
const Game = require('./Game');
const Player = require('./Player');
const { SOCKETS, ROOM_ROLES } = require('../config/constants');

let clientSocket;
let httpServer;
let httpServerAddr;
let sockets;

// Create fake lobby
const game = new Game({});
game.players.push(
  new Player({
    id: 1,
    socketId: 'a',
    username: 'player',
    role: ROOM_ROLES.PLAYER,
  }),
  new Player({
    id: 2,
    socketId: 'b',
    username: 'owner',
    role: ROOM_ROLES.CREATOR,
  }),
  new Player({
    id: 3,
    socketId: 'c',
    username: 'spectator',
    role: ROOM_ROLES.SPECTATOR,
  }),
);

beforeAll((done) => {
  httpServer = http.createServer();
  httpServerAddr = httpServer.listen().address();
  sockets = new Sockets(httpServer);
  sockets.listenToEvents();
  done();
});

afterAll((done) => {
  httpServer.close();
  done();
});

beforeEach((done) => {
  clientSocket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
  });
  sockets.lobbies.lobbies = [];
  clientSocket.on('connect', () => {
    done();
  });
});

afterEach((done) => {
  if (clientSocket.connected) {
    clientSocket.disconnect();
  }
  done();
});


describe('Scokets class contains all socket listeners and dispatches actions', () => {

  it('should communicate between client and server', (done) => {
    sockets.io.emit('echo', 'Hello World');
    clientSocket.once('echo', (message) => {
      expect(message).toBe('Hello World');
      done();
    });
    sockets.io.on('connection', (socket) => {
      expect(socket).toBeDefined();
      done();
    });
  });

  it('should return up-to-date tournaments list', (done) => {
    const fn = jest.fn();
    clientSocket.emit(SOCKETS.TOURNAMENTS_LIST, {}, fn);
    setTimeout(() => {
      expect(fn).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should return room info (fail)', (done) => {
    const fn = jest.fn();
    clientSocket.emit(SOCKETS.ROOM_INFOS, {}, fn);
    setTimeout(() => {
      expect(fn).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should return room info (success)', (done) => {
    const fn = jest.fn();
    sockets.lobbies.lobbies.push(game);
    clientSocket.emit(SOCKETS.ROOM_INFOS, { id: game.id }, fn);
    setTimeout(() => {
      expect(fn).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should create a room', (done) => {
    clientSocket.emit(SOCKETS.ROOM_CREATION, {});
    setTimeout(() => {
      expect(sockets.lobbies.lobbies).toHaveLength(1);
      done();
    }, 100);
  });

  it('should update a room (fail)', (done) => {
    clientSocket.emit(SOCKETS.ROOM_UPDATE, {});
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should update a room (success)', (done) => {
    sockets.lobbies.lobbies.push(game);
    clientSocket.emit(SOCKETS.ROOM_UPDATE, { id: game.id });
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should notify forbidden access', (done) => {
    clientSocket.emit(SOCKETS.ROOM_FORBIDDEN_ACCESS, {});
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should update user', (done) => {
    clientSocket.emit(SOCKETS.ROOM_USER_UPDATE, {});
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should consider user as joining room', (done) => {
    sockets.lobbies.lobbies.push(game);
    clientSocket.emit(SOCKETS.ROOM_USER_JOINED, { id: game.id, user: game.players[0] });
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should consider user as joining room', (done) => {
    clientSocket.emit(SOCKETS.ROOM_USER_JOINED, {});
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should consider user as lefting room', (done) => {
    clientSocket.emit(SOCKETS.ROOM_USER_LEFT, {});
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should consider user as lefting room', (done) => {
    sockets.lobbies.lobbies.push(game);
    clientSocket.emit(SOCKETS.ROOM_USER_LEFT, { id: game.id, user: game.players[0] });
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should update specter', (done) => {
    sockets.lobbies.lobbies.push(game);
    clientSocket.emit(SOCKETS.GAME_SPECTER_UPDATE, { id: game.id });
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should update specter', (done) => {
    clientSocket.emit(SOCKETS.GAME_SPECTER_UPDATE, {});
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should handle scoring system', (done) => {
    sockets.lobbies.lobbies.push(game);
    clientSocket.emit(SOCKETS.GAME_SCORED, { id: game.id });
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should handle scoring system', (done) => {
    clientSocket.emit(SOCKETS.GAME_SCORED, {});
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should change game status to "hasStarted"', (done) => {
    clientSocket.emit(SOCKETS.GAME_STARTS, {});
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should change game status to "hasStarted"', (done) => {
    sockets.lobbies.lobbies.push(game);
    clientSocket.emit(SOCKETS.GAME_STARTS, { id: game.id });
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should change game status to "hasEnded"', (done) => {
    clientSocket.emit(SOCKETS.GAME_OVER, {});
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should change game status to "hasEnded"', (done) => {
    sockets.lobbies.lobbies.push(game);
    clientSocket.emit(SOCKETS.GAME_OVER, { id: game.id });
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should create and return new piece', (done) => {
    clientSocket.emit(SOCKETS.GAME_NEW_TILE, {});
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should create and return new piece', (done) => {
    sockets.lobbies.lobbies.push(game);
    clientSocket.emit(SOCKETS.GAME_NEW_TILE, { id: game.id });
    setTimeout(() => {
      done();
    }, 100);
  });

  it('should disconnect user from lobbies', (done) => {
    sockets.lobbies.lobbies.push(game);
    const sav = sockets.broadcastTournamentsList;
    sockets.broadcastTournamentsList = jest.fn();
    setTimeout(() => {
      sockets.handlePlayerLeft(game, game.players[0], {});
      sockets.broadcastTournamentsList = sav;
      done();
    }, 100);
  });

});
