const validator = require('validator')
const isEmpty = require('../../utils/obj/isEmpty')
const { BOUNDARY_VALUES } = require('../../config/constants')

const isUsername = (username) => {
  if (isEmpty(username)) return false
  if (!validator.isLength(username, {
    min: BOUNDARY_VALUES.NAME_MIN_LEN,
    max: BOUNDARY_VALUES.NAME_MAX_LEN,
  })) return false
  if (!validator.isAlphanumeric(username)) return false
  return true
}

module.exports = isUsername
