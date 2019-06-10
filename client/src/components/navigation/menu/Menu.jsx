import React from 'react';
import PropTypes from 'prop-types';
import LeftSideSubmenu from './submenus/LeftSideSubmenu';
import RightSideSubmenu from './submenus/RightSideSubmenu';
import './Menu.scss';

const menu = props => (
  <nav className="menu">
    <LeftSideSubmenu variant={props.variant} />
    <RightSideSubmenu variant={props.variant} />
  </nav>
);

menu.propTypes = {
  variant: PropTypes.string,
};

menu.defaultProps = {
  variant: 'full',
};

export default menu;
