import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { countBy, sumBy, get } from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SelectAvatar from '../../misc/UI/selectAvatar/SelectAvatar';
import Header from '../../misc/navigation/header/Header';
import Footer from '../../misc/navigation/footer/Footer';
import { userUpdate, userDelete } from '../../store/actions';
import { API_CALLS, DEFAULT } from '../../config/constants';
import ProfileDialogForm from './ProfileDialogForm';
import './Profile.scss';

// Create style to handle avatar display
const useStyles = makeStyles({ dialogPaper: { overflow: 'visible', boxShadow: 'none' } });

const account = (props) => {

  // Set style to handle avatar display
  const classes = useStyles();

  // Declare a state to earn efficiency
  const [profileInfos, setProfileInfos] = useState({ ...props.user });

  // Avatar selection
  const [displayAvatarSelection, toggleAvatarSelectionWindow] = useState(false);

  // Dialog form
  const [dialogFormParameters, setDialogFormParameters] = useState({
    open: false,
    handleClose: () => {},
    handleValidate: () => {},
    textFieldOnChange: () => {},
    textFieldValue: '',
    textFieldLabel: '',
    textFieldType: '',
    textFieldText: '',
    textFieldTitle: '',
  });

  const modifyUserAccount = (param, value) => {
    if (value === '') return;
    axios.put(`${API_CALLS.PUT_USER}${profileInfos.id}`, { user: { [param]: value } }, API_CALLS.CONFIG)
      .then(result => ((result.data.success) ? props.onUserUpdate({ ...result.data.user }) : null))
      .catch(() => {});
  };

  // Handle avatar change
  const handleAvatarChange = (avatar) => {
    toggleAvatarSelectionWindow(false);
    modifyUserAccount('avatar', avatar);
  };

  // Handle form validation
  const validateForm = (param, value) => {

    setDialogFormParameters({ open: false });

    // Handle account modification
    if (param !== 'delAccount') modifyUserAccount(param, value);

    // Handle account deletion
    else {
      axios.delete(`${API_CALLS.DELETE_USER}${profileInfos.id}`, { ...API_CALLS.CONFIG, data: { password: value } })
        .then((result) => {
          if (result.data.success === false) return;
          props.onUserDelete(profileInfos);
          props.history.push('/');
        })
        .catch(() => {});
    }
  };

  // Toggle dialog form
  const handleDialogForm = (param) => {

    const parameters = {
      open: true,
      handleValidate: validateForm,
      handleClose: () => setDialogFormParameters({ open: false }),
      textFieldValue: (param === 'username') ? profileInfos.username : '',
      textFieldLabel: (param === 'username') ? 'username' : 'password',
      textFieldType: (param === 'username') ? 'username' : 'password',
      param,
    };

    if (param === 'username') {
      setDialogFormParameters({
        ...parameters,
        textFieldText: 'Please enter a new username. It must contain at least 6 alphanumeric characters.',
        textFieldTitle: 'Change username',
      });
    } else if (param === 'password') {
      setDialogFormParameters({
        ...parameters,
        textFieldText: 'Please enter a new password. It must contain at least 8 characters including at least one uppercase and one lowercase letter, one digit and one special character.',
        textFieldTitle: 'Change password',
      });
    } else {
      setDialogFormParameters({
        ...parameters,
        textFieldText: 'Please confirm your password to validate account deletion.',
        textFieldTitle: 'Delete account',
      });
    }
  };


  // Method used to fetch user information on page load
  useEffect(() => {
    // Check if user is logged
    if (!props.user.id) props.history.replace('/');

    // Make API call to get latest information about user
    axios.get(`${API_CALLS.GET_USER}/${props.user.id}`, API_CALLS.CONFIG)
      .then((result) => {
        if (result.data.success === false) props.history.replace('/');
        const statistics = {
          gamesPlayed: result.data.user.scores.length,
          gamesWon: countBy(result.data.user.scores, { hasWon: true }).true || 0,
          totalScore: sumBy(result.data.user.scores, 'score') || 0,
        };
        setProfileInfos({ ...result.data.user, statistics });
      })
      .catch(() => { props.history.replace('/'); });
  }, [props.user]);

  return (
    <div className="profile-container">
      <Header color="light" />
      <div className="profile-bg" />
      <Dialog
        PaperProps={{ className: classes.dialogPaper }}
        open
        onClose={() => {}}
      >
        <div className="profile">
          {profileInfos.avatar
            ? (
              <Avatar
                className="profile-avatar"
                src={require(`../../assets/avatars/${profileInfos.avatar}`)} // eslint-disable-line
                onClick={() => toggleAvatarSelectionWindow(true)}
                alt="avatar"
              />
            ) : null}
          <SelectAvatar
            open={displayAvatarSelection}
            onClose={handleAvatarChange}
            selectedValue={dialogFormParameters.avatar || DEFAULT.VALUE}
          />
          <DialogTitle id="responsive-dialog-title" onClick={() => handleDialogForm('username')}>{profileInfos.username || ''}</DialogTitle>
          <DialogContent>
            <List>
              <ListItem>
                <ListItemText primary={get(profileInfos, 'statistics.gamesPlayed', 0)} secondary="games played" />
              </ListItem>
              <ListItem>
                <ListItemText primary={get(profileInfos, 'statistics.gamesWon', 0)} secondary="games won" />
              </ListItem>
              <ListItem>
                <ListItemText primary={get(profileInfos, 'statistics.totalScore', 0)} secondary="total score" />
              </ListItem>
            </List>
            <DialogContentText>
              Procedente igitur mox tempore cum adventicium nihil inveniretur, relicta ora maritima
              &nbsp;in Lycaoniam adnexam Isauriae se contulerunt ibique densis intersaepientes
              &nbsp;itinera praetenturis provincialium et viatorum opibus pascebantur.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogForm('delAccount')} color="secondary">Delete account</Button>
            <Button onClick={() => handleDialogForm('password')} color="primary">Change password</Button>
          </DialogActions>
        </div>
      </Dialog>
      {(dialogFormParameters.open) ? <ProfileDialogForm {...dialogFormParameters} /> : null}
      <Footer />
    </div>
  );

};


account.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  onUserUpdate: PropTypes.func.isRequired,
  onUserDelete: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  onUserUpdate: user => dispatch(userUpdate(user)),
  onUserDelete: user => dispatch(userDelete(user)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(account));
