import mongoose from 'mongoose';
import validator from 'validator';

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
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default mongoose.model('User', userSchema);
