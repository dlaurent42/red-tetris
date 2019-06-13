// FileSystem
const getFileContent = require('./filesystem/getFileContent');

// Maths
const mean = require('./maths/mean');
const mathsMax = require('./maths/max');
const mathsMin = require('./maths/min');
const percentile = require('./maths/percentile');
const std = require('./maths/std');

// Obj
const isEmpty = require('./obj/isEmpty');
const dynamicSort = require('./obj/dynamicSort');

// String
const hasDigit = require('./string/hasDigit');
const hash = require('./string/hash');
const hasLowercase = require('./string/hasLowercase');
const hasSpecial = require('./string/hasSpecial');
const hasUppercase = require('./string/hasUppercase');
const template = require('./string/interpolation');
const isAlpha = require('./string/isAlpha');
const isAlphaNumeric = require('./string/isAlphaNumeric');
const isFloat = require('./string/isFloat');
const isNumeric = require('./string/isNumeric');
const random = require('./string/random');

export {
  getFileContent,
  mean,
  mathsMax,
  mathsMin,
  percentile,
  std,
  dynamicSort,
  hash,
  hasDigit,
  hasLowercase,
  hasUppercase,
  hasSpecial,
  isAlpha,
  isAlphaNumeric,
  isNumeric,
  isFloat,
  isEmpty,
  random,
  template,
};
