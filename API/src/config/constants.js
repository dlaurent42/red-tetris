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
};

const ERRORS = {
  DATA_VALIDATION: 'Input are not valid',
  DATA_MISSING: 'Form is missing some data',
};

export {
  BOUNDARY_VALUES,
  ERRORS,
};
