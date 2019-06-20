import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Header from '../../misc/navigation/header/Header';
import SelectAvatar from '../../misc/UI/selectAvatar/SelectAvatar';
import { DEFAULT, REGEX, API_CALLS } from '../../config/constants';
import { userRegister } from '../../store/actions';
import './Signup.scss';

const signup = (props) => {

  // Avatar selection
  const [displayAvatarSelection, toggleAvatarSelectionWindow] = useState(false);

  // Form data structure
  const [values, setValues] = useState({
    avatar: DEFAULT.AVATAR,
    username: '',
    email: '',
    password: '',
    cpassword: '',
  });

  // Form errors structure
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false,
    cpassword: false,
    signup: false,
  });

  // Handle value change
  const handleValueChange = name => event => setValues({ ...values, [name]: event.target.value });

  // Handle avatar change
  const handleAvatarChange = (avatar) => {
    setValues({ ...values, avatar });
    toggleAvatarSelectionWindow(false);
  };

  // Handle form validation
  const validateForm = (event) => {
    event.preventDefault();

    // Create object containing errors based on form
    const formErrors = {
      username: !(REGEX.USERNAME.test(values.username)),
      email: !(REGEX.EMAIL.test(values.email)),
      password: !(REGEX.PASSWORD.test(values.password)),
      cpassword: (values.password !== values.cpassword),
    };

    // Check if an occured in form
    if (Object.values(formErrors).includes(true)) {
      setErrors({ ...formErrors, ...formErrors });
      return;
    }

    // Make API call
    axios.post(API_CALLS.POST_USER_REGISTER, { user: values }, API_CALLS.CONFIG)
      .then((res) => {
        if (res.data.success) props.onUserRegister(res.data.user);
        else setErrors({ ...errors, signup: (typeof res.data.err === 'string') ? res.data.err : true });
      })
      .catch(() => setErrors({ ...formErrors, signup: true }));

  };

  if (props.user.id) return <Redirect to="/" />;
  return (
    <div>
      <Header variant="reduced" />
      <div className="signup-container">
        <div className="signup-form-container">
          <form className="signup-form" autoComplete="off">

            <h1>SIGN UP</h1>
            {(displayAvatarSelection)
              ? (
                <SelectAvatar
                  open={displayAvatarSelection}
                  onClose={handleAvatarChange}
                  selectedValue={values.avatar}
                />
              ) : null}
            <Avatar className="signup-avatar" onClick={() => toggleAvatarSelectionWindow(true)} src={require(`../../assets/avatars/${values.avatar}`)} alt={values.avatar} /> {/* eslint-disable-line */}
            <TextField
              autoFocus
              required
              error={errors.username}
              helperText={(errors.username) ? 'Username must contain at least 6 alphanumeric characters.' : null}
              id="standard-username"
              label="Username"
              className="input"
              value={values.username}
              onChange={handleValueChange('username')}
              margin="normal"
            />
            <TextField
              required
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
            <Button variant="contained" className="button" onClick={validateForm}>Validate</Button>
            {(errors.signup)
              ? <div className="signup-error">{typeof errors.signup === 'string' ? errors.signup : DEFAULT.ERROR_MESSAGE}</div>
              : null}
            <Link className="signup-link" to="/login">Already have an account?</Link>
          </form>
        </div>
        <div className="signup-background" />
      </div>
    </div>
  );
};

signup.propTypes = {
  onUserRegister: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any),
};

signup.defaultProps = {
  user: {},
};

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({
  onUserRegister: user => dispatch(userRegister(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(signup);
