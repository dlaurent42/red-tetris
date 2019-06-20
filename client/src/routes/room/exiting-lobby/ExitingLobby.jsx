import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { find, get, max } from 'lodash';
import Typography from '@material-ui/core/Typography';
import TetrisGrid from '../components/TetrisGrid';
import PlayerSlot from './slots/PlayerSlot';
import generateId from '../../../utils/generateId';
import { ROOM_ROLES, API_CALLS } from '../../../config/constants';

const exitingLobby = (props) => {

  // Function permitting to run a new game
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
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
      },
    });
  };

  // On component will mount call api to update scores
  useEffect(() => {

    // Remember max score
    const maxScore = max(props.roomInfos.scores.map(el => el.score));

    // Update scores for all logged users
    props.roomInfos.scores.forEach((player) => {

      // Set data structure
      const score = {
        mode: props.roomInfos.mode,
        maxPlayers: props.roomInfos.maxPlayers,
        score: player.score,
        username: player.username,
        hasWon: player.score === maxScore,
      };

      // For each logged user, make API call
      axios.put(API_CALLS.PUT_USER({ id: player.id }), { score }, API_CALLS.CONFIG)
        .then(() => {})
        .catch(err => console.log(err));

    });
  }, []);

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
