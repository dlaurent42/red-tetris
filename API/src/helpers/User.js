import mongoose from 'mongoose';
import validator from 'validator';

import { random, hash } from '../utils';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    validate: value => validator.isAscii(value),
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: value => validator.isEmail(value),
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  salt: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', (next) => {
  // this.salt = random(255);
  console.log(this.salt);
  // this.password = hash(password, salt);
  console.log(`Hashed password: ${this.password}`);
  next();
});

export default mongoose.model('User', userSchema);
