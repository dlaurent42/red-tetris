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
    trim: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  createdAt: Date,
  updatedAt: Date,
});

userSchema.pre('update', function () {
  this.updatedAt = Date.now();
});

userSchema.pre('save', function (next) {
  if (!this.createdAt) this.createdAt = Date.now();
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('User', userSchema);
