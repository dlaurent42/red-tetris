import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const header = (props) => {

  // State
  const [isLoginFormDisplayed, toggleLoginForm] = useState(false);
  const [isRegistrationFormDisplayed, toggleRegistrationForm] = useState(false);

  return (
    <div />
  );
};

const mapStateToProps = state => ({
  user: state.user.user,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(header);
