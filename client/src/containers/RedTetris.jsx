import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Home from '../components/home/Home';
import Login from '../components/user/login/Login';
import Signup from '../components/user/signup/Signup';
import RecoverPassword from '../components/user/recover-password/RecoverPassword';
import RecoverPasswordKey from '../components/user/recover-password/RecoverPasswordKey';
import About from '../components/about/About';
import Tournaments from '../components/game/tournaments/Tournaments';
import Leaderboard from '../components/game/leaderboard/Leaderboard';
import Page404 from '../components/navigation/404/404';
import './RedTetris.scss';

const RedTetris = () => (
  <HashRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/recover-password" component={RecoverPassword} />
      <Route path="/recover-password[:key]" component={RecoverPasswordKey} />
      <Route path="/about" component={About} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/tournaments" component={Tournaments} />
      <Route path="/:room[:username]" render={() => <></>} />
      <Route path="/profile/friends" render={() => <></>} />
      <Route path="/profile/settings" render={() => <></>} />
      <Route path="/profile/statistics" render={() => <></>} />
      <Route path="/profile" render={() => <></>} />
      <Route component={Page404} />
    </Switch>
  </HashRouter>
);

export default RedTetris;
