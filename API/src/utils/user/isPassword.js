import validator from 'validator';

import isEmpty from '../obj/isEmpty';
import { BOUNDARY_VALUES } from '../../config/constants';
import hasDigit from '../string/hasDigit';
import hasSpecial from '../string/hasSpecial';
import hasLowercase from '../string/hasLowercase';
import hasUppercase from '../string/hasUppercase';

const isPassword = (password, cpassword) => {
  if (isEmpty(password)) return false;
  if (!validator.isLength(password, { min: BOUNDARY_VALUES.PASS_MIN_LEN })) return false;
  if (!(hasDigit(password)
    && hasSpecial(password)
    && hasLowercase(password)
    && hasUppercase(password))) return false;
  if (!isEmpty(cpassword) && cpassword !== password) return false;
  return true;
};

export default isPassword;
