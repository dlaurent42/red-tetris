import 'babel-polyfill';
import express from 'express';
import request from 'supertest';
import middleware from './middleware';

import { TOKENS } from '../config/constants';

const init = () => {
  const app = express();
  app.use('', middleware);
  app.get('/', (req, res) => {
    res.status(200).json({ success: true });
  });
  return app;
};

describe('middleware testing', () => {

  test('getting w/o middleware', async () => {
    const app = init();
    const res = await request(app)
      .get('/');
    expect(res.status).toBe(403);
  });

  test('getting w/ middleware', async () => {
    const app = init();
    const res = await request(app)
      .get('/')
      .set('Authorization', `Bearer ${TOKENS.AUTH}`);
    expect(res.status).toBe(200);
  });
});
