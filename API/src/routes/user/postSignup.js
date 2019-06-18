import express from 'express';
import User from '../../helpers/User';

import {
  isEmpty,
  userIsUsername,
  userIsEmail,
  userIsPassword,
} from '../../utils';
import { ERRORS } from '../../config/constants';

const router = express.Router();
const dataCheck = user => (
  userIsUsername(user.username)
  && userIsEmail(user.email)
  && userIsPassword(user.password)
);

router.post('/signup', (req, res) => {
  if (isEmpty(req.body.user)) return res.status(400).json({ err: ERRORS.DATA_MISSING });

  if (!dataCheck(req.body.user)) return res.status(200).json({ err: ERRORS.DATA_VALIDATION });

  const user = new User(req.body.user);
  return user.save()
    .then((doc) => {
      return res.json({ success: 'true', user: doc });
    })
    .catch((err) => {
      console.log(err);
      return res.status(200).json({ err: err.message });
    });

  // return user.save((err) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(200).json({ err: err.message });
  //   }
  //   return res.json({ success: 'true' });
  // });
});

export default router;
