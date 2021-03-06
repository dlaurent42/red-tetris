import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Logo from '../../../logo/Logo';
import './LeftSideSubmenu.scss';

const leftSideSubmenu = props => (
  (props.variant === 'reduced')
    ? (
      <div className={['menu-left', props.color].join(' ')}>
        <Link to="/" className="menu-logo reduced-logo"><Logo variant={props.variant} /></Link>
      </div>
    ) : (
      <div className={['menu-left', props.color].join(' ')}>
        <Link to="/" className="menu-logo"><Logo variant={props.variant} /></Link>
        <Link to="/tournaments" className={['menu-item'].concat((props.location === '#/tournaments') ? 'active' : '').join(' ')}>TOURNAMENTS</Link>
        <Link to="/leaderboard" className={['menu-item'].concat((props.location === '#/leaderboard') ? 'active' : '').join(' ')}>LEADERBOARD</Link>
        <Link to="/about" className={['menu-item'].concat((props.location === '#/about') ? 'active' : '').join(' ')}>ABOUT US</Link>
      </div>
    )
);

leftSideSubmenu.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
  location: PropTypes.string.isRequired,
};

leftSideSubmenu.defaultProps = {
  color: 'dark',
  variant: 'full',
};

export default leftSideSubmenu;
