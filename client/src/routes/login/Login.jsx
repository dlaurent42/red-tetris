import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Header from '../../misc/navigation/header/Header';
import { DEFAULT, REGEX, API_CALLS } from '../../config/constants';
import { userLogin } from '../../store/actions';
import './Login.scss';

const login = (props) => {

  // Form data structure
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  // Form errors structure
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    login: false,
  });

  // Handle value change
  const handleValueChange = name => event => setValues({ ...values, [name]: event.target.value });

  // Handle form validation
  const validateForm = (event) => {
    event.preventDefault();

    // Create object containing errors based on form
    const formErrors = {
      ...errors,
      email: !(REGEX.EMAIL.test(values.email)),
      password: !(REGEX.PASSWORD.test(values.password)),
    };

    // Check if an occured in form
    if (Object.values(formErrors).includes(true)) {
      setErrors(formErrors);
      return;
    }

    // Make API call
    axios.get(API_CALLS.GET_USER_LOGIN, API_CALLS.CONFIG)
      .then((result) => {
        console.log('API Fetch', result);
        if (result.success) props.onUserLogin(result.user);
        else setErrors({ ...errors, login: (typeof result.err === 'string') ? result.err : true });
      })
      .catch((err) => {
        console.log('API Fetch error');
        console.log(err);
        setErrors({ ...errors, login: true });
      });
  };

  if (props.user.id) return <Redirect to="/" />;
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
            {(errors.login)
              ? <div className="login-error">{typeof errors.login === 'string' ? errors.login : DEFAULT.ERROR_MESSAGE}</div>
              : null}
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
  onUserLogin: PropTypes.func.isRequired,
};

login.defaultProps = {
  user: {},
};

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  onUserLogin: user => dispatch(userLogin(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(login);
