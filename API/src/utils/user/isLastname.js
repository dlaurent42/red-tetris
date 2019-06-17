const validator = require('validator')
const isEmpty = require('../../utils/obj/isEmpty')
const { BOUNDARY_VALUES } = require('../../config/constants')

const isLastname = (lastname) => {
  if (isEmpty(lastname)) return false
  if (!validator.isLength(lastname, {
    min: BOUNDARY_VALUES.NAME_MIN_LEN,
    max: BOUNDARY_VALUES.NAME_MAX_LEN,
  })) return false
  if (/^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/.exec(lastname) === null) return false
  return true
}

module.exports = isLastname
