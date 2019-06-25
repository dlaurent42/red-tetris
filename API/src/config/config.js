import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.NODE_ENV || 'production';
console.log(`Server environment is ${environment}`);

const SERVER = {
  HOST: '127.0.0.1',
  PORT: '4000',
};

const ECOSYSTEM = {
  SOCKET: process.env.SOCKET_SERVER || '127.0.0.1:3000',
  CLIENT: process.env.CLIENT_SERVER || '127.0.0.1:8080',
};

const DATABASE = {
  HOST: process.env.DATABASE_HOST || '127.0.0.1',
  PORT: process.env.DATABASE_PORT || '27017',
  NAME: process.env.DATABASE_NAME || 'red-tetris',
  USER: process.env.DATABASE_USER,
  PASS: process.env.DATABASE_PASS,
  OPTIONS: {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
};

const MAIL = {
  USER: process.env.MAIL_USER,
  PASS: process.env.MAIL_PASS,
};

// To implement | Whitelist works.
const corsWhiteList = [ECOSYSTEM.SOCKET, ECOSYSTEM.CLIENT];
const CORS = {
  origin: (origin, callback) => {
    if (corsWhiteList.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error('CORS indentification error!'));
  },
};

export {
  CORS,
  MAIL,
  SERVER,
  DATABASE,
};
