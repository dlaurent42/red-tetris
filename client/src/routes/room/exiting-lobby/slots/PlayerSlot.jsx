import React from 'react';
import PropTypes from 'prop-types';
import { get, find } from 'lodash';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICONS, ROOM_ROLES } from '../../../../config/constants';

const padNumber = number => (number <= 999999 ? `00000${number}`.slice(-6) : number);

const playerSlot = (props) => {
  let icon = ICONS.TIMES_CIRCLE;
  const role = get(find(props.roomInfos.players, { socketId: props.player.socketId }), 'role');
  if (role === ROOM_ROLES.CREATOR) icon = ICONS.CROWN;
  if (role === ROOM_ROLES.PLAYER) icon = ICONS.GAMEPAD;
  return (
    <div className="room-exiting-lobby-player-slot">
      <Badge badgeContent={<FontAwesomeIcon icon={icon} className={['lobby-icon', icon].join(' ')} />}>
        <Avatar src={require(`../../../../assets/avatars/${props.player.avatar}`) /* eslint-disable-line */} alt="avatar" />
      </Badge>
      <div>{(props.player.socketId === props.socket.id) ? 'You' : props.player.username || 'unkwown-player'}</div>
      <div>{padNumber(props.player.score)}</div>
    </div>
  );
};

playerSlot.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  player: PropTypes.objectOf(PropTypes.any).isRequired,
  roomInfos: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default playerSlot;
