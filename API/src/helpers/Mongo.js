import mongoose from 'mongoose';

import { DATABASE } from '../config/config';

const { sleep } = require('../utils');

class MongoDb {
  constructor() {
    this.db = mongoose.connection;
    if (process.env.NODE_ENV === 'development') {
      this.uri = `mongodb://${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`;
    } else {
      this.uri = `mongodb://${DATABASE.USER}:${DATABASE.PASS}@${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`;
    }
    this.db.on('connecting', () => { console.log(`Connecting to ${this.uri}`); });
    this.db.on('connected', () => { console.log(`Connected to ${this.uri}`); });
    this.db.once('open', () => { console.log('Connection opened'); });
    this.db.on('reconnected', () => { console.log(`Reconnected on ${this.uri}`); });
    this.db.on('error', (err) => {
      console.error(`Error in MongoDb connection: ${err}`);
      mongoose.disconnect();
    });
    this.db.on('disconnected', () => {
      console.log(`Disconnected from ${this.uri}`);
      sleep(5000);
      this.connection = mongoose.connect(this.uri, { useNewUrlParser: true });
    });
    this.connection = mongoose.connect(this.uri, { useNewUrlParser: true });
  }
}

export default MongoDb;
