const SERVER = {
  HOST: 'localhost',
  PORT: 8080,
};

const SOCKETS = {
  NEW_ROOM: 'newRoom',
  ROOM_LIST: 'getRoomList',
  GAME_START: 'startGame',
  GAME_BEGIN: 'gameHasStarted',
  JOIN_ROOM: 'joinRoom',
  ROOM_INFO: 'getRoomInfo',
  APPLY_PENALTY: 'applyPenalty',
  PLAYER_READY: 'playerReady',
  // Game logic related
  GAME: {
    FINISH: 'gameOver',
    NEXT_PIECE: 'gameNewTile',
    PLAYER_SCORE: 'gameScored',
  },
  // All notifications are emit'ed from server to client
  NOTIFICATIONS: {
    ROOM_CREATED: 'roomCreated',
    PLAYER_ENTERED: 'playerEntersGame',
    PLAYER_LEFT: 'playerLeftGame',
    // one constant is missing: friendConnection | no API server yet!
  },
};

const REGEX = {
  ROOM_NAME: /^[a-zA-Z0-9]{6,12}$/,
  ROOM_PWD: /^[a-zA-Z0-9]{6,12}$/,
};

export { SERVER, SOCKETS, REGEX };
