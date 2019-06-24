import 'babel-polyfill';
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import deleteUser from './delete';

import User from '../../models/User.model';
import { hash, random } from '../../utils';
import { DATABASE } from '../../config/config';

const init = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use('/user', deleteUser);
  return app;
};

describe('DELETE /user/:id', () => {
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

  test('trying to delete with invalid id', async () => {
    const id = '123';
    const app = init();
    const res = await request(app)
      .delete(`/user/${id}`)
      .send({ });
    expect(res.body.success).toBe(false);
  });

  test('trying to delete with invalid password', async () => {
    const app = init();
    const res = await request(app)
      .delete(`/user/${user.id}`)
      .send({
        password: 'notvalidatall',
      });
    expect(res.body.success).toBe(false);
  });

  test('trying to delete with valid data', async () => {
    const app = init();
    const res = await request(app)
      .delete(`/user/${user.id}`)
      .send({ password });
    expect(res.body.success).toBe(true);
  });

});
