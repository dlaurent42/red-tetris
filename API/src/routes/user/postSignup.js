import express from 'express';
import { get } from 'lodash';
import UserHelper from '../../helpers/User';
import Mail from '../../helpers/Mail';

import {
  isEmpty,
  userIsUsername,
  userIsEmail,
  userIsPassword,
} from '../../utils';
import { ERRORS } from '../../config/constants';

const router = express.Router();
const validateFields = ({ username, email, password }) => (
  userIsUsername(username) && userIsEmail(email) && userIsPassword(password)
);

router.post('/signup', (req, res) => {
  if (isEmpty(req.body.user)) {
    return res.status(400).json({ success: false, err: ERRORS.DATA_MISSING });
  }
  if (!validateFields(req.body.user)) {
    return res.status(200).json({ success: false, err: ERRORS.DATA_VALIDATION });
  }

  return new UserHelper(req.body.user).addNewUser()
    .then((user) => {
      new Mail().register(user);
      return res.status(200).json({ success: true, user });
    })
    .catch(err => res.status(200).json({ success: false, err: get(err, 'message', err) }));
});

export default router;
