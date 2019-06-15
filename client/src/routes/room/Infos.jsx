import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { SOCKETS } from '../../config/constants';

const infos = (props) => {
  console.log('[infos');

  const handleClick = () => {
    props.setUser({ ...props.user, isReady: !props.user.isReady });
    props.socket.emit(SOCKETS.PLAYER_READY, { roomId: props.roomInfos.roomId });
  };

  // Listen to room updates
  useEffect(() => {
    props.socket.on(SOCKETS.ROOM_UPDATE, data => props.setRoomInfos(...props.roomInfos, ...data));
  }, []);

  return (
    <div className="room-infos">
      <div>
        <span>{props.user.username}</span>
        {
          (props.gameInfos.hasStarted)
            ? <div className="room-infos-score">{props.user.score}</div>
            : (
              <Button
                onClick={handleClick}
                className={(props.user.isReady) ? 'room-infos-btn-ready' : 'room-infos-btn-not-ready'}
              >
                {(props.user.isReady) ? 'ready' : 'Not ready'}
              </Button>
            )
        }
      </div>
      {
        props.roomInfos.users.map((user) => {
          if (user.id === props.socket.id) return null;
          return (
            <div key={user.id}>
              <span>{user.username}</span>
              {
                (props.gameInfos.hasStarted)
                  ? <div className="room-infos-score">{user.score}</div>
                  : <div className="room-infos-status">{user.status}</div>
              }
            </div>
          );
        })
      }
    </div>
  );
};

infos.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  setUser: PropTypes.func.isRequired,
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  roomInfos: PropTypes.objectOf(PropTypes.any).isRequired,
  setRoomInfos: PropTypes.func.isRequired,
  gameInfos: PropTypes.objectOf(PropTypes.any).isRequired,
};

/*

if ! game  has started:
  player... [ready] / [not ready]
  enemy... [waiting] [ready]

if game has started:
  player: score
  enemy: score (even if he has left the room)

*/

export default infos;
