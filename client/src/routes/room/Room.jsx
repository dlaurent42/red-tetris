import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Paper from '@material-ui/core/Paper';
import Game from './Game';
import Specter from './Specter';
import Pile from './Pile';
import Infos from './Infos';
import Counter from './Counter';
import Header from '../../misc/navigation/header/Header';
import Footer from '../../misc/navigation/footer/Footer';
import { ROOM_ROLES, SOCKETS } from '../../config/constants';
import './Room.scss';

const room = (props) => {

  // Define user
  const parameters = window.location.hash.split('/').slice(1)[0].split(/\[(.+?)\]/);
  const [user, setUser] = useState({
    username: parameters[1],
    score: 0,
    status: false,
    role: parameters[7],
  });
  const [params, setParams] = useState({
    roomName: parameters[0],
    roomId: parameters[3],
    roomPassword: parameters[5],
    users: [],
  });
  const [game, setGame] = useState({ hasStarted: false, counterRun: false, gameOver: false });

  // Define tiles stack
  const [tilesStack, setTilesStack] = useState([]);

  // On load, check if room exists, if it has a password, is username is correct, etc.
  useEffect(() => {

    // Check if room exists, create it if not
    props.socket.emit(SOCKETS.ROOM_INFOS, { ...params }, (data) => {

      // Check password
      if (data.roomHasPassword && data.roomPassword !== params.password) {
        props.socket.emit(SOCKETS.ROOM_FORBIDDEN_ACCESS, { ...data });
        props.history.push('/tournaments');
      }

      // Check number of players if role is not spectator
      const updatedUser = {
        username: (props.user.uid) ? props.user.username : parameters[1],
        score: 0,
        status: false,
        role: (user.role === ROOM_ROLES.SPECTATOR
        || data.nbPlayers + 1 > data.maxPlayers
        || data.gameHasStarted) ? ROOM_ROLES.SPECTATOR : user.role,
      };

      // Update both user and room information
      setUser(updatedUser);
      setParams({ ...data });
      props.socket.emit(SOCKETS.ROOM_USER_JOINED, { roomId: data.roomId, user: updatedUser });
    });

  }, []);

  useEffect(() => {
    const unlisten = props.history.listen(() => {
      props.socket.emit(SOCKETS.ROOM_USER_LEFT, { roomId: params.roomId, user });
    });
    return () => unlisten();
  }, []);

  console.log(`render Room gameOver=${game.gameOver}`);
  return (
    <div className="room-container">
      <Header />
      <Counter
        game={game}
        setGame={setGame}
      />
      <Paper className="room-paper">
        <div className="flex-container">
          <Game
            game={game}
            setGame={setGame}
            socket={props.socket}
            roomId={params.roomId || ''}
            tilesStack={tilesStack}
            setTilesStack={setTilesStack}
          />
          <div className="flex-subcontainer">
            <Infos
              socket={props.socket}
              userInfos={user}
              setUserInfos={setUser}
              roomInfos={params}
              setRoomInfos={setParams}
              gameInfos={game}
            />
            <Pile
              tilesStack={tilesStack}
            />
            {params.maxPlayer > 1 ? <Specter socket={props.socket} /> : null }
          </div>
        </div>
      </Paper>
      <Footer />
    </div>
  );
};

room.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  user: state.user.user,
  socket: state.socket.socket,
});

export default withRouter(connect(mapStateToProps)(room));
