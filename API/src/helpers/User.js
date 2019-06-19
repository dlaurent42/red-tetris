import User from '../models/User.model';

import {
  isEmpty,
  random,
  hash,
} from '../utils';
import { ERRORS } from '../config/constants';

class UserHelper {
  static addNewUser(user) {
    return new Promise((resolve, reject) => {
      // Check for unique email and username
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
          console.log(`Unexpected eror: ${err.message}`);
          reject(new Error(ERRORS.DB_FAIL));
        });
    });
  }
}

export default UserHelper;
