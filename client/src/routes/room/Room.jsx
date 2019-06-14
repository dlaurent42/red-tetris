import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Paper from '@material-ui/core/Paper';
import Game from './Game';
import Specter from './Specter';
import Pile from './Pile';
import Header from '../../misc/navigation/header/Header';
import Footer from '../../misc/navigation/footer/Footer';
import { ROOM_ROLES, SOCKETS } from '../../config/constants';
import './Room.scss';

const room = (props) => {

  // Define user
  const parameters = window.location.hash.split('/').slice(1)[0].split(/\[(.+?)\]/);
  const [user, setUser] = useState({});
  const [params, setParams] = useState({
    roomName: parameters[0],
    roomId: parameters[3],
    roomPassword: parameters[5],
    username: parameters[1],
    userRole: parameters[7],
  });

  // Define tiles stack
  const [tilesStack, setTilesStack] = useState([]);

  // On load, check if room exists, if it has a password, is username is correct, etc.
  useEffect(() => {

    // Check if room exists, create it if not
    props.socket.emit(SOCKETS.EMIT_FETCH_ROOM, { ...params }, (data) => {

      // Check password
      if (data.hasPwd && data.pwd !== params.password) props.history.push('/tournaments');

      // Check number of players if role is not spectator
      if (params.userRole !== ROOM_ROLES.SPECTATOR && data.nbPlayer >= data.maxPlayers) {
        setParams({ ...params, userRole: ROOM_ROLES.SPECTATOR });
        props.socket.emit(SOCKETS.EMIT_JOIN_ROOM, { ...params, userRole: ROOM_ROLES.SPECTATOR });
      } props.socket.emit(SOCKETS.EMIT_JOIN_ROOM, { ...params });

      // Check user data
      if (props.user.uid) setUser({ ...props.user, isReady: false });
      else setUser({ username: params.username, isReady: false });

    });

  }, []);

  // Check before unload
  const onBeforeUnloadHandler = (e) => {
    e.preventDefault();
    console.log('before unload needs call api to update score and emit player left the game');
    console.log('for redirection, do it in header');
  };

  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnloadHandler);
    return () => window.removeEventListener('beforeunload', onBeforeUnloadHandler);
  }, []);

  return (
    <div className="room-container">
      <Header />
      <Paper className="room-paper">
        <div className="flex-container">
          <Game
            socket={props.socket}
            roomId={params.roomId}
            tilesStack={tilesStack}
            setTilesStack={setTilesStack}
          />
          <Pile
            tilesStack={tilesStack}
          />
          <Specter
            socket={props.socket}
          />
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
