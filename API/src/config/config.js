const dotenv = require('dotenv')
dotenv.load()

const environment = process.env.NODE_ENV || 'production'

const SERVER = {
  HOST: '127.0.0.1',
  PORT: '4000',
};

const DATABASE = {
  HOST: process.env.DATABASE_HOST || '127.0.0.1',
  NAME: process.env.DATABASE_NAME || 'red-tetris',
  USER: process.env.DATABASE_USER,
  PASS: process.env.DATABASE_PASS,
};

const MAIL = {
  HOST: process.env.DATABASE_HOST || '127.0.0.1',
  NAME: process.env.DATABASE_NAME || 'red-tetris',
  USER: process.env.DATABASE_USER,
  PASS: process.env.DATABASE_PASS,
}

export { SERVER, DATABASE, MAIL };
