import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Logo from '../../logo/Logo';
import './LeftSideSubmenu.scss';

const leftSideSubmenu = (props) => {
  if (props.variant === 'full') {
    return (
      <div className="menu-left">
        <Link to="/" className="menu-left-item"><Logo /></Link>
        <Link to="/tournaments" className="menu-left-item">TOURNAMENTS</Link>
        <Link to="/leaderboard" className="menu-left-item">LEADERBOARD</Link>
        <Link to="/about" className="menu-left-item">ABOUT</Link>
      </div>
    );
  }
  if (props.variant === 'reduced') {
    return (
      <div className="menu-left">
        <Link to="/" className="menu-left-item"><Logo /></Link>
      </div>
    );
  }
  return null;
};

leftSideSubmenu.propTypes = {
  variant: PropTypes.string,
};

leftSideSubmenu.defaultProps = {
  variant: 'full',
};

export default leftSideSubmenu;
