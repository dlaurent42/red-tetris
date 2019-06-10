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
      <Route path="/about" render={() => <>In rooms</>} />
      <Route path="/leaderboard" render={() => <>In rooms</>} />
      <Route path="/tournaments" render={() => <>In rooms</>} />
      <Route path="/:room[:username]" render={() => <>In room</>} />
      <Route path="/profile/friends" render={() => <>In profile</>} />
      <Route path="/profile/settings" render={() => <>In profile</>} />
      <Route path="/profile/statistics" render={() => <>In profile</>} />
      <Route path="/profile" render={() => <>In profile</>} />
      <Route render={() => <>404</>} />
    </Switch>
  </HashRouter>
);

export default RedTetris;
