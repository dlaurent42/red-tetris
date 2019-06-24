import 'babel-polyfill';
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import getRecover from './getRecoverPassword';

import User from '../../models/User.model';
import PasswordRecovery from '../../models/PasswordRecover.model';
import { hash, random } from '../../utils';
import { DATABASE } from '../../config/config';

const init = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use('/user', getRecover);
  return app;
};

describe('GET /user/recover-password', () => {
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

  test('trying to recover password with empty fields', async () => {
    const app = init();
    const res = await request(app)
      .get('/user/recover-password')
      .query({});
    expect(res.body.success).toBe(false);
  });

  test('trying to recover password with invalid token', async () => {
    const app = init();
    const res = await request(app)
      .get('/user/recover-password')
      .query({ token: 'notvalidtoken' });
    expect(res.body.success).toBe(false);
  });

  test('trying to recover password with valid token', async () => {
    const app = init();
    const token = await PasswordRecovery.create({
      token: random(255),
      redirectUrl: 'doesnt matter',
      userId: user.id,
    });
    const res = await request(app)
      .get('/user/recover-password')
      .query({ token: token.token });
    await PasswordRecovery.deleteOne({ userId: user.id });
    expect(res.body.success).toBe(true);
  });

});
