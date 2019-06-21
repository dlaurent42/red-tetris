import { get } from 'lodash';
import express from 'express';
import UserHelper from '../../helpers/User';

import { userIsEmail } from '../../utils';
import { ERRORS } from '../../config/constants';

const router = express.Router();

router.post('/recover-password', (req, res) => {
  if (!userIsEmail(req.body.user.email)) {
    return res.status(200).json({ success: false, err: ERRORS.DATA_VALIDATION });
  }

  return new UserHelper({ ...req.body.user }).recoverPasswordByEmail()
    .then(doc => res.status(200).json({ success: true, message: doc.message }))
    .catch(err => res.status(200).json({ success: false, err: get(err, 'message', err) }));
});

export default router;
