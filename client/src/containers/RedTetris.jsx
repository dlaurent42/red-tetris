import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Home from '../components/home/Home';
import Login from '../components/user/login/Login';
import Signup from '../components/user/signup/Signup';

const RedTetris = () => (
  <HashRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/rooms" render={() => <>In rooms</>} />
      <Route path="/profile" render={() => <>In profile</>} />
      <Route path="/:room[:username]" render={() => <>In room</>} />
      <Route render={() => <>404</>} />
    </Switch>
  </HashRouter>
);

export default RedTetris;
