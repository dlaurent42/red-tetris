import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SOCKETS, ICONS, ROOM_ROLES } from '../../../../config/constants';

const playerSlot = (props) => {

  const onReady = () => {
    if (props.player.isReady) return;
    const user = { ...props.userInfos, isReady: true };
    props.setUserInfos(user);
    console.log('emitting ROOM_USER_UPDATE');
    props.socket.emit(SOCKETS.ROOM_USER_UPDATE, { id: props.roomInfos.id, user });
  };
  return (
    <div className="room-entering-lobby-player-slot">
      <Badge badgeContent={<FontAwesomeIcon icon={(props.player.role === ROOM_ROLES.CREATOR) ? ICONS.CROWN : ICONS.GAMEPAD} className="lobby-icon" />}>
        <Avatar className="menu-profile-avatar" src={require(`../../../../assets/avatars/${props.player.avatar}`) /* eslint-disable-line */} alt="avatar" />
      </Badge>
      {(props.player.socketId === props.socket.id) ? 'You' : props.player.username || 'unkwown-player'}
      {(props.player.socketId === props.socket.id)
        ? (
          <button
            type="button"
            onClick={onReady}
            className={(props.player.isReady) ? 'current-player-ready' : 'current-player-not-ready'}
          >
            {(props.player.isReady) ? 'READY !' : 'READY ?'}
          </button>
        ) : (
          <div className={(props.player.isReady) ? 'other-player-ready' : 'other-player-not-ready'}>
            {(props.player.isReady) ? 'READY !' : 'NOT READY !'}
          </div>
        )
      }
    </div>
  );
};

playerSlot.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  player: PropTypes.objectOf(PropTypes.any).isRequired,
  roomInfos: PropTypes.objectOf(PropTypes.any).isRequired,
  userInfos: PropTypes.objectOf(PropTypes.any).isRequired,
  setUserInfos: PropTypes.func.isRequired,
};

export default playerSlot;
