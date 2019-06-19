import express from 'express';
import UserHelper from '../../helpers/User';

import { isEmpty } from '../../utils';
import { ERRORS } from '../../config/constants';

const router = express.Router();

router.get('/login', (req, res) => {
  if (isEmpty(req.body.user) || isEmpty(req.body.user.username)
    || isEmpty(req.body.user.password)) {
    return res.status(400).json({ err: ERRORS.DATA_MISSING });
  }

  return UserHelper.login(req.body.user)
    .then(doc => res.json({ user: doc }))
    .catch((err) => {
      console.log(err);
      res.status(200).json({ err: err.message });
    });
});

export default router;
