import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.NODE_ENV || 'production';
console.log(`Server environment is ${environment}`);

const SERVER = {
  HOST: '127.0.0.1',
  PORT: '4000',
};

const DATABASE = {
  HOST: process.env.DATABASE_HOST || '127.0.0.1',
  PORT: process.env.DATABASE_PORT || '27017',
  NAME: process.env.DATABASE_NAME || 'red-tetris',
  USER: process.env.DATABASE_USER,
  PASS: process.env.DATABASE_PASS,
};

const MAIL = {
  HOST: process.env.MAIL_HOST || '127.0.0.1',
  NAME: process.env.MAIL_NAME || 'red-tetris',
  USER: process.env.MAIL_USER,
  PASS: process.env.MAIL_PASS,
};

export { SERVER, DATABASE, MAIL };
