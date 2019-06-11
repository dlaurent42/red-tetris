import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Header from '../../misc/navigation/header/Header';
import { REGEX } from '../../config/constants';
import './Login.scss';

const login = (props) => {

  // Handle form data
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });
  const handleValueChange = name => event => setValues({ ...values, [name]: event.target.value });

  // Handle form validation
  const validateForm = (event) => {
    event.preventDefault();
    setErrors({
      email: !(REGEX.EMAIL.test(values.email)),
      password: !(REGEX.PASSWORD.test(values.password)),
    });
  };

  if (props.user.uid) return <Redirect to="/" />;
  return (
    <div>
      <Header variant="reduced" />
      <div className="login-container">
        <div className="login-form-container">
          <form className="login-form" autoComplete="off">

            <h1>LOG IN</h1>
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
            <TextField
              required
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
            <Button variant="contained" className="button" onClick={validateForm}>Validate</Button>
            <Link className="login-link" to="/signup">Don&#39;t have account?</Link>
            <Link className="login-link" to="/recover-password">Forgot password?</Link>
          </form>
        </div>
        <div className="login-background" />
      </div>
    </div>
  );
};

login.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
};

login.defaultProps = {
  user: {},
};

const mapStateToProps = state => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(login);
