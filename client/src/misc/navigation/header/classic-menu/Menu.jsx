import React from 'react';
import PropTypes from 'prop-types';
import LeftSideSubmenu from './submenus/LeftSideSubmenu';
import RightSideSubmenu from './submenus/RightSideSubmenu';
import './Menu.scss';

const menu = props => (
  <nav className="menu">
    <LeftSideSubmenu {...props} />
    <RightSideSubmenu {...props} />
  </nav>
);

menu.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
  location: PropTypes.string.isRequired,
};

menu.defaultProps = {
  color: 'dark',
  variant: 'full',
};

export default menu;
