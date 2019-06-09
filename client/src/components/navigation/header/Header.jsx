import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const header = (props) => {
  const currentPage = window.location.hash;

  console.log(window.location.hash);
  return (
    <nav className="header">
      <Link to="/">Home</Link>
      {/* user */}
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/profile">Signup</Link>
      <Link to="/friends">Signup</Link>
      {/* game */}
      <Link to="/rooms">Rooms</Link>
      <Link to="/room[hello]">Specific room</Link>
    </nav>
  );
};

const mapStateToProps = state => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(header);
