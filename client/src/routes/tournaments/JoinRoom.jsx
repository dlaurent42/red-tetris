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

const joinRoom = (props) => {

  const [password, setPassword] = useState('');

  const handleValidation = (role) => {
    if (role === 'player'
      && ((props.data.hasPassword && password !== props.data.password)
      || props.data.nbPlayers >= props.data.maxPlayers)) return;
    props.history.push({
      pathname: `/${props.data.name}[${props.user.username}]`,
      state: {
        room: {
          id: props.data.id,
          name: props.data.name,
          hasPassword: props.data.hasPassword,
          password: props.data.password,
        },
        user: {
          role,
          id: props.user.uid,
          username: props.user.username,
          avatar: props.user.avatar,
        },
      },
    });
  };

  return (
    <Dialog
      open={props.displayJoinRoomDialogBox}
      onClose={() => props.setDisplayJoinRoomDialogBox(false)}
      aria-labelledby="join-room"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="join-room">{`Join ${props.data.name}`}</DialogTitle>
      <DialogContent>
        {(props.data.hasPassword && props.data.nbPlayers < props.data.maxPlayers)
          ? <DialogContentText>{`Room password: ${props.data.password}`}</DialogContentText> : null}
        <DialogContentText>
          The goal of Tetris is to score as many points as possible&nbsp;
          by clearing horizontal lines of Blocks.&nbsp;
          The player must rotate, move, and drop the falling&nbsp;
          Tetriminos inside the Matrix (playing field).&nbsp;
          Lines are cleared when they are filled with Blocks and have no empty spaces.
        </DialogContentText>
        {(props.data.hasPassword && props.data.nbPlayers < props.data.maxPlayers)
          ? (
            <TextField
              autoFocus
              margin="dense"
              id="standard-username"
              label="room password"
              className="room-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
        {(props.data.nbPlayers < props.data.maxPlayers)
          ? (
            <Button
              variant="contained"
              autoFocus
              color="primary"
              disabled={
                props.data.hasPassword && password !== props.data.password}
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
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  displayJoinRoomDialogBox: PropTypes.bool.isRequired,
  setDisplayJoinRoomDialogBox: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user.user,
});

export default withRouter(connect(mapStateToProps)(joinRoom));
