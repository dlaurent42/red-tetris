import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICONS, ROOM_ROLES } from '../../../config/constants';

const padNumber = number => (number <= 999999 ? `00000${number}`.slice(-6) : number);

const gameInformations = props => (
  <div className="room-statistics">
    {props.roomInfos.players
      .filter(player => player.role !== ROOM_ROLES.SPECTATOR)
      .map(player => (
        <div className="room-statistic-player" key={`statistics-${player.socketId}`}>
          {<FontAwesomeIcon icon={(player.role === ROOM_ROLES.CREATOR) ? ICONS.CROWN : ICONS.GAMEPAD} className="lobby-icon" />}
          <div>{(player.socketId === props.socket.id) ? 'You' : player.username || 'unkwown-player'}</div>
          <div>{padNumber(player.score)}</div>
        </div>
      ))}
  </div>
);

gameInformations.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  roomInfos: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default gameInformations;
