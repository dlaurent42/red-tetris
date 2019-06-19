import express from 'express';
import { get } from 'lodash';

import UserHelper from '../../helpers/User';

const router = express.Router();

router.put('/:id', (req, res) => (
  new UserHelper(req.body.user).updateById(req.params.id)
    .then(user => res.status(200).json({ success: true, user }))
    .catch(err => res.status(200).json({ success: false, err: get(err, 'message', err) }))
));

export default router;
