// import { pick } from 'lodash';
import User from '../models/User.model';

import { isEmpty } from '../utils';

// const FILTERS = ['id', 'username', 'avatar', 'email', 'scores'];

class LeaderboardHelper {
  constructor() {
    // To implement fetching
    this.users = [];
  }

  getLeaderboard() {
    console.log(this.users);
  }
}

export default LeaderboardHelper;
