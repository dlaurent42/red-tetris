import express from 'express';
import { get } from 'lodash';

import UserHelper from '../../helpers/User';

const router = express.Router();

router.get('/:id', (req, res) => (
  new UserHelper(req.params).getById()
    .then(user => res.status(200).json({ success: true, user }))
    .catch(err => res.status(200).json({ success: false, err: get(err, 'message', err) }))
));

export default router;
