import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { countBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { ICONS, ROOM_ROLES, SOCKETS } from '../../config/constants';

const infos = (props) => {
  const setUserReady = () => {
    props.setUserInfos({ ...props.userInfos, status: true });
    props.socket.emit(SOCKETS.ROOM_USER_UPDATE, {
      roomId: props.roomInfos.roomId,
      user: { ...props.userInfos, status: true },
    });
  };

  const inviteFriend = () => {
    // if (!props.userInfos.userId) return;
  };

  const startGame = () => {
    props.socket.emit(SOCKETS.GAME_STARTS, { roomId: props.roomInfos.roomId });
  };

  // Listen to room updates
  useEffect(() => {
    props.socket.on(
      SOCKETS.ROOM_UPDATE,
      (data) => {
        console.log('ROOM_UPDATE');
        props.setRoomInfos({ ...props.roomInfos, ...data });
      },
    );
  }, []);

  // Listen to user updates
  useEffect(() => {
    props.socket.on(
      SOCKETS.ROOM_USER_UPDATE,
      (data) => {
        console.log('ROOM_USER_UPDATE');
        props.setUserInfos({ ...props.userInfos, ...data });
      },
    );
  }, []);

  // Handle number of spectators
  const spectatorsCounter = countBy(
    props.roomInfos.users,
    { role: ROOM_ROLES.SPECTATOR },
  ).true || 0;

  // Handle number of players ready
  const playersReadyCounter = (countBy(
    props.roomInfos.users,
    { role: ROOM_ROLES.PLAYER, status: true },
  ).true || 0) + (countBy(
    props.roomInfos.users,
    { role: ROOM_ROLES.CREATOR, status: true },
  ).true || 0);

  // Handle filtered users
  const filteredUsers = props.roomInfos.users.filter(u => (
    u.role !== ROOM_ROLES.SPECTATOR && u.socketId !== props.socket.id
  ));

  // Handle display of current user
  let currentUser;
  if (!props.gameInfos.hasStarted) {
    currentUser = (props.userInfos.status)
      ? <Button disabled className="room-infos-current-user-ready">READY!</Button>
      : <Button onClick={setUserReady} className="room-infos-current-user-nready">READY?</Button>;
  } else currentUser = <div className="room-infos-score">{props.userInfos.score}</div>;

  // Handle display of other users
  const otherUser = Array((props.roomInfos.maxPlayers > 0) ? props.roomInfos.maxPlayers - 1 : 0)
    .fill(<Button onClick={inviteFriend} disable={props.userInfos.userId > 0}>{(props.userInfos.userId) ? 'invite friend' : 'waiting for player'}</Button>)
    .map((el, idx) => {
      if (!filteredUsers[idx]) return <Button key={Math.random() * 1500} onClick={inviteFriend}>{(props.userInfos.userId) ? 'invite friend' : 'wait for player'}</Button>;
      if (props.gameInfos.hasStarted) {
        return (
          <div key={Math.random() * 1500} className="room-infos-other-user-ctn">
            <div className="room-infos-other-user-usm">{filteredUsers[idx].username}</div>
            <div className="room-infos-other-user-scr">{filteredUsers[idx].score}</div>
          </div>
        );
      }
      return (
        <div key={Math.random() * 1500} className="room-infos-other-user-ctn">
          <div className="room-infos-other-user-usm">{filteredUsers[idx].username}</div>
          <div
            className={['room-infos-other-user-sts', (filteredUsers[idx].status) ? 'ready' : 'waiting'].join(' ')}
          >
            {(filteredUsers[idx].status) ? 'ready' : 'waiting'}
          </div>
        </div>
      );
    });

  // Render
  console.log('render Infos');
  return (
    <Paper className="room-infos">
      <div className="room-infos-header">
        <Typography gutterBottom variant="h4">{props.roomInfos.roomName}</Typography>
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
      {
        (props.userInfos.role === ROOM_ROLES.CREATOR && !props.gameInfos.hasStarted)
          ? (
            <Button
              disabled={playersReadyCounter < props.roomInfos.maxPlayers}
              onClick={startGame}
            >
              Start
            </Button>
          ) : null
      }
      {(props.gameInfos.gameOver) ? <div>Game over</div> : null}
    </Paper>
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

export default infos;
