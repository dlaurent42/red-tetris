const SERVER = {
  HOST: 'localhost',
  PORT: 8080,
};

const SOCKETS = {
  newRoom: 'newRoom',
  getRoomList: 'getRoomList',
};

const REGEX = {
  ROOM_NAME: /^[a-zA-Z0-9]{6,12}$/,
  ROOM_PWD: /^[a-zA-Z0-9]{6,12}$/,
};

export { SERVER, SOCKETS, REGEX };
