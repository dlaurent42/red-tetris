const validator = require('validator')
const isEmpty = require('../obj/isEmpty')
const { BOUNDARY_VALUES } = require('../../config/constants')

const isEmail = (email) => {
  if (isEmpty(email)) return false
  if (!validator.isEmail(email)) return false
  if (!validator.isLength(email, { max: BOUNDARY_VALUES.EMAIL_MAX_LEN })) return false
  return true
}

module.exports = isEmail
