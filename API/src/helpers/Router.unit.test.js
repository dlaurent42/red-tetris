import express from 'express';
import Router from './Router';

const app = express();

describe('Router', () => {

  it('should set routes for whole application', () => {
    const router = new Router(app).setAllRoutes();
    expect(router).toEqual(undefined);
  });
});
