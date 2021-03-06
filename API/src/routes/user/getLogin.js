import express from 'express';
import { get } from 'lodash';

import { isEmpty } from '../../utils';
import UserHelper from '../../helpers/User';
import { ERRORS } from '../../config/constants';

const router = express.Router();

const validateFields = ({ email, password }) => !isEmpty(email) && !isEmpty(password);

router.get('/login', (req, res) => {
  const { email, password } = req.query;
  if (!validateFields({ email, password })) {
    return res.status(400).json({ success: false, err: ERRORS.DATA_MISSING });
  }

  // If data is correct, try to log user.
  return new UserHelper({ email, password }).login()
    .then(user => res.status(200).json({ success: true, user }))
    .catch(err => res.status(200).json({ success: false, err: get(err, 'message', err) }));
});

export default router;
