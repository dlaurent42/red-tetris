import User from '../models/User.model';

import {
  isEmpty,
  random,
  hash,
} from '../utils';
import { ERRORS } from '../config/constants';

class UserHelper {
  static toObject(user) {
    return { // Add more to return more on user.
      id: user.id,
      email: user.email,
      avatar: user.avatar,
      username: user.username,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    };
  }

  static addNewUser(user) {
    return new Promise((resolve, reject) => {
      /* With try catch that would be cleaner (ASK!) */
      User.find({ $or: [{ email: user.email }, { username: user.username }] })
        .then((doc) => {
          if (!isEmpty(doc)) throw new Error(ERRORS.UNIQUE_LOGIN);
          const newUser = new User(user);
          newUser.salt = random(255);
          newUser.password = hash(newUser.password, newUser.salt);
          newUser.save()
            .then(res => resolve(res))
            .catch(err => reject(err));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static login(user) {
    return new Promise((resolve, reject) => {
      User.findOne({ email: user.email })
        .then((doc) => {
          if (isEmpty(doc)) throw new Error(ERRORS.NO_USER);
          const tmpPwd = hash(user.password, doc.salt);
          if (tmpPwd !== doc.password) throw new Error(ERRORS.BAD_PASS);
          resolve(this.toObject(doc));
        })
        .catch((err) => {
          console.log(err);
          reject(new Error(ERRORS.NO_USER));
        });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      User.findById(id)
        .then((doc) => {
          if (isEmpty(doc)) throw new Error(ERRORS.NO_USER);
          resolve(this.toObject(doc));
        })
        .catch((err) => {
          console.log(err);
          reject(new Error(ERRORS.NO_USER));
        });
    });
  }
}

export default UserHelper;
