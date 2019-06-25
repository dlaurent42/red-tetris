import http from 'http';
import express from 'express';
import Sockets from './helpers/Sockets';
import { SERVER } from './config/constants';

class Server {
  constructor() {

    // Server variables
    this.app = express();
    this.http = http.Server(this.app);
    this.sockets = new Sockets(this.http).listenToEvents();

  }

  listen() {
    this.http.listen(SERVER.PORT, SERVER.HOST, () => {
      process.stdout.write(`Listening on http://${SERVER.HOST}:${SERVER.PORT}\n`);
    });
  }
}

new Server().listen();
