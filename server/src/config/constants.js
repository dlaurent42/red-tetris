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
  NOTIFY_ROOM_FORBIDDEN_ACCESS: 'roomForbiddenAccess',

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
  NOTIFY_FRIEND_CONNECTION: 'friendConnection',
};

const ROOM_ROLES = {
  CREATOR: 'creator',
  PLAYER: 'player',
  SPECTATOR: 'spectator',
};

const GAME_MODES = [
  'classic',
  'survival',
  'invisible',
];

const GAME_SETTINGS = {
  GRID_WIDTH: 10,
  GRID_HEIGHT: 20,
};

module.exports = {
  SERVER,
  SOCKETS,
  ROOM_ROLES,
  GAME_MODES,
  GAME_SETTINGS,
};
