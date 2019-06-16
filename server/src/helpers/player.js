const { ROOM_ROLES } = require('../config/constants');

class Player {
  constructor(props) {
    this.socketId = props.socketID;
    this.username = props.username;
    this.score = 0;
    this.status = false;
    this.role = props.status || ROOM_ROLES.SPECTATOR;
  }

  update(data) {
    this.username = data.username || this.username;
    this.score = data.score || this.score;
    this.status = data.status || this.status;
    this.role = data.role || this.role;
  }
}

module.exports = Player;
