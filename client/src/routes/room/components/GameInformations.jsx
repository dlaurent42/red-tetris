import React from 'react';
import PropTypes from 'prop-types';
import { get, find } from 'lodash';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICONS, ROOM_ROLES } from '../../../config/constants';

const padNumber = number => (number <= 999999 ? `00000${number}`.slice(-6) : number);

const gameInformations = props => (
  <div className="room-statistics">
    {props.roomInfos.scores
      .filter(player => player.role !== ROOM_ROLES.SPECTATOR)
      .map((player) => {
        let icon = ICONS.TIMES_CIRCLE;
        const role = get(find(props.roomInfos.players, { socketId: player.socketId }), 'role');
        if (role === ROOM_ROLES.CREATOR) icon = ICONS.CROWN;
        if (role === ROOM_ROLES.PLAYER) icon = ICONS.GAMEPAD;
        return (
          <div className="room-statistic-player" key={`statistics-${player.socketId}`}>
            <Badge badgeContent={<FontAwesomeIcon icon={icon} className={['lobby-icon', icon].join(' ')} />}>
              <Avatar src={require(`../../../assets/avatars/${player.avatar}`) /* eslint-disable-line */} alt="avatar" />
            </Badge>
            <div>{(player.socketId === props.socket.id) ? 'You' : player.username || 'unkwown-player'}</div>
            <div>{padNumber(player.score)}</div>
          </div>
        );
      })}
  </div>
);

gameInformations.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  roomInfos: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default gameInformations;
