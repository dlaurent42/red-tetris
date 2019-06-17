const { ROOM_ROLES } = require('../config/constants');

class Player {
  constructor(props) {
    this.socketId = props.socketId;
    this.username = props.username;
    this.score = 0;
    this.status = false;
    this.role = props.role || ROOM_ROLES.SPECTATOR;
  }

  update(data) {
    if (!data) return;
    this.username = data.username || this.username;
    this.score = data.score || this.score;
    this.status = data.status || this.status;
    this.role = data.role || this.role;
  }
}

module.exports = Player;
