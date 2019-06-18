const { ROOM_ROLES } = require('../config/constants');

class Player {
  constructor(props) {
    this.socketId = props.socketId;
    this.username = props.username;
    this.score = 0;
    this.blockedRows = 0;
    this.isReady = false;
    this.specter = {};
    this.role = props.role || ROOM_ROLES.SPECTATOR;
    this.tilesStack = [];
  }

  update(data) {
    if (!data) return;
    this.username = data.username || this.username;
    this.score = data.score || this.score;
    this.blockedRows = data.blockedRows || this.blockedRows;
    this.isReady = data.isReady || this.isReady;
    this.role = data.role || this.role;
    this.specter = data.specter || this.specter;
    this.tilesStack = data.tilesStack || this.tilesStack;
  }
}

module.exports = Player;
