import express from 'express';
import { get } from 'lodash';
import UserHelper from '../../helpers/User';

import {
  userIsUsername,
  userIsPassword,
} from '../../utils';
import { ERRORS } from '../../config/constants';

const router = express.Router();

const validData = ({ username, password }) => (
  !((username && !userIsUsername(username)) || (password && !userIsPassword(password)))
);

router.put('/:id', (req, res) => {
  if (!validData(req.body.user)) {
    return res.status(200).json({ success: false, err: ERRORS.DATA_VALIDATION });
  }

  return new UserHelper({ ...req.body.user }).updateById()
    .then(user => res.status(200).json({ success: true, user }))
    .catch(err => res.status(200).json({ success: false, err: get(err, 'message', err) }));
});

export default router;
