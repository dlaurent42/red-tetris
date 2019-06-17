const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    validate: value => validator.isAscii(value),
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  profilePic: {
    type: String,
    required: true,
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
  recoverPassword: [{
    token: {
      type: String,
      trim: true,
    },
    expiration: {
      type: Date,
    },
  }],
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: value => validator.isEmail(value),
  },
  emailConfirmation: [{
    token: {
      type: String,
      trim: true,
    },
    expiration: {
      type: Date,
    },
  }],
  emailConfirmed: {
    type: Boolean,
    default: false,
  },
  oauthOrigin: {
    type: String,
  },
  language: {
    type: String,
    default: 'ENGLISH',
    enum: ['ENGLISH', 'FRENCH', 'SPANISH', 'GERMAN'],
  },
})

userSchema.pre('save', (next) => {
  const now = Date.now()
  this.updatedAt = now
  if (!this.createdAt) this.createdAt = now
  next()
})

module.exports = mongoose.model('User', userSchema)
