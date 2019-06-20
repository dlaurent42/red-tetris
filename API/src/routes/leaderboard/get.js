import express from 'express';

import LeaderboardHelper from '../../helpers/Leaderboard';

const router = express.Router();

router.get('/', (req, res) => {
  new LeaderboardHelper().getLeaderboard();
  res.status(200).json({ success: false, err: 'Not implemented yet' });
});

export default router;
