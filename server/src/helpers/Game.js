const { countBy } = require('lodash');
const { GAME_MODES, ROOM_ROLES } = require('../config/constants');

const generateID = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  console.log(`New random ID generated: ${result}`);
  return result;
};

class Game {
  constructor(props) {
    this.id = props.id || generateID(64);
    this.name = props.name;
    this.maxPlayers = props.maxPlayers || 1;
    this.hasPassword = props.hasPassword || false;
    this.password = props.password || '';
    this.mode = props.mode || GAME_MODES[0];
    this.hasStarted = false;
    this.hasEnded = false;
    this.players = [];
    this.scores = [];
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      nbPlayers: countBy(this.players, { role: ROOM_ROLES.SPECTATOR }).false || 0,
      maxPlayers: this.maxPlayers,
      hasPassword: this.hasPassword,
      password: this.password,
      mode: this.mode,
      hasStarted: this.hasStarted,
      hasEnded: this.hasEnded,
      players: this.players,
      scores: this.scores,
    };
  }

  update(data) {
    if (!data) return;
    this.id = data.id || this.id;
    this.name = data.name || this.name;
    this.maxPlayers = data.maxPlayers || this.maxPlayers;
    this.hasPassword = data.hasPassword || this.hasPassword;
    this.password = data.password || this.password;
    this.mode = data.mode || this.mode;
    this.hasStarted = data.hasStarted || this.hasStarted;
    this.hasEnded = data.hasEnded || this.hasEnded;
    this.players = data.players || this.players;
    this.scores = data.scores || this.scores;
  }
}

module.exports = Game;
