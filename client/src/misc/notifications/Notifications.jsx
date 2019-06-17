import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import { NOTIFICATIONS, SOCKETS } from '../../config/constants';

const notifications = (props) => {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const action = key => (
    <React.Fragment>
      <Button size="small" style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>Dismiss</Button>
    </React.Fragment>
  );

  props.socket.on(
    SOCKETS.NOTIFY_FRIEND_CONNECTION,
    data => (
      enqueueSnackbar(`${data.username} is connected.`, { action, ...NOTIFICATIONS.FRIEND_CONNECTION })
    ),
  );

  props.socket.on(
    SOCKETS.NOTIFY_PLAYER_LEFT_GAME,
    data => (
      enqueueSnackbar(`${data.username} has left the room.`, { action, ...NOTIFICATIONS.PLAYER_LEFT })
    ),
  );

  props.socket.on(
    SOCKETS.NOTIFY_PLAYER_ENTERS_GAME,
    data => (
      enqueueSnackbar(`${data.username} has joined the room.`, { action, ...NOTIFICATIONS.PLAYER_ENTERS })
    ),
  );

  props.socket.on(
    SOCKETS.NOTIFY_ROOM_CREATED,
    data => (
      enqueueSnackbar(`${data.roomName} room created.`, { action, ...NOTIFICATIONS.ROOM_CREATED })
    ),
  );

  props.socket.on(
    SOCKETS.NOTIFY_ROOM_NOT_CREATED,
    (data) => {
      props.history.push('/tournaments');
      enqueueSnackbar(`${data.roomName} room not created.`, { action, ...NOTIFICATIONS.ROOM_NOT_CREATED });
    },
  );

  props.socket.on(
    SOCKETS.NOTIFY_ROOM_FORBIDDEN_ACCESS,
    data => (
      enqueueSnackbar(`Forbidden access to ${data.roomName} room.`, { action, ...NOTIFICATIONS.FORBIDDEN_ACCESS })
    ),
  );

  return <React.Fragment />;
};

notifications.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  socket: state.socket.socket,
});

export default withRouter(connect(mapStateToProps)(notifications));
