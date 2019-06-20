import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
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
import { DEFAULT, API_CALLS } from '../../config/constants';
import './Profile.scss';

// Create style to handle avatar display
const useStyles = makeStyles({ dialogPaper: { overflow: 'visible' } });

const profile = (props) => {

  // Set style to handle avatar display
  const classes = useStyles();

  // Profile data structure
  const [profileInfos, setProfileInfos] = useState({ ...props.user,
    statistics: {
      gamesPlayed: 'N/A',
      gamesWon: 'N/A',
      totalScore: 'N/A',
    },
  });

  // Fetch user information
  useEffect(() => {
    console.log(`Fetching user with id: ${props.user.id}`);

    // Check if user is logged
    if (!props.user.id) return;

    // Make API call
    axios.get(API_CALLS.GET_USER({ id: props.user.id }), API_CALLS.CONFIG)
      .then((result) => {
        console.log('API Fetch', result);
        if (result.success) setProfileInfos(...result.user);
      })
      .catch((err) => {
        console.log('API Fetch error');
        console.log(err);
      });
  }, []);

  console.log('profileInfos', profileInfos);

  return (
    <Dialog
      PaperProps={{ className: classes.dialogPaper }}
      open={props.open}
      onClose={props.onClose}
    >
      <div className="profile">
        <Avatar className="profile-avatar" src={require(`../../assets/avatars/${profileInfos.avatar || DEFAULT.AVATAR}`) /* eslint-disable-line */} alt="avatar" />
        <DialogTitle id="responsive-dialog-title">{profileInfos.username || 'unknown-user'}</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText primary={profileInfos.statistics.gamesPlayed} secondary="games played" />
            </ListItem>
            <ListItem>
              <ListItemText primary={profileInfos.statistics.gamesWon} secondary="games won" />
            </ListItem>
            <ListItem>
              <ListItemText primary={profileInfos.statistics.totalScore} secondary="total score" />
            </ListItem>
          </List>
          <DialogContentText>
            Procedente igitur mox tempore cum adventicium nihil inveniretur, relicta ora maritima in
            &nbsp;Lycaoniam adnexam Isauriae se contulerunt ibique densis intersaepientes itinera
            &nbsp;praetenturis provincialium et viatorum opibus pascebantur.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );

};

profile.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default profile;
