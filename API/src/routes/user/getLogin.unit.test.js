import 'babel-polyfill';
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import getLogin from './getLogin';

import User from '../../models/User.model';
import { hash, random } from '../../utils';
import { DATABASE } from '../../config/config';

const init = () => {
  const app = express();
  app.use('/', getLogin);
  return app;
};

describe('GET /user/login', () => {
  let user;
  const salt = random(255);
  const password = 'superStrongPassword123!@#';

  beforeAll(() => {
    mongoose.connect(`mongodb://${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}_mock`, DATABASE.OPTIONS);
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

  test('trying to log in with empty field', async () => {
    const app = init();
    const res = await request(app)
      .get('/login')
      .query({ email: '', password: '' });
    expect(res.body.success).toBe(false);
  });

  test('trying to log in with invalid field', async () => {
    const app = init();
    const res = await request(app)
      .get('/login')
      .query({ email: 'bademail.com', password: 'badpass' });
    expect(res.body.success).toBe(false);
  });

  test('trying to log in with correct credentials', async () => {
    const app = init();
    const res = await request(app)
      .get('/login')
      .query({ email: user.email, password });
    expect(res.body.success).toBe(true);
  });

  test('trying to log in with invalid credentials', async () => {
    const app = init();
    const res = await request(app)
      .get('/login')
      .query({ email: 'bad@credentials.com', password: 'Crediantials!23' });
    expect(res.body.success).toBe(false);
  });

});
