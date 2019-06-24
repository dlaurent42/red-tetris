import 'babel-polyfill';
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postSignup from './postSignup';

import User from '../../models/User.model';
import { hash, random } from '../../utils';
import { DATABASE } from '../../config/config';

const init = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use('/user', postSignup);
  return app;
};

describe('POST /user/signup', () => {
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

  test('trying to log in with empty fields', async () => {
    const app = init();
    const res = await request(app)
      .post('/user/signup')
      .send({ user: {} });
    expect(res.body.success).toBe(false);
  });

  test('trying to log in with non empty invalid field', async () => {
    const app = init();
    const res = await request(app)
      .post('/user/signup')
      .send({ user: { garbage: 'garbage' } });
    expect(res.body.success).toBe(false);
  });

  test('trying to log in with valid fields but existing user', async () => {
    const app = init();
    const res = await request(app)
      .post('/user/signup')
      .send({
        user: {
          username: 'TestUser123',
          email: 'testuser123@redtetris.com',
          password,
          avatar: 'man.png',
        },
      });
    expect(res.body.success).toBe(false);
  });

  test('trying to log in with valid fields', async () => {
    const app = init();
    const res = await request(app)
      .post('/user/signup')
      .send({
        user: {
          username: 'TestUser1234',
          email: 'testuser1234@redtetris.com',
          password,
          avatar: 'man.png',
        },
      });
    expect(res.body.success).toBe(true);
    await User.deleteOne({ username: res.body.user.username });
  });

});
