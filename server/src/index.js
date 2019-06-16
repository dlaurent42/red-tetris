const http = require('http');
const express = require('express');
const Sockets = require('./helpers/Sockets');
const { SERVER } = require('./config/constants');

class Server {
  constructor() {

    // Server variables
    this.app = express();
    this.http = http.Server(this.app);
    this.sockets = new Sockets(this.http).listenToEvents();

  }

  listen() {
    this.http.listen(SERVER.PORT, SERVER.HOST, () => {
      console.log(`Listening on http://${SERVER.HOST}:${SERVER.PORT}`);
    });
  }
}

new Server().listen();
