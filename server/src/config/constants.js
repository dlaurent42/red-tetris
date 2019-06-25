const SERVER = {
  HOST: 'localhost',
  PORT: 8080,
};

const SOCKETS = {

  /* ----------------   Tournaments   --------------- */
  TOURNAMENTS_LIST: 'tournamentsList',
  TOURNAMENTS_UPDATE: 'tournamentsUpdate',

  /* -------------------   Room   ------------------- */
  ROOM_INFOS: 'roomInfos',
  ROOM_UPDATE: 'roomUpdate',
  ROOM_CREATION: 'roomCreation',
  ROOM_USER_UPDATE: 'roomUserUpdate',
  ROOM_USER_JOINED: 'roomUserJoined',
  ROOM_USER_LEFT: 'roomUserLeft',
  ROOM_FORBIDDEN_ACCESS: 'roomForbiddenAccess',

  /* -------------------   Game   ------------------- */
  GAME_SPECTER_UPDATE: 'gameSpecterUpdate',
  GAME_STARTS: 'gameStarts',
  GAME_OVER: 'gameOver',
  GAME_SCORED: 'gameScored',
  GAME_NEW_TILE: 'gameNewTile',

  /* ---------------   Notifications   -------------- */
  NOTIFY_ROOM_CREATED: 'roomCreated',
  NOTIFY_ROOM_NOT_CREATED: 'roomNotCreated',
  NOTIFY_PLAYER_LEFT_GAME: 'playerLeftGame',
  NOTIFY_PLAYER_ENTERS_GAME: 'playerEntersGame',
  NOTIFY_ROOM_FORBIDDEN_ACCESS: 'roomForbiddenAccess',
};

const ROOM_ROLES = {
  CREATOR: 'creator',
  PLAYER: 'player',
  SPECTATOR: 'spectator',
};

const GAME_MODES = [
  'classic',
  'hard',
  'invisible',
];

const GAME_SETTINGS = {
  GRID_WIDTH: 10,
  GRID_HEIGHT: 20,
};

const COLORS = [
  'red',
  'blue',
  'green',
  'yellow',
];

const PIECES = [
  {
    // Cube
    positions: [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    innerPositions: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    size: 2,
    type: 'Cube',
    // Pipe
  }, {
    positions: [
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
    ],
    innerPositions: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
    size: 4,
    type: 'Pipe',
    // Reversed L
  }, {
    positions: [
      { x: 5, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    innerPositions: [
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    size: 3,
    type: 'Reversed L',
  // L
  }, {
    positions: [
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    innerPositions: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    size: 3,
    type: 'L',
  // S
  }, {
    positions: [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
    ],
    innerPositions: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    size: 3,
    type: 'S',
  // T
  }, {
    positions: [
      { x: 5, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
    ],
    innerPositions: [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    size: 3,
    type: 'T',
  // Z
  }, {
    positions: [
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    innerPositions: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    size: 3,
    type: 'Z',
  },
];

module.exports = {
  SERVER,
  SOCKETS,
  COLORS,
  PIECES,
  ROOM_ROLES,
  GAME_MODES,
  GAME_SETTINGS,
};
