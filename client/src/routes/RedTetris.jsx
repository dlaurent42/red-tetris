import React, { Suspense, lazy, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { GooSpinner } from 'react-spinners-kit';
import { API_CALLS } from '../config/constants';
import { userUpdate, userDelete } from '../store/actions';
import './RedTetris.scss';

const Homepage = lazy(() => import('./homepage/Homepage'));

const Login = lazy(() => import('./login/Login'));
const Signup = lazy(() => import('./signup/Signup'));
const Logout = lazy(() => import('./logout/Logout'));
const RecoverPassword = lazy(() => import('./recover-password/RecoverPassword'));
const RecoverPasswordKey = lazy(() => import('./recover-password/RecoverPasswordKey'));
const Profile = lazy(() => import('./profile/Profile'));
const About = lazy(() => import('./about/About'));

const Room = lazy(() => import('./room/Room'));
const Tournaments = lazy(() => import('./tournaments/Tournaments'));
const Leaderboard = lazy(() => import('./leaderboard/Leaderboard'));

const Page404 = lazy(() => import('../misc/navigation/404/404'));
const Redirection = lazy(() => import('./room/Redirection'));
const Notifications = lazy(() => import('../misc/notifications/Notifications'));

const redTetris = (props) => {

  useEffect(() => {
    // Check if API call is needed to fetch user information
    if (!props.user.id || props.user.username) return;

    // Make API call
    axios.get(`${API_CALLS.GET_USER}/${props.user.id}`, API_CALLS.CONFIG)
      .then((res) => {
        if (res.data.success) props.onUserUpdate(res.data.user);
        else props.onUserDelete(props.user);
      })
      .catch(() => props.onUserDelete(props.user));
  }, []);

  return (

    // suspense permits to display spinner until data has loaded
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
        <HashRouter>
          <Notifications />
          <Switch>
            <Route path="/" exact component={Homepage} />

            {/* misc */}
            <Route path="/about" component={About} />

            {/* forms */}
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/recover-password" component={RecoverPassword} />
            <Route path="/recover-password[:key]" component={RecoverPasswordKey} />
            {/* user */}
            <Route path="/profile" component={Profile} />
            <Route path="/logout" component={Logout} />

            {/* game */}
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/tournaments" component={Tournaments} />
            <Route path="/:room[:username]" component={Room} />
            <Route path="/:room[]" component={Room} />

            {/* misc */}
            <Route path="/redirection" component={Redirection} />
            <Route component={Page404} />
          </Switch>
        </HashRouter>
      </SnackbarProvider>
    </Suspense>
  );
};

redTetris.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  onUserUpdate: PropTypes.func.isRequired,
  onUserDelete: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  onUserUpdate: user => dispatch(userUpdate(user)),
  onUserDelete: user => dispatch(userDelete(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(redTetris);
