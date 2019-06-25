import 'babel-polyfill';
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import getLeaderboard from './get';

import { DATABASE } from '../../config/config';

// Setting into development mode for easy DATABASE access
process.env.NODE_ENV = 'development';

const init = () => {
  const app = express();
  app.use('/leaderboard', getLeaderboard);
  return app;
};

describe('GET /leaderboard', () => {

  beforeAll(() => {
    mongoose.connect(`mongodb://${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}_mock`, DATABASE.OPTIONS);
  });
  afterAll((done) => {
    mongoose.disconnect(done);
  });

  test('fetching API in regular way', async () => {
    const app = init();
    const res = await request(app).get('/leaderboard');
    expect(res.body.success).toBe(true);
  });

  test('fetching API w/o database', () => {
    mongoose.disconnect();
    const app = init();
    request(app)
      .get('/leaderboard')
      .end((err, res) => {
        expect(res.body.success).toBe(false);
      });
  });

});
