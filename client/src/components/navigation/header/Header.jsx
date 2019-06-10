import React from 'react';
import PropTypes from 'prop-types';
import Menu from '../menu/Menu';
import './Header.scss';

const header = props => (
  <nav className={['header', props.color].join(' ')}>
    <Menu variant={props.variant} />
  </nav>
);

header.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
};

header.defaultProps = {
  color: 'transparent',
  variant: 'full',
};

export default header;
