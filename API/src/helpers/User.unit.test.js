import 'babel-polyfill';
import mongoose from 'mongoose';

import User from '../models/User.model';
import UserHelper from './User';
import { DATABASE } from '../config/config';

import { random, hash } from '../utils';

describe('Testing User helper', () => {
  let userDb;
  const salt = random(255);
  const password = 'superStrongPassword123!@#';

  beforeAll(() => {
    mongoose.connect(`mongodb://${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`);
  });
  beforeEach(async () => {
    userDb = new User({
      username: 'TestUser123',
      email: 'testuser123@redtetris.com',
      salt,
      password: hash(password, salt),
      avatar: 'man.png',
    });
    await userDb.save();
  });
  afterEach(async () => {
    await userDb.delete();
  });
  afterAll((done) => {
    mongoose.disconnect(done);
  });

  test('Testing login with correct data', async () => {
    const user = new UserHelper(userDb);
    let status = false;

    try {
      user.password = password;
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(true);
  });

  test('Testing login with incorrect data', async () => {
    const user = new UserHelper(userDb);
    let status = false;

    try {
      user.password = 'notgood';
      await user.login();
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(false);
  });

  test('Testing getById with correct data', async () => {
    const user = new UserHelper(userDb);
    let status = false;

    try {
      await user.getById();
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(true);
  });

  test('Testing getById with incorrect data', async () => {
    const user = new UserHelper(userDb);
    let status = false;

    try {
      user.id = mongoose.Types.ObjectId();
      await user.getById();
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(false);
  });

  test('Testing updateByIdScore with correct data', async () => {
    const user = new UserHelper(userDb);
    let status = false;

    try {
      user.score = {
        score: 10,
        hasWon: true,
        mode: 'classic',
        maxPlayers: 1,
      };
      await user.updateByIdScore();
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(true);
  });

  test('Testing updateByIdScore with incorrect id', async () => {
    const user = new UserHelper(userDb);
    let status = false;

    try {
      user.id = mongoose.Types.ObjectId();
      user.score = {
        score: 10,
        hasWon: true,
        mode: 'classic',
        maxPlayers: 1,
      };
      await user.updateByIdScore();
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(false);
  });

  test('Testing updateByIdInformations with duplicate username and empty userID', async () => {
    const user = new UserHelper(userDb);
    user.id = '45613126544';
    let status = false;
    const dummyData = new User({
      username: 'SameUsernameIsNotAllowed1',
      email: 'testuser987@redtetriss.com',
      salt,
      password: hash(password, salt),
      avatar: 'man.png',
    });
    await dummyData.save();
    try {
      user.username = dummyData.username;
      await user.updateByIdInformations();
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(false);
    await dummyData.delete();
  });

  test('Testing updateByIdInformations with bad userID', async () => {
    const user = new UserHelper(userDb);
    let status = false;
    try {
      user.id = mongoose.Types.ObjectId();
      await user.updateByIdInformations();
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(false);
  });

  test('Testing updateByIdInformations with duplicate username', async () => {
    const user = new UserHelper(userDb);
    let status = false;
    const dummyData = new User({
      username: 'SameUsernameIsNotAllowed1',
      email: 'testuser987@redtetriss.com',
      salt,
      password: hash(password, salt),
      avatar: 'man.png',
    });
    await dummyData.save();
    try {
      user.username = dummyData.username;
      await user.updateByIdInformations();
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(false);
    await dummyData.delete();
  });

  test('Testing updateById with correct data - scores', async () => {
    const user = new UserHelper(userDb);
    let status = false;

    try {
      user.score = {
        score: 10,
        hasWon: true,
        mode: 'classic',
        maxPlayers: 1,
      };
      await user.updateById();
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(true);
  });

  test('Testing updateById with correct data - userdata', async () => {
    const user = new UserHelper(userDb);
    let status = false;

    try {
      user.avatar = 'newavatar.png';
      await user.updateById();
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(true);
  });

  test('Testing updateById with correct data - having empty score', async () => {
    const user = new UserHelper(userDb);
    let status = false;

    try {
      user.avatar = 'newavatar.png';
      user.score = {};
      await user.updateById();
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(true);
  });

  test('Testing deleteById with incorrect data - having bad userId', async () => {
    const user = new UserHelper(userDb);
    let status = false;

    try {
      user.id = mongoose.Types.ObjectId();
      await user.deleteById();
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(false);
  });

  test('Testing deleteById with incorrect data - empty password', async () => {
    const user = new UserHelper(userDb);
    let status = false;

    try {
      user.password = undefined;
      await user.deleteById();
      status = true;
    } catch (err) {
      status = false;
    }
    expect(status).toBe(false);
  });

});
