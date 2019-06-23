import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { countBy, sumBy } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
const useStyles = makeStyles({
  dialogPaper: { overflow: 'visible' },
  dialogPaperResponsive: { overflowY: 'auto' },
});

const profile = (props) => {

  // Set style to handle avatar display
  const classes = useStyles();
  const responsiveSmallScreenWidth = useMediaQuery('(max-width:1023px)');

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

    // Check if user is logged
    if (!props.user.id) return;

    // Make API call
    axios.get(`${API_CALLS.GET_USER}/${props.user.id}`, API_CALLS.CONFIG)
      .then((result) => {
        if (result.data.success === false) return;
        const statistics = {
          gamesPlayed: result.data.user.scores.length,
          gamesWon: countBy(result.data.user.scores, { hasWon: true }).true || 0,
          totalScore: sumBy(result.data.user.scores, 'score') || 0,
        };
        setProfileInfos({ ...result.data.user, statistics });
      })
      .catch(() => {});
  }, []);

  return (
    <Dialog
      PaperProps={{
        className: (responsiveSmallScreenWidth)
          ? classes.dialogPaperResponsive
          : classes.dialogPaper,
      }}
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
