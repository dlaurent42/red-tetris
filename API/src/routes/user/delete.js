import express from 'express';
import { get } from 'lodash';

import UserHelper from '../../helpers/User';

const router = express.Router();

router.delete('/:id', (req, res) => (
  new UserHelper({ ...req.body, ...req.params }).deleteById()
    .then(() => res.status(200).json({ success: true }))
    .catch(err => res.status(200).json({ success: false, err: get(err, 'message', err) }))
));

export default router;
