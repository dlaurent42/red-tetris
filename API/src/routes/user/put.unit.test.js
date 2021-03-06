import 'babel-polyfill';
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import putUser from './put';

import User from '../../models/User.model';
import { hash, random } from '../../utils';
import { DATABASE } from '../../config/config';

const init = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use('/user', putUser);
  return app;
};

describe('PUT /user/:id', () => {
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

  test('trying to log in with invalid id', async () => {
    const id = '123';
    const app = init();
    const res = await request(app)
      .put(`/user/${id}`)
      .send({ user: {} });
    expect(res.body.success).toBe(false);
  });

  test('trying to log in with valid id but wrong fields', async () => {
    const app = init();
    const res = await request(app)
      .put(`/user/${user.id}`)
      .send({
        user: {
          username: 'crap',
          password: 'badpass',
        },
      });
    expect(res.body.success).toBe(false);
  });

  test('trying to log in with valid data', async () => {
    const app = init();
    const res = await request(app)
      .put(`/user/${user.id}`)
      .send({
        user: {
          username: 'TestUser1234',
          password: 'NewPassword!23',
        },
      });
    expect(res.body.success).toBe(true);
  });

  test('trying to log in with valid data (score add)', async () => {
    const app = init();
    const res = await request(app)
      .put(`/user/${user.id}`)
      .send({
        user: {
          scores: {
            score: 100,
            hasWon: true,
            mode: 'classic',
            maxPlayers: 1,
          },
        },
      });
    expect(res.body.success).toBe(true);
  });
});
