export const ACTIONS = {
  USER_LOGIN: 'USER_LOGIN',
  USER_REGISTER: 'USER_REGISTER',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_CHANGE_AVATAR: 'USER_CHANGE_AVATAR',
  USER_CHANGE_USERNAME: 'USER_CHANGE_USERNAME',
  USER_CHANGE_PASSWORD: 'USER_CHANGE_PASSWORD',
  USER_CHANGE_EMAIL: 'USER_CHANGE_EMAIL',
  USER_UPDATE_STATS: 'USER_UPDATE_STATS',
};

export const DEFAULT = {
  AVATAR: 'man.png',
  USERNAME: 'unknown-user',
};

export const CONFIG = {
  SERVER: {
    URL: 'http://localhost',
    PORT: '8080',
  },
};

export const REGEX = {
  USERNAME: /^[a-zA-Z0-9]{6,}$/,
  EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, //eslint-disable-line
  PASSWORD: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  ROOM_NAME: /^[a-zA-Z0-9]{6,12}$/,
  ROOM_PWD: /^[a-zA-Z0-9]{6,12}$/,
};

export const AVATARS = [
  'businessman.png',
  'businesswoman.png',
  'man-1.png',
  'man-10.png',
  'man-11.png',
  'man-12.png',
  'man-13.png',
  'man-14.png',
  'man-15.png',
  'man-16.png',
  'man-17.png',
  'man-18.png',
  'man-19.png',
  'man-2.png',
  'man-20.png',
  'man-21.png',
  'man-22.png',
  'man-23.png',
  'man-24.png',
  'man-25.png',
  'man-26.png',
  'man-27.png',
  'man-28.png',
  'man-29.png',
  'man-3.png',
  'man-30.png',
  'man-31.png',
  'man-32.png',
  'man-33.png',
  'man-34.png',
  'man-4.png',
  'man-5.png',
  'man-6.png',
  'man-7.png',
  'man-8.png',
  'man-9.png',
  'man.png',
  'woman-1.png',
  'woman-10.png',
  'woman-11.png',
  'woman-12.png',
  'woman-2.png',
  'woman-3.png',
  'woman-4.png',
  'woman-5.png',
  'woman-6.png',
  'woman-7.png',
  'woman-8.png',
  'woman-9.png',
  'woman.png',
];

export const ICONS = {
  TROPHY: 'trophy',
  MEDAL: 'medal',
  AWARD: 'award',
  LOCK: 'lock',
  EYE: 'eye',
  EYE_SLASH: 'eye-slash',
  SEARCH: 'search',
};

export const GAME_MODES = [
  'classic',
  'survival',
  'invisible',
];

export const NOTIFICATIONS = {
  FRIEND_CONNECTION: {
    variant: 'success',
    autoHideDuration: 2000,
  },
  PLAYER_ENTERS: {
    variant: 'success',
    autoHideDuration: 2000,
  },
  PLAYER_LEFT: {
    variant: 'warning',
    autoHideDuration: 3000,
  },
  ROOM_CREATED: {
    variant: 'success',
    autoHideDuration: 2000,
  },
  FORBIDDEN_ACCESS: {
    variant: 'error',
    autoHideDuration: 2000,
  },
};

export const SOCKETS = {

  /* ----------------   Tournaments   --------------- */
  TOURNAMENTS_LIST: 'tournamentsList',
  // Value :   tournamentsList
  // Type  :   emit with fallback function
  // Send  :   {}
  // Data  : {
  //  tournaments: [
  //    {roomId, roomName, nbPlayers, maxPlayers, roomHasPassword, roomPassword, roomMode},
  //    {roomId, roomName, nbPlayers, maxPlayers, roomHasPassword, roomPassword, roomMode},
  //  ]}
  TOURNAMENTS_UPDATE: 'tournamentsUpdate',
  // Value :   tournamentsUpdate
  // Type  :   on
  // Data  :   see above

  /* -------------------   Room   ------------------- */
  ROOM_INFOS: 'roomInfos',
  // Value :   roomInfos
  // Type  :   emit
  /* Data  :   {
    roomId,
    roomName,
    roomMode,
    roomPassword,
    roomHasPassword,
    username of current user,
    userRole of current user,
    users: [ { username, score, status(ready, not ready), role }] corresponds to other users
  } */
  ROOM_UPDATE: 'roomUpdate',
  // Value :   roomUpdate
  // Type  :   on
  // Data  :   data sent by roomInfos
  ROOM_CREATION: 'roomCreation',
  // Value :   roomCreation
  // Type  :   emit
  // Data  :   data sent by roomInfos with users = empty array
  ROOM_NEW_USER: 'roomNewUser',
  // Value :   roomNewUser
  // Type  :   emit
  // Data  :   data sent by roomInfos
  ROOM_FORBIDDEN_ACCESS: 'roomForbiddenAccess',
  // Value :   roomForbiddenAccess
  // -----------------------
  // Type  :   emit
  // Data  :   data sent by roomInfos
  NOTIFY_ROOM_FORBIDDEN_ACCESS: 'roomForbiddenAccess',
  // -----------------------
  // Type  :   on
  // Data  :   data sent by roomInfos
  // Whhhhhaaaat ? I send you an emit, then I redirect user and you send me emit (for notifications)

  /* -------------------   Game   ------------------- */
  GAME_SPECTER_UPDATE: 'gameSpecterUpdate',
  // Value :   gameSpecterUpdate
  // Type  :   emit + on
  // Data  :   { roomId, specter }
  GAME_STARTS: 'gameStarts',
  // Value :   gameStarts
  // Type  :   on
  // Data  :   { tiles (x3): [{ positions: [], innerPositions: [] }, {}, {}] }
  GAME_OVER: 'gameOver',
  // Value :   gameOver
  // Type  :   emit + on
  // Data  :   { roomId }
  GAME_SCORED: 'gameScored',
  // Value :   gameScored
  // Type  :   emit + on
  // Data  :   { roomId, score = number of rows scored }
  GAME_NEW_TILE: 'gameNewTile',
  // Value :   gameNewTile
  // Type  :   emit with fallback function
  // Data s:   { roomId }
  // Data r:   { tile: { positions: [], innerPositions: [] } }

  /* ---------------   Notifications   -------------- */
  NOTIFY_ROOM_CREATED: 'roomCreated',
  // Value :   roomCreated
  // Type  :   on
  // Data  :   { roomName }
  NOTIFY_PLAYER_LEFT_GAME: 'playerLeftGame',
  // Value :   playerLeftGame
  // Type  :   on
  // Data  :   { username }
  NOTIFY_PLAYER_ENTERS_GAME: 'playerEntersGame',
  // Value :   playerEntersGame
  // Type  :   on
  // Data  :   { username }
  NOTIFY_FRIEND_CONNECTION: 'friendConnection',
  // Value :   friendConnection
  // Type  :   on
  // Data  :   { username }
};

export const ROOM_ROLES = {
  CREATOR: 'creator',
  PLAYER: 'player',
  SPECTATOR: 'spectator',
};

export const KEYS = {
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  SPACEBAR: 32,
};

export const GAME_SETTINGS = {
  GRID_WIDTH: 10,
  GRID_HEIGHT: 20,
  DELAY_BEFORE_STARTS: 3000,
  COLORS: [
    'red',
    'blue',
    'green',
    'yellow',
  ],
};
