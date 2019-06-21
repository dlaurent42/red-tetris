import { get } from 'lodash';
import express from 'express';
import UserHelper from '../../helpers/User';

import { isEmpty } from '../../utils';
import { ERRORS } from '../../config/constants';

const router = express.Router();

router.get('/recover-password', (req, res) => {
  if (isEmpty(req.body.user.token)) {
    return res.status(200).json({ success: false, err: ERRORS.DATA_VALIDATION });
  }

  return new UserHelper({ ...req.body.user }).recoverPasswordByToken()
    .then(id => res.status(200).json({ success: true, id }))
    .catch(err => res.status(200).json({ success: false, err: get(err, 'message', err) }));
});

export default router;
