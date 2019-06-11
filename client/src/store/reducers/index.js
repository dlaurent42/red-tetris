import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import middleware from '../middleware/middleware';
import { socket } from './socket';
import { user } from './user';

const combinedReducers = combineReducers({
  socket,
  user,
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line

const store = createStore(
  combinedReducers,
  composeEnhancers(applyMiddleware(middleware, thunk)),
);

export default store;
