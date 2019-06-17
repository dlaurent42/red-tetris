const validator = require('validator')
const isEmpty = require('../../utils/obj/isEmpty')
const { BOUNDARY_VALUES } = require('../../config/constants')
const hasDigit = require('../string/hasDigit')
const hasSpecial = require('../string/hasSpecial')
const hasLowercase = require('../string/hasLowercase')
const hasUppercase = require('../string/hasUppercase')

const isPassword = (password, cpassword) => {
  if (isEmpty(password)) return false
  if (!validator.isLength(password, { min: BOUNDARY_VALUES.PASS_MIN_LEN })) return false
  if (!(hasDigit(password)
    && hasSpecial(password)
    && hasLowercase(password)
    && hasUppercase(password))) return false
  if (!isEmpty(cpassword) && cpassword !== password) return false
  return true
}

module.exports = isPassword
