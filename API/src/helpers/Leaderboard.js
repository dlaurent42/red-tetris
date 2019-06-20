import {
  pick,
  sumBy,
  orderBy,
  take,
} from 'lodash';
import User from '../models/User.model';

import { isEmpty } from '../utils';
import { BOUNDARY_VALUES } from '../config/constants';

const getLeaderboard = () => (
  new Promise((resolve, reject) => {
    User.find({})
      .then((users) => {
        if (isEmpty(users)) return resolve({ scoring: [], gamePlayed: [] });
        const boardScore = [];
        const boardPlayed = [];
        users.forEach((user) => {
          boardScore.push({
            ...pick(user, ['username', 'avatar', 'id']),
            score: sumBy(user.scores, 'score') || 0,
          });
          boardPlayed.push({
            ...pick(user, ['username', 'avatar', 'id']),
            score: user.scores.length,
          });
        });
        const scoring = take(orderBy(boardScore, ['score'], ['desc']), BOUNDARY_VALUES.LEADERBOARD_LEN);
        const gamesPlayed = take(orderBy(boardPlayed, ['score'], ['desc']), BOUNDARY_VALUES.LEADERBOARD_LEN);
        return resolve({ scoring, gamesPlayed });
      })
      .catch(err => reject(err));
  })
);

export default getLeaderboard;
