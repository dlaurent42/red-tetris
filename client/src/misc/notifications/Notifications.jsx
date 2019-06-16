import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
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

  useEffect(() => {
    props.socket.on(
      SOCKETS.NOTIFY_FRIEND_CONNECTION,
      (data) => {
        console.log('SOCKETS.NOTIFY_FRIEND_CONNECTION');
        enqueueSnackbar(`${data.username} is connected.`, { action, ...NOTIFICATIONS.FRIEND_CONNECTION });
      },
    );
  });

  useEffect(() => {
    props.socket.on(
      SOCKETS.NOTIFY_PLAYER_LEFT_GAME,
      (data) => {
        console.log('SOCKETS.NOTIFY_PLAYER_LEFT_GAME');
        enqueueSnackbar(`${data.username} has left the room.`, { action, ...NOTIFICATIONS.PLAYER_LEFT });
      },
    );
  });

  useEffect(() => {
    props.socket.on(
      SOCKETS.NOTIFY_PLAYER_ENTERS_GAME,
      (data) => {
        console.log('SOCKETS.NOTIFY_PLAYER_ENTERS_GAME');
        enqueueSnackbar(`${data.username} has joined the room.`, { action, ...NOTIFICATIONS.PLAYER_ENTERS });
      },
    );
  });

  useEffect(() => {
    props.socket.on(
      SOCKETS.NOTIFY_ROOM_CREATED,
      (data) => {
        console.log('SOCKETS.NOTIFY_ROOM_CREATED');
        enqueueSnackbar(`${data.roomName} room created.`, { action, ...NOTIFICATIONS.ROOM_CREATED });
      },
    );
  });

  useEffect(() => {
    props.socket.on(
      SOCKETS.NOTIFY_ROOM_FORBIDDEN_ACCESS,
      (data) => {
        console.log('SOCKETS.NOTIFY_ROOM_FORBIDDEN_ACCESS');
        enqueueSnackbar(`Forbidden access to ${data.roomName} room.`, { action, ...NOTIFICATIONS.FORBIDDEN_ACCESS });
      },
    );
  });

  return <React.Fragment />;
};

notifications.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  socket: state.socket.socket,
});

export default connect(mapStateToProps)(notifications);
