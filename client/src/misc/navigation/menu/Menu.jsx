import React from 'react';
import PropTypes from 'prop-types';
import LeftSideSubmenu from './submenus/LeftSideSubmenu';
import RightSideSubmenu from './submenus/RightSideSubmenu';
import './Menu.scss';

const menu = props => (
  <nav className="menu">
    <LeftSideSubmenu color={props.color} variant={props.variant} />
    <RightSideSubmenu color={props.color} variant={props.variant} />
  </nav>
);

menu.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
};

menu.defaultProps = {
  color: 'dark',
  variant: 'full',
};

export default menu;
