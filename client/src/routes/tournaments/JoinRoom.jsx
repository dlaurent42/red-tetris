import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import { DEFAULT } from '../../config/constants';

const joinRoom = (props) => {

  const [roomPassword, setRoomPassword] = useState('');

  const handleValidation = (status) => {
    if (status === 'player'
      && ((props.roomData.hasPwd && roomPassword !== props.roomData.pwd)
      || props.roomData.nbPlayers >= props.roomData.maxPlayers)) return;
    props.history.push(`/${props.roomData.roomName}[${props.user.username || DEFAULT.USERNAME}][${props.roomData.roomId}][${props.roomData.pwd}][${status}]`);
  };

  return (
    <Dialog
      open={props.displayJoinRoomDialogBox}
      onClose={() => props.setDisplayJoinRoomDialogBox(false)}
      aria-labelledby="join-room"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="join-room">{`Join ${props.roomData.roomName}`}</DialogTitle>
      <DialogContent>
        {(props.roomData.hasPwd && props.roomData.nbPlayers < props.roomData.maxPlayers)
          ? <DialogContentText>{`Room password: ${props.roomData.pwd}`}</DialogContentText> : null}
        <DialogContentText>
          The goal of Tetris is to score as many points as possible&nbsp;
          by clearing horizontal lines of Blocks.&nbsp;
          The player must rotate, move, and drop the falling&nbsp;
          Tetriminos inside the Matrix (playing field).&nbsp;
          Lines are cleared when they are filled with Blocks and have no empty spaces.
        </DialogContentText>
        {(props.roomData.hasPwd && props.roomData.nbPlayers < props.roomData.maxPlayers)
          ? (
            <TextField
              autoFocus
              margin="dense"
              id="standard-username"
              label="room password"
              className="room-password"
              value={roomPassword}
              onChange={e => setRoomPassword(e.target.value)}
              fullWidth
            />
          ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => handleValidation('spectator')}
        >
          Spectator
        </Button>
        {(props.roomData.nbPlayers < props.roomData.maxPlayers)
          ? (
            <Button
              variant="contained"
              autoFocus
              color="primary"
              disabled={props.roomData.hasPwd && roomPassword !== props.roomData.pwd}
              onClick={() => handleValidation('player')}
            >
              Player
            </Button>
          ) : null}
      </DialogActions>
    </Dialog>
  );
};

joinRoom.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  roomData: PropTypes.objectOf(PropTypes.any).isRequired,
  displayJoinRoomDialogBox: PropTypes.bool.isRequired,
  setDisplayJoinRoomDialogBox: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user.user,
});

export default withRouter(connect(mapStateToProps)(joinRoom));
