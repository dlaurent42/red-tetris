const { countBy } = require('lodash');
const { GAME_MODES, ROOM_ROLES } = require('../config/constants');

const generateID = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

class Game {
  constructor(props) {
    this.id = props.roomId || generateID(64);
    this.name = (props.roomName && props.roomName.trim() !== '') ? props.roomName : 'no-named-lobby';
    this.maxPlayers = props.maxPlayers || 1;
    this.hasPassword = props.roomHasPassword || false;
    this.password = props.roomPassword || '';
    this.mode = props.roomMode || GAME_MODES[0];
    this.hasStarted = false;
    this.players = [];
  }

  toObject() {
    return {
      roomId: this.id,
      roomName: this.name,
      nbPlayers: countBy(this.players, { role: ROOM_ROLES.SPECTATOR }).false,
      maxPlayers: this.maxPlayers,
      roomHasPassword: this.hasPassword,
      roomPassword: this.password,
      roomMode: this.mode,
      gameHasStarted: this.hasStarted,
      users: this.players,
    };
  }

  update(data) {
    if (!data) return;
    this.id = data.roomId || this.id;
    this.name = data.roomName || this.name;
    this.maxPlayers = data.maxPlayers || this.maxPlayers;
    this.hasPassword = data.roomHasPassword || this.hasPassword;
    this.password = data.roomPassword || this.password;
    this.mode = data.roomMode || this.mode;
    this.hasStarted = data.gameHasStarted || this.hasStarted;
    this.players = data.users || this.players;
  }
}

module.exports = Game;
