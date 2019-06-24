import 'babel-polyfill';
import mongoose from 'mongoose';

import User from '../models/User.model';
import getLeaderboard from './Leaderboard';
import { DATABASE } from '../config/config';

import { random, hash } from '../utils';

describe('Testing Leaderboard helper', () => {
  const salt = random(255);
  const password = 'superStrongPassword123!@#';

  beforeAll(() => {
    mongoose.connect(`mongodb://${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`);
  });
  afterAll((done) => {
    mongoose.disconnect(done);
  });

  test('Testing with some users', async () => {
    // let's create user to have a some leaderboard
    const userDb = new User({
      username: 'TestUser123',
      email: 'testuser123@redtetris.com',
      salt,
      password: hash(password, salt),
      avatar: 'man.png',
    });
    await userDb.save();
    // leaderboard
    let res;
    try {
      res = await getLeaderboard();
    } catch (err) {
      // no need to put anything here
    }
    // clean garbage
    await userDb.delete();
    expect(res.scoring.length).toBe(1);
  });

  test('Testing with no users', async () => {
    let res;
    try {
      res = await getLeaderboard();
    } catch (err) {
      // no need to put anything here
    }
    expect(res.scoring.length).toBe(0);
  });

});
