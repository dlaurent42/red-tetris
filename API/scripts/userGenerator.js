import mongoose from 'mongoose';
import UserModel from '../src/models/User.model';

import { DATABASE } from '../src/config/config';
import { random } from '../src/utils';

const usernames = [
  'serenadeexcellent', 'clapwarrior', 'lloydband', 'gutscrate', 'mesonsquiggly',
  'faxrobber', 'protactiniumhell', 'tricepsbrandy', 'burritosantacid', 'lenscona',
  'importancepause', 'oomphtiger', 'fiddleblister', 'exclusionpattack', 'pluckyiraqi',
  'atypicalmechanic', 'blinkerhurried', 'removesteps', 'poisewolds', 'logicalpraising',
  'seelogged', 'althoughsub', 'petawawaproofs', 'wrathfulbobsled', 'vaultingepidermal',
];

const scoreGenerator = (size) => {
  const ret = [];
  for (let index = 0; index < size; index += 1) {
    // { score: 100, hasWon: true, mode: string, maxPlayers: int [1,2] },
    ret.push({
      score: Math.floor((Math.random() * 100)),
      hasWon: !!Math.floor((Math.random() * 2)),
      mode: 'classic',
      maxPlayers: 1,
    });
  }
  return ret;
};

// connect to database
const dbURL = (process.env.NODE_ENV === 'development')
  ? `mongodb://${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`
  : `mongodb://${DATABASE.USER}:${DATABASE.PASS}@${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`;
mongoose.connect(dbURL);
const db = mongoose.connection;

db.once('open', async () => {
  await usernames.forEach(async (user) => {
    await UserModel.create({
      username: user,
      email: `${user}@mail.com`,
      password: random(20),
      avatar: 'man.png',
      scores: scoreGenerator(Math.floor((Math.random() * 20) + 1)),
    });
  });
  mongoose.connection.close(() => {
    console.log('Database filling complete');
    process.exit();
  });
});
