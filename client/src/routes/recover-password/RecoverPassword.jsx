import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link, Redirect } from 'react-router-dom';
import Header from '../../misc/navigation/header/Header';
import { REGEX } from '../../config/constants';
import './RecoverPassword.scss';

const recoverPassword = (props) => {

  // Handle form data
  const [values, setValues] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({
    email: false,
  });
  const handleValueChange = name => event => setValues({ ...values, [name]: event.target.value });

  // Handle form validation
  const validateForm = (event) => {
    event.preventDefault();
    setErrors({
      email: !(REGEX.EMAIL.test(values.email)),
    });
  };

  if (props.user.uid) return <Redirect to="/" />;
  return (
    <div>
      <Header variant="reduced" />
      <div className="recover-password-container">
        <div className="recover-password-form-container">
          <form className="recover-password-form" autoComplete="off">
            <h1>RECOVER PASSWORD</h1>
            <TextField
              required
              autoFocus
              error={errors.email}
              helperText={(errors.email) ? 'Email must be valid.' : null}
              id="standard-email"
              label="Email"
              className="input"
              type="email"
              value={values.email}
              onChange={handleValueChange('email')}
              margin="normal"
            />
            <Button variant="contained" className="button" onClick={validateForm}>Validate</Button>
            <Link className="recover-password-link" to="/signup">Don&#39;t have account?</Link>
            <Link className="recover-password-link" to="/login">Remember password?</Link>
          </form>
        </div>
        <div className="recover-password-background" />
      </div>
    </div>
  );
};

recoverPassword.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
};

recoverPassword.defaultProps = {
  user: {},
};

const mapStateToProps = state => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(recoverPassword);
