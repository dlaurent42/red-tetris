import validator from 'validator';

import isEmpty from '../obj/isEmpty';
import { BOUNDARY_VALUES } from '../../config/constants';

const isEmail = (email) => {
  if (isEmpty(email)) return false;
  if (!validator.isEmail(email)) return false;
  if (!validator.isLength(email, { max: BOUNDARY_VALUES.EMAIL_MAX_LEN })) return false;
  return true;
};

export default isEmail;
