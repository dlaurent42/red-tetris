import React from 'react';
import PropTypes from 'prop-types';
import logoSmall from '../../../assets/logo/logo.png';
import logoLarge from '../../../assets/logo/logo-full.png';
import './Logo.scss';

const logo = props => (
  <img
    className={(props.variant === 'full') ? 'logo logo-large' : 'logo logo-small'}
    src={(props.variant === 'full') ? logoLarge : logoSmall}
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
