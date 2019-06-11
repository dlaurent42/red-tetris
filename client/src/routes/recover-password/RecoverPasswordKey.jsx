import React, { useState, useEffect } from 'react';
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
    password: '',
    cpassword: '',
  });
  const [errors, setErrors] = useState({
    password: false,
    cpassword: false,
  });
  const handleValueChange = name => event => setValues({ ...values, [name]: event.target.value });

  // Handle form validation
  const validateForm = (event) => {
    event.preventDefault();
    setErrors({
      password: !(REGEX.PASSWORD.test(values.password)),
      cpassword: (values.password !== values.cpassword),
    });
  };

  useEffect(() => {
    /* check key */
  }, []);

  if (props.user.uid) return <Redirect to="/" />;
  return (
    <div>
      <Header variant="reduced" />
      <div className="recover-password-container">
        <div className="recover-password-form-container">
          <form className="recover-password-form" autoComplete="off">
            <h1>RECOVER PASSWORD</h1>
            <TextField
              error={errors.password}
              helperText={(errors.password) ? 'Password must contain at least 8 characters including at least one uppercase and one lowercase letter, one digit and one special character.' : null}
              id="standard-password-input"
              label="Password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={handleValueChange('password')}
              margin="normal"
            />
            <TextField
              error={errors.cpassword}
              helperText={(errors.cpassword) ? 'Confirmed password is different than entered password.' : null}
              id="standard-cpassword-input"
              label="Confirm password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={values.cpassword}
              onChange={handleValueChange('cpassword')}
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
