import React from 'react';
import PropTypes from 'prop-types';
import logoLarge from '../../../assets/logo/logo-full.png';
import './Logo.scss';

const logo = props => (
  <img
    className={['logo', `logo-${props.variant}`].join(' ')}
    src={logoLarge}
    alt="logo"
  />
);

logo.propTypes = {
  variant: PropTypes.string,
};

logo.defaultProps = {
  variant: 'full',
};

export default logo;
