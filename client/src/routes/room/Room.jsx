import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Header from '../../misc/navigation/header/Header';
import Footer from '../../misc/navigation/footer/Footer';
import EnteringLobby from './entering-lobby/EnteringLobby';
import ExitingLobby from './exiting-lobby/ExitingLobby';
import PlayerLobby from './playing-lobby/PlayerLobby';
import Specter from './components/Specter';
import NextTile from './components/NextTile';
import GameInformations from './components/GameInformations';
import { ROOM_ROLES, SOCKETS } from '../../config/constants';
import './Room.scss';

const room = (props) => {

  // State relative to room
  const [roomInfos, setRoomInfos] = useState({});

  // State relative to user
  const [userInfos, setUserInfos] = useState({});

  // State relative to pieces
  const [tiles, setTiles] = useState([]);
  const [tilesStack, setTilesStack] = useState([]);

  // Event used on page load
  useEffect(() => {

    // Check if user navigated to this page through url directly
    if (props.location.state === undefined) {
      props.socket.emit(SOCKETS.ROOM_FORBIDDEN_ACCESS, { name: window.location.hash.split('/').slice(1)[0].split(/\[(.*?)\]/)[0] });
      props.history.push('/tournaments');
      return;
    }

    // Fetch information about room
    props.socket.emit(SOCKETS.ROOM_INFOS, { ...props.location.state.room }, (data) => {

      // Check password
      if (data.hasPassword && data.password !== props.location.state.password) {
        props.socket.emit(SOCKETS.ROOM_FORBIDDEN_ACCESS, { name: data.name });
        props.history.push('/tournaments');
        return;
      }

      // Add information to user
      const user = {
        ...props.location.state.user,
        score: 0,
        isReady: false,
        role: (props.location.state.user.role === ROOM_ROLES.SPECTATOR
          || data.nbPlayers + 1 > data.maxPlayers
          || data.hasStarted
        ) ? ROOM_ROLES.SPECTATOR : props.location.state.user.role,
      };

      // Update information containers
      setUserInfos({ ...user });
      setRoomInfos({ ...data });
      props.socket.emit(SOCKETS.ROOM_USER_JOINED, { id: data.id, user });

    });
  }, []);

  // Event listener on page unload
  useEffect(() => {
    const unlisten = props.history.listen(() => {
      props.socket.emit(SOCKETS.ROOM_USER_LEFT, { id: roomInfos.id, user: userInfos });
    });
    return () => unlisten();
  }, [roomInfos, userInfos]);

  // Event listener on game starts / game over / romm update events
  const handleGameStarts = (data) => {
    setTiles([data.startTile]);
    setTilesStack(data.tilesStack);
    setRoomInfos(data.lobby);
  };
  const handleGameOver = data => setRoomInfos(data);
  const handleGameUpdate = data => setRoomInfos(data);
  useEffect(() => {
    props.socket.on(SOCKETS.GAME_STARTS, handleGameStarts);
    props.socket.on(SOCKETS.GAME_OVER, handleGameOver);
    props.socket.on(SOCKETS.ROOM_UPDATE, handleGameUpdate);
    return () => {
      props.socket.removeListener(SOCKETS.GAME_STARTS, handleGameStarts);
      props.socket.removeListener(SOCKETS.GAME_OVER, handleGameOver);
      props.socket.removeListener(SOCKETS.ROOM_UPDATE, handleGameUpdate);
    };
  }, []);

  // Select lobby to display
  let lobby;
  switch (roomInfos.hasStarted + roomInfos.hasEnded) {

    // Handle case where game has not started yet
    case 0:
      lobby = (
        <EnteringLobby
          socket={props.socket}
          roomInfos={roomInfos}
          userInfos={userInfos}
          setUserInfos={setUserInfos}
        />
      );
      break;

    // Handle case where game has started
    case 1:
      lobby = (userInfos.role === ROOM_ROLES.SPECTATOR)
        ? (
          <div className="flex-container">
            {(roomInfos.players.filter(player => player.role !== ROOM_ROLES.SPECTATOR).length)
              ? roomInfos.players
                .filter(player => player.role !== ROOM_ROLES.SPECTATOR)
                .map(player => (
                  <Specter
                    key={`specter${player.socketId}`}
                    type="large"
                    player={player}
                  />
                ))
              : <div className="no-player-left">No player left.</div>}
          </div>
        ) : (
          <div className="flex-container">
            <PlayerLobby
              id={roomInfos.id}
              mode={roomInfos.mode}
              socket={props.socket}
              tiles={tiles}
              setTiles={setTiles}
              tilesStack={tilesStack}
              setTilesStack={setTilesStack}
            />
            <div className="flex-container-right">
              <GameInformations roomInfos={roomInfos} socket={props.socket} />
              {(roomInfos.mode !== 'invisible') ? <NextTile tile={tilesStack[0]} /> : null}
              {(roomInfos.mode !== 'invisible')
                ? roomInfos.players
                  .filter(player => (
                    player.role !== ROOM_ROLES.SPECTATOR && player.socketId !== props.socket.id
                  ))
                  .map(player => (
                    <Specter
                      key={`specter${player.socketId}`}
                      type="small"
                      player={player}
                    />
                  ))
                : null}
            </div>
          </div>
        );
      break;

    // Handle case where game has ended
    case 2:
      lobby = (
        <ExitingLobby
          socket={props.socket}
          tiles={tiles}
          roomInfos={roomInfos}
        />
      );
      break;
    default: lobby = null;
  }

  // Render component
  return (
    <div className="room-container">
      <Header />
      <Paper className="room-lobby">
        {lobby}
      </Paper>
      <Footer />
    </div>
  );
};

room.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  socket: state.socket.socket,
});

export default withRouter(connect(mapStateToProps)(room));
