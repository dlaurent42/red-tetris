// Miscellaneous
const sleep = require('./miscellaneous/sleep')
const timeoutPromise = require('./miscellaneous/timeoutPromise')
const whatTimeIsIt = require('./miscellaneous/whatTimeIsIt')

// Obj
const isEmpty = require('./obj/isEmpty')
const dynamicSort = require('./obj/dynamicSort')

// String
const hash = require('./string/hash')
const template = require('./string/interpolation')
const random = require('./string/random')
const recursiveRegex = require('./string/recursiveRegex')

// User
// const userIsFirstname = require('./user/isFirstname')
// const userIsLastname = require('./user/isLastname')
const userIsPassword = require('./user/isPassword')
const userIsUsername = require('./user/isUsername')
const userIsEmail = require('./user/isEmail')

module.exports = {
  dynamicSort,
  hash,
  isEmpty,
  random,
  recursiveRegex,
  sleep,
  template,
  timeoutPromise,
  whatTimeIsIt,
  // userIsFirstname,
  // userIsLastname,
  userIsPassword,
  userIsUsername,
  userIsEmail,
}
