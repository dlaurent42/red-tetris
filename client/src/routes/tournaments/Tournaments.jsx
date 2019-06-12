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
import { GAME_MODES } from '../../config/constants';
import './Tournaments.scss';

const fakeRoomNames = ['Acrimony', 'Gridelin', 'Abattoir', 'Diorism', 'Turdine', 'Abattoir', 'Camsteary', 'Ganister', 'Luminous', 'ZaazAnole', 'Sapsago', 'Torsibility', 'Testaceous', 'Hypnosophy', 'Tampion', 'Isogeny', 'Abattoir', 'Luminous', 'Scientism', 'Magnanimous', 'Moriadon8', 'Costard', 'Abderian', 'Verrucose', 'Xenolalia', 'Skiagram', 'Pellucid', 'Ptyalagogue', 'Blauwbok', 'Adnomination', 'Luminous', 'Acrimony', 'Pejorism', 'Divaricate', 'Papyrography', 'Affranchise', 'Luminous', 'Abattoir', 'Luminous', 'Tattersall', 'Jackanapes', 'Schmutz', 'ComplainZygote', 'Ensorcell', 'HoiPolloi', 'Cacophony', 'Freewheeling', 'SpittinYoyo', 'Whodunit', 'Petcock', 'DamperGuffaw', 'Alfresco', 'Bugbear', 'PlotclassDaedal', 'JohnmuerJunket', 'Muffuletta', 'Joementum', 'Emo1Wigout', 'Godwottery', 'Pomposity', 'Toothsome', 'Ostinato', 'Currish', 'Toupeeba4000', 'Whatsis', 'Gubbins', 'Blinker', 'Tookusde0909', 'Whisternefet', 'Erinaceous', 'Sternutate', 'Tumultuous', 'Maelstrom', 'Ephemeral', 'Moniker', 'Shartnuts334', 'Zonkedle1128', 'Sthenereu12345', 'Quokkareap3r', 'Manorexic'];
const rdmStr = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // eslint-disable-line
const rdmNbr = bound => Math.floor(Math.random() * bound);

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
    props.socket.emit('getRoomsList');
    const fakeData = [];
    for (let index = 0; index < 45; index += 1) {
      const a = rdmNbr(2) + 1;
      const b = rdmNbr(3) + 1;
      const hasPwd = Math.random() >= 0.5;
      fakeData.push({
        hasPwd,
        pwd: (hasPwd) ? rdmStr() : '',
        roomId: rdmStr(),
        roomName: fakeRoomNames[rdmNbr(fakeRoomNames.length)],
        nbPlayers: Math.min(a, b),
        maxPlayers: Math.max(a, b),
        mode: GAME_MODES[rdmNbr(GAME_MODES.length)],
      });
    }
    setTournamentsList(fakeData);
  }, []);

  // Add event listener on rooms updates
  useEffect(() => {
    props.socket.on('updateRoomsList', (data) => {
      console.log('[Tournaments] receive data from event listener');
      setTournamentsList(data);
    });
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
