import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Header from '../../components/navigation/header/Header';
import Footer from '../../components/navigation/footer/Footer';
import { ICONS, GAME_MODES } from '../../config/constants';
import './Tournaments.scss';

const fakeRoomNames = ['Acrimony', 'Gridelin', 'Abattoir', 'Diorism', 'Turdine', 'Abattoir', 'Camsteary', 'Ganister', 'Luminous', 'ZaazAnole', 'Sapsago', 'Torsibility', 'Testaceous', 'Hypnosophy', 'Tampion', 'Isogeny', 'Abattoir', 'Luminous', 'Scientism', 'Magnanimous', 'Moriadon8', 'Costard', 'Abderian', 'Verrucose', 'Xenolalia', 'Skiagram', 'Pellucid', 'Ptyalagogue', 'Blauwbok', 'Adnomination', 'Luminous', 'Acrimony', 'Pejorism', 'Divaricate', 'Papyrography', 'Affranchise', 'Luminous', 'Abattoir', 'Luminous', 'Tattersall', 'Jackanapes', 'Schmutz', 'ComplainZygote', 'Ensorcell', 'HoiPolloi', 'Cacophony', 'Freewheeling', 'SpittinYoyo', 'Whodunit', 'Petcock', 'DamperGuffaw', 'Alfresco', 'Bugbear', 'PlotclassDaedal', 'JohnmuerJunket', 'Muffuletta', 'Joementum', 'Emo1Wigout', 'Godwottery', 'Pomposity', 'Toothsome', 'Ostinato', 'Currish', 'Toupeeba4000', 'Whatsis', 'Gubbins', 'Blinker', 'Tookusde0909', 'Whisternefet', 'Erinaceous', 'Sternutate', 'Tumultuous', 'Maelstrom', 'Ephemeral', 'Moniker', 'Shartnuts334', 'Zonkedle1128', 'Sthenereu12345', 'Quokkareap3r', 'Manorexic'];
const rdmStr = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // eslint-disable-line
const rdmNbr = bound => Math.floor(Math.random() * bound);

