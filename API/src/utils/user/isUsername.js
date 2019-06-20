import validator from 'validator';

import isEmpty from '../obj/isEmpty';
import { BOUNDARY_VALUES } from '../../config/constants';

const isUsername = (username) => {
  if (isEmpty(username)) return false;
  if (!validator.isLength(username, {
    min: BOUNDARY_VALUES.NAME_MIN_LEN,
    max: BOUNDARY_VALUES.NAME_MAX_LEN,
  })) return false;
  if (!validator.isAlphanumeric(username)) return false;
  return true;
};

export default isUsername;
