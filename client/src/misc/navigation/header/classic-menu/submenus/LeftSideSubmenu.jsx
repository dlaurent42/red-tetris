import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Logo from '../../../logo/Logo';
import './LeftSideSubmenu.scss';

const leftSideSubmenu = (props) => {
  if (props.variant === 'full') {
    return (
      <div className={['menu-left', props.color].join(' ')}>
        <Link to="/" className="menu-logo"><Logo variant={props.variant} /></Link>
        <Link to="/tournaments" className={['menu-item'].concat((window.location.hash === '#/tournaments') ? 'active' : '').join(' ')}>TOURNAMENTS</Link>
        <Link to="/leaderboard" className={['menu-item'].concat((window.location.hash === '#/leaderboard') ? 'active' : '').join(' ')}>LEADERBOARD</Link>
        <Link to="/about" className={['menu-item'].concat((window.location.hash === '#/about') ? 'active' : '').join(' ')}>ABOUT US</Link>
      </div>
    );
  }
  if (props.variant === 'reduced') {
    return (
      <div className={['menu-left', props.color].join(' ')}>
        <Link to="/" className="menu-logo reduced-logo"><Logo variant={props.variant} /></Link>
      </div>
    );
  }
  return null;
};

leftSideSubmenu.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
};

leftSideSubmenu.defaultProps = {
  color: 'dark',
  variant: 'full',
};

export default leftSideSubmenu;
