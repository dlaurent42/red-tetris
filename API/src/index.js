import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import { SERVER } from './config/config';

class Server {
  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.http = http.Server(this.app);
  }

  listen() {
    this.http.listen(SERVER.PORT, SERVER.HOST, () => {
      console.log(`Listening on http://${SERVER.HOST}:${SERVER.PORT}`);
    });
  }
}

new Server().listen();
