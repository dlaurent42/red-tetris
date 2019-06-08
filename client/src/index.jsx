import React from 'react';
import ReactDOM from 'react-dom';
import RedTetris from './containers/RedTetris';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<RedTetris />, document.getElementById('root'));

serviceWorker.unregister();
