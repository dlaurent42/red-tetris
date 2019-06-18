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

userSchema.pre('save', function fun(next) {
  this.salt = random(255);
  this.password = hash(this.password, this.salt);
  console.log(`Hashed password: ${this.password}`);

  // Check if email is unique (don't like this method | ask for better one)
  mongoose.model('User', userSchema).find({ email: this.email }, (err, docs) => {
    if (!docs.length) next();
    else next(new Error('User with this email already exists'));
  });
});

export default mongoose.model('User', userSchema);
