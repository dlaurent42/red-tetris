import express from 'express';
import UserHelper from '../../helpers/User';

import { isEmpty } from '../../utils';

const router = express.Router();

router.get('/:id', (req, res) => {
  if (isEmpty(req.params.id)) return res.status(404);

  return UserHelper.getById(req.params.id)
    .then(doc => res.json({ user: doc }))
    .catch((err) => {
      console.log(err);
      res.status(200).json({ err: err.message });
    });
});

export default router;
