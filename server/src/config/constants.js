const SERVER = {
  HOST: 'localhost',
  PORT: 8080,
};

const SOCKETS = {
  NEW_ROOM: 'newRoom',
  ROOM_LIST: 'getRoomList',
  GAME_START: 'startGame',
  NEXT_PIECE: 'getNextPiece',
  JOIN_ROOM: 'joinRoom',
};

const REGEX = {
  ROOM_NAME: /^[a-zA-Z0-9]{6,12}$/,
  ROOM_PWD: /^[a-zA-Z0-9]{6,12}$/,
};

export { SERVER, SOCKETS, REGEX };
