import 'babel-polyfill';
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRecovery from './postRecoverPassword';

import User from '../../models/User.model';
import PasswordRecovery from '../../models/PasswordRecover.model';
import { hash, random } from '../../utils';
import { DATABASE } from '../../config/config';

const init = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use('/user', postRecovery);
  return app;
};

describe('POST /user/recover-password', () => {
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

  test('trying to recover password with empty input', async () => {
    const app = init();
    const res = await request(app)
      .post('/user/recover-password')
      .send({ user: {} });
    expect(res.body.success).toBe(false);
  });

  test('trying to recover password with invalid input', async () => {
    const app = init();
    const res = await request(app)
      .post('/user/recover-password')
      .send({
        user: {
          email: 'notgreatemail',
          redirectUrl: 'noturl',
        },
      });
    expect(res.body.success).toBe(false);
  });

  test('trying to recover password with valid input, but incorrect data', async () => {
    const app = init();
    const res = await request(app)
      .post('/user/recover-password')
      .send({
        user: {
          email: 'test@mail.com',
          redirectUrl: 'http://localhost:4000/user/recover-prassword',
        },
      });
    expect(res.body.success).toBe(false);
  });

  test('trying to recover password with valid input and data', async () => {
    const app = init();
    const res = await request(app)
      .post('/user/recover-password')
      .send({
        user: {
          email: user.email,
          redirectUrl: 'http://localhost:4000/user/recover-prassword',
        },
      });
    await PasswordRecovery.deleteOne({ userId: user.id });
    expect(res.body.success).toBe(true);
  });

});
