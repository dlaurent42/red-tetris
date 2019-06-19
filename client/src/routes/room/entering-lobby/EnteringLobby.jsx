import React from 'react';
import PropTypes from 'prop-types';
import { countBy, get } from 'lodash';
import Typography from '@material-ui/core/Typography';
import PlayerSlot from './slots/PlayerSlot';
import EmptySlot from './slots/EmptySlot';
import { SOCKETS, ROOM_ROLES } from '../../../config/constants';

const enteringLobby = (props) => {

  // Method used to start game
  const handleStart = () => {
    console.log('emitting GAME_STARTS');
    props.socket.emit(SOCKETS.GAME_STARTS, { id: props.roomInfos.id });
  };

  const emptySlotsCount = props.roomInfos.maxPlayers - get(countBy(props.roomInfos.players, { role: ROOM_ROLES.SPECTATOR }), 'false', 0);
  const allPlayersReady = props.roomInfos.maxPlayers === get(countBy(props.roomInfos.players, { isReady: true }), 'true', 0);
  return (
    <div className="room-entering-lobby">
      <div className="room-entering-lobby-ctn">
        <div className="room-entering-lobby-title">
          <Typography variant="h5" paragraph>{props.roomInfos.name}</Typography>
          <Typography variant="h6" paragraph>{props.roomInfos.id}</Typography>
        </div>
        <div className="room-entering-lobby-slots">
          {props.roomInfos.players
            .filter(user => user.role !== ROOM_ROLES.SPECTATOR)
            .map(player => (
              <PlayerSlot
                key={player.socketId}
                socket={props.socket}
                player={player}
                roomInfos={props.roomInfos}
                userInfos={props.userInfos}
                setUserInfos={props.setUserInfos}
              />
            ))}
          {Array(emptySlotsCount).fill(0).map((el, idx) => (
            <EmptySlot
              key={['fst', 'snd', 'trd', 'frth'][idx]}
              socket={props.socket}
              roomInfos={props.roomInfos}
              userInfos={props.userInfos}
              setUserInfos={props.setUserInfos}
            />
          ))}
        </div>
        <div className="room-entering-lobby-start">
          {(props.userInfos.role === ROOM_ROLES.CREATOR)
            ? (
              <button
                disabled={!allPlayersReady}
                type="button"
                className={['room-entering-lobby-start-button', (allPlayersReady) ? 'ready-to-start' : 'not-ready-to-start'].join(' ')}
                onClick={handleStart}
              >
                START !
              </button>
            ) : null
          }
        </div>
      </div>
    </div>
  );
};

enteringLobby.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  roomInfos: PropTypes.objectOf(PropTypes.any).isRequired,
  userInfos: PropTypes.objectOf(PropTypes.any).isRequired,
  setUserInfos: PropTypes.func.isRequired,
};

export default enteringLobby;
