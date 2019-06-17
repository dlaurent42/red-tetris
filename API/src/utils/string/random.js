const crypto = require('crypto')

const randomString = length => (
  crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
)

module.exports = randomString
