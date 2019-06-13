import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTrophy,
  faAward,
  faMedal,
  faLock,
  faEye,
  faEyeSlash,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import store from './store/reducers';
import RedTetris from './routes/RedTetris';
import * as serviceWorker from './serviceWorker';

library.add(
  faTrophy,
  faAward,
  faMedal,
  faLock,
  faEye,
  faEyeSlash,
  faSearch,
);

ReactDOM.render(
  <Provider store={store}>
    <RedTetris />
  </Provider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
