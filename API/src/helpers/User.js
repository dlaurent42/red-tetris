import { pick, find } from 'lodash';
import User from '../models/User.model';
import Mail from './Mail';

import {
  hash,
  random,
  isEmpty,
} from '../utils';
import { TOKENS, ERRORS } from '../config/constants';

const FILTERS = ['id', 'username', 'avatar', 'email', 'scores'];

class UserHelper {
  constructor(userInformation) {
    this.id = userInformation.id;
    this.username = userInformation.username;
    this.password = userInformation.password;
    this.avatar = userInformation.avatar;
    this.email = userInformation.email;

    // Used in case of score update
    this.score = userInformation.score || {};

    // Used in password recovery
    this.token = userInformation.token || '';
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

  updateByIdScore() {
    return new Promise((resolve, reject) => (
      User.findOneAndUpdate(this.id, { $push: { scores: this.score } })
        .then((user) => {
          if (isEmpty(user)) throw new Error(ERRORS.UPDATE_FAILED);
          return resolve(pick(user, FILTERS));
        })
        .catch(err => reject(err))
    ));
  }

  updateByIdInformations() {
    return new Promise((resolve, reject) => (
      User.findById(this.id)
        .then(async user => ({
          user,
          userWithUsername: await User.findOne({ username: this.username }),
        }))
        .then(({ user, userWithUsername }) => {
          if (isEmpty(user)) throw new Error(ERRORS.NO_USER);
          if (this.username !== user.username && !isEmpty(userWithUsername)) {
            throw new Error(ERRORS.UNIQUE_USERNAME);
          }
          return User.findOneAndUpdate(this.id, {
            username: this.username || user.username,
            avatar: this.avatar || user.avatar,
            password: this.password ? hash(this.password, user.salt) : user.password,
          });
        })
        .then((user) => {
          if (isEmpty(user)) throw new Error(ERRORS.UPDATE_FAILED);
          return resolve(pick(user, FILTERS));
        })
        .catch(err => reject(err))
    ));
  }

  updateById() {
    return (!isEmpty(this.score))
      ? this.updateByIdScore()
      : this.updateByIdInformations();
  }

  deleteById() {
    return new Promise((resolve, reject) => {
      User.findById(this.id)
        .then((user) => {
          if (isEmpty(user)) throw new Error(ERRORS.NO_USER);
          if (!this.password) throw new Error(ERRORS.DATA_VALIDATION);
          if (user.password !== hash(this.password, user.salt)) throw new Error(ERRORS.BAD_PASS);
          return resolve(user.delete());
        })
        .catch(err => reject(err));
    });
  }

  recoverPasswordByEmail() {
    const recoverPasswordTokens = {
      token: random(127),
      expires: Date.now() + TOKENS.PASSWORD_EXPIRE,
    };

    return new Promise((resolve, reject) => {
      User.findOneAndUpdate({ email: this.email }, { $push: { recoverPasswordTokens } })
        .then((user) => {
          if (isEmpty(user)) throw new Error(ERRORS.NO_USER);
          // new Mail().recoveryToken(this.email, recoverPasswordTokens.token);
          console.log('Do not forget recovery token MAIL', this.email, recoverPasswordTokens.token);
          return resolve({ message: `Recovery token was sent to ${this.email}` });
        })
        .catch(err => reject(err));
    });
  }

  recoverPasswordByToken() {
    return new Promise((resolve, reject) => {
      User.findOne({ 'recoverPasswordTokens.token': this.token })
        .then((user) => {
          if (isEmpty(user)) throw new Error(ERRORS.NO_USER);
          // If token is valid
          const token = find(user.recoverPasswordTokens, { token: this.token });
          if (Date.now() > token.expires) throw new Error(ERRORS.TOKEN_EXPIRED);
          return resolve({ id: user.id });
        })
        .catch(err => reject(err));
    });
  }
}

export default UserHelper;
