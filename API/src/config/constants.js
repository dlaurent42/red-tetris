// push here any constant string or number

const BOUNDARY_VALUES = {
  AGE_MIN: 18,
  AGE_MAX: 99,
  POPULARITY_MIN: 0,
  POPULARITY_MAX: 5000,
  EMAIL_MAX_LEN: 255,
  NAME_MIN_LEN: 5,
  NAME_MAX_LEN: 25,
  PASS_MIN_LEN: 8,
  LEADERBOARD_LEN: 5,
};

const ERRORS = {
  DATA_VALIDATION: 'Input are not valid',
  DATA_MISSING: 'Form is missing some data',
  UNIQUE_LOGIN: 'User with this email or username already exists',
  DB_FAIL: 'Error occured while accessing database',
  NO_USER: 'Such user does not exist',
  BAD_PASS: 'Password is incorrect',
  UNIQUE_USERNAME: 'User with such username already exists',
  UPDATE_FAILED: 'Cannot update user',
};

const TOKENS = {
  AUTH: 'abcd',
};

export {
  BOUNDARY_VALUES,
  ERRORS,
  TOKENS,
};
