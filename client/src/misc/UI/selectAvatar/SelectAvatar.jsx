import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { AVATARS } from '../../../config/constants';
import './SelectAvatar.scss';

const selectAvatar = (props) => {

  const handleClose = () => props.onClose(props.selectedValue);
  const handleListItemClick = value => props.onClose(value);
  return (
    <Dialog className="avatars-dialog" onClose={handleClose} aria-labelledby="simple-dialog-title" open={props.open}>
      <DialogTitle id="simple-dialog-title">Select your avatar</DialogTitle>
      <List className="avatars-list">
        {AVATARS.map(avatar => (
          <ListItem className="avatars-list-item" button onClick={() => handleListItemClick(avatar)} key={avatar}>
            <Avatar src={require(`../../../assets/avatars/${avatar}`)} alt={avatar} /> {/* eslint-disable-line */}
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

selectAvatar.propTypes = {
  selectedValue: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

selectAvatar.defaultProps = {
  selectedValue: '',
};

export default selectAvatar;
