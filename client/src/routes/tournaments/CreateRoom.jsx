import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { GAME_MODES, REGEX, ROOM_ROLES } from '../../config/constants';

const makeid = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const createRoom = (props) => {

  const [form, setForm] = useState({
    name: '',
    password: '',
    maxPlayers: 1,
    mode: GAME_MODES[0],
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    password: false,
    maxPlayers: false,
    mode: false,
  });

  const handleFormChange = field => event => setForm({ ...form, [field]: event.target.value });
  const validateForm = () => {
    setFormErrors({
      name: !(REGEX.ROOM_NAME.test(form.name)),
      maxPlayers: form.maxPlayers !== 1 && form.maxPlayers !== 2,
      mode: !GAME_MODES.includes(form.mode),
      password: form.password.length > 0 && !REGEX.ROOM_PWD.test(form.password),
    });
    if ([(!(REGEX.ROOM_NAME.test(form.name))),
      (form.maxPlayers !== 1 && form.maxPlayers !== 2),
      (!GAME_MODES.includes(form.mode)),
      (form.password.length > 0 && !REGEX.ROOM_PWD.test(form.password)),
    ].includes(true)) return;
    props.history.push({
      pathname: `/${form.name}[${props.user.username}]`,
      state: {
        room: {
          id: makeid(64),
          name: form.name,
          maxPlayers: form.maxPlayers,
          hasPassword: (form.password.length > 0),
          password: form.password,
          mode: form.mode,
        },
        user: {
          role: ROOM_ROLES.CREATOR,
          id: props.user.uid,
          username: props.user.username,
          avatar: props.user.avatar,
        },
      },
    });
  };

  return (
    <Dialog
      open={props.displayCreateRoomDialogBox}
      onClose={() => props.setDisplayCreateRoomDialogBox(false)}
      aria-labelledby="create-room"
      aria-describedby="alert-dialog-description"
      className="create-room"
    >
      <DialogTitle id="create-room">Create Room</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item>
            <TextField
              className="create-room-input"
              required
              autoFocus
              margin="dense"
              error={formErrors.name}
              id="standard-room-name"
              label="Name"
              value={form.name}
              onChange={handleFormChange('name')}
            />
          </Grid>
          <Grid item>
            <TextField
              className="create-room-input"
              margin="dense"
              error={formErrors.password}
              id="standard-room-pwd"
              label="Password (opt.)"
              value={form.password}
              onChange={handleFormChange('password')}
              type="password"
            />
          </Grid>
        </Grid>
        <FormControl fullWidth className="create-room-input">
          <InputLabel htmlFor="max-players-select">Max. Players</InputLabel>
          <Select
            required
            onChange={handleFormChange('maxPlayers')}
            value={form.maxPlayers}
            inputProps={{
              name: 'maxPlayers',
              id: 'max-players-select',
            }}
          >
            <MenuItem value={1}>solo</MenuItem>
            <MenuItem value={2}>versus</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className="create-room-input">
          <InputLabel htmlFor="mode-select">Mode</InputLabel>
          <Select
            required
            onChange={handleFormChange('mode')}
            value={form.mode}
            inputProps={{
              name: 'mode',
              id: 'mode-select',
            }}
          >
            {GAME_MODES.map(mode => <MenuItem key={mode} value={mode}>{mode}</MenuItem>)}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => props.setDisplayCreateRoomDialogBox(false)} color="primary">
          Cancel
        </Button>
        <Button variant="contained" onClick={validateForm} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

createRoom.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  displayCreateRoomDialogBox: PropTypes.bool.isRequired,
  setDisplayCreateRoomDialogBox: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user.user,
});

export default withRouter(connect(mapStateToProps)(createRoom));
