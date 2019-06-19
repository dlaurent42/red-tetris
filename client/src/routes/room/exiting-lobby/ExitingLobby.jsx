import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { find, get } from 'lodash';
import Typography from '@material-ui/core/Typography';
import TetrisGrid from '../components/TetrisGrid';
import PlayerSlot from './slots/PlayerSlot';
import generateId from '../../../utils/generateId';
import { ROOM_ROLES } from '../../../config/constants';

const exitingLobby = (props) => {

  const newGameHandler = () => {
    const user = find(props.roomInfos.players, { socketId: props.socket.id });
    const id = generateId(64);
    props.history.push({
      pathname: '/redirection',
      state: {
        room: {
          id,
          name: props.roomInfos.name,
          maxPlayers: props.roomInfos.maxPlayers,
          hasPassword: (props.roomInfos.password.length > 0),
          password: props.roomInfos.password,
          mode: props.roomInfos.mode,
        },
        user: {
          role: ROOM_ROLES.CREATOR,
          id: user.uid,
          username: user.username,
          avatar: user.avatar,
        },
      },
    });
  };

  return (
    <div className="room-exiting-lobby">
      <div className="flex-container">
        <TetrisGrid tiles={props.tiles} />
      </div>
      <div className="room-exiting-lobby-ctn">
        <div className="room-exiting-lobby-title">
          <Typography variant="h5" paragraph>{props.roomInfos.name}</Typography>
          <Typography variant="h6" paragraph>{props.roomInfos.id}</Typography>
        </div>
        <div className="room-exiting-lobby-slots">
          {props.roomInfos.scores
            .map(player => (
              <PlayerSlot
                key={player.socketId}
                socket={props.socket}
                player={player}
                roomInfos={props.roomInfos}
              />
            ))}
        </div>
        <div className="room-exiting-lobby-new-game">
          {(get(find(props.roomInfos.players, { socketId: props.socket.id }), 'role', ROOM_ROLES.PLAYER) === ROOM_ROLES.CREATOR)
            ? (
              <button
                type="button"
                className="room-exiting-lobby-new-game-button"
                onClick={newGameHandler}
              >
                NEW GAME
              </button>
            ) : null
          }
        </div>
      </div>
    </div>
  );
};

exitingLobby.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  tiles: PropTypes.arrayOf(PropTypes.any),
  roomInfos: PropTypes.objectOf(PropTypes.any).isRequired,
};

exitingLobby.defaultProps = {
  tiles: [],
};

export default withRouter(exitingLobby);
