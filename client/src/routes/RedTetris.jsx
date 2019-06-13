import React, { Suspense, lazy } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { GooSpinner } from 'react-spinners-kit';
import './RedTetris.scss';

const Homepage = lazy(() => import('./homepage/Homepage'));

const Login = lazy(() => import('./login/Login'));
const Signup = lazy(() => import('./signup/Signup'));
const RecoverPassword = lazy(() => import('./recover-password/RecoverPassword'));
const RecoverPasswordKey = lazy(() => import('./recover-password/RecoverPasswordKey'));
const About = lazy(() => import('./about/About'));

const Room = lazy(() => import('./room/Room'));
const Tournaments = lazy(() => import('./tournaments/Tournaments'));
const Leaderboard = lazy(() => import('./leaderboard/Leaderboard'));

const Page404 = lazy(() => import('../misc/navigation/404/404'));
const Notifications = lazy(() => import('../misc/notifications/Notifications'));


const RedTetris = () => (
  <Suspense fallback={<div className="spinner"><GooSpinner size={100} color="#ff0550" /></div>}>
    <SnackbarProvider
      maxSnack={4}
      dense
      preventDuplicate
      hideIconVariant
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <Notifications />
      <HashRouter>
        <Switch>
          <Route path="/" exact component={Homepage} />

          {/* misc */}
          <Route path="/about" component={About} />

          {/* game */}
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/tournaments" component={Tournaments} />
          {/* if room NOT joined through interface */}
          <Route path="/:room[:username]" component={Room} />
          {/* if room joined through interface */}
          <Route path="/:room[:username][:key][:password][:role]" component={Room} />

          {/* forms */}
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/recover-password" component={RecoverPassword} />
          <Route path="/recover-password[:key]" component={RecoverPasswordKey} />
          {/* user */}
          <Route path="/profile" render={() => <></>} />
          <Route path="/account" render={() => <></>} />
          <Route path="/friends" render={() => <></>} />
          <Route path="/logout" render={() => <></>} />
          <Route component={Page404} />
        </Switch>
      </HashRouter>
    </SnackbarProvider>
  </Suspense>
);

export default RedTetris;
