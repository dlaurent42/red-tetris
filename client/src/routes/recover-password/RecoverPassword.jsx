import React, { useState } from 'react';
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
  const [message, setMessage] = useState('');
  const [values, setValues] = useState({ email: '' });
  const [errors, setErrors] = useState({ email: false, recoverPassword: false });
  const handleValueChange = name => event => setValues({ ...values, [name]: event.target.value });

  // Handle form validation
  const validateForm = (event) => {
    event.preventDefault();

    const email = !(REGEX.EMAIL.test(values.email));
    setErrors({ email });
    if (email) {
      setErrors({ ...errors, email });
      return;
    }

    const data = { user: { email: values.email, redirectUrl: DEFAULT.REDIRECT_RECOVER_PWD } };
    axios.post(API_CALLS.POST_USER_RECOVER_PASSWORD, data, API_CALLS.CONFIG)
      .then((res) => {
        if (res.data.success) setMessage(res.data.message);
        else setErrors({ ...errors, recoverPassword: (typeof res.data.err === 'string') ? res.data.err : true });
      })
      .catch(() => {});
  };

  if (props.user.id) return <Redirect to="/" />;
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
            {(errors.recoverPassword)
              ? <div className="recover-password-error">{typeof errors.recoverPassword === 'string' ? errors.recoverPassword : DEFAULT.ERROR_MESSAGE}</div>
              : null}
            {(message) ? <div className="recover-password-message">{message}</div> : null}
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
