import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { SOCKETS } from '../../config/constants';

const redirection = (props) => {

  if (props.location.state === undefined) {
    props.socket.emit(SOCKETS.ROOM_FORBIDDEN_ACCESS, { name: '' });
    props.history.replace('/tournaments');
  }

  return (
    <Redirect to={Object.assign(props.location, { pathname: `/${props.location.state.room.id}[${props.location.state.user.username}]` })} />
  );

};

redirection.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  socket: state.socket.socket,
});

export default withRouter(connect(mapStateToProps)(redirection));
