import cors from 'cors';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import Router from './helpers/Router';
import { SERVER } from './config/config';

class Server {
  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.http = http.Server(this.app);
    this.routes = new Router(this.app).setAllRoutes();
  }

  listen() {
    this.http.listen(SERVER.PORT, SERVER.HOST, () => {
      console.log(`Listening on http://${SERVER.HOST}:${SERVER.PORT}`);
    });
  }
}

new Server().listen();
