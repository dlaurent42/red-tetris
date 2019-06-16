import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Header from '../../misc/navigation/header/Header';
import Footer from '../../misc/navigation/footer/Footer';
import Settings from './Settings';
import Table from './Table';
import JoinRoom from './JoinRoom';
import CreateRoom from './CreateRoom';
import { SOCKETS } from '../../config/constants';
import './Tournaments.scss';

const tournaments = (props) => {

  // State
  const [tournamentsList, setTournamentsList] = useState([]);
  const [displayJoinRoomDialogBox, setDisplayJoinRoomDialogBox] = useState(false);
  const [displayCreateRoomDialogBox, setDisplayCreateRoomDialogBox] = useState(false);
  const [filters, setFilters] = useState({
    showFullRooms: true,
    showRoomsWithPwd: true,
    searchValue: '',
  });
  const [joinRoomData, setJoinRoomData] = useState({});

  // ComponentDidMount: fetch rooms list
  useEffect(() => {
    // To be kept
    props.socket.emit(
      SOCKETS.TOURNAMENTS_LIST,
      {},
      data => setTournamentsList(data.tournaments),
    );
  }, []);

  // Add event listener on rooms updates
  useEffect(() => {
    props.socket.on(SOCKETS.TOURNAMENTS_UPDATE, (data) => {
      setTournamentsList(data.tournaments);
    });
    return () => props.socket.removeAllListeners();
  }, [tournamentsList]);

  return (
    <div className="tournaments-container">
      <Header color="dark" />
      <Paper className="tournaments-paper">
        <Settings
          filters={filters}
          setFilters={setFilters}
          setDisplayCreateRoomDialogBox={setDisplayCreateRoomDialogBox}
        />
        <Table
          list={tournamentsList}
          filters={filters}
          setDisplayJoinRoomDialogBox={setDisplayJoinRoomDialogBox}
          setJoinRoomData={setJoinRoomData}
        />
      </Paper>
      <Footer />

      <JoinRoom
        roomData={joinRoomData}
        displayJoinRoomDialogBox={displayJoinRoomDialogBox}
        setDisplayJoinRoomDialogBox={setDisplayJoinRoomDialogBox}
      />
      <CreateRoom
        displayCreateRoomDialogBox={displayCreateRoomDialogBox}
        setDisplayCreateRoomDialogBox={setDisplayCreateRoomDialogBox}
      />
    </div>
  );
};

tournaments.propTypes = {
  socket: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  socket: state.socket.socket,
});

export default connect(mapStateToProps)(tournaments);