const tournaments = (props) => {

  // State
  const [searchInputRef, setSearchInputRef] = useState(null);
  const [tournamentsList, setTournamentsList] = useState([]);
  const [filteredTournamentsList, setFilteredTournamentsList] = useState([]);
  const [openDialogJoin, setOpenDialogJoin] = useState(false);
  const [roomDialogJoin, setRoomDialogJoin] = useState({});
  const [roomDialogJoinPwd, setRoomDialogJoinPwd] = useState('');
  const [openDialogCreate, setOpenDialogCreate] = useState(false);
  const [openDialogCreateForm, setOpenDialogCreateForm] = useState({});
  const [form, setForm] = useState({
    showFullRooms: true,
    showRoomsWithPwd: true,
    searchValue: '',
  });

  // Util permitting to filter data based on fields
  const filterTournamentsList = (data, filters) => {
    setFilteredTournamentsList(data.filter((el) => {
      if (filters.showFullRooms === false && el.nbPlayers >= el.maxPlayers) return false;
      if (filters.showRoomsWithPwd === false && el.hasPwd) return false;
      if (filters.searchValue !== '' && el.roomName.includes(filters.searchValue) === false) return false;
      return true;
    }));
  };

  // form change handler
  const handleFormChange = field => (event) => {
    const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
    setForm({ ...form, [field]: value });
    filterTournamentsList(tournamentsList, { ...form, [field]: value });
  };
  const handleCreationFormChange = field => (event) => {
    const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
    setOpenDialogCreateForm({ ...openDialogCreateForm, [field]: value });
  };

  // ComponentDidMount: fetch rooms list
  useEffect(() => {
    // props.socket.emit('getRoomsList');
    const fakeData = [];
    for (let index = 0; index < 45; index += 1) {
      const a = rdmNbr(2) + 1;
      const b = rdmNbr(3) + 1;
      const hasPwd = Math.random() >= 0.5;
      fakeData.push({
        hasPwd,
        pwd: (hasPwd) ? rdmStr() : undefined,
        roomId: rdmStr(),
        roomName: fakeRoomNames[rdmNbr(fakeRoomNames.length)],
        nbPlayers: Math.min(a, b),
        maxPlayers: Math.max(a, b),
        mode: GAME_MODES[rdmNbr(GAME_MODES.length)],
      });
    }
    setTournamentsList(fakeData);
    setFilteredTournamentsList(fakeData);
  }, []);

  // Add event listener on rooms updates
  useEffect(() => {
    props.socket.on('updateRoomsList', (data) => {
      setTournamentsList(data);
      filterTournamentsList(data, form);
    });
  }, [tournamentsList]);

  return (
    <div className="tournaments-container">
      <Header color="dark" />
      <Paper className="tournaments-paper">

        {/* ------ TOURNAMENT SETTINGS ------ */}

        <FormGroup row className="tournaments-form">
          <FormGroup row className="tournaments-subform-right">
            <FormControlLabel
              control={(
                <Checkbox
                  checked={form.showFullRooms}
                  onChange={handleFormChange('showFullRooms')}
                  value={form.showFullRooms}
                  color="default"
                />
              )}
              label="Show full rooms"
            />
            <FormControlLabel
              control={(
                <Checkbox
                  checked={form.showRoomsWithPwd}
                  onChange={handleFormChange('showRoomsWithPwd')}
                  value={form.showRoomsWithPwd}
                  color="default"
                />
              )}
              label="Show rooms with password"
            />
          </FormGroup>
          <FormGroup row className="tournaments-subform-left">
            <div className="tournament-searchbar">
              <input ref={(ip) => { setSearchInputRef(ip); }} value={form.searchValue} onChange={handleFormChange('searchValue')} />
              <FontAwesomeIcon icon={ICONS.SEARCH} onClick={() => searchInputRef.focus()} />
            </div>
            <Button variant="outlined" className="button" onClick={() => setOpenDialogCreate(true)}>Create room</Button>
          </FormGroup>
        </FormGroup>

        {/* ------ TOURNAMENT LIST ------ */}

        {
          useMemo(() => (
            <Table className="tournaments-table">
              <TableHead className="tournaments-table-head">
                <TableRow>
                  <TableCell />
                  <TableCell align="center">Room&nbsp;ID</TableCell>
                  <TableCell align="center">Room&nbsp;Name</TableCell>
                  <TableCell align="center">Mode</TableCell>
                  <TableCell align="center">Players</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tournaments-table-body">
                {filteredTournamentsList.map(tournament => (
                  <TableRow key={tournament.roomId} className="tournaments-table-row" onClick={() => { setOpenDialogJoin(true); setRoomDialogJoin(tournament); }}>
                    <TableCell align="center">
                      <FontAwesomeIcon icon={ICONS.LOCK} className={['tournaments-lock', (tournament.hasPwd) ? 'lock' : 'unlock'].join(' ')} />
                    </TableCell>
                    <TableCell align="center">{tournament.roomId}</TableCell>
                    <TableCell align="center">{tournament.roomName}</TableCell>
                    <TableCell align="center">{tournament.mode}</TableCell>
                    <TableCell align="center">{`${tournament.nbPlayers}/${tournament.maxPlayers}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ), [filteredTournamentsList])
        }
      </Paper>
      <Footer />

      {/* ------ ROOM JOIN ------ */}

      <Dialog
        open={openDialogJoin}
        onClose={() => { setOpenDialogJoin(false); setRoomDialogJoinPwd(''); }}
        aria-labelledby="join-room"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="join-room">{`Join ${roomDialogJoin.roomName}`}</DialogTitle>
        <DialogContent>
          {(roomDialogJoin.hasPwd && roomDialogJoin.nbPlayers < roomDialogJoin.maxPlayers)
            ? <DialogContentText>{`Room password: ${roomDialogJoin.pwd}`}</DialogContentText> : null}
          <DialogContentText>
            The goal of Tetris is to score as many points as possible&nbsp;
            by clearing horizontal lines of Blocks.&nbsp;
            The player must rotate, move, and drop the falling&nbsp;
            Tetriminos inside the Matrix (playing field).&nbsp;
            Lines are cleared when they are filled with Blocks and have no empty spaces.
          </DialogContentText>
          {(roomDialogJoin.hasPwd && roomDialogJoin.nbPlayers < roomDialogJoin.maxPlayers)
            ? (
              <TextField
                autoFocus
                margin="dense"
                id="standard-username"
                label="room password"
                className="room-password"
                value={roomDialogJoinPwd}
                onChange={e => setRoomDialogJoinPwd(e.target.value)}
                fullWidth
              />
            ) : null}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => { setOpenDialogJoin(false); setRoomDialogJoinPwd(''); }} color="primary">
            Spectator
          </Button>
          {(roomDialogJoin.nbPlayers < roomDialogJoin.maxPlayers)
            ? (
              <Button disabled={roomDialogJoinPwd !== roomDialogJoin.pwd} variant="contained" onClick={() => { setOpenDialogJoin(false); setRoomDialogJoinPwd(''); }} color="primary" autoFocus>
                Player
              </Button>
            ) : null}
        </DialogActions>
      </Dialog>

      {/* ------ ROOM CREATION ------ */}

      <Dialog
        open={openDialogCreate}
        onClose={() => setOpenDialogCreate(false)}
        aria-labelledby="create-room"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="create-room">Create Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            In order to create a room, create a room :)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenDialogCreate(false)} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={() => setOpenDialogCreate(false)} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
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
