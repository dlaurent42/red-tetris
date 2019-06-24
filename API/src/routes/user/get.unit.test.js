import 'babel-polyfill';
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import getUserById from './get';

import User from '../../models/User.model';
import { hash, random } from '../../utils';
import { DATABASE } from '../../config/config';

// Setting into development mode for easy DATABASE access
process.env.NODE_ENV = 'development';

const init = () => {
  const app = express();
  app.use('/user', getUserById);
  return app;
};

describe('GET /user/:id', () => {
  let user;
  const salt = random(255);
  const password = 'superStrongPassword123!@#';

  beforeAll(() => {
    mongoose.connect(`mongodb://${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`);
  });
  beforeEach(() => {
    user = new User({
      username: 'TestUser123',
      email: 'testuser123@redtetris.com',
      salt,
      password: hash(password, salt),
      avatar: 'man.png',
    });
    return user.save();
  });
  afterEach(() => user.delete());
  afterAll((done) => {
    mongoose.disconnect(done);
  });

  test('fetching user with bad ID', async () => {
    const app = init();
    const res = await request(app).get('/user/123');
    expect(res.body.success).toBe(false);
  });

  test('fetching user with valid ID', async () => {
    const app = init();
    const res = await request(app).get(`/user/${user.id}`);
    expect(res.body.success).toBe(true);
  });

});
