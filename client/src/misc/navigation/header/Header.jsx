import React from 'react';
import PropTypes from 'prop-types';
import ClassicMenu from './classic-menu/Menu';
import MobileMenu from './mobile-menu/Menu';
import './Header.scss';

const header = props => (
  <header className={['header', props.variant].join(' ')}>
    <ClassicMenu location={window.location.hash} {...props} />
    <MobileMenu {...props} />
  </header>
);

header.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
};

header.defaultProps = {
  color: 'dark',
  variant: 'full',
};

export default header;
