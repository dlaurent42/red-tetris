import React from 'react';
import PropTypes from 'prop-types';
import LeftSideSubmenu from './submenus/LeftSideSubmenu';
import RightSideSubmenu from './submenus/RightSideSubmenu';
import './Menu.scss';

const menu = (props) => {
  console.log(window.location.hash);
  return (
    <nav>
      ttiti
      <RightSideSubmenu variant={props.variant} />
      <LeftSideSubmenu variant={props.variant} />
    </nav>
  );
};

menu.propTypes = {
  variant: PropTypes.string,
};

menu.defaultProps = {
  variant: 'full',
};

export default menu;
