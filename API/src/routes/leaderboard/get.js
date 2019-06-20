import express from 'express';
import { get } from 'lodash';

import getLeaderboard from '../../helpers/Leaderboard';

const router = express.Router();

router.get('/', (req, res) => (
  getLeaderboard()
    .then(result => res.status(200).json({ success: true, leaderboard: result }))
    .catch(err => res.status(200).json({ success: false, err: get(err, 'message', err) }))
));

export default router;
