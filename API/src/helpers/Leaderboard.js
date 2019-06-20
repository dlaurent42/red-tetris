import _ from 'lodash';
import User from '../models/User.model';

import { isEmpty } from '../utils';
import { BOUNDARY_VALUES } from '../config/constants';

// const FILTERS = ['id', 'username', 'avatar', 'email', 'scores'];

const getLeaderboard = () => (
  new Promise((resolve, reject) => {
    User.find({})
      .then((users) => {
        if (isEmpty(users)) return resolve({ scoring: [], gamePlayed: [] });
        const board = [];
        users.forEach(user => (
          board.push({
            ..._.pick(user, ['username', 'avatar', 'id']),
            gamesPlayed: user.scores.length,
            score: _.sumBy(user.scores, 'score') || 0,
          })));
        const scoring = _.take(_.orderBy(board, ['score'], ['desc']), BOUNDARY_VALUES.LEADERBOARD_LEN);
        const gamesPlayed = _.take(_.orderBy(board, ['value'], ['desc']), BOUNDARY_VALUES.LEADERBOARD_LEN);
        return resolve({ scoring, gamesPlayed });
      })
      .catch(err => reject(err));
  })
);

export default getLeaderboard;
