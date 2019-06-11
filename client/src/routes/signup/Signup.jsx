import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Header from '../../misc/navigation/header/Header';
import SelectAvatar from '../../misc/UI/selectAvatar/SelectAvatar';
import { DEFAULT, REGEX } from '../../config/constants';
import './Signup.scss';

const signup = (props) => {

  // Handle form data
  const [displayAvatarSelection, toggleAvatarSelectionWindow] = useState(false);
  const [values, setValues] = useState({
    avatar: DEFAULT.AVATAR,
    username: '',
    email: '',
    password: '',
    cpassword: '',
  });
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false,
    cpassword: false,
  });
  const handleValueChange = name => event => setValues({ ...values, [name]: event.target.value });

  // Handle avatar change
  const handleAvatarChange = (avatar) => {
    setValues({ ...values, avatar });
    toggleAvatarSelectionWindow(false);
  };

  // Handle form validation
  const validateForm = (event) => {
    event.preventDefault();
    setErrors({
      username: !(REGEX.USERNAME.test(values.username)),
      email: !(REGEX.EMAIL.test(values.email)),
      password: !(REGEX.PASSWORD.test(values.password)),
      cpassword: (values.password !== values.cpassword),
    });
  };

  if (props.user.uid) return <Redirect to="/" />;
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
            <Link className="signup-link" to="/login">Already have an account?</Link>
          </form>
        </div>
        <div className="signup-background" />
      </div>
    </div>
  );
};

signup.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
};

signup.defaultProps = {
  user: {},
};

const mapStateToProps = state => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(signup);
