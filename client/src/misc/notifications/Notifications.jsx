import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import { NOTIFICATIONS, SOCKETS } from '../../config/constants';

const notifications = (props) => {

  console.log('[Notifications]');

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const action = key => (
    <React.Fragment>
      <Button size="small" style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>Dismiss</Button>
    </React.Fragment>
  );
  useEffect(() => {
    props.socket.on(
      SOCKETS.ON_FRIEND_CONNECTION,
      data => enqueueSnackbar(`${data.username} is connected.`, { action, ...NOTIFICATIONS.FRIEND_CONNECTION }),
    );
  });

  useEffect(() => {
    props.socket.on(
      SOCKETS.ON_PLAYER_LEFT_GAME,
      data => enqueueSnackbar(`${data.username} has left the room.`, { action, ...NOTIFICATIONS.PLAYER_LEFT }),
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
