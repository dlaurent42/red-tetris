import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link, Redirect } from 'react-router-dom';
import Header from '../../misc/navigation/header/Header';
import { REGEX, DEFAULT, API_CALLS } from '../../config/constants';
import './RecoverPassword.scss';

const recoverPassword = (props) => {

  // Handle form data
  const [id, setId] = useState(0);
  const [values, setValues] = useState({
    password: '',
    cpassword: '',
  });
  const [errors, setErrors] = useState({
    password: false,
    cpassword: false,
    recoverPassword: false,
  });
  const handleValueChange = name => event => setValues({ ...values, [name]: event.target.value });

  // Handle form validation
  const validateForm = (event) => {
    event.preventDefault();

    const formErrors = {
      password: !(REGEX.PASSWORD.test(values.password)),
      cpassword: (values.password !== values.cpassword),
    };

    // Check if an occured in form
    if (Object.values(formErrors).includes(true)) {
      setErrors({ ...errors, ...formErrors });
      return;
    }

    axios.put(`${API_CALLS.PUT_USER}${id}`, { user: { password: values.password, id } }, API_CALLS.CONFIG)
      .then((res) => {
        if (res.data.success) props.history.replace('/login');
        else setErrors({ ...errors, recoverPassword: (typeof res.data.err === 'string') ? res.data.err : true });
      })
      .catch(() => {});
  };

  // On page load, check token and get user id
  useEffect(() => {
    const token = window.location.hash.split('/').slice(1)[0].split(/\[(.+?)\]/)[1];
    axios.get(`${API_CALLS.GET_USER_RECOVER_PASSWORD}?token=${token}`, API_CALLS.CONFIG)
      .then((res) => {
        if (res.data.success) setId(res.data.id);
        else props.history.replace('/recover-password');
      })
      .catch(() => {});
  }, []);

  if (props.user.id) return <Redirect to="/" />;
  return (
    <div>
      <Header variant="reduced" />
      <div className="recover-password-container">
        <div className="recover-password-form-container">
          <form className="recover-password-form">
            <h1>RECOVER PASSWORD</h1>
            <TextField
              required
              autoFocus
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
              required
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
            {(errors.recoverPassword)
              ? <div className="recover-password-error">{typeof errors.recoverPassword === 'string' ? errors.recoverPassword : DEFAULT.ERROR_MESSAGE}</div>
              : null}
            <Button disabled={Object.values(errors).includes(true) || errors.recoverPassword} variant="contained" className="button" onClick={validateForm}>Validate</Button>
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
