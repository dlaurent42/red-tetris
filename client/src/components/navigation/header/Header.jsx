import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const header = (props) => {
  
  props.color = ['primary', 'secondary', 'transparent'];
  props.variant = ['full', 'reduced', 'logo-only'];
  return (
    <nav className="header">
      <Logo />
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

export default connect(mapStateToProps)(header);
