import { pick } from 'lodash';
import User from '../models/User.model';

import {
  hash,
  random,
  isEmpty,
  userIsUsername,
  userIsPassword,
} from '../utils';
import { ERRORS } from '../config/constants';

const FILTERS = ['id', 'username', 'avatar', 'email', 'scores'];

class UserHelper {
  constructor(userInformation) {
    this.id = userInformation.id;
    this.username = userInformation.username;
    this.password = userInformation.password;
    this.avatar = userInformation.avatar;
    this.email = userInformation.email;
    this.score = userInformation.score || {}; // implement
    // fill
  }

  addNewUser() {
    return new Promise((resolve, reject) => (
      User.find({ $or: [{ email: this.email }, { username: this.username }] })
        .then((doc) => {
          if (!isEmpty(doc)) throw new Error(ERRORS.UNIQUE_LOGIN);
          const user = new User(this);
          user.salt = random(255);
          user.password = hash(this.password, user.salt);
          return user.save();
        })
        .then(res => resolve(res))
        .catch(err => reject(err))
    ));
  }

  login() {
    return new Promise((resolve, reject) => {
      User.findOne({ email: this.email })
        .then((user) => {
          if (isEmpty(user)) throw new Error(ERRORS.NO_USER);
          if (hash(this.password, user.salt) !== user.password) throw new Error(ERRORS.BAD_PASS);
          return resolve(pick(user, FILTERS));
        })
        .catch(err => reject(err));
    });
  }

  getById() {
    return new Promise((resolve, reject) => {
      User.findById(this.id)
        .then(user => (
          (isEmpty(user)) ? reject(new Error(ERRORS.NO_USER)) : resolve(pick(user, FILTERS))
        ))
        .catch(err => reject(err));
    });
  }

  updateById(id) {
    return new Promise((resolve, reject) => {
      const validData = ({ username, password }) => {
        if ((username && !userIsUsername(username))
          || (password && !userIsPassword(password))) return false;
        // if (username) { // have to fix this
        //   User.find({ username })
        //     .then((user) => {
        //       if (user.length) return false;
        //       return true;
        //     });
        // }
        return true;
      };

      User.findById(id)
        .then((user) => {
          if (isEmpty(user)) throw new Error(ERRORS.NO_USER);
          const self = user; // idk why | eslint: no-param-reassign
          if (!validData(this)) throw new Error(ERRORS.DATA_VALIDATION);
          self.username = this.username || self.username;
          self.avatar = this.avatar || self.avatar;
          self.password = this.password ? hash(this.password, self.salt) : self.password;
          if (this.score) self.scores.push(this.score);
          self.save();
          return resolve(pick(self, FILTERS));
        })
        .catch(err => reject(err));
    });
  }

  deleteById(id) {
    return new Promise((resolve, reject) => {
      User.findById(id)
        .then((user) => {
          if (isEmpty(user)) throw new Error(ERRORS.NO_USER);
          if (!this.password) throw new Error(ERRORS.DATA_VALIDATION);
          if (user.password !== hash(this.password, user.salt)) throw new Error(ERRORS.BAD_PASS);
          return resolve(user.delete());
        })
        .catch(err => reject(err));
    });
  }
}

export default UserHelper;
