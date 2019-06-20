import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Profile from '../../../../misc/profile/Profile';
import { SOCKETS, ICONS, ROOM_ROLES } from '../../../../config/constants';


const playerSlot = (props) => {

  const onReady = () => {
    if (props.player.isReady) return;
    const user = { ...props.userInfos, isReady: true };
    props.setUserInfos(user);
    props.socket.emit(SOCKETS.ROOM_USER_UPDATE, { id: props.roomInfos.id, user });
  };

  const [openProfile, setOpenProfile] = useState(false);
  const toggleProfile = () => setOpenProfile(!openProfile);

  return (
    <div
      role="presentation"
      onClick={toggleProfile}
      className={['room-entering-lobby-player-slot', (props.player.socketId !== props.socket.id) ? 'clickable' : ''].join(' ')}
    >
      {(props.player.socketId !== props.socket.id && openProfile)
        ? <Profile open={openProfile} onClose={toggleProfile} user={props.player} />
        : null}
      <Badge
        badgeContent={
          (
            <FontAwesomeIcon
              icon={(props.player.role === ROOM_ROLES.CREATOR) ? ICONS.CROWN : ICONS.GAMEPAD}
              className={['lobby-icon', (props.player.role === ROOM_ROLES.CREATOR) ? ICONS.CROWN : ICONS.GAMEPAD].join(' ')}
            />
          )}
      >
        <Avatar src={require(`../../../../assets/avatars/${props.player.avatar}`) /* eslint-disable-line */} alt="avatar" />
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
