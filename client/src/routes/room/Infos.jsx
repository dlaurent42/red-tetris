import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { countBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ICONS, ROOM_ROLES, SOCKETS } from '../../config/constants';

const infos = (props) => {
  console.log('[infos');

  const setUserReady = () => {
    props.setUserInfos({ ...props.userInfos, status: true });
    props.socket.emit(SOCKETS.ROOM_USER_UPDATE, {
      roomId: props.roomInfos.roomId,
      user: { ...props.userInfos, status: true },
    });
  };

  const inviteFriend = () => {
    if (!props.userInfos.userId) return;
    console.log('invitation sent');
  };

  // Listen to room updates
  useEffect(() => {
    props.socket.on(
      SOCKETS.ROOM_UPDATE,
      data => props.setRoomInfos({ ...props.roomInfos, ...data }),
    );
  }, []);

  // Listen to user updates
  useEffect(() => {
    props.socket.on(
      SOCKETS.ROOM_USER_UPDATE,
      data => props.setUserInfos({ ...props.userInfos, ...data }),
    );
  }, []);

  // Handle number of spectators
  const spectatorsCounter = countBy(props.roomInfos.users, { role: ROOM_ROLES.SPECTATOR }).true;

  // Handle display of current user
  let currentUser;
  if (!props.gameInfos.hasStarted) {
    currentUser = (props.userInfos.status)
      ? <Button disabled className="room-infos-current-user-ready">READY!</Button>
      : <Button onClick={setUserReady} className="room-infos-current-user-nready">READY?</Button>;
  } else currentUser = <div className="room-infos-score">{props.userInfos.score}</div>;

  // Handle display of other users
  const otherUser = Array.from(Array(props.roomInfos.maxPlayers).keys())
    .fill(<Button onClick={inviteFriend} disable={props.userInfos.userId > 0}>{(props.userInfos.userId) ? 'invite friend' : 'wait for player'}</Button>)
    .map((el) => {
      if (!props.roomInfos.users[el]) return <Button key={`user_${el}`} onClick={inviteFriend}>{(props.userInfos.userId) ? 'invite friend' : 'wait for player'}</Button>;
      if (props.gameInfos.hasStarted) {
        return (
          <div key={`user_${el}`} className="room-infos-other-user-ctn">
            <div className="room-infos-other-user-usm">{props.roomInfos.users[el].username}</div>
            <div className="room-infos-other-user-scr">{props.roomInfos.users[el].score}</div>
          </div>
        );
      }
      return (
        <div key={`user_${el}`} className="room-infos-other-user-ctn">
          <div className="room-infos-other-user-usm">{props.roomInfos.users[el].username}</div>
          <div
            className={['room-infos-other-user-sts', (props.roomInfos.users[el].status) ? 'ready' : 'waiting'].join(' ')}
          >
            {(props.roomInfos.users[el].status) ? 'ready' : 'waiting'}
          </div>
        </div>
      );
    });
  // Render
  return (
    <div className="room-infos">
      <div className="room-infos-header">
        <Typography>{props.roomInfos.roomName}</Typography>
        {(spectatorsCounter)
          ? (
            <div className="room-infos-watcher">
              <span>{spectatorsCounter}</span>
              <FontAwesomeIcon icon={ICONS.EYE} className="leaderboard-icon award" />
            </div>
          ) : null}
      </div>
      <div className="room-infos-current-user">
        <div>{props.userInfos.username}</div>
        {currentUser}
      </div>
      <div className="room-infos-other-users">
        {otherUser}
      </div>
    </div>
  );
};

infos.propTypes = {
  userInfos: PropTypes.objectOf(PropTypes.any).isRequired,
  setUserInfos: PropTypes.func.isRequired,
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
  roomInfos: PropTypes.objectOf(PropTypes.any).isRequired,
  setRoomInfos: PropTypes.func.isRequired,
  gameInfos: PropTypes.objectOf(PropTypes.any).isRequired,
};

/*

user: {
  username,
  score,
  status,
  role,
}

roomInfos: {
  roomName,
  roomId,
  roomPassword,
  users: [ { username, score, status(ready, not ready), role }],
}

gameInfos: {
  hasStarted,
  counterRun,
  gameOver,
}

room

if ! game  has started:
  player... [ready] / [not ready]
  enemy... [waiting] [ready]

if game has started:
  player: score
  enemy: score (even if he has left the room)

*/

export default infos;
