const SERVER = {
  HOST: 'localhost',
  PORT: 8080,
};

const SOCKETS = {
  TOURNAMENTS: {
    LIST: 'tournamentsList',
  },
  // Room system
  ROOM: {
    INFOS: 'roomInfos',
    UPDATE: 'roomUpdate',
    JOIN: 'roomUserJoined',
    CREATE: 'roomCreation',
    USER_LEFT: 'roomUserLeft',
    FORBIDDEN: 'roomForbiddenAccess',
  },
  // Game logic related
  GAME: {
    BEGIN: 'startGame', // for lobby leader to start
    FINISH: 'gameOver',
    STARTS: 'gameStarts',
    NEXT_PIECE: 'gameNewTile',
    PLAYER_SCORE: 'gameScored',
  },
  // Player emit's
  PLAYER: {
    READY: 'playerReady',
  },
  // All notifications are emit'ed from server to client
  NOTIFICATIONS: {
    ROOM_CREATED: 'roomCreated',
    PLAYER_LEFT: 'playerLeftGame',
    FORBIDDEN: 'roomForbiddenAccess',
    PLAYER_ENTERED: 'playerEntersGame',
    // one constant is missing: friendConnection | no API server yet!
  },
};

const REGEX = {
  ROOM_NAME: /^[a-zA-Z0-9]{6,12}$/,
  ROOM_PWD: /^[a-zA-Z0-9]{6,12}$/,
};

export { SERVER, SOCKETS, REGEX };
