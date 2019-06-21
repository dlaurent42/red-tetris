import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { REGEX } from '../../config/constants';

const profileDialogForm = (props) => {

  const [value, setValue] = useState(props.textFieldValue);
  const [isValid, setIsValid] = useState(false);

  const onChange = (e) => {
    setIsValid((props.textFieldLabel === 'username' && REGEX.USERNAME.test(e.target.value))
      || (props.textFieldLabel === 'password' && REGEX.PASSWORD.test(e.target.value)));
    setValue(e.target.value);
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{props.textFieldTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.textFieldText}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          value={value}
          onChange={onChange}
          label={props.textFieldLabel}
          type={props.textFieldType}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
        </Button>
        <Button
          disabled={!isValid}
          onClick={() => props.handleValidate(props.param, value)}
          color="primary"
        >
          Validate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

profileDialogForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleValidate: PropTypes.func.isRequired,
  textFieldValue: PropTypes.string.isRequired,
  textFieldLabel: PropTypes.string.isRequired,
  textFieldType: PropTypes.string.isRequired,
  textFieldText: PropTypes.string.isRequired,
  textFieldTitle: PropTypes.string.isRequired,
  param: PropTypes.string.isRequired,
};

export default profileDialogForm;
