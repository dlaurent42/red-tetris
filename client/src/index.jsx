import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './reducers';
import RedTetris from './containers/RedTetris';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Provider store={store}><RedTetris /></Provider>, document.getElementById('root'));

serviceWorker.unregister();
